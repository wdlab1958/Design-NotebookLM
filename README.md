# NotebookLM 슬라이드 프롬프트 생성기

Google NotebookLM용 프레젠테이션 슬라이드 AI 프롬프트를 체계적으로 생성하는 웹 애플리케이션입니다.

## 주요 기능

### 카테고리 및 프롬프트
- **총 133가지 카테고리** — 11개 대분류 체계로 구성 (A3 AI/AX 프로젝트, 비즈니스, 기술, 교육, 의료, 과학, 예술, 사회, 산업, 정부, 특수)
- **A3 AI/AX 프로젝트 — 25개 (신규)** — 사이드바 최상단에 배치된 wdlab 자체 구축 AI/AX 프로젝트 컬렉션
  - `100K-Expert` — 10만 AX 전문인력 양성 프로젝트 (171개 API, 7개 멀티에이전트 프레임워크)
  - `A3DE` — 자율형 에이전트 개발 환경 (5대 AI 에이전트, 100+ API)
  - `AEGIS` — 7계층 아키텍처 AI 컴패니언 (3LMS 메모리, Seruphine 음성, 197+ API, 149개 기능)
  - `AgentForge` — 멀티에이전트 AI 플랫폼 (8개 프레임워크, 20개 워크스페이스, 93개 API)
  - `AIALBM` — 학습형 AI 에이전트 (3단계 메모리, 연합 학습, 뇌 기억 모델)
  - `AIMES-Eleven` — 스마트 제조 실행 시스템 (11개 산업 도메인, 예측 정비)
  - `AiNex` — AX 컨설팅 플랫폼 (7개 멀티에이전트, ISO AI 거버넌스)
  - `APIGateway` — 마이크로서비스 통합 API Gateway (Backend 15 + Frontend 12 + Gateway 1)
  - `ARGUS` — AI 통합 보안 모니터링 (이상 탐지, 위협 헌팅, 자동 대응)
  - `ASCM` — AI SaaS 통합 관제 (AEGIS·AgentForge·AiNex·NexusAI·AIALBM 통합)
  - `AutoFlow` — vLLM Docker 기반 업무 자동화 (OpenClaw, 11개 도메인, 67+ 스킬)
  - `Design NotebookLM` — 본 프로젝트 (133개 카테고리, 30개 디자인 스타일)
  - `FileForge` — 지능형 파일 관리 플랫폼 (10개 AI 에이전트, 77개 API)
  - `FileForge-Python` — 전체 스택 파일 관리 (PySide6 + NiceGUI 듀얼 인터페이스)
  - `Gov. Clawling` — 정부 데이터 수집 시스템 (공공 API, 정책 문서 분석)
  - `NexusAI` — 멀티에이전트 오케스트레이션 (10개 에이전틱 프레임워크, 290+ API)
  - `Pi5-Edge-Device` — 엣지 자율 추론 게이트웨이 (Raspberry Pi 5 + Gemma 4, 99종 센서/105종 릴레이)
  - `Self Security Consulting` — AI 보안 컨설팅 플랫폼 (ISO 27001, 13종 AI 에이전트, Red Team 자동화)
  - `SlideEditor` — AI 슬라이드 편집기 (Gemini OCR, PDF/PPTX/이미지 멀티포맷)
  - `TruthLens` — 딥페이크 탐지 시스템 (OWL 온톨로지, 40개 탐지 모듈, 14개 StateGraph)
  - `wdlab-CLI` — 자율 진화형 AI 개발 워크벤치 (로컬 우선 LLM, 5계층 적응형 메모리)
  - `LOAN4U` — AI 기반 맞춤형 대출 추천 플랫폼
  - `PokerFace` — 실시간 얼굴 표정·미세표정 분석 AI
  - `WDLAB-AlphaForge` — 알파 전략 자동 생성(퀀트 트레이딩) 플랫폼
  - `WDLAB-LLMOps` — 엔드투엔드 LLM 운영(LLMOps) 플랫폼
- **기술 & IT 확장 — 18개** — 기존 10개 + 신규 8개 카테고리
  - AI/머신러닝, 클라우드/인프라, 사이버보안, 블록체인/웹3, 소프트웨어 개발
  - 데이터 분석, IoT/스마트기기, UX/UI 디자인, 로봇공학, 5G/통신
  - **AX (AI Transformation)** — AI 기반 기업 디지털 전환 전략
  - **AIMES** — AI 모델 평가 시스템 및 MLOps 파이프라인
  - **Agent Harness Engineering** — AI 에이전트 오케스트레이션 및 하네스 설계
  - **Hermes Agent** — Hermes 기반 자율 에이전트 플랫폼
  - **보안 컨설팅** — 기업 정보보안 컨설팅 및 취약점 진단
  - **보안 관제** — SOC/SIEM/SOAR 기반 통합 보안 관제
  - **아두이노 응용** — Arduino 기반 IoT, 센서, 자동화 프로젝트
  - **라즈베리파이 응용** — Raspberry Pi 기반 엣지 컴퓨팅, AI 추론 서버
- **카테고리별 10가지 프롬프트 샘플** — 한국어/영어 이중 언어 지원 (총 1,330개 프롬프트)

### 디자인 스타일
- **30가지 디자인 구조** — 심플, 공학적, 과학적, 예술적, 창의적, 미니멀, 모던, 클래식, 테크, 비즈니스, 인포그래픽, 매거진, 다크모드, 그라디언트, 3D/입체, 플랫, 뉴모피즘, 레트로, 미래적, 자연/유기적, 기하학적, 타이포중심, 사진중심, 일러스트, 데이터중심, 스토리텔링, 브루탈리즘, 글래스모피즘, 한국적, 하이브리드
- **사실적인 슬라이드 미리보기 모달** — 각 스타일 호버 시 눈 아이콘 클릭으로 모달 오픈
  - CSS 기반 고퀄리티 슬라이드 목업 (타이틀 슬라이드 + 콘텐츠 슬라이드 2장)
  - 좌우 화살표 및 dot 인디케이터로 슬라이드 네비게이션
  - 실제 프레젠테이션과 유사한 차트, KPI 카드, 진행률 바, 타이포그래피 등 포함
  - 모달 내에서 직접 스타일 선택 가능

### 다국어 지원
- **한국어/영어 전환** — 헤더에서 언어 토글 버튼으로 전환
- 카테고리명, 프롬프트, 디자인 스타일 설명 등 전체 UI 이중 언어 대응

### 프롬프트 생성
- **3단계 프롬프트 자동 생성** — 디자인 분석 → 마스터 대본 → 렌더링 실행
- **배치 분할 처리** — 대규모 프레젠테이션을 최대 20장 단위로 자동 분할
  - 3단계는 배치별 **자기완결형 Studio 프롬프트 배열**로 생성 (의사코드 제거, 마스터 대본 "슬라이드 번호: N" 1:1 매핑 강제, 첫 배치만 표지·마지막 배치만 클로징) — 80장이 동일 20장 4회 반복되던 문제 해결
  - **순차 복사 헬퍼** — "전체 복사" 대신 클릭마다 다음 단계(1단계 → 2단계 → 배치 1~N)만 클립보드에 복사하고 진행도(N/Total)를 버튼 라벨로 안내
- **통합 마스터 사양서(원클릭 흐름)** `(워킹트리 변경, 미커밋)` — 디자인 시스템 + 마스터 콘텐츠 플랜 + 배치 렌더링 계약을 하나의 선언형 문서(`[MASTER PRESENTATION SPEC]` PART 1~5)로 묶어 NotebookLM **소스로 1회만 붙여넣기**. 배치마다 Studio "맞춤설정" 칸 길이 제한을 넘지 않는 짧은 **Studio 실행 프롬프트**를 별도 제공하여 배치 1·2를 동시에 생성해도 연속된 한 덱이 되도록 전역 슬라이드 번호/내러티브 좌표를 고정 (`app/src/lib/unified.ts`, 프론트·백엔드 공유 단일 출처). 기존 1·2·3단계는 "레거시 — 채팅 기반 단계별 프롬프트(고급)" 로 접힘 유지
- **백엔드 생성 + 로컬 폴백** `(워킹트리 변경, 미커밋)` — 결과 페이지는 `/api/generate` 로 프롬프트를 생성하고, 백엔드 미연결 시 동일 로직의 로컬 생성기로 대체하며 출처 배지(백엔드 생성 / 로컬 생성(폴백))와 경고 배너를 표시
- **AI 직접 생성 (Claude / Gemini)** `(워킹트리 변경, 미커밋)` — 설정에 등록한 API Key 로 `/api/llm/generate` 를 호출해 2단계 마스터 대본을 실제로 작성 (실패 시 명시적 오류 표시)
- **디자인 레퍼런스 연동** — Behance, Dribbble, 나노바나나 참조 지원
- **설정 관리** — Claude, Gemini API Key 등록 및 사용자 지정 프롬프트
  - **사용자 지정 프롬프트 실제 주입** `(워킹트리 변경, 미커밋)` — 저장만 되던 customPrompt 를 1·2·3단계 및 통합 사양서에 "최우선 반영" 블록으로 주입
  - **연결 테스트** `(워킹트리 변경, 미커밋)` — 공급자별 "연결 테스트" 버튼으로 `/api/llm/validate` 를 호출해 키 유효성·모델명을 즉시 확인
- **백엔드 상태 팝오버** `(워킹트리 변경, 미커밋)` — 헤더 Bell 아이콘 클릭 시 `/api/health` 결과(연결 상태, 카테고리/스타일/프롬프트 수, LLM 모델)를 표시
- **NotebookLM 바로 열기** `(워킹트리 변경, 미커밋)` — "NotebookLM 열기" 버튼과 사이드바 NotebookLM 항목이 실제 `notebooklm.google.com` 을 새 탭으로 오픈
- **HTTP 환경 클립보드 폴백** — `navigator.clipboard` 미지원 환경(HTTP, 구형 브라우저)에서도 `document.execCommand` 기반 복사 지원
- **Hydration 안전 UI** — 버튼 중첩으로 인한 React hydration 에러 제거 (role=button div로 전환)

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React 19 + TypeScript 5.9 |
| Build Tool | Vite 5 (`@vitejs/plugin-react` 4) — Vite 8 에서 하향 고정 `(워킹트리 변경, 미커밋)` |
| Backend | Node 22 내장 `http` (외부 의존성 0, `server/`) `(워킹트리 변경, 미커밋)` |
| Test | Node 스크립트 기반 A/B · E2E · Chaos (`tests/`) `(워킹트리 변경, 미커밋)` |
| Styling | TailwindCSS 3.4 |
| Routing | React Router DOM 7 |
| Icons | Lucide React |
| Linting | ESLint 9 |

## 프로젝트 구조

```
app/
├── src/
│   ├── main.tsx                           # 엔트리 포인트 (BrowserRouter + LanguageProvider)
│   ├── App.tsx                            # 라우팅 설정
│   ├── types.ts                           # TypeScript 인터페이스
│   ├── components/
│   │   ├── Header.tsx                     # 상단 헤더 (설정, 언어 토글)
│   │   ├── Sidebar.tsx                    # 좌측 네비게이션
│   │   ├── CategorySelector.tsx           # 카테고리 선택 (133개, 11개 그룹, 검색 지원)
│   │   ├── PromptSelector.tsx             # 프롬프트 샘플 선택
│   │   ├── DesignStyleSelector.tsx        # 디자인 스타일 선택 (30개, 미리보기 통합)
│   │   ├── DesignStylePreviewModal.tsx    # 디자인 스타일 미리보기 모달 (30개 스타일 x 2장)
│   │   ├── DesignRefPanel.tsx             # 디자인 레퍼런스 링크
│   │   ├── PageConfig.tsx                 # 슬라이드 수 및 배치 설정
│   │   └── SettingsModal.tsx              # API Key 및 사용자 설정
│   ├── pages/
│   │   ├── MainPage.tsx                   # 메인 설정 페이지 (/) — NotebookLM 새 탭 오픈
│   │   └── CustomizePage.tsx              # 프롬프트 생성 결과 (/customize) — 통합 사양서·AI 직접 생성·로컬 폴백
│   ├── lib/                               # (미커밋) 백엔드 연동 모듈
│   │   ├── api.ts                         # /api 클라이언트 (health, generate, llmGenerate, validateKey)
│   │   ├── unified.ts                     # 통합 마스터 사양서 + Studio 실행 프롬프트 생성기 (프론트/백엔드 공유)
│   │   └── unified.mjs                    # unified.ts 의 Node 18 호환 JS 버전 (서버가 import)
│   ├── data/
│   │   ├── categories.ts                  # 133개 카테고리 및 프롬프트 데이터 (한/영)
│   │   └── designStyles.ts                # 30개 디자인 스타일 정의 (한/영)
│   └── i18n/
│       ├── LanguageContext.tsx            # 다국어 Provider 컴포넌트만 export (fast-refresh 친화)
│       ├── lang.ts                        # (미커밋) LanguageContext/useLang/translations 분리
│       ├── ko.ts                          # 한국어 번역 리소스
│       └── en.ts                          # 영어 번역 리소스
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── index.html
├── vite.config.ts                         # 포트 3017 + /api → 백엔드(8013) 프록시
├── .runall.vite.config.mjs                # (미커밋) run_all_projects.sh 통합 실행기용 포트 재매핑 래퍼
├── tailwind.config.js
├── tsconfig.json
└── package.json
server/                                    # (미커밋) 백엔드 API — Node 내장 http, 의존성 0
├── index.mjs                              # 7개 엔드포인트 라우팅, 입력 검증(totalPages 정수 1~1000), CORS
├── lib/generate.mjs                       # 3단계 프롬프트 결정론적 생성 + customPrompt 주입 + 통합 사양서
├── lib/llm.mjs                            # Claude(Messages API) / Gemini(generateContent) 호출 및 키 검증
└── package.json                           # npm start / npm run dev(--watch)
tests/                                     # (미커밋) A/B · E2E · Chaos 테스트 (기동 중인 서버 대상)
├── ab_test.mjs                            # 백엔드 /api/generate vs 독립 참조 구현 차분 검증
├── e2e_test.mjs                           # 헬스/데이터 통계/경계값/80p 회귀/입력검증/프록시
├── chaos_test.mjs                         # 깨진 JSON, 필드 누락/문자열/초과, 대용량 payload, 동시 요청
└── lib.mjs
```

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm

### 설치 및 실행

프론트엔드(Vite)와 백엔드(Node API)를 함께 실행합니다.

```bash
# 1) 백엔드 API 서버 (기본 포트 8013, 의존성 0 — Node 22+ 필요)
cd server
PORT=8013 npm start

# 2) 프론트엔드 (별도 터미널, 기본 포트 3017)
cd app
npm install
npm run dev          # /api 요청은 Vite 프록시가 백엔드(8013)로 전달
```

프론트엔드 개발 서버는 `http://localhost:3017`, 백엔드 API는 `http://localhost:8013` 에서 실행됩니다.

### 백엔드 API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/health` | 서버 상태 + 데이터 통계(카테고리/스타일/프롬프트 수) |
| GET | `/api/categories` | 전체 카테고리(133개) |
| GET | `/api/categories/:id` | 단일 카테고리 |
| GET | `/api/design-styles` | 전체 디자인 스타일(30개) |
| POST | `/api/generate` | 3단계 프롬프트 결정론적 생성 (customPrompt 반영, 20장 단위 배치 분할) |
| POST | `/api/llm/generate` | Claude/Gemini API로 2단계 마스터 대본 **실제 생성** |
| POST | `/api/llm/validate` | Claude/Gemini API Key 유효성 검증(연결 테스트) |

> 백엔드는 프론트엔드의 `app/src/data/*.ts` 를 단일 데이터 출처로 직접 재사용합니다(중복 없음, Node 22 type-stripping). LLM 엔드포인트는 키 미설정/오류 시 **명시적 에러(400/4xx)** 를 반환하며 사일런트 폴백을 하지 않습니다.
> `/api/generate` 응답에는 `step1`/`step2`/`step3Batches`/`batchCount` 외에 통합 흐름용 `unified`(마스터 사양서)와 `studioPrompts[]`(배치별 Studio 실행 프롬프트)가 포함됩니다. `totalPages` 는 1~1000 정수만 허용(문자열·실수는 400).
> API 포트는 `PORT`(백엔드) / `VITE_API_PORT`(프록시 대상) 환경변수로 변경할 수 있습니다.

### 테스트 (백엔드 8013 / 프론트 3017 기동 상태에서)

```bash
cd tests
npm test            # A/B → E2E → Chaos 순차 실행 (npm run test:ab | test:e2e | test:chaos 개별 실행)
```

- **A/B(차분)** — 백엔드 `/api/generate` 와 테스트 내장 참조 구현을 무작위 구성 60개로 비교해 출력 동등성·지연 측정
- **E2E** — 헬스/데이터 통계(133/30/1,330/25), 목록·단일·404, 3단계 생성 경계값(5·20·21·45·80p), 80p 배치 반복 회귀, customPrompt 주입, 입력검증 400, LLM 키 없음 400, 프론트 프록시
- **Chaos** — 깨진 JSON, 필드 누락/음수/초과/문자열, 1000p(50배치), 대용량 payload, 미지 경로/메서드, 200 동시 요청

### 빌드

```bash
npm run build
```

빌드 결과물은 `app/dist/` 디렉토리에 생성됩니다.

## 사용 방법

1. **카테고리 선택** — 133가지 카테고리 중 프레젠테이션 주제에 맞는 카테고리를 선택합니다. (A3 AI/AX 프로젝트 그룹이 최상단에 표시됩니다.)
2. **프롬프트 선택** — 선택한 카테고리의 10가지 프롬프트 샘플 중 하나를 선택합니다.
3. **디자인 스타일 선택** — 30가지 디자인 스타일 중 원하는 스타일을 선택합니다.
   - 각 스타일에 마우스를 올리면 나타나는 눈(Eye) 아이콘을 클릭하여 미리보기를 확인할 수 있습니다.
   - 모달에서 좌우 화살표로 타이틀/콘텐츠 슬라이드를 확인한 뒤 선택합니다.
4. **레퍼런스 및 설정** — 디자인 참고 URL, 대상 청중, 프레젠테이션 목적을 입력합니다.
5. **페이지 수 지정** — 총 슬라이드 수를 설정합니다 (1~100장, 20장 단위 배치 분할).
6. **NotebookLM 열기** — 실제 NotebookLM 이 새 탭으로 열리고 결과 페이지로 이동합니다. 결과 페이지에서는 두 가지 방식을 제공합니다.
   - **권장(통합 흐름)** — "통합 사양서 복사 (1회)" → NotebookLM "+ 소스 추가 → 복사된 텍스트" 에 붙여넣기 → 발표 소스 업로드 → Studio → 슬라이드 생성 → 맞춤설정에 [배치 1] Studio 실행 프롬프트 붙여넣고 시작 → 곧바로 [배치 2]로 한 번 더 시작하면 20장 덱들이 동시에 생성되며, 순서대로 이으면 하나의 연속 발표 자료가 됩니다.
   - **레거시(채팅 기반)** — 1단계 → 2단계 → 배치 1~N 순으로 순차 복사 헬퍼를 눌러 NotebookLM 채팅창에서 단계별로 실행합니다.
   - **AI 직접 생성** — 설정에 Claude/Gemini API Key 가 등록되어 있으면 2단계 마스터 대본을 AI 가 실제로 작성합니다.

### 생성되는 3단계 프롬프트

| 단계 | 설명 |
|------|------|
| 1단계 — 디자인 분석 | 업로드된 디자인 이미지를 분석하여 Adaptive Presentation Design System 생성 |
| 2단계 — 마스터 대본 | 소스 문서를 분석하여 N장 분량의 마스터 스크립트 생성 |
| 3단계 — 렌더링 실행 | 배치 단위로 분할하여 순차적 FUNCTION 호출 실행 |

## 카테고리 구성 (133개)

| 대분류 | ID 범위 | 소분류 수 |
|--------|---------|----------|
| **A3 AI/AX 프로젝트** (신규, 최상단) | **109–133** | **25개** |
| 비즈니스 & 경영 | 1–10 | 10개 |
| **기술 & IT** | **11–28** | **18개** |
| 교육 & 학술 | 29–38 | 10개 |
| 의료 & 건강 | 39–48 | 10개 |
| 과학 & 공학 | 49–58 | 10개 |
| 예술 & 디자인 | 59–68 | 10개 |
| 사회 & 인문 | 69–78 | 10개 |
| 산업 & 비즈니스 | 79–88 | 10개 |
| 정부 & 공공 | 89–98 | 10개 |
| 특수 & 기타 | 99–108 | 10개 |

## A3 AI/AX 프로젝트 카테고리 (25개, ID 109–133)

알파벳순 정렬되어 있으며, 각 프로젝트당 10개의 한국어/영어 프롬프트 샘플을 제공합니다.

| # | ID | 프로젝트 | 핵심 키워드 |
|---|----|----------|-------------|
| 1 | 109 | 100K-Expert | 10만 AX 전문인력, 171개 API, 7개 멀티에이전트 |
| 2 | 110 | A3DE | 자율형 에이전트 개발, 5대 AI 에이전트, 100+ API |
| 3 | 111 | AEGIS | 7계층 아키텍처, 3LMS 메모리, Seruphine 음성, 149개 기능 |
| 4 | 112 | AgentForge | 8개 AI 프레임워크, 20개 워크스페이스, 93개 API |
| 5 | 113 | AIALBM | 학습형 에이전트, 3단계 메모리, 연합 학습 |
| 6 | 114 | AIMES-Eleven | 스마트 MES, 11개 산업 도메인, 예측 정비 |
| 7 | 115 | AiNex | AX 컨설팅, ISO AI 거버넌스, 7개 프레임워크 |
| 8 | 116 | APIGateway | 마이크로서비스 통합, 28개 서비스, OAuth/JWT |
| 9 | 117 | ARGUS | AI 보안 모니터링, 이상 탐지, 위협 헌팅 |
| 10 | 118 | ASCM | AI SaaS 통합 관제, 5개 플랫폼 통합, Self-Healing |
| 11 | 119 | AutoFlow | vLLM Docker, OpenClaw, 67+ 스킬 |
| 12 | 120 | Design NotebookLM | 슬라이드 프롬프트 생성기 (본 프로젝트) |
| 13 | 121 | FileForge | 파일 관리 플랫폼, 10개 AI 에이전트, 77개 API |
| 14 | 122 | FileForge-Python | PySide6 + NiceGUI, Python 백엔드, 77개 API |
| 15 | 123 | Gov. Clawling | 정부 데이터 수집, 공공 API, 정책 문서 분석 |
| 16 | 124 | NexusAI | 멀티에이전트 오케스트레이션, 10개 프레임워크, 290+ API |
| 17 | 125 | Pi5-Edge-Device | Raspberry Pi 5, Gemma 4, 99종 센서/105종 릴레이 |
| 18 | 126 | Self Security Consulting | ISO 27001, 5계층 하네스, 13종 AI 에이전트 |
| 19 | 127 | SlideEditor | Gemini OCR, PDF/PPTX/이미지, 캔버스 편집 |
| 20 | 128 | TruthLens | 딥페이크 탐지, OWL 온톨로지, 40개 탐지 모듈 |
| 21 | 129 | wdlab-CLI | 자율 진화형 AI 개발 워크벤치, 5계층 적응형 메모리 |
| 22 | 130 | LOAN4U | AI 기반 맞춤형 대출 추천 플랫폼 |
| 23 | 131 | PokerFace | 실시간 얼굴 표정·미세표정 분석 AI |
| 24 | 132 | WDLAB-AlphaForge | 알파 전략 자동 생성(퀀트 트레이딩) 플랫폼 |
| 25 | 133 | WDLAB-LLMOps | 엔드투엔드 LLM 운영(LLMOps) 플랫폼 |

## 디자인 스타일 미리보기 (30가지)

| # | 스타일 | 영문명 | 설명 |
|---|--------|--------|------|
| 1 | 심플 | Simple | 깔끔한 여백과 최소한의 요소 |
| 2 | 공학적 | Engineering | 구조적이고 정밀한 다이어그램 중심 |
| 3 | 과학적 | Scientific | 데이터 시각화와 분석적 그래프 중심 |
| 4 | 예술적 | Artistic | 회화적 표현과 감성적 비주얼 |
| 5 | 창의적 | Creative | 비대칭 레이아웃과 실험적 타이포 |
| 6 | 미니멀 | Minimal | 극단적으로 절제된 요소 |
| 7 | 모던 | Modern | 세련된 기하학적 형태와 그라디언트 |
| 8 | 클래식 | Classic | 전통적이고 격식 있는 레이아웃 |
| 9 | 테크 | Tech | 디지털 감성의 네온 톤 |
| 10 | 비즈니스 | Business | 기업 프레젠테이션 전문 레이아웃 |
| 11 | 인포그래픽 | Infographic | 아이콘/차트 중심 정보 시각화 |
| 12 | 매거진 | Magazine | 잡지 편집 스타일 |
| 13 | 다크모드 | Dark Mode | 어두운 배경 하이 콘트라스트 |
| 14 | 그라디언트 | Gradient | 부드러운 색상 전환 |
| 15 | 3D/입체 | 3D/Dimensional | 3D 오브젝트와 원근감 |
| 16 | 플랫 | Flat | 평면적 색면과 단순 도형 |
| 17 | 뉴모피즘 | Neumorphism | 부드러운 그림자 양각/음각 |
| 18 | 레트로 | Retro | 복고풍 컬러팔레트 |
| 19 | 미래적 | Futuristic | SF 감성 홀로그램 |
| 20 | 자연/유기적 | Organic | 자연 텍스처 곡선 형태 |
| 21 | 기하학적 | Geometric | 정교한 기하학 패턴 |
| 22 | 타이포중심 | Typography-centric | 대형 타이포그래피 주인공 |
| 23 | 사진중심 | Photo-driven | 대형 이미지 풀블리드 |
| 24 | 일러스트 | Illustration | 커스텀 일러스트 기반 |
| 25 | 데이터중심 | Data-driven | 차트/대시보드 스타일 |
| 26 | 스토리텔링 | Storytelling | 내러티브 흐름 강조 |
| 27 | 브루탈리즘 | Brutalism | 거친 텍스처 실험적 레이아웃 |
| 28 | 글래스모피즘 | Glassmorphism | 반투명 유리 효과 |
| 29 | 한국적 | Korean Traditional | 한국 전통 문양과 오방색 |
| 30 | 하이브리드 | Hybrid | 여러 스타일 혼합 |

## 변경 이력

| 날짜 | 버전 | 주요 변경 사항 |
|------|------|---------------|
| 2026-10-15 | — | README 를 2026-10-15 기준 신규 구현(백엔드·통합 사양서·AI 직접 생성·테스트) 반영으로 갱신 |
| 2026-06-06 ~ 2026-07-07 | v1.5 (워킹트리 변경, 미커밋) | Node 백엔드(`server/`, 7개 API) 신규 구축 및 Vite `/api` 프록시 연동, 통합 마스터 사양서 + Studio 실행 프롬프트(원클릭 흐름), AI 직접 생성(Claude/Gemini) 및 API Key 연결 테스트, customPrompt 실제 주입, 백엔드 미연결 시 로컬 폴백, Bell 백엔드 상태 팝오버, NotebookLM 실제 새 탭 오픈, 사이드바 죽은 버튼/활성 로직 수정, 미리보기 모달 i18n 하드코딩 제거, lint 0(lazy initializer, `i18n/lang.ts` 분리), A/B·E2E·Chaos 테스트 62건, Vite 8 → 5 하향 고정 |
| 2026-05-03 | v1.4 | A3 AI/AX 프로젝트 4개 추가 (LOAN4U, PokerFace, WDLAB-AlphaForge, WDLAB-LLMOps → 총 133개), "전체 복사" → 순차 복사 헬퍼 교체, 3단계 렌더링을 배치별 자기완결 프롬프트 배열로 재작성(80장 동일 20장 반복 문제 해결) |
| 2026-04-15 | v1.3 | A3 AI/AX 프로젝트 21개 카테고리 추가 (ID 109–129), CustomizePage hydration/클립보드 버그 수정 |
| - | v1.2 | 기술&IT 카테고리 8개 추가 (총 18개), 디자인 프리뷰 모달 구현 |
| - | v1.1 | 한국어/영어 언어 토글 지원 |
| - | v1.0 | 초기 릴리스 — 108개 카테고리, 30개 디자인 스타일, 3단계 프롬프트 생성 |

## 최근 업데이트 (2026-10-15 기준)

- **2026-05-03 (커밋)** — A3 AI/AX 프로젝트 4개 추가(총 133개), 순차 복사 헬퍼, 3단계 배치별 자기완결 프롬프트(80장 반복 버그 수정)
- **2026-06-06 (워킹트리 변경, 미커밋)** — `server/` 백엔드 신규(7개 API, 의존성 0), `app/src/lib/api.ts` 프론트 연동, Vite 프록시, API Key 연결 테스트, AI 직접 생성, customPrompt 주입, Bell 상태 팝오버, NotebookLM 새 탭 오픈, i18n/접근성/lint 정리, `tests/` A/B·E2E·Chaos
- **2026-06-12 (워킹트리 변경, 미커밋)** — 통합 마스터 사양서(`unified.ts`) + 배치별 Studio 실행 프롬프트 도입, 결과 페이지를 "통합 흐름(권장) / 레거시 단계별(고급)" 구조로 개편, 구버전 백엔드 호환(unified 누락 시 로컬 보강)
- **2026-07-07 (워킹트리 변경, 미커밋)** — `unified.mjs`(Node 18 호환 JS 버전)로 서버 import 전환, Vite 8 → 5 / plugin-react 6 → 4 하향 고정
- **2026-09-24 (워킹트리 변경, 미커밋)** — `app/.runall.vite.config.mjs` 통합 실행기(run_all_projects.sh)용 포트 재매핑 래퍼 추가

## 라이선스

Private
