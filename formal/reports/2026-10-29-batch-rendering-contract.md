# 02_Design_NotebookLM 형식 검증 보고서 (WDLAB-STD-VERIFY-001)

- 프로젝트: `02_Design_NotebookLM` (GitHub `wdlab1958/Design-NotebookLM`, branch `main`)
- 검사 대상 commit: `eb95e949f9d0782ee2bfcfb0db10bd7848614e3b` (2026-10-15 "Node 백엔드 신규 구축…")
- 검증 일자: **2026-10-29** · 표준: WDLAB Unified Proof-Skills Standard v1.0 · 워크플로: W1 Bug hunt
- 에이전트/모델: claude-fable-5-1 · 도구: proof-skills 0.1.1, tla2tools v1.8.0 (TLC 2026.10.28), OpenJDK 21.0.12.1, Node v22.23.4 · Lean 4 미설치
- 산출물: `formal/` (스펙·증거·findings.json), `tests/batch_contract_test.mjs`, 본 보고서(`formal/reports/2026-10-29-batch-rendering-contract.md` 사본)

## 1. 판정 요약

| 항목 | 값 |
|---|---|
| Concern | `batch-rendering-contract` — 20장 단위 배치 분할 계획 + 배치별 계약 문구(범위·정확 장수·표지/클로징)가, 배치들이 **독립·병행** 렌더링된 뒤 순서대로 병합될 때 "슬라이드 1..n 정확히 1회, 표지 1장(1번), 클로징 1장(n번)" 을 보장하는가 |
| **Verdict** | **`BOUNDED-PASS`** (현재 코드) · F1 = 과거 버그(fbd3053 이전) `FIXED` 상태를 모델+실코드로 확증 · 부수 발견 F2 `CONFIRMED`(low, 구조적 위험), F3 `SUSPECTED`(low) |
| 달성 레벨 | **L2** (TLA+/TLC bounded model check) — 목표 L2 달성. L3(Lean) 은 미설치로 W7 후속 |
| 경계 | `MC.cfg`: n ∈ 1..5, BatchSize=2, 3 toggles ON → 37 generated / **25 distinct / depth 5**, liveness L1 포함 · `MC_wide.cfg`: n ∈ 1..100, **BatchSize=20(실제 상수)** → 2,880 / **1,340 distinct / depth 7** (최대 5배치) |
| 3-config | `MC` PASS(0) · `MC_bug` FAIL(12, `P3_ExactDeck`) · `MC_sanity` FAIL(12, 3배치 병합 상태 도달) — 추가 변이 `MC_bug_scope` FAIL(12) · `MC_bug_count` FAIL(12) · `MC_bug_role` PASS(예상, §5 A3) |
| 실코드 재현 | 과거 코드 85f2104 `generateStep3` 에 대해 `repro/legacy_85f2104.mjs` → **P1·P2·P3 모두 위반, exit 1** (`evidence/test_before.log`) · 현재 코드 `tests/batch_contract_test.mjs` 5/5 통과 (`evidence/test_after.log`) |
| 신뢰 기반 | TLC 2026.10.28 + 추상화 A1~A6 (렌더러 = 계약 문구를 글자 그대로 준수하는 적대자; LLM 의 부분 준수는 범위 밖) |
| 소스 수정 | **없음** — 수정은 커밋 fbd3053(2026-05-03) 에 이미 반영. 본 사이클은 모델·검사기·회귀 가드·게이트 스크립트를 **추가**만 함(Thin additive shell) |

> "검증됨" 의 의미: 위 경계 안에서, 위 추상화 아래, 동결 속성 P1·P2·P3·L1 과 코드 속성 C1·C2 에 반례가 없다. 코드가 모든 입력에 대해 정확하다는 뜻이 아니다(§5).

## 2. 프로젝트 개요와 G0 후보

React 19 + Vite 프론트엔드(NotebookLM 슬라이드 프롬프트 생성 UI, `app/`) + 의존성 0 Node http 백엔드(`server/`, 7개 엔드포인트) + 서버 기동형 A/B·E2E·Chaos 스크립트(`tests/`). 공유 가변 상태·DB·큐·락이 없는 **순수 함수형 프롬프트 생성기**가 핵심이어서 전통적 동시성 후보는 거의 없다. 유일하게 "독립 병행 실행 + 병합" 형태의 분산 데이터흐름을 갖는 것이 NotebookLM Studio 배치 렌더링 계약이며, 여기엔 실제 회귀 버그 이력(fbd3053 "80페이지가 동일 20페이지 4번 반복") 과 문서화된 불변식이 있다.

| 순위 | 후보 | 위치 | blast radius | concurrency | 처리 |
|---|---|---|---|---|---|
| **1** | **batch-rendering-contract** | `app/src/lib/unified.ts:39-120`, `server/lib/generate.mjs:76-133`, `PageConfig.tsx:12-20`, `tests/lib.mjs:37-46` | H | M | **선택** |
| 2 | result-generation-fallback (`/api/generate` ↔ 로컬 폴백 경합) | `CustomizePage.tsx:127-134` | L | M | 두 경로 출력 동일 — 미선택 |
| 3 | sequential-copy-helper (await 후 stale `seqIndex`, 복사 실패 무시) | `CustomizePage.tsx:136-154, 435-443` | L | M | F3 기록 |
| 4 | request-body-limit (`readJson` 5MB 초과 후 응답 쓰기) | `server/index.mjs:34-49` | L | L | 정적 검토 종결 |
| 5 | data-source-twins (`.ts`/`.mjs` 쌍 중복) | `app/src/data/*`, `app/src/lib/unified.*` | M | — | F2 기록 + drift guard |
| 6 | llm-call-error-mapping | `server/lib/llm.mjs` | L | L | 외부 API 호출 금지 — 제외 |

L0 정적 점검(`evidence/static_checks.log`): `tsc --noEmit` exit 0, `eslint` exit 0, `.ts`/`.mjs` 쌍(categories 133, designStyles 30, unified n=1..1000×4 구성) 차분 0, 카테고리 id 유일·프롬프트 1,330개·A3 25개 일치, SANY 파싱 OK.

## 3. Finding F1 — 배치 계약 부재 시 슬라이드 중복/손실 ("80장 = 동일 20장 ×4")

- **severity** high · **status** `fixed` (수정 커밋 fbd3053 기존; 본 사이클에서 모델·재현·회귀 가드로 확증) · **위반 속성** `P3_ExactDeck` (부수로 P1·P2)

### 3.1 모델과 fix toggle
`formal/batch-rendering-contract/tla/Spec.tla`: 초기상태에서 `n ∈ MinN..MaxN` 을 전수 선택(한 실행이 모든 덱 길이를 검사), `Plan(n)` 은 코드 루프의 1:1 전사. 배치 b 의 렌더러 `Render(b)` 는 계약 문구가 금지하지 않는 모든 출력을 비결정적으로 선택하고, 배치들은 임의 순서로 완료되며 사용자가 `Merge` 로 인덱스 순 병합한다.

| toggle | 코드의 계약 문구 | OFF = 과거 코드(85f2104) |
|---|---|---|
| `ScopeContract` | "global slides s–e" / "Use ONLY … slides numbered s through e … IGNORE every Master Script slide outside this range" (`unified.ts:94,119`, `generate.mjs:99`) | `target_data: "Source Script Slides s to e"` — 배타성 없음 → 1..n 어디서나 선택 |
| `CountContract` | "EXACTLY c slides" (`unified.ts:94,119`, `generate.mjs:100`) | `length: "dynamic"` → 1..BatchSize 장 |
| `RoleContract` | 첫 배치 외 표지 금지·마지막 배치 외 클로징 금지·마지막 배치 단일 클로징 (`unified.ts:96-99,114-118`, `generate.mjs:102-110`) | 규칙 없음 → 배치마다 기본 타이틀/감사 슬라이드 추가 가능 |

### 3.2 최소 반례 트레이스 (`MC_bug_scope.cfg`: ScopeContract OFF — 과거 증상 "다른 배치의 슬라이드 재생성")

| step | actor | action | 코드 매핑 | 변경 |
|---|---|---|---|---|
| 1 | Init | n=3, plan = ⟨[1–2], [3]⟩ | `unified.ts:39-52 batchPlan` | deck = ⟨∅, ∅⟩ |
| 2 | Studio 배치 1 | `Render(1)` → nums ⟨1, 2⟩ | `unified.ts:107-120 studioPrompt` | deck[1] = ⟨1,2⟩ |
| 3 | Studio 배치 2 | `Render(2)` → nums ⟨2⟩ (범위가 고정되지 않아 배치 1 의 슬라이드를 다시 렌더) | `unified.ts:94,119` / `generate.mjs:99` (OFF) | deck[2] = ⟨2⟩ |
| 4 | 사용자 | `Merge` → ⟨1, 2, 2⟩ | `unified.ts:103,175` | **P3 위반**: 슬라이드 3 손실, 2 중복 |

`MC_bug.cfg`(세 toggle 모두 OFF, 레거시) 최단 반례 (`evidence/trace_bug.md`):

| step | actor | action | 변경 |
|---|---|---|---|
| 1 | Init | n=2, plan = ⟨[1–2]⟩ | deck = ⟨∅⟩ |
| 2 | Studio 배치 1 | `Render(1)` → nums ⟨1⟩ (장수 미고정 — `length: "dynamic"`) | deck[1] = ⟨1⟩ |
| 3 | 사용자 | `Merge` → ⟨1⟩ | **P3 위반**: 슬라이드 2 손실 (P2 도 위반) |

### 3.3 코드 매핑 (CORRESPONDENCE.md 요약)

| 모델 | 코드 |
|---|---|
| `Plan(n)` | `app/src/lib/unified.ts:39-52` `batchPlan` (동일 루프 사본: `server/lib/generate.mjs:77-87`, `PageConfig.tsx:12-20`, `tests/lib.mjs:37-46`) |
| `BatchCountFormula` | `server/lib/generate.mjs:133` `Math.max(1, Math.ceil(totalPages/20))` |
| `Render(b)` 입력 | `unified.ts:107-120` `studioPrompt(b)`, `generate.mjs:93-123` `generateStep3Batches` |
| `Scope/Counts/Extras/RolesOK` | 위 3.1 표 |
| `Merge` | `unified.ts:103` "concatenated in order, MUST read as ONE seamless presentation", `unified.ts:175` 사용 방법 5 |

### 3.4 재현 테스트와 수정 전 실패 로그
재현은 **결정론적**이다: 외부 서비스 없이 생성 모듈을 직접 import 하고, 실행 가능한 모델 쌍둥이 `repro/contract_checker.mjs` 가 (문구 → 계약 플래그 → 적대적 렌더러의 레거시 선택 → 인덱스 순 병합 → P1~P3 단언) 을 수행한다.

- 과거 코드: `git show 85f2104:app/src/pages/CustomizePage.tsx` 의 `generateStep3` 를 esbuild 로 변환해 실행 (`repro/legacy_85f2104.mjs`). `evidence/test_before.log` 발췌:
```
[FAIL] n=80 batches=4 flags(batch1)={"scope":false,"exactCount":false,"coverForbidden":false,"closingForbidden":true}
       P1_SingleCover=false covers@[1,2,22,42,62]  P2_SingleClosing=false closings@[]
       P3_ExactDeck=false merged=81 slides, first 24 nums=[0,1,2,...,20,1,2,3]
4 configuration(s) violate the frozen properties on 85f2104 (pre-fix code) — F1 reproduced
EXIT=1
```
  → 80장 요청이 "추가 타이틀 1장 + 슬라이드 1..20 ×4 = 81장", 표지 5장, 클로징 0장: README 가 기술한 과거 증상 그대로.
- 현재 코드: `tests/batch_contract_test.mjs` (node:test, `npm run test:formal`) — n=1..1000 전체에서 C1·C2(`batchPlan`/`batchCount`), P1·P2·P3(Studio 프롬프트·3단계 배치 프롬프트 각각), 규칙 번호 연속성(fbd3053 의 "3. 중복" 버그), 계약 3요소 명시, `unified.ts`↔`unified.mjs` 드리프트 가드. `evidence/test_after.log`: `# pass 5 / # fail 0`.

### 3.5 수정 diff
없음. `evidence/patches/` 비어 있음(의도). 수정 자체는 커밋 `fbd3053` ("generateStep3 단일 문자열 → generateStep3Batches 배치별 배열… 1:1 매핑 규칙 강제… 커버/종료 슬라이드 규칙") 과 `unified.ts` PART 4 배치 계약에 이미 존재한다. §6.6 Anti-Reward-Hacking: 기능 제거·early-return 없음, 소스 무변경.

### 3.6 수정 후 통과·mutation 증거
| 검사 | 결과 | 증거 |
|---|---|---|
| `MC.cfg` (3 toggle ON, n 1..5, B=2) | PASS, 25 distinct, depth 5, L1 liveness 검사 완료 | `evidence/tlc_fixed.log` |
| `MC_wide.cfg` (ON, n 1..100, **B=20**) | PASS, 1,340 distinct, depth 7 | `evidence/tlc_wide.log` |
| `MC_bug.cfg` (모두 OFF) | FAIL `P3_ExactDeck`, depth 3 | `evidence/tlc_bug.log`, `trace_bug.md` |
| `MC_bug_scope.cfg` (Scope OFF) | FAIL `P3_ExactDeck`, depth 4 (중복) | `evidence/tlc_mutation_scope.log`, `trace_mutation_scope.md` |
| `MC_bug_count.cfg` (Count OFF) | FAIL `P3_ExactDeck`, depth 4 (손실) | `evidence/tlc_mutation_count.log` |
| `MC_bug_role.cfg` (Role OFF) | PASS — **예상된 결과** (A3: 정확 장수 지시가 추가 슬라이드를 이미 배제; 역할 규칙은 LLM 렌더러에 대한 defence-in-depth) | `evidence/tlc_mutation_role.log` |
| `MC_sanity.cfg` | FAIL `Sanity_NeverMergedThreeBatches` (3배치 병합 상태 도달) | `evidence/tlc_sanity.log`, `trace_sanity.md` |
| `-coverage 1` | Init 5, Render 15 distinct/22, Merge 5/5, Terminated 0/5(종료 스터터) — 비활성 action 없음 | `evidence/tlc_coverage.log` |
| 게이트 스크립트 | `./formal/run_all.sh` → 7 TLC 기대값 + 테스트 + 과거 재현 모두 PASS, "ALL GATES PASSED" | `evidence/run_all.log`, `mutation.log` |

(※ FAIL 설정의 "states generated" 수치는 4 워커가 첫 반례를 만나는 시점에 따라 실행마다 조금 다르다 — 예: MC_bug 330~372. depth 와 위반 속성은 결정적이다.)

## 4. 부수 발견 (수정하지 않음, 기록만)

### F2 — `.ts`/`.mjs` 쌍 중복 (low, `confirmed` 구조적 위험)
`server/index.mjs:13-14`, `server/lib/generate.mjs:10` 은 `.mjs` 쌍둥이를 import 하고 프론트는 `.ts` 를 import 한다(README 는 "단일 데이터 출처, 중복 없음" 이라 기술). 배치 루프도 4곳에 복제되어 있다. 오늘 기준 차분 0(`static_checks.log`), `tests/batch_contract_test.mjs` 가 `unified` 쌍을 가드. 단일 출처 전략(Node 22 type-stripping 으로 `.ts` 직접 import vs 빌드 시 `.mjs` 생성 + W6 드리프트 CI) 은 **HITL 결정** 필요.

### F3 — 순차 복사 헬퍼 진행도 (low, `suspected`)
`CustomizePage.tsx:136-154` `handleCopy` 는 `document.execCommand('copy')` 반환값을 확인하지 않고 성공 표시하며, `:435-443` 은 `await` 뒤 클로저의 `seqIndex` 로 비함수형 `setState` 를 한다(빠른 연속 클릭 시 같은 단계 2회 복사 — 건너뜀은 없고 라벨은 일관됨). React 테스트 러너가 없어 결정론적 재현 미작성 → SUSPECTED.

### 관찰 (finding 아님)
- UI 는 `totalPages` 1..100 (`PageConfig.tsx:42`), API 는 1..1000 (`server/index.mjs:89`) — 의도된 상·하한 차이로 보이나 README 에 명시되어 있지 않다.
- n=1 단일 슬라이드에서 Studio 문구 "Slide 1 is the cover; the single closing slide is slide 1" 은 표지·클로징 겸용을 뜻한다(모델 A5 와 일치).

## 5. 검증된 것과 경계, 신뢰 기반

### 5.1 속성 표
| ID | 속성 | 수준 | 출처 | 동결 | 결과(경계) |
|---|---|---|---|---|---|
| P1 | 표지 정확히 1장 = 슬라이드 1 | protocol | `unified.ts:86,96-97`; fbd3053; README | ✅ | holds (MC, MC_wide) |
| P2 | 클로징 정확히 1장 = 슬라이드 n | protocol | `unified.ts:99`; `generate.mjs:109`; fbd3053 | ✅ | holds |
| P3 | 병합 덱 = 1..n 정확히 1회·순서대로 | protocol | `unified.ts:102-103`; README; `e2e_test.mjs:58-66` | ✅ | holds / 변이 시 violated |
| C1 | 배치 장수 1..20 | code | README; `unified.ts:45` | — | holds |
| C2 | 계획 = 1..n 연속 분할, 길이 = ceil(n/20) = `batchCount` | code | `generate.mjs:133`; `tests/lib.mjs:37-46`; `e2e_test.mjs:49-55` | — | holds |
| L1 | `<>(merged ≠ ⟨⟩)` (WF) | protocol/liveness | `unified.ts:175` | ✅ | holds |
| Sanity | 3배치 병합 상태 도달 | sanity | §6.1 | — | violated (의도) |

### 5.2 경계
`n ∈ 1..5, BatchSize=2` (25 states, depth 5) · `n ∈ 1..100, BatchSize=20` (1,340 states, depth 7, ≤5 배치). API 상한 1000장(50배치)은 모델 밖이나, `tests/batch_contract_test.mjs` 가 n=1..1000 전체를 실코드로 확인한다(L0/L1 수준).

### 5.3 신뢰 기반과 버그를 숨길 수 있는 추상화
- 신뢰: TLC 2026.10.28 / Java 21, `Properties.tla` 의 문장, 대응표(`CORRESPONDENCE.md`).
- A1 슬라이드 = (전역 번호, extra 플래그). 내용·디자인 일관성은 검증 밖.
- **A2 렌더러는 문구를 글자 그대로 준수하는 적대자.** 실제 NotebookLM(LLM) 의 부분 준수·오해로 생기는 결함은 이 모델이 잡지 못한다. PASS 는 "계약 문구가 충분조건" 임을 뜻할 뿐이다.
- A3 정확 장수 지시(CountContract)가 추가 무번호 표지/클로징도 배제한다고 가정 → `RoleContract` 단독 변이 통과. 역할 규칙 제거를 권고하지 않는다(A2).
- A4 배치 완료 순서 임의, 병합은 항상 인덱스 순(사용자 수칙). 부분 병합·잘못된 순서 병합은 모델 밖.
- A5 소형 경계에서 BatchSize 를 2 로 축소(3배치 구조 확보); 실제 20 은 MC_wide 로 보완.
- A6 네트워크/API 실패, LLM 호출, 클립보드 흐름은 범위 밖.
- 모델 변경·속성 약화·CONSTRAINT·fairness 추가: **없음** (fairness 는 L1 을 위해 처음부터 `WF_vars(Next)`; safety 설정에서는 영향 없음).

## 6. 재실행 명령어
```bash
cd /home/ubuntu-02/ai_project/02_Design_NotebookLM
./formal/run_all.sh                                   # 7개 TLC 기대값 + node:test + 과거 코드 재현 (TLC_WORKERS=4 기본)
cd formal/batch-rendering-contract/tla
java -cp ~/.cache/proof-skills/tla2tools.jar tlc2.TLC -workers 4 -config MC.cfg        Properties.tla   # exit 0
java -cp ~/.cache/proof-skills/tla2tools.jar tlc2.TLC -workers 4 -config MC_wide.cfg   Properties.tla   # exit 0
java -cp ~/.cache/proof-skills/tla2tools.jar tlc2.TLC -workers 4 -config MC_bug.cfg    Properties.tla   # exit 12
java -cp ~/.cache/proof-skills/tla2tools.jar tlc2.TLC -workers 4 -config MC_sanity.cfg Properties.tla   # exit 12
java -cp ~/.cache/proof-skills/tla2tools.jar tlc2.TLC -workers 4 -config MC.cfg -coverage 1 Properties.tla
cd ../../../tests && npm run test:formal                                  # node --test batch_contract_test.mjs → pass 5
cd .. && node formal/batch-rendering-contract/repro/legacy_85f2104.mjs    # 과거 코드 → exit 1
```

## 7. HITL 승인 이력
| 게이트 | 상태 |
|---|---|
| G2 속성 동결 (P1, P2, P3, L1) | **pending Brian review** (2026-10-29) — 승인 전 약화 금지 |
| G7 수정 승인 | 해당 없음 — 소스 수정 없음. F2 단일 출처 전략은 **pending Brian** (설계 선택) |

## 8. 후속 제안
- **W5 CI 회귀 가드**: `./formal/run_all.sh` 와 `npm run test:formal` 을 CI 에 등록(7개 TLC 기대값 중 하나라도 어긋나면 fail-closed). 1분 미만.
- **W6 드리프트**: `unified.ts/.mjs`, `generate.mjs`, `PageConfig.tsx`, `tests/lib.mjs` 변경 시 대응표 재검토 필수화; F2 단일 출처 결정.
- **W4 단순화**: 배치 루프 4사본 → `unified.batchPlan` 단일 사용(C2 가 동등성 보장). `RoleContract` 는 모델상 중복이지만 LLM 렌더러 때문에 **유지** 권고.
- **W7 Lean 승격**: `Plan(n)` 이 모든 n 에 대해 1..n 의 연속 분할이고 길이 = ⌈n/B⌉ 임을 Lean 4 로 증명(순수 함수 → 적합). Lean 설치 후.
- F3: React 테스트 러너 + 클립보드 fake 도입 후 재현 → 수정 여부 결정.

## 9. Definition of Done 체크리스트 (§15)
```
[x] SCOPE.md: 단일 concern, 포함/추상화/제외, 경계 명시
[x] Properties: 출처 인용, 프로토콜 속성 동결 (+ HITL 승인 기록 — pending)
[x] CORRESPONDENCE.md: 모든 action ↔ file:line
[x] MC.cfg PASS / MC_bug.cfg FAIL / MC_sanity.cfg FAIL (로그 저장) + MC_wide, 변이 3종
[x] 반례 → 결정적 재현, 수정 전(과거 코드) 실패 로그 저장, 속성 단언에서 실패
[x] 수정 후(현재 코드) 모델·테스트 통과, mutation check 로 toggle 되돌리면 다시 실패
[ ] (Lean) sorry 0 … — 해당 없음 (Lean 미설치, L3 미주장)
[x] 패치 감사 기록 — 패치 없음(evidence/patches 비어 있음), 무력화 수정 아님
[x] findings.json (wdlab 블록 포함), 판정 어휘 준수
[x] 보고서 docx 발행 + formal/reports/ 로컬 사본 (Artifact 웹 발행은 부모 세션 재량)
[x] W5 CI 가드 등록 여부 결정 제안, W4 단순화 후속 제안
```

## 10. 변경 파일 목록과 commit
추가(신규): `formal/README.md`, `formal/CANDIDATES.md`, `formal/TOOLCHAIN.lock`, `formal/findings.json`, `formal/run_all.sh`, `formal/reports/2026-10-29-batch-rendering-contract.md`, `formal/batch-rendering-contract/{SCOPE.md, CORRESPONDENCE.md}`, `formal/batch-rendering-contract/tla/{Spec.tla, Properties.tla, MC.cfg, MC_bug.cfg, MC_bug_scope.cfg, MC_bug_count.cfg, MC_bug_role.cfg, MC_sanity.cfg, MC_wide.cfg}`, `formal/batch-rendering-contract/repro/{contract_checker.mjs, legacy_85f2104.mjs}`, `formal/batch-rendering-contract/evidence/*` (14 로그/트레이스), `tests/batch_contract_test.mjs`.
변경: `tests/package.json` (+`test:formal` 스크립트), `README.md` (형식 검증 섹션, Oct.29 2026).
소스 코드(`app/src/**`, `server/**`) 변경 없음. 사용자의 미커밋 파일 4개(`02_Design_NotebookLM-2026-06-06.md`, `AIMES-Biz.docx`, `AIMES-Eleven 사업계획서.docx`, `app/.runall.vite.config.mjs`)는 건드리지 않음.

commit: 본 `formal/` 디렉터리를 추가한 커밋 — 저장소 사본은 자기 sha 를 담을 수 없으므로 `git log -1 --format=%H -- formal/CANDIDATES.md` 로 확인. 최종 sha 와 push 결과는 저장소 밖 보고서 `~/ai_project/Proof-Skills/02_Design_NotebookLM_ProofSkills_Report_2026-10-29.md` §10 및 `evidence/git_commit.log` 에 기재.
