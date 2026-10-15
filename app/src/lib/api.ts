// 백엔드 API 클라이언트. Vite dev 프록시(/api → :8013)를 통해 호출한다.

export interface GenConfig {
  categoryName?: string
  categoryNameEn?: string
  promptText: string
  designStyleName?: string
  designStyleNameEn?: string
  designRefUrl?: string
  targetAudience?: string
  presentationObjective?: string
  totalPages: number
  customPrompt?: string
}

export interface GenResult {
  step1: string
  step2: string
  step3Batches: string[]
  batchCount: number
  // 통합(원클릭) 흐름: NotebookLM 소스로 1회 붙여넣는 마스터 사양서 + 배치별 짧은 Studio 실행 프롬프트
  unified: string
  studioPrompts: string[]
}

export interface HealthResult {
  status: string
  categories: number
  designStyles: number
  a3Projects: number
  totalPrompts: number
  llm: { claude: string; gemini: string }
}

const BASE = (import.meta.env.VITE_API_BASE as string | undefined) || ''

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `요청 실패 (HTTP ${res.status})`)
  }
  return data as T
}

export const api = {
  health: () => req<HealthResult>('/api/health'),
  generate: (config: GenConfig) =>
    req<GenResult>('/api/generate', { method: 'POST', body: JSON.stringify(config) }),
  llmGenerate: (provider: 'claude' | 'gemini', apiKey: string, config: GenConfig) =>
    req<{ provider: string; model: string; text: string }>('/api/llm/generate', {
      method: 'POST',
      body: JSON.stringify({ provider, apiKey, config }),
    }),
  validateKey: (provider: 'claude' | 'gemini', apiKey: string) =>
    req<{ ok: boolean; provider: string; model: string }>('/api/llm/validate', {
      method: 'POST',
      body: JSON.stringify({ provider, apiKey }),
    }),
}
