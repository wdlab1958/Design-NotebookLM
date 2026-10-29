# Correspondence: batch-rendering-contract

Spec commit: `eb95e94` (2026-10-29, HEAD of `main`; 4 untracked user files not part of the spec)

## Map

| Model element | Spec | Kind | Source (file:line) | Abstraction / Assumption |
|---|---|---|---|---|
| `PlanFrom/Plan(n)` | tla/Spec.tla:41 | operator | `app/src/lib/unified.ts:39-52` batchPlan (동일 루프: `server/lib/generate.mjs:77-87`, `app/src/components/PageConfig.tsx:12-20`, `tests/lib.mjs:37-46`) | 루프를 재귀로 1:1 전사. count=min(remaining,BatchSize) |
| `BatchCountFormula(n)` | tla/Spec.tla:50 | operator | `server/lib/generate.mjs:133` `Math.max(1, Math.ceil(totalPages/20))` | C2 에서 루프 길이와 비교 |
| `n` | tla/Spec.tla:53 | variable | `totalPages` (`server/index.mjs:89` 1..1000, `PageConfig.tsx:42` UI 1..100) | Init 에서 MinN..MaxN 전수 선택 — 한 실행이 모든 n 을 다룸 |
| `plan` | tla/Spec.tla:53 | variable | `batchPlan()` 반환값 `[{idx,start,end,count}]` | 행동 내 상수(트레이스 가독성용) |
| `deck[b]` | tla/Spec.tla:53 | variable | 배치 b 의 Studio 생성 결과 덱(NotebookLM 출력; 코드 외부) | `nums`(전역 번호 증가열) + `xc/xz`(추가 표지/클로징 플래그) |
| `merged` | tla/Spec.tla:53 | variable | 사용자가 순서대로 이어붙인 최종 덱 (`unified.ts:175` 사용 방법 5) | 병합 전 `<<>>` |
| `Scope(b)` | tla/Spec.tla:76 | operator (toggle ScopeContract) | `unified.ts:94` "global slides s–e", `unified.ts:119` "global slides s to e", `generate.mjs:99` "Use ONLY … IGNORE every Master Script slide outside this range" | OFF = 85f2104 `target_data: "Source Script Slides s to e"` (배타성 없음) → 1..n |
| `Counts(b)` | tla/Spec.tla:77 | operator (toggle CountContract) | `unified.ts:94,119` "EXACTLY c slides", `generate.mjs:100` "Generate EXACTLY c slides" | OFF = 85f2104 `length: "dynamic"` → 1..BatchSize |
| `RenderedNums(b)` | tla/Spec.tla:78 | operator | 위 두 계약의 합성 | 둘 다 ON 이면 단일 열(열거 생략, MC_wide 성능) |
| `Extras` | tla/Spec.tla:88 | operator | `unified.ts:96-99` batchContract, `unified.ts:114-118` studioPrompt tail, `generate.mjs:102-110` 규칙 4-6 | A3: RoleContract ∨ CountContract 면 추가 슬라이드 없음 |
| `RolesOK(b,s)` | tla/Spec.tla:92 | operator (toggle RoleContract) | `unified.ts:97` "NO cover … start IMMEDIATELY with global slide s", `unified.ts:98-99`, `generate.mjs:103,106,109` | 1번 슬라이드는 첫 배치, n번은 마지막 배치에서만 |
| `Init` | tla/Spec.tla:97 | action | `MainPage.tsx` → localStorage config → `CustomizePage` → `/api/generate` (`server/index.mjs:84-93`) → `generateAll` (`generate.mjs:127-136`) | config 중 totalPages 만 보존 |
| `Render(b)` | tla/Spec.tla:105 | action | NotebookLM Studio 1회 생성 = `unified.ts:107-120` studioPrompt(b) / `generate.mjs:93-123` step3 batch(b) 를 입력으로 받는 외부 렌더러 | 배치 간 독립·임의 순서; 계약이 금지하지 않는 모든 출력 비결정 |
| `DeckSlides/Concat` | tla/Spec.tla:113 | operator | 사용자가 배치 덱을 이어붙이는 행위의 표현 | 추가 표지는 맨 앞, 추가 클로징은 맨 뒤 |
| `Merge` | tla/Spec.tla:124 | action | `unified.ts:103` "The batch decks, concatenated in order, MUST read as ONE seamless presentation", `unified.ts:175` | 모든 배치 완료 후 1회 |
| `Terminated` | tla/Spec.tla:130 | action | — | 종료 상태 스터터(데드락 회피, `-deadlock` 미사용) |
| `TypeOK` | tla/Spec.tla:138 | invariant | — | 변수 타입 |
| `P1_SingleCover` | tla/Properties.tla:17 | invariant (frozen) | `unified.ts:86,96-97`; fbd3053; README | IsCover = extra=cover ∨ num=1 |
| `P2_SingleClosing` | tla/Properties.tla:22 | invariant (frozen) | `unified.ts:99`; `generate.mjs:109`; fbd3053 | IsClosing = extra=closing ∨ num=n |
| `P3_ExactDeck` | tla/Properties.tla:29 | invariant (frozen) | `unified.ts:102-103`; README; `tests/e2e_test.mjs:58-66` | merged 의 num 열 = <<1..n>> |
| `C1_BatchBound` | tla/Properties.tla:33 | invariant | README; `unified.ts:45` |  |
| `C2_PlanPartition` | tla/Properties.tla:38 | invariant | `generate.mjs:133`; `tests/lib.mjs:37-46`; `tests/e2e_test.mjs:49-55` | 루프 ↔ 닫힌식 일치 포함 |
| `L1_EventuallyMerged` | tla/Properties.tla:46 | liveness (frozen) | `unified.ts:175` | WF_vars(Next) |
| `Sanity_NeverMergedThreeBatches` | tla/Properties.tla:50 | sanity (must fail) | — | 3배치 병합 상태 도달성 |

## Assumptions

- A1. 슬라이드 = (전역 번호, extra 플래그). 내용/디자인은 모델 밖.
- A2. 렌더러는 계약 문구를 글자 그대로 준수하는 적대자. LLM 의 부분 준수/오해는 모델 밖 — PASS 는 "문구가 충분조건" 임을 뜻하며 NotebookLM 이 실제로 따름을 보장하지 않음.
- A3. `CountContract`(EXACTLY c slides) 가 켜지면 추가 무번호 표지/클로징 슬라이드도 배제된다고 가정. 그 결과 `RoleContract` 단독 변이는 통과(MC_bug_role) — 역할 규칙은 엄격 준수 렌더러 하에서 중복(defence-in-depth).
- A4. 배치 완료 순서는 임의(병행 생성). 병합은 항상 배치 인덱스 순(사용자 수칙).
- A5. `BatchSize` 는 코드 상수 20 (MC_wide) 또는 축소값 2 (MC/MC_bug: 3배치 구조를 n≤5 로 확보).

## Granularity

- 한 행동 = NotebookLM Studio 1회 생성(배치 1개 통째). 생성 중간 상태는 다른 배치에 보이지 않으므로 더 쪼개도 인터리빙이 늘지 않음.
- `Merge` 는 사용자의 수동 이어붙임 1회. 부분 병합(배치 일부만 이어붙임)은 모델 밖.
- `Init` 이 `n` 을 전수 선택하므로 한 TLC 실행 = MinN..MaxN 전 구성 검사.

## Drift check

- 대응 파일 변경 시 W6 재검토: `app/src/lib/unified.ts`, `app/src/lib/unified.mjs`, `server/lib/generate.mjs`, `app/src/components/PageConfig.tsx`, `tests/lib.mjs`.
- `tests/batch_contract_test.mjs` 가 문구 파서(`repro/contract_checker.mjs`)로 계약 3요소의 존재를 매 실행 확인하므로 문구 변경 시 즉시 실패한다.
