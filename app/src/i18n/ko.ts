export const ko = {
  // Header
  appTitle: 'NotebookLM 슬라이드 프롬프트 생성기',
  langToggleTitle: 'Switch to English',

  // API 상태 (Bell)
  apiStatus: {
    title: 'API 서버 상태',
    checking: '확인 중...',
    online: '백엔드 연결됨',
    offline: '백엔드 오프라인',
    categories: '카테고리',
    designStyles: '디자인 스타일',
    totalPrompts: '총 프롬프트',
  },

  // Sidebar
  nav: {
    home: '홈',
    design: '디자인',
    prompt: '프롬프트',
    generate: '생성',
    notebookLM: 'NotebookLM',
  },

  // Settings Modal
  settings: {
    title: '설정',
    claudeApiKey: 'Claude API Key',
    geminiApiKey: 'Gemini API Key',
    customPromptLabel: '사용자 지정 프롬프트 (선택)',
    customPromptPlaceholder: '추가로 반영하고 싶은 프롬프트를 입력하세요...',
    cancel: '취소',
    save: '저장',
    testConnection: '연결 테스트',
    testing: '테스트 중...',
    testOk: '연결 성공',
  },

  // Category Selector
  category: {
    title: '카테고리 선택 (133개)',
    searchPlaceholder: '카테고리 검색...',
    groups: {
      'a3project': 'A3 AI/AX 프로젝트',
      'business': '비즈니스 & 경영',
      'tech': '기술 & IT',
      'education': '교육 & 학술',
      'medical': '의료 & 건강',
      'science': '과학 & 공학',
      'art': '예술 & 디자인',
      'social': '사회 & 인문',
      'industry': '산업 & 비즈니스',
      'government': '정부 & 공공',
      'special': '특수 & 기타',
    },
  },

  // Prompt Selector
  promptSelector: {
    emptyTitle: '왼쪽에서 카테고리를 선택하면',
    emptySubtitle: '10가지 프롬프트 샘플이 표시됩니다',
    sampleSuffix: '— 프롬프트 샘플 (10개)',
  },

  // Design Style Selector
  designStyle: {
    title: '디자인 구조 선택 (30가지)',
  },

  // Design Style Preview Modal
  designPreview: {
    navHint: '← → 좌우 화살표로 타이틀/콘텐츠 슬라이드를 확인하세요',
    descLabel: '디자인 설명',
    close: '닫기',
    selected: '선택됨',
    selectThis: '이 스타일 선택',
  },

  // Design Ref Panel
  designRef: {
    title: '디자인 참고 사이트',
    nanobananaDesc: '프레젠테이션 디자인 전문',
    behanceDesc: 'Adobe 디자인 포트폴리오 플랫폼',
    dribbbleDesc: '디자이너 커뮤니티 & 영감',
    urlLabel: '디자인 참고 URL (Behance/Dribbble에서 선택 후 붙여넣기)',
  },

  // Page Config
  pageConfig: {
    title: '슬라이드 페이지 설정',
    totalPages: '총 생성 페이지 수',
    pages: '페이지',
    batchPlan: '분기 렌더링 계획 (최대 20장/배치)',
    slide: '슬라이드',
    batchSummary: (count: number) => `총 ${count}개 배치로 분기 실행 | 첫 배치 실행 후 순차 실행`,
  },

  // Main Page
  main: {
    configTitle: '슬라이드 프롬프트 구성',
    stepsCompleted: (done: number, total: number) => `${done}/${total} 단계 완료`,
    steps: {
      category: '카테고리',
      prompt: '프롬프트',
      designStructure: '디자인 구조',
      targetObjective: '대상/목적',
      pageSettings: '페이지 설정',
    },
    presentationSettings: '발표 설정',
    targetAudience: '대상 청중 (Target Audience)',
    targetAudiencePlaceholder: '예: 정부과제 심사 평가위원, 투자자, 학생 등',
    presentationObjective: '발표 목적 (Presentation Objective)',
    presentationObjectivePlaceholder: '예: AI 기반 딥페이크 탐지 플랫폼 개발 과제 발표',
    selectionSummary: '선택 요약:',
    categoryNotSelected: '카테고리 미선택',
    openNotebook: 'NotebookLM 열기',
  },

  // Customize Page
  customize: {
    noConfig: '설정된 구성이 없습니다. 먼저 메인 페이지에서 설정해주세요.',
    goBack: '메인으로 돌아가기',
    title: '슬라이드 맞춤설정 프롬프트',
    pagesSuffix: '페이지',
    reconfigure: '다시 설정',
    generating: '백엔드에서 프롬프트 생성 중...',
    srcBackend: '백엔드 생성',
    srcLocal: '로컬 생성(폴백)',
    fallbackWarn: '백엔드 API에 연결하지 못해 로컬 생성으로 대체했습니다. (백엔드 서버를 실행하면 동일 결과가 서버에서 생성됩니다)',
    aiTitle: 'AI 직접 생성 (Claude / Gemini)',
    aiDesc: '설정에 등록한 API Key로 2단계 마스터 대본을 AI가 실제로 작성합니다.',
    aiRun: 'AI로 생성',
    configSummary: '구성 요약',
    promptLabel: '프롬프트',
    audienceLabel: '대상 청중',
    objectiveLabel: '발표 목적',
    usageTitle: '사용 방법',
    usageSteps: [
      '권장: 아래 "통합 마스터 사양서"를 1회 복사하여 NotebookLM "+ 소스 추가 → 복사된 텍스트"에 붙여넣습니다. (기존 4회 복사 불필요)',
      '발표 내용 소스(대본·자료 문서)를 같은 노트북에 업로드합니다.',
      'Studio → 슬라이드 생성 → 맞춤설정에 [배치 1] 프롬프트를 붙여넣고 생성을 시작한 뒤, 기다리지 말고 곧바로 [배치 2]로 생성을 한 번 더 시작하면 20페이지 덱 2개가 동시에 생성됩니다.',
      '완성된 배치 덱을 순서대로 이으면 표지부터 클로징까지 연속된 하나의 발표 자료가 됩니다.',
      '아래 레거시(채팅 기반) 단계별 프롬프트는 NotebookLM 채팅창에서 단계별로 직접 실행하고 싶을 때만 사용하세요.',
    ],
    unifiedTitle: '통합 마스터 사양서 — 1회 복사로 끝내기',
    unifiedDesc: '디자인 시스템 + 마스터 대본 계약 + 배치 경계 규칙을 하나의 문서로 묶었습니다. NotebookLM 소스로 1회만 붙여넣으면 배치별 슬라이드가 연속된 내용으로 생성됩니다.',
    unifiedCopy: '통합 사양서 복사 (1회)',
    unifiedCopied: '복사 완료 — 소스로 붙여넣기',
    unifiedSteps: [
      '위 버튼으로 통합 사양서 복사 → NotebookLM "+ 소스 추가 → 복사된 텍스트"에 붙여넣기 (1회)',
      '발표 내용 소스 업로드 → Studio → 슬라이드 생성 → 맞춤설정에 [배치 1] 프롬프트 붙여넣고 시작',
      '기다리지 말고 곧바로 슬라이드 생성을 한 번 더 열어 [배치 2] 프롬프트로 시작 → 두 덱이 동시에 생성',
      '배치 덱을 순서대로 이으면 하나의 연속된 발표 자료 완성',
    ],
    studioPromptsTitle: 'Studio 실행 프롬프트 (슬라이드 생성 맞춤설정 칸에 붙여넣기 — 통합 사양서 PART 5에도 포함)',
    studioSingleLabel: '단일 생성',
    unifiedShow: '통합 사양서 전체 보기',
    unifiedHide: '통합 사양서 접기',
    legacyTitle: '레거시 — 채팅 기반 단계별 프롬프트 (고급)',
    step1Title: '1단계: 슬라이드 영문 디자인 추출 프롬프트',
    step2Title: '2단계: 마스터 대본 추출 프롬프트',
    step3Title: '3단계: 슬라이드 렌더링 프롬프트',
    copy: '복사',
    copied: '복사됨',
    copyAll: '전체 복사',
    copyAllDone: '전체 복사 완료!',
    copyAllDesc: '3개 단계 프롬프트를 한 번에 복사하여 NotebookLM에 붙여넣기',
    stepPrefix: '단계',
    seqCopyDesc: 'NotebookLM은 한 번에 한 프롬프트씩 별도 메시지/생성으로 처리해야 합니다. 클릭할 때마다 다음 항목이 클립보드에 복사됩니다 (3단계가 20페이지 단위 배치로 나뉜 경우 각 배치도 별도 항목으로 처리).',
    seqStart: '순차 복사 시작 (1/{total})',
    seqNext: '다음 복사 ({n}/{total})',
    seqJustCopied: '{n}/{total} 복사됨 — 붙여넣고 다음 클릭',
    seqDone: '완료! 다시 시작하려면 클릭',
    batchLabel: '배치',
  },

  // Language
  langLabel: '한국어',
}
