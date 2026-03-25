# NotebookLM 슬라이드 프롬프트 생성기

Google NotebookLM용 프레젠테이션 슬라이드 AI 프롬프트를 체계적으로 생성하는 웹 애플리케이션입니다.

## 주요 기능

- **100가지 카테고리** — 비즈니스, 기술, 교육, 의료, 과학, 예술, 사회, 산업, 정부, 특수 등 10개 대분류 × 10개 소분류
- **카테고리별 10가지 프롬프트 샘플** — 슬라이드 자료 설명을 위한 사전 정의 템플릿
- **30가지 디자인 스타일** — 심플, 공학적, 과학적, 예술적, 창의적, 미니멀, 모던, 3D, 뉴모피즘, 한국 전통 등
- **디자인 레퍼런스 연동** — Behance, Dribbble, 나노바나나 참조 지원
- **3단계 프롬프트 자동 생성** — 디자인 분석 → 마스터 대본 → 렌더링 실행
- **배치 분할 처리** — 대규모 프레젠테이션을 최대 20장 단위로 자동 분할
- **설정 관리** — Claude, Gemini API Key 등록 및 사용자 지정 프롬프트

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
│   ├── main.tsx                    # 엔트리 포인트 (BrowserRouter)
│   ├── App.tsx                     # 라우팅 설정
│   ├── types.ts                    # TypeScript 인터페이스
│   ├── components/
│   │   ├── Header.tsx              # 상단 헤더 (설정, 알림)
│   │   ├── Sidebar.tsx             # 좌측 네비게이션
│   │   ├── CategorySelector.tsx    # 카테고리 선택 (100개, 검색 지원)
│   │   ├── PromptSelector.tsx      # 프롬프트 샘플 선택
│   │   ├── DesignStyleSelector.tsx # 디자인 스타일 선택 (30개)
│   │   ├── DesignRefPanel.tsx      # 디자인 레퍼런스 링크
│   │   ├── PageConfig.tsx          # 슬라이드 수 및 배치 설정
│   │   └── SettingsModal.tsx       # API Key 및 사용자 설정
│   ├── pages/
│   │   ├── MainPage.tsx            # 메인 설정 페이지 (/)
│   │   └── CustomizePage.tsx       # 프롬프트 생성 결과 (/customize)
│   └── data/
│       ├── categories.ts           # 100개 카테고리 및 프롬프트 데이터
│       └── designStyles.ts         # 30개 디자인 스타일 정의
├── public/
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

개발 서버가 http://localhost:3017 에서 실행됩니다.

### 빌드

```bash
npm run build
```

빌드 결과물은 `app/dist/` 디렉토리에 생성됩니다.

## 사용 방법

1. **카테고리 선택** — 100가지 카테고리 중 프레젠테이션 주제에 맞는 카테고리를 선택합니다.
2. **프롬프트 선택** — 선택한 카테고리의 10가지 프롬프트 샘플 중 하나를 선택합니다.
3. **디자인 스타일 선택** — 30가지 디자인 스타일 중 원하는 스타일을 선택합니다.
4. **레퍼런스 및 설정** — 디자인 참고 URL, 대상 청중, 프레젠테이션 목적을 입력합니다.
5. **페이지 수 지정** — 총 슬라이드 수를 설정합니다 (1~100장, 20장 단위 배치 분할).
6. **NotebookLM 열기** — 3단계 프롬프트가 자동 생성되며, 각 프롬프트를 복사하여 NotebookLM에서 사용합니다.

### 생성되는 3단계 프롬프트

| 단계 | 설명 |
|------|------|
| 1단계 — 디자인 분석 | 업로드된 디자인 이미지를 분석하여 Adaptive Presentation Design System 생성 |
| 2단계 — 마스터 대본 | 소스 문서를 분석하여 N장 분량의 마스터 스크립트 생성 |
| 3단계 — 렌더링 실행 | 배치 단위로 분할하여 순차적 FUNCTION 호출 실행 |

## 라이선스

Private
