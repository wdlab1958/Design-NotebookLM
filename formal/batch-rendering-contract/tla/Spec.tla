------------------------------- MODULE Spec -------------------------------
(* Design NotebookLM — batch rendering contract (concern: batch-rendering-   *)
(* contract).                                                                 *)
(*                                                                            *)
(* A deck of n slides is rendered by NotebookLM Studio as ceil(n/BatchSize)   *)
(* INDEPENDENT generations ("batches"). Each batch sees only the master spec  *)
(* and its own short Studio prompt, never another batch's output, and the     *)
(* batches may run concurrently and finish in any order. The user then        *)
(* concatenates the batch decks by batch index. The code under test is the    *)
(* planner + contract text generator:                                         *)
(*   app/src/lib/unified.ts  batchPlan / batchContract / studioPrompt        *)
(*   server/lib/generate.mjs generateStep3Batches / batchCount               *)
(*                                                                            *)
(* Fix toggles (all TRUE = current code, all FALSE = legacy prompt before     *)
(* commit fbd3053 "80 pages rendered as the same 20 pages x 4"):              *)
(*   ScopeContract : a batch may use ONLY global slides start..end             *)
(*                   ("IGNORE every Master Script slide outside this range").  *)
(*   CountContract : a batch renders EXACTLY count slides.                     *)
(*   RoleContract  : cover/title slides forbidden outside batch 1, closing /   *)
(*                   thank-you slides forbidden outside the last batch.        *)
(* The renderer is modelled adversarially: it may do anything the contract    *)
(* text does not forbid.                                                      *)
EXTENDS Naturals, Sequences, FiniteSets

CONSTANTS MinN,          \* smallest deck length explored
          MaxN,          \* largest deck length explored (all n in MinN..MaxN in one run)
          BatchSize,     \* code constant 20 (unified.ts:45, generate.mjs:82)
          ScopeContract, \* fix toggle 1: range exclusivity
          CountContract, \* fix toggle 2: exact slide count
          RoleContract   \* fix toggle 3: cover / closing placement

ASSUME /\ MinN \in Nat /\ MaxN \in Nat /\ 1 <= MinN /\ MinN <= MaxN
       /\ BatchSize \in Nat /\ BatchSize >= 1
       /\ ScopeContract \in BOOLEAN /\ CountContract \in BOOLEAN /\ RoleContract \in BOOLEAN

----------------------------------------------------------------------------
(* Planner — a literal transcription of the loop                             *)
(* src: app/src/lib/unified.ts:39-52 batchPlan                             *)
(*      server/lib/generate.mjs:77-87, app/src/components/PageConfig.tsx:12-20 *)
(*      tests/lib.mjs:37-46 refBatchPlan (same loop, 4 copies in the repo)    *)
RECURSIVE PlanFrom(_, _, _)
PlanFrom(remaining, start, idx) ==
  IF remaining = 0 THEN <<>>
  ELSE LET count == IF remaining < BatchSize THEN remaining ELSE BatchSize
       IN <<[idx |-> idx, start |-> start, end |-> start + count - 1, count |-> count]>>
          \o PlanFrom(remaining - count, start + count, idx + 1)
Plan(total) == PlanFrom(total, 1, 1)

\* src: server/lib/generate.mjs:133  batchCount = max(1, ceil(totalPages / 20))
BatchCountFormula(total) == IF total = 0 THEN 1 ELSE (total + BatchSize - 1) \div BatchSize

----------------------------------------------------------------------------
VARIABLES n,       \* totalPages of this behaviour (chosen in Init)
          plan,    \* Plan(n), constant per behaviour (shown in traces)
          deck,    \* deck[b] = [nums, xc, xz]: rendered output of batch b (nums = <<>> : not yet)
          merged   \* <<>> until the user concatenates the batch decks
vars == <<n, plan, deck, merged>>

NB == Len(plan)
Batches == 1..NB
NoDeck == [nums |-> <<>>, xc |-> FALSE, xz |-> FALSE]
Rendered(b) == deck[b].nums # <<>>

Rng(s) == {s[i] : i \in DOMAIN s}
Increasing(s) == \A i \in 1..(Len(s) - 1) : s[i] < s[i + 1]

(* What the contract text leaves open to the renderer.                        *)
(* src: app/src/lib/unified.ts:94 "BATCH i/k = global slides s–e (EXACTLY c slides)"   *)
(*      app/src/lib/unified.ts:119 "Render EXACTLY c slides = global slides s to e"     *)
(*      server/lib/generate.mjs:99  "Use ONLY ... slides numbered s through e ...        *)
(*                                   IGNORE every Master Script slide outside this range"*)
(*      server/lib/generate.mjs:100 "Generate EXACTLY c slides, mapped 1:1"              *)
(* Legacy (85f2104 CustomizePage.tsx generateStep3): target_data "Source Script Slides  *)
(* s to e" (not exclusive), length: "dynamic" -> the renderer summarised the whole       *)
(* source: any increasing selection of 1..BatchSize global slides.                       *)
Scope(b)  == IF ScopeContract THEN plan[b].start..plan[b].end ELSE 1..n
Counts(b) == IF CountContract THEN {plan[b].count} ELSE 1..BatchSize
RenderedNums(b) ==
  IF ScopeContract /\ CountContract
    THEN { [i \in 1..plan[b].count |-> plan[b].start + i - 1] }   \* pinned 1:1 (no enumeration)
    ELSE { s \in UNION { [1..k -> Scope(b)] : k \in Counts(b) } : Increasing(s) }

(* Extra, unnumbered title / closing slides. NotebookLM adds them by default;  *)
(* they are suppressed when the prompt forbids them (RoleContract) or pins the *)
(* exact slide count (CountContract).                                          *)
(* src: app/src/lib/unified.ts:96-99 batchContract, :114-118 studioPrompt    *)
(*      server/lib/generate.mjs:102-110 rules 4-6                              *)
Extras == IF RoleContract \/ CountContract THEN {FALSE} ELSE BOOLEAN

\* src: app/src/lib/unified.ts:97 "NO cover ... start IMMEDIATELY with global slide s"
\*      app/src/lib/unified.ts:98-99 "NO summary ... closing" / "SINGLE closing slide is global slide e"
RolesOK(b, s) ==
  RoleContract => /\ (1 \in Rng(s) => b = 1)
                  /\ (n \in Rng(s) => b = NB)

----------------------------------------------------------------------------
Init == /\ n \in MinN..MaxN
        /\ plan = Plan(n)
        /\ deck = [b \in 1..Len(Plan(n)) |-> NoDeck]
        /\ merged = <<>>

\* One Studio generation for batch b (independent of all other batches, any order).
\* src: app/src/lib/unified.ts:107-120 studioPrompt, :82-105 batchContract
\*      server/lib/generate.mjs:93-123 generateStep3Batches
Render(b) ==
  /\ b \in Batches /\ ~Rendered(b) /\ merged = <<>>
  /\ \E s \in RenderedNums(b), xc \in Extras, xz \in Extras :
       /\ RolesOK(b, s)
       /\ deck' = [deck EXCEPT ![b] = [nums |-> s, xc |-> xc, xz |-> xz]]
  /\ UNCHANGED <<n, plan, merged>>

\* A rendered batch deck as a slide sequence: optional extra title, numbered slides, optional extra closing.
DeckSlides(b) ==
     (IF deck[b].xc THEN <<[num |-> 0, extra |-> "cover"]>> ELSE <<>>)
  \o [i \in 1..Len(deck[b].nums) |-> [num |-> deck[b].nums[i], extra |-> "none"]]
  \o (IF deck[b].xz THEN <<[num |-> 0, extra |-> "closing"]>> ELSE <<>>)

RECURSIVE Concat(_)
Concat(k) == IF k = 0 THEN <<>> ELSE Concat(k - 1) \o DeckSlides(k)

\* The user concatenates the finished batch decks in batch order.
\* src: app/src/lib/unified.ts:103 "The batch decks, concatenated in order, MUST read as ONE seamless presentation"
\*      app/src/lib/unified.ts:175 usage step 5; README.md "순차 복사 헬퍼"
Merge ==
  /\ merged = <<>>
  /\ \A b \in Batches : Rendered(b)
  /\ merged' = Concat(NB)
  /\ UNCHANGED <<n, plan, deck>>

Terminated == merged # <<>> /\ UNCHANGED vars

Next == \/ \E b \in 1..MaxN : Render(b)   \* constant-level bound so TLC names the action; Render guards b \in Batches
        \/ Merge
        \/ Terminated
Spec == Init /\ [][Next]_vars /\ WF_vars(Next)

----------------------------------------------------------------------------
TypeOK ==
  /\ n \in MinN..MaxN
  /\ plan \in Seq([idx : 1..MaxN, start : 1..MaxN, end : 1..MaxN, count : 1..BatchSize])
  /\ DOMAIN deck = Batches
  /\ \A b \in Batches : deck[b].nums \in Seq(1..n) /\ deck[b].xc \in BOOLEAN /\ deck[b].xz \in BOOLEAN
  /\ merged \in Seq([num : 0..MaxN, extra : {"none", "cover", "closing"}])
=============================================================================
