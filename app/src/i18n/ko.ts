export const ko = {
  // Header
  appTitle: 'NotebookLM 슬라이드 프롬프트 생성기',

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
    configSummary: '구성 요약',
    promptLabel: '프롬프트',
    audienceLabel: '대상 청중',
    objectiveLabel: '발표 목적',
    usageTitle: '사용 방법',
    usageSteps: [
      '소스파일(대본 문서)을 NotebookLM의 소스로 업로드합니다.',
      '아래 1~3단계 프롬프트를 순서대로 채팅창에 붙여넣습니다.',
      '[Global Design System]의 URL은 Behance/Dribbble에서 선택한 디자인의 URL을 사용합니다.',
      '슬라이드 자료가 배치별로 순차 출력됩니다.',
    ],
    step1Title: '1단계: 슬라이드 영문 디자인 추출 프롬프트',
    step2Title: '2단계: 마스터 대본 추출 프롬프트',
    step3Title: '3단계: 슬라이드 렌더링 프롬프트',
    copy: '복사',
    copied: '복사됨',
    copyAll: '전체 복사',
    copyAllDone: '전체 복사 완료!',
    copyAllDesc: '3개 단계 프롬프트를 한 번에 복사하여 NotebookLM에 붙여넣기',
    stepPrefix: '단계',
    seqCopyDesc: 'NotebookLM 채팅창은 한 번에 한 단계씩 보내야 합니다. 클릭할 때마다 다음 단계가 클립보드에 복사됩니다.',
    seqStart: '순차 복사 시작 (1단계)',
    seqNext: '{n}단계 복사',
    seqJustCopied: '{n}단계 복사됨 — 붙여넣고 다음 클릭',
    seqDone: '완료! 다시 시작하려면 클릭',
  },

  // Language
  langLabel: '한국어',
}
