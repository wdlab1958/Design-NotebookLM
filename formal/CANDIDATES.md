# G0 후보 선정 — 02_Design_NotebookLM (2026-10-29)

프로젝트 성격: React 19 + Vite 프론트엔드(프롬프트 생성 UI) + 의존성 0 Node http 백엔드(`server/`) + 서버 기동형 A/B·E2E·Chaos 스크립트(`tests/`).
공유 가변 상태·DB·큐·락이 없는 **순수 함수형 프롬프트 생성기**가 핵심이므로, 전통적 동시성(레이스·리스·재시도) 후보는 거의 없다.
유일하게 "독립 병행 실행 + 병합"의 분산 데이터흐름 형태를 갖는 것은 **NotebookLM Studio 배치 렌더링 계약**이다
(배치 N개가 서로의 출력을 보지 못한 채 동시에 생성되고 사용자가 순서대로 이어붙임 — README "배치 1·2를 동시에 생성해도 연속된 한 덱").

| 순위 | 후보 concern | 위치 | 영향 범위 | 동시성 | 비고 |
|---|---|---|---|---|---|
| **1** | **batch-rendering-contract** — 배치 분할 계획(`batchPlan`)과 배치별 계약 문구(범위·정확 장수·표지/클로징 위치)가 독립 렌더링 + 순서 병합 하에서 "슬라이드 1..n 정확히 1회, 표지 1장, 클로징 1장"을 보장하는가 | `app/src/lib/unified.ts:39-120`, `server/lib/generate.mjs:76-133`, `app/src/components/PageConfig.tsx:12-20`, `tests/lib.mjs:37-46` | **H** (제품의 핵심 산출물; 과거 회귀 버그 fbd3053 "80장 = 동일 20장 ×4") | **M** (배치 병행 생성 + 병합, 렌더러는 적대적 비결정) | **선택** — BatchPipeline/DagScheduler 패턴 변형 |
| 2 | result-generation-fallback — `CustomizePage` useEffect 의 `/api/generate` 호출과 로컬 폴백(`localGenerate`) 경합(StrictMode 이중 실행, 느린 응답 후 폴백 덮어쓰기) | `app/src/pages/CustomizePage.tsx:127-134` | L (두 경로 출력이 동일 — 출처 배지만 달라짐) | M | 결과 동등성은 후보 1 의 테스트(ts/mjs twin)로 간접 보장 |
| 3 | sequential-copy-helper — 순차 복사 버튼의 `await handleCopy` 후 `setSeqIndex(seqIndex + 1)` stale-closure, 복사 실패(`execCommand` 반환값 무시) 시 진행도만 전진 | `app/src/pages/CustomizePage.tsx:136-154, 435-443` | L (UI 보조 기능) | M (클릭 ↔ 클립보드 비동기) | F3 로 기록만 (SUSPECTED; React 테스트 러너 없음) |
| 4 | request-body-limit — `readJson` 5MB 초과 시 `reject` + `req.destroy()` 뒤 응답 쓰기 | `server/index.mjs:34-49` | L (chaos 테스트가 연결 종료를 허용) | L | Node http 가 destroyed socket 쓰기를 무시 — 정적 검토로 종결 |
| 5 | data-source-twins — `categories/designStyles/unified` 의 `.ts`/`.mjs` 쌍 중복(README 는 "단일 출처" 라 기술) | `app/src/data/*.{ts,mjs}`, `app/src/lib/unified.{ts,mjs}` | M (드리프트 시 프론트/백엔드 불일치) | — (정적) | F2 로 기록; L0 차분 점검 통과(동일), 회귀 테스트에 drift guard 포함 |
| 6 | llm-call-error-mapping — `callLlm` 공급자 오류 → `LlmError(status)` 매핑 | `server/lib/llm.mjs` | L | L | 외부 API 호출 금지로 모델링 제외 |

## 선택 근거
- blast radius × concurrency 최대이며, **실제 과거 버그(fbd3053)** 와 **문서화된 불변식**(unified.ts PART 4, README, e2e 테스트)이 존재해 G2 속성 수확이 출처 인용 가능.
- 3-config(fix toggle = 계약 문구 3요소) 로 "모델이 실패할 수 있음" 을 보일 수 있고, 과거 코드(85f2104)를 git 에서 꺼내 **실코드 재현**이 가능.
- 표준 §11 에 본 프로젝트 전용 가이드는 없음 → 일반 절차(G0~G8) 적용.
