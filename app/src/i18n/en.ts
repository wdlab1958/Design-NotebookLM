export const en = {
  // Header
  appTitle: 'NotebookLM Slide Prompt Generator',

  // Sidebar
  nav: {
    home: 'Home',
    design: 'Design',
    prompt: 'Prompt',
    generate: 'Generate',
    notebookLM: 'NotebookLM',
  },

  // Settings Modal
  settings: {
    title: 'Settings',
    claudeApiKey: 'Claude API Key',
    geminiApiKey: 'Gemini API Key',
    customPromptLabel: 'Custom Prompt (Optional)',
    customPromptPlaceholder: 'Enter additional prompt instructions...',
    cancel: 'Cancel',
    save: 'Save',
  },

  // Category Selector
  category: {
    title: 'Select Category (133)',
    searchPlaceholder: 'Search categories...',
    groups: {
      'a3project': 'A3 AI/AX Project',
      'business': 'Business & Management',
      'tech': 'Technology & IT',
      'education': 'Education & Academia',
      'medical': 'Medical & Health',
      'science': 'Science & Engineering',
      'art': 'Art & Design',
      'social': 'Social & Humanities',
      'industry': 'Industry & Commerce',
      'government': 'Government & Public',
      'special': 'Special & Others',
    },
  },

  // Prompt Selector
  promptSelector: {
    emptyTitle: 'Select a category on the left',
    emptySubtitle: 'to see 10 prompt samples',
    sampleSuffix: '— Prompt Samples (10)',
  },

  // Design Style Selector
  designStyle: {
    title: 'Select Design Style (30)',
  },

  // Design Ref Panel
  designRef: {
    title: 'Design Reference Sites',
    nanobananaDesc: 'Presentation Design Specialists',
    behanceDesc: 'Adobe Design Portfolio Platform',
    dribbbleDesc: 'Designer Community & Inspiration',
    urlLabel: 'Design Reference URL (Paste from Behance/Dribbble)',
  },

  // Page Config
  pageConfig: {
    title: 'Slide Page Settings',
    totalPages: 'Total Pages to Generate',
    pages: 'pages',
    batchPlan: 'Batch Rendering Plan (max 20 slides/batch)',
    slide: 'Slide',
    batchSummary: (count: number) => `${count} batches total | Sequential execution after first batch`,
  },

  // Main Page
  main: {
    configTitle: 'Slide Prompt Configuration',
    stepsCompleted: (done: number, total: number) => `${done}/${total} steps completed`,
    steps: {
      category: 'Category',
      prompt: 'Prompt',
      designStructure: 'Design Style',
      targetObjective: 'Target/Goal',
      pageSettings: 'Page Setup',
    },
    presentationSettings: 'Presentation Settings',
    targetAudience: 'Target Audience',
    targetAudiencePlaceholder: 'e.g., Government reviewers, Investors, Students',
    presentationObjective: 'Presentation Objective',
    presentationObjectivePlaceholder: 'e.g., AI-based deepfake detection platform development proposal',
    selectionSummary: 'Summary:',
    categoryNotSelected: 'No category selected',
    openNotebook: 'Open NotebookLM',
  },

  // Customize Page
  customize: {
    noConfig: 'No configuration found. Please set up on the main page first.',
    goBack: 'Back to Main',
    title: 'Slide Customization Prompts',
    pagesSuffix: 'pages',
    reconfigure: 'Reconfigure',
    configSummary: 'Configuration Summary',
    promptLabel: 'Prompt',
    audienceLabel: 'Target Audience',
    objectiveLabel: 'Objective',
    usageTitle: 'How to Use',
    usageSteps: [
      'Upload your source documents to NotebookLM as sources.',
      'Paste the prompts below (Steps 1-3) into the chat in order.',
      'Use a design URL from Behance/Dribbble for the [Global Design System] URL.',
      'Slides will be generated sequentially in batches.',
    ],
    step1Title: 'Step 1: Slide Design Extraction Prompt',
    step2Title: 'Step 2: Master Script Extraction Prompt',
    step3Title: 'Step 3: Slide Rendering Prompt',
    copy: 'Copy',
    copied: 'Copied',
    copyAll: 'Copy All',
    copyAllDone: 'All Copied!',
    copyAllDesc: 'Copy all 3 step prompts at once to paste into NotebookLM',
    stepPrefix: 'Step',
    seqCopyDesc: 'NotebookLM chat needs each step sent as a separate message. Each click copies the next step to your clipboard.',
    seqStart: 'Start Sequential Copy (Step 1)',
    seqNext: 'Copy Step {n}',
    seqJustCopied: 'Step {n} copied — paste it, then click for next',
    seqDone: 'Done! Click to restart',
  },

  // Language
  langLabel: 'English',
}
