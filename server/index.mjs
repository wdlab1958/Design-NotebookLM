// NotebookLM 슬라이드 프롬프트 생성기 — 백엔드 API 서버
// 의존성 0 (Node 내장 http + fetch). 데이터는 프론트엔드 TS 를 그대로 재사용(Node 22 type-stripping).
import http from 'node:http'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { generateAll } from './lib/generate.mjs'
import { callLlm, validateKey, LlmError } from './lib/llm.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../app/src/data')

// 프론트엔드와 동일한 단일 데이터 출처를 동적 import (중복 제거)
const { categories } = await import(resolve(DATA_DIR, 'categories.mjs'))
const { designStyles } = await import(resolve(DATA_DIR, 'designStyles.mjs'))

const PORT = Number(process.env.PORT || 8013)
const HOST = process.env.HOST || '0.0.0.0'
const START = Date.now()

const A3_MIN_ID = 109 // A3 AI/AX 프로젝트 시작 id

function send(res, status, body, extraHeaders = {}) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body)
  res.writeHead(status, {
    'content-type': typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
    ...extraHeaders,
  })
  res.end(payload)
}

function readJson(req) {
  return new Promise((resolveBody, reject) => {
    let data = ''
    let size = 0
    req.on('data', c => {
      size += c.length
      if (size > 5_000_000) { reject(new Error('payload too large')); req.destroy() }
      data += c
    })
    req.on('end', () => {
      if (!data) return resolveBody({})
      try { resolveBody(JSON.parse(data)) } catch { reject(new Error('invalid JSON body')) }
    })
    req.on('error', reject)
  })
}

const routes = []
function route(method, pattern, handler) { routes.push({ method, pattern, handler }) }

// --- 라우트 정의 -------------------------------------------------------------

route('GET', /^\/api\/health$/, (req, res) => {
  send(res, 200, {
    status: 'ok',
    uptimeSec: Math.round((Date.now() - START) / 1000),
    categories: categories.length,
    designStyles: designStyles.length,
    a3Projects: categories.filter(c => c.id >= A3_MIN_ID).length,
    totalPrompts: categories.reduce((n, c) => n + (c.prompts?.length || 0), 0),
    llm: { claude: 'claude-opus-4-8', gemini: 'gemini-2.5-pro' },
    time: new Date().toISOString(),
  })
})

route('GET', /^\/api\/categories$/, (req, res) => {
  send(res, 200, { count: categories.length, categories })
})

route('GET', /^\/api\/categories\/(\d+)$/, (req, res, m) => {
  const cat = categories.find(c => c.id === Number(m[1]))
  if (!cat) return send(res, 404, { error: '카테고리를 찾을 수 없습니다', id: Number(m[1]) })
  send(res, 200, cat)
})

route('GET', /^\/api\/design-styles$/, (req, res) => {
  send(res, 200, { count: designStyles.length, designStyles })
})

// 결정론적 3단계 프롬프트 생성 (LLM 불필요)
route('POST', /^\/api\/generate$/, async (req, res) => {
  const cfg = await readJson(req)
  if (!cfg || typeof cfg.promptText !== 'string' || !cfg.promptText.trim()) {
    return send(res, 400, { error: 'promptText 는 필수입니다' })
  }
  if (typeof cfg.totalPages !== 'number' || !Number.isInteger(cfg.totalPages) || cfg.totalPages < 1 || cfg.totalPages > 1000) {
    return send(res, 400, { error: 'totalPages 는 1~1000 사이의 정수여야 합니다' })
  }
  send(res, 200, generateAll(cfg))
})

// 실제 LLM 직접 생성 (Step2 마스터 대본을 Claude/Gemini 가 실제로 작성)
route('POST', /^\/api\/llm\/generate$/, async (req, res) => {
  const body = await readJson(req)
  const { provider, apiKey, config } = body || {}
  if (!config || !config.promptText) return send(res, 400, { error: 'config.promptText 는 필수입니다' })
  const { step2 } = generateAll(config)
  try {
    const result = await callLlm(provider, {
      apiKey,
      prompt: step2,
      system: 'You are a Chief Content Architect. Follow the user output format exactly and respond in Korean.',
      maxTokens: 4096,
    })
    send(res, 200, result)
  } catch (e) {
    if (e instanceof LlmError) return send(res, e.status, { error: e.message, detail: e.detail })
    send(res, 500, { error: String(e.message || e) })
  }
})

// 키 유효성 검증 (설정 모달의 "연결 테스트")
route('POST', /^\/api\/llm\/validate$/, async (req, res) => {
  const { provider, apiKey } = (await readJson(req)) || {}
  try {
    send(res, 200, await validateKey(provider, apiKey))
  } catch (e) {
    if (e instanceof LlmError) return send(res, e.status, { ok: false, error: e.message })
    send(res, 500, { ok: false, error: String(e.message || e) })
  }
})

// --- 서버 --------------------------------------------------------------------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  if (req.method === 'OPTIONS') return send(res, 204, '')
  for (const r of routes) {
    if (r.method !== req.method) continue
    const m = url.pathname.match(r.pattern)
    if (m) {
      try { return await r.handler(req, res, m) }
      catch (e) { return send(res, 400, { error: String(e.message || e) }) }
    }
  }
  send(res, 404, { error: 'Not Found', path: url.pathname })
})

server.listen(PORT, HOST, () => {
  const ep = routes.map(r => `${r.method} ${r.pattern.source.replace(/\\/g, '')}`)
  console.log(`[backend] listening on http://${HOST}:${PORT}`)
  console.log(`[backend] data: ${categories.length} categories, ${designStyles.length} design styles`)
  console.log('[backend] routes:\n  ' + ep.join('\n  '))
})
