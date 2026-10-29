# formal/ — WDLAB proof-skills 형식 검증 (WDLAB-STD-VERIFY-001 v1.0)

**Concern:** `batch-rendering-contract` — n장 덱을 최대 20장 배치로 나누어 NotebookLM Studio 가 **독립·병행** 렌더링한 뒤 순서대로 이어붙일 때,
코드가 만든 배치 계획(`batchPlan`)과 배치별 계약 문구(범위 · 정확 장수 · 표지/클로징 위치)가
"전역 슬라이드 1..n 정확히 1회, 표지 1장(1번), 클로징 1장(n번)" 을 보장하는가.

**Verdict (2026-10-29, commit eb95e94):** `BOUNDED-PASS` · **L2** · 경계 `n=1..5, BatchSize=2` (25 states, depth 5, liveness 포함) 및 `n=1..100, BatchSize=20` (1,340 states, depth 7, 최대 5배치) · 신뢰 기반 = TLC 2026.10.28 + 추상화 A1~A6(`batch-rendering-contract/SCOPE.md`).
과거 코드(85f2104, fbd3053 이전)는 모델(`MC_bug.cfg`)과 실코드(`repro/legacy_85f2104.mjs`) 모두에서 `P3_ExactDeck` 위반 — "80장 = 동일 20장 ×4" 재현. 소스 수정 없음(이미 fbd3053 에서 수정), 회귀 가드 `tests/batch_contract_test.mjs` 추가.

## 구성
```
formal/
├── CANDIDATES.md            G0 후보 6개 · 순위 · 선택 근거
├── findings.json            기계 판독 결과 (F1 fixed, F2 confirmed/low, F3 suspected/low) + wdlab 블록
├── TOOLCHAIN.lock           proof-skills 0.1.1 / tla2tools v1.8.0 (TLC 2026.10.28) / Java 21 / Lean 미설치
├── run_all.sh               3-config 게이트 + 회귀 테스트 + 과거 코드 재현 (기대값 단언, TLC_WORKERS 존중)
├── reports/2026-10-29-batch-rendering-contract.md   보고서 사본 (docx: ~/ai_project/Proof-Skills/)
└── batch-rendering-contract/
    ├── SCOPE.md             범위 · 추상화 · 경계 · 속성 표(G2, HITL pending)
    ├── CORRESPONDENCE.md    모델 요소 ↔ file:line
    ├── tla/Spec.tla         모델 (toggle: ScopeContract / CountContract / RoleContract)
    ├── tla/Properties.tla   동결 속성 P1 P2 P3 L1 + 코드 속성 C1 C2 + sanity
    ├── tla/MC*.cfg          MC(PASS) MC_wide(PASS) MC_bug(FAIL) MC_bug_scope(FAIL) MC_bug_count(FAIL) MC_bug_role(PASS, 예상) MC_sanity(FAIL)
    ├── repro/contract_checker.mjs   모델의 실행 가능한 쌍둥이(문구 → 계약 플래그 → 적대적 렌더러 → P1~P3)
    ├── repro/legacy_85f2104.mjs     git 85f2104 의 generateStep3 로 과거 버그 재현 (exit 1 기대)
    └── evidence/            tlc_*.log, trace_*.md, mutation.log, test_before/after.log, static_checks.log, run_all.log
```

## 실행
```bash
./formal/run_all.sh                       # 전부 (java + ~/.cache/proof-skills/tla2tools.jar, node >= 22)
cd tests && npm run test:formal           # 회귀 가드만 (서버 불필요)
node formal/batch-rendering-contract/repro/legacy_85f2104.mjs   # 과거 코드 재현 → exit 1
```

## 주의
- PASS 는 "명시 경계 안에서 반례 없음" 이다. 렌더러(NotebookLM)는 **문구를 글자 그대로 준수하는 적대자**로 추상화했으므로, LLM 의 부분 준수/오해로 생기는 결함은 이 검증 범위 밖이다.
- `MC_bug_role.cfg` 가 통과하는 것은 모델상 정확 장수 지시가 추가 표지/클로징을 이미 배제하기 때문(A3). 역할 규칙은 LLM 렌더러에 대한 defence-in-depth 로 유지한다.
- Lean 4 미설치 → L3(모든 n) 은 W7 후속 제안.
