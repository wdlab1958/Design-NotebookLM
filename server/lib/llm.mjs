// 실제 Claude(Anthropic) / Gemini(Google) API 호출 래퍼.
// 사일런트 폴백 금지: 키가 없거나 공급자 오류 시 명시적 에러를 던진다.

const CLAUDE_MODEL = 'claude-opus-4-8'
const GEMINI_MODEL = 'gemini-2.5-pro'

export class LlmError extends Error {
  constructor(message, status = 502, detail = null) {
    super(message)
    this.name = 'LlmError'
    this.status = status
    this.detail = detail
  }
}

/**
 * Claude Messages API 호출 (Anthropic).
 * POST https://api.anthropic.com/v1/messages
 */
export async function callClaude({ apiKey, prompt, system, maxTokens = 4096 }) {
  if (!apiKey || !apiKey.trim()) {
    throw new LlmError('Claude API Key가 설정되지 않았습니다. 설정에서 키를 등록하십시오.', 400)
  }
  let resp
  try {
    resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        ...(system ? { system } : {}),
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  } catch (e) {
    throw new LlmError(`Anthropic 연결 실패: ${e.message}`, 502)
  }
  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    const msg = data?.error?.message || `Anthropic 오류 (HTTP ${resp.status})`
    throw new LlmError(msg, resp.status, data?.error || null)
  }
  const text = (data.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')
  return { provider: 'claude', model: CLAUDE_MODEL, text, usage: data.usage || null }
}

/**
 * Gemini generateContent API 호출 (Google Generative Language).
 */
export async function callGemini({ apiKey, prompt, system, maxTokens = 4096 }) {
  if (!apiKey || !apiKey.trim()) {
    throw new LlmError('Gemini API Key가 설정되지 않았습니다. 설정에서 키를 등록하십시오.', 400)
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey.trim())}`
  let resp
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    })
  } catch (e) {
    throw new LlmError(`Gemini 연결 실패: ${e.message}`, 502)
  }
  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    const msg = data?.error?.message || `Gemini 오류 (HTTP ${resp.status})`
    throw new LlmError(msg, resp.status, data?.error || null)
  }
  const text = (data.candidates?.[0]?.content?.parts || [])
    .map(p => p.text || '')
    .join('')
  return { provider: 'gemini', model: GEMINI_MODEL, text, usage: data.usageMetadata || null }
}

export function callLlm(provider, args) {
  if (provider === 'claude') return callClaude(args)
  if (provider === 'gemini') return callGemini(args)
  throw new LlmError(`알 수 없는 공급자: ${provider}`, 400)
}

/** 키 유효성 검증 — 최소 토큰으로 실호출. */
export async function validateKey(provider, apiKey) {
  const r = await callLlm(provider, { apiKey, prompt: 'ping', maxTokens: 8 })
  return { ok: true, provider: r.provider, model: r.model }
}
