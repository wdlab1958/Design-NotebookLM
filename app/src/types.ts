export interface AppSettings {
  claudeApiKey: string;
  geminiApiKey: string;
  customPrompt: string;
}

export interface SlideConfig {
  categoryId: number | null;
  promptText: string;
  designStyleId: number | null;
  designRefUrl: string;
  targetAudience: string;
  presentationObjective: string;
  totalPages: number;
}
