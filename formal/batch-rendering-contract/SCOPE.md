# Scope: batch-rendering-contract
- Project / Module: 02_Design_NotebookLM / `app/src/lib/unified.ts` (+ `server/lib/generate.mjs` 동일 로직)
- Verification Level Target: **L2** (TLA+/TLC bounded model check)
- Concern (한 문장): n장 덱을 최대 20장 배치로 나누어 **서로 독립적으로(병행) 렌더링**한 뒤 순서대로 이어붙일 때, 코드가 생성한 배치 계획과 배치별 계약 문구가 "전역 슬라이드 1..n 정확히 1회, 표지 1장(1번), 클로징 1장(n번)" 을 보장하는가.
- Rank: blast radius **H** × concurrency **M** (CANDIDATES.md 1순위)
- Spec commit: `eb95e94` (HEAD, 2026-10-29)

## In scope
- 배치 계획 루프 `batchPlan(totalPages)` (unified.ts:39-52; generate.mjs:77-87; PageConfig.tsx:12-20; tests/lib.mjs:37-46 — 4개 사본 동일 로직) → `Plan(n)`.
- 닫힌식 `batchCount = max(1, ceil(totalPages/20))` (generate.mjs:133) 와 루프 길이의 일치 → `C2_PlanPartition`.
- 배치별 계약 3요소(fix toggle):
  - `ScopeContract` — "global slides s–e / Use ONLY ... IGNORE every slide outside" (unified.ts:94,119; generate.mjs:99)
  - `CountContract` — "EXACTLY c slides" (unified.ts:94,119; generate.mjs:100)
  - `RoleContract` — 첫 배치 외 표지 금지, 마지막 배치 외 클로징 금지, 마지막 배치의 단일 클로징 (unified.ts:96-99,114-118; generate.mjs:102-110)
- 렌더러(NotebookLM Studio)는 **적대적**: 계약 문구가 금지하지 않는 모든 선택을 비결정적으로 수행(범위 밖 슬라이드, 장수 변경, 추가 표지/감사 슬라이드).
- 배치 병행 생성(임의 완료 순서) 후 사용자의 배치 인덱스 순 병합 `Merge`.

## Abstracted (버그를 숨길 수 있는 추상화 명시)
- A1. 슬라이드 내용은 전역 번호 `num`(1..n)과 `extra ∈ {none, cover, closing}` 로만 추상화. 제목·본문·디자인 일관성(PART 2)은 모델 밖.
- A2. 렌더러는 **문구를 글자 그대로 준수하는 적대자**로 모델링. 실제 LLM 렌더러의 *부분 준수*(지시를 무시·오해)는 모델 밖 → 계약 문구가 충분조건임을 보일 뿐, LLM 이 실제로 따르는지는 보장하지 않음.
- A3. 추가(무번호) 표지/클로징 슬라이드는 `RoleContract` 또는 `CountContract` 가 켜져 있으면 생성되지 않는다고 가정(정확 장수 지시가 추가 슬라이드를 배제). 이 때문에 `RoleContract` 단독 변이(MC_bug_role)는 **통과** — 역할 규칙은 엄격 준수 렌더러 아래선 중복(defence-in-depth)임을 모델이 보여줌. 제거 권고는 하지 않음(A2).
- A4. 배치 수(배치 크기 20) 는 코드 상수. 작은 경계에선 `BatchSize=2` 로 축소(3배치 구조 보장), 넓은 경계(MC_wide)는 실제 20 과 UI 최대 100장.
- A5. 단일 배치(n ≤ 20) 의 표지/클로징은 Studio 프롬프트 문구("Slide 1 is the cover; closing slide is slide n")에 의존. n=1 은 슬라이드 1 이 표지·클로징 겸용.
- A6. 네트워크·API 실패, LLM 호출(`/api/llm/*`), 클립보드 복사 흐름은 범위 밖(별도 후보 2·3).

## Out of scope
- 1·2단계 프롬프트 내용, 디자인 시스템 문구, i18n, 백엔드 라우팅/입력검증(L0 정적 점검 결과만 `evidence/static_checks.log`).
- NotebookLM 실제 동작 검증(외부 서비스 호출 금지).

## Tool choice & rationale
- **TLA+ / TLC** (G3): 배치별 독립 렌더링의 비결정 선택과 병행 완료 순서를 전수 탐색해야 하고, 모든 n ∈ 1..MaxN 을 한 번의 실행에서 다루기 위해 `n` 을 초기상태 변수로 둠(DagScheduler 패턴의 "모든 그래프" 기법). 패턴 출발점: `BatchPipeline`(데이터흐름 무손실·무중복) + `DagScheduler`(초기상태 전수).
- Lean 4 미설치 → 모든 n 에 대한 무한 증명(L3)은 W7 후속 제안으로만 기록.
- 실코드 재현: `node:test` 기반 결정론적 테스트(`tests/batch_contract_test.mjs`) — 서버 불필요, 생성 모듈 직접 import. 과거 코드(85f2104) 재현은 `repro/legacy_85f2104.mjs`.

## Bounds
| 설정 | MinN..MaxN | BatchSize | Scope/Count/Role | 기대 | 결과 |
|---|---|---|---|---|---|
| `MC.cfg` | 1..5 | 2 | T/T/T | PASS | PASS — 37 generated / **25 distinct / depth 5**, L1 liveness 검사 포함 |
| `MC_wide.cfg` | 1..100 | **20** (실제 상수) | T/T/T | PASS | PASS — 2,880 / **1,340 distinct / depth 7** (최대 5배치) |
| `MC_bug.cfg` | 1..5 | 2 | F/F/F (85f2104 레거시) | FAIL | FAIL `P3_ExactDeck` (depth 3) |
| `MC_bug_scope.cfg` | 1..5 | 2 | F/T/T | FAIL | FAIL `P3_ExactDeck` (depth 4, 중복 슬라이드) |
| `MC_bug_count.cfg` | 1..5 | 2 | T/F/T | FAIL | FAIL `P3_ExactDeck` (depth 4, 슬라이드 손실) |
| `MC_bug_role.cfg` | 1..5 | 2 | T/T/F | PASS(예상, A3) | PASS |
| `MC_sanity.cfg` | 1..5 | 2 | T/T/T | FAIL | FAIL `Sanity_NeverMergedThreeBatches` (3배치 병합 상태 도달) |

## Properties (G2 수확·동결 — `tla/Properties.tla`)
| ID | Property | Level | Source | Frozen |
|---|---|---|---|---|
| P1 | 병합 덱에 표지(cover)는 정확히 1장이며 1번 슬라이드 | protocol | unified.ts:86 "Slide 1 is the cover … Never add extra cover or closing slides"; unified.ts:96-97; commit fbd3053 "첫 배치 외에는 커버/타이틀 금지"; README "첫 배치만 표지" | ✅ |
| P2 | 클로징은 정확히 1장이며 마지막(n번) 슬라이드 | protocol | unified.ts:99 "The SINGLE closing slide of the whole deck is global slide e only"; generate.mjs:109; fbd3053 "마지막 배치에만 단일 종료 슬라이드" | ✅ |
| P3 | 병합 덱 = 전역 슬라이드 1..n 정확히 1회, 순서대로(무손실·무중복·무재배열·추가 없음) | protocol | unified.ts:102-103 "Never … duplicate slides … no repeated and no missing content"; README "80장이 동일 20장 4회 반복되던 문제 해결"; tests/e2e_test.mjs:58-66 | ✅ |
| C1 | 모든 배치는 1..20장 | code | README "최대 20장 단위로 자동 분할"; unified.ts:45 | — |
| C2 | 계획은 1..n 의 연속 분할이며 길이 = ceil(n/20) = `batchCount` | code | generate.mjs:133; tests/lib.mjs:37-46; tests/e2e_test.mjs:49-55 | — |
| L1 | 모든 행동은 결국 병합 덱을 만든다 (`<>(merged ≠ <<>>)`, WF) | protocol (liveness) | unified.ts:175 사용 방법 5 | ✅ |

HITL: `G2: pending Brian review` (2026-10-29) — 승인 전까지 약화 금지.
