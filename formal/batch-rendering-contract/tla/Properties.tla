---------------------------- MODULE Properties ----------------------------
(* Frozen properties for concern batch-rendering-contract.                   *)
(* G2 harvest (sources cited per property; see SCOPE.md §Properties).         *)
(* HITL: G2 pending Brian review (2026-10-29). Do not weaken without approval. *)
EXTENDS Spec

IsCover(sl)   == sl.extra = "cover"   \/ sl.num = 1
IsClosing(sl) == sl.extra = "closing" \/ sl.num = n
Covers   == {i \in 1..Len(merged) : IsCover(merged[i])}
Closings == {i \in 1..Len(merged) : IsClosing(merged[i])}
Nums     == [i \in 1..Len(merged) |-> merged[i].num]

(* P1 — protocol. Exactly one cover/title slide in the whole deck and it is    *)
(* slide 1. src: unified.ts:86 "Slide 1 is the cover ... Never add extra      *)
(* cover or closing slides"; fbd3053 "첫 배치 외에는 커버/타이틀 금지";             *)
(* README.md "첫 배치만 표지".                                                   *)
P1_SingleCover == merged # <<>> => Covers = {1}

(* P2 — protocol. Exactly one closing slide and it is the last slide (n).     *)
(* src: unified.ts:99 "The SINGLE closing slide of the whole deck is global    *)
(* slide e only"; generate.mjs:109; fbd3053 "마지막 배치에만 단일 종료 슬라이드". *)
P2_SingleClosing == merged # <<>> => Closings = {Len(merged)}

(* P3 — protocol. The concatenated deck is exactly global slides 1..n, in     *)
(* order: no loss, no duplication, no reordering, no extra slides.            *)
(* src: unified.ts:102-103 "Never compress, merge, reorder, split, or          *)
(* duplicate slides ... no repeated and no missing content"; README.md "80장이  *)
(* 동일 20장 4회 반복되던 문제 해결"; tests/e2e_test.mjs:58-66.               *)
P3_ExactDeck == merged # <<>> => Nums = [i \in 1..n |-> i]

(* C1 — code. Every batch has 1..BatchSize slides (20-slide Studio limit).     *)
(* src: README.md "최대 20장 단위로 자동 분할"; unified.ts:45 Math.min(remaining, 20) *)
C1_BatchBound == \A b \in Batches : plan[b].count \in 1..BatchSize

(* C2 — code. The plan is a contiguous partition of 1..n and its length equals *)
(* the closed-form batchCount the API also returns.                           *)
(* src: generate.mjs:133 batchCount; tests/e2e_test.mjs:49-55, tests/lib.mjs:37-46 *)
C2_PlanPartition ==
  /\ plan[1].start = 1 /\ plan[NB].end = n
  /\ \A b \in 1..(NB - 1) : plan[b + 1].start = plan[b].end + 1
  /\ \A b \in Batches : plan[b].idx = b /\ plan[b].count = plan[b].end - plan[b].start + 1
  /\ NB = BatchCountFormula(n)

(* L1 — liveness. Every behaviour eventually produces the merged deck         *)
(* (all batches finish and the user concatenates). Needs WF on Next.          *)
L1_EventuallyMerged == <>(merged # <<>>)

(* Sanity (must FAIL): a full 3-batch deck is really reached and merged.       *)
(* Proves the interesting states (middle batch present) are explored.          *)
Sanity_NeverMergedThreeBatches == ~(merged # <<>> /\ NB >= 3)
=============================================================================
