# NotebookLM 슬라이드 프롬프트 생성기

Google NotebookLM용 프레젠테이션 슬라이드 AI 프롬프트를 체계적으로 생성하는 웹 애플리케이션입니다.

## 주요 기능

### 카테고리 및 프롬프트
- **총 129가지 카테고리** — 11개 대분류 체계로 구성 (A3 AI/AX 프로젝트, 비즈니스, 기술, 교육, 의료, 과학, 예술, 사회, 산업, 정부, 특수)
- **A3 AI/AX 프로젝트 — 21개 (신규)** — 사이드바 최상단에 배치된 wdlab 자체 구축 AI/AX 프로젝트 컬렉션
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
  - `Design NotebookLM` — 본 프로젝트 (129개 카테고리, 30개 디자인 스타일)
  - `FileForge` — 지능형 파일 관리 플랫폼 (10개 AI 에이전트, 77개 API)
  - `FileForge-Python` — 전체 스택 파일 관리 (PySide6 + NiceGUI 듀얼 인터페이스)
  - `Gov. Clawling` — 정부 데이터 수집 시스템 (공공 API, 정책 문서 분석)
  - `NexusAI` — 멀티에이전트 오케스트레이션 (10개 에이전틱 프레임워크, 290+ API)
  - `Pi5-Edge-Device` — 엣지 자율 추론 게이트웨이 (Raspberry Pi 5 + Gemma 4, 99종 센서/105종 릴레이)
  - `Self Security Consulting` — AI 보안 컨설팅 플랫폼 (ISO 27001, 13종 AI 에이전트, Red Team 자동화)
  - `SlideEditor` — AI 슬라이드 편집기 (Gemini OCR, PDF/PPTX/이미지 멀티포맷)
  - `TruthLens` — 딥페이크 탐지 시스템 (OWL 온톨로지, 40개 탐지 모듈, 14개 StateGraph)
  - `wdlab-CLI` — 자율 진화형 AI 개발 워크벤치 (로컬 우선 LLM, 5계층 적응형 메모리)
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
- **카테고리별 10가지 프롬프트 샘플** — 한국어/영어 이중 언어 지원 (총 1,290개 프롬프트)

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
- **디자인 레퍼런스 연동** — Behance, Dribbble, 나노바나나 참조 지원
- **설정 관리** — Claude, Gemini API Key 등록 및 사용자 지정 프롬프트
- **HTTP 환경 클립보드 폴백** — `navigator.clipboard` 미지원 환경(HTTP, 구형 브라우저)에서도 `document.execCommand` 기반 복사 지원
- **Hydration 안전 UI** — 버튼 중첩으로 인한 React hydration 에러 제거 (role=button div로 전환)

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React 19 + TypeScript 5.9 |
| Build Tool | Vite 8 |
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
│   │   ├── CategorySelector.tsx           # 카테고리 선택 (129개, 11개 그룹, 검색 지원)
│   │   ├── PromptSelector.tsx             # 프롬프트 샘플 선택
│   │   ├── DesignStyleSelector.tsx        # 디자인 스타일 선택 (30개, 미리보기 통합)
│   │   ├── DesignStylePreviewModal.tsx    # 디자인 스타일 미리보기 모달 (30개 스타일 x 2장)
│   │   ├── DesignRefPanel.tsx             # 디자인 레퍼런스 링크
│   │   ├── PageConfig.tsx                 # 슬라이드 수 및 배치 설정
│   │   └── SettingsModal.tsx              # API Key 및 사용자 설정
│   ├── pages/
│   │   ├── MainPage.tsx                   # 메인 설정 페이지 (/)
│   │   └── CustomizePage.tsx              # 프롬프트 생성 결과 (/customize, HTTP 클립보드 폴백 포함)
│   ├── data/
│   │   ├── categories.ts                  # 129개 카테고리 및 프롬프트 데이터 (한/영)
│   │   └── designStyles.ts                # 30개 디자인 스타일 정의 (한/영)
│   └── i18n/
│       ├── LanguageContext.tsx            # 다국어 컨텍스트 Provider
│       ├── ko.ts                          # 한국어 번역 리소스
│       └── en.ts                          # 영어 번역 리소스
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm

### 설치 및 실행

```bash
cd app
npm install
npm run dev
```

개발 서버가 `http://localhost:5173` 에서 실행됩니다.

### 빌드

```bash
npm run build
```

빌드 결과물은 `app/dist/` 디렉토리에 생성됩니다.

## 사용 방법

1. **카테고리 선택** — 129가지 카테고리 중 프레젠테이션 주제에 맞는 카테고리를 선택합니다. (A3 AI/AX 프로젝트 그룹이 최상단에 표시됩니다.)
2. **프롬프트 선택** — 선택한 카테고리의 10가지 프롬프트 샘플 중 하나를 선택합니다.
3. **디자인 스타일 선택** — 30가지 디자인 스타일 중 원하는 스타일을 선택합니다.
   - 각 스타일에 마우스를 올리면 나타나는 눈(Eye) 아이콘을 클릭하여 미리보기를 확인할 수 있습니다.
   - 모달에서 좌우 화살표로 타이틀/콘텐츠 슬라이드를 확인한 뒤 선택합니다.
4. **레퍼런스 및 설정** — 디자인 참고 URL, 대상 청중, 프레젠테이션 목적을 입력합니다.
5. **페이지 수 지정** — 총 슬라이드 수를 설정합니다 (1~100장, 20장 단위 배치 분할).
6. **NotebookLM 열기** — 3단계 프롬프트가 자동 생성되며, 각 프롬프트를 복사하여 NotebookLM에서 사용합니다.

### 생성되는 3단계 프롬프트

| 단계 | 설명 |
|------|------|
| 1단계 — 디자인 분석 | 업로드된 디자인 이미지를 분석하여 Adaptive Presentation Design System 생성 |
| 2단계 — 마스터 대본 | 소스 문서를 분석하여 N장 분량의 마스터 스크립트 생성 |
| 3단계 — 렌더링 실행 | 배치 단위로 분할하여 순차적 FUNCTION 호출 실행 |

## 카테고리 구성 (129개)

| 대분류 | ID 범위 | 소분류 수 |
|--------|---------|----------|
| **A3 AI/AX 프로젝트** (신규, 최상단) | **109–129** | **21개** |
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

## A3 AI/AX 프로젝트 카테고리 (21개, ID 109–129)

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
| 2026-04-15 | v1.3 | A3 AI/AX 프로젝트 21개 카테고리 추가 (ID 109–129), CustomizePage hydration/클립보드 버그 수정 |
| - | v1.2 | 기술&IT 카테고리 8개 추가 (총 18개), 디자인 프리뷰 모달 구현 |
| - | v1.1 | 한국어/영어 언어 토글 지원 |
| - | v1.0 | 초기 릴리스 — 108개 카테고리, 30개 디자인 스타일, 3단계 프롬프트 생성 |

## 라이선스

Private
