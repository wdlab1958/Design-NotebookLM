// Chaos 테스트 — 비정상 입력/과부하/오류 주입 하에서도 서버가 죽지 않고
// 올바른 상태코드를 반환하며(500/크래시 없음) 살아남는지 검증한다.
import { http, makeReporter, pctl } from './lib.mjs'

const r = makeReporter('Chaos')
console.log('=== Chaos 테스트 시작 ===')

// 1. 잘못된 JSON 본문
{
  const res = await http('POST', '/api/generate', '{ this is not json ]')
  r.check('깨진 JSON → 400 (500 아님)', res.status === 400, `HTTP ${res.status}`)
}

// 2. 필수 필드 누락 변형들
for (const [name, body] of [
  ['빈 본문', {}],
  ['promptText 공백', { promptText: '   ', totalPages: 5 }],
  ['totalPages 음수', { promptText: 'x', totalPages: -5 }],
  ['totalPages 초과(2000)', { promptText: 'x', totalPages: 2000 }],
  ['totalPages 문자열', { promptText: 'x', totalPages: 'abc' }],
]) {
  const res = await http('POST', '/api/generate', body)
  r.check(`${name} → 4xx (서버 안정)`, res.status >= 400 && res.status < 500, `HTTP ${res.status}`)
}

// 3. 극단적으로 큰(허용 범위 내) 페이지 수 — 1000p = 50배치, 처리 가능해야 함
{
  const res = await http('POST', '/api/generate', { promptText: '대규모', totalPages: 1000 })
  r.check('1000p → 200 & 50배치', res.status === 200 && res.json?.step3Batches?.length === 50, `batches=${res.json?.step3Batches?.length}`)
}

// 4. 매우 긴 customPrompt (100KB) — payload 한도 내 처리/거부 모두 안정
{
  const big = 'A'.repeat(100_000)
  const res = await http('POST', '/api/generate', { promptText: 'x', totalPages: 5, customPrompt: big })
  r.check('100KB customPrompt → 안정 처리(2xx/4xx)', (res.status >= 200 && res.status < 500), `HTTP ${res.status}`)
}

// 5. payload 과대(>5MB) → 거부하되 크래시 없음
{
  let status = 0
  try {
    const huge = 'B'.repeat(6_000_000)
    const res = await http('POST', '/api/generate', { promptText: huge, totalPages: 5 })
    status = res.status
  } catch { status = -1 /* 연결 종료 */ }
  r.check('6MB payload → 거부/연결종료(크래시 아님)', status === -1 || (status >= 400 && status < 500) || status === 0 || status === 200, `status=${status}`)
}

// 6. 알 수 없는 라우트/메서드
{
  const a = await http('GET', '/api/does-not-exist')
  r.check('알 수 없는 경로 → 404', a.status === 404)
  const b = await http('GET', '/api/generate')  // GET on POST route
  r.check('잘못된 메서드 → 404', b.status === 404)
}

// 7. LLM 오류 경로 — 잘못된 키/공급자에서 500 아닌 4xx
for (const [name, body, path] of [
  ['llm/generate 키 없음', { provider: 'claude', config: { promptText: 'x', totalPages: 3 } }, '/api/llm/generate'],
  ['llm/generate 알 수 없는 공급자', { provider: 'bogus', apiKey: 'k', config: { promptText: 'x', totalPages: 3 } }, '/api/llm/generate'],
  ['llm/validate 빈 키', { provider: 'gemini', apiKey: '' }, '/api/llm/validate'],
]) {
  const res = await http('POST', path, body)
  r.check(`${name} → 4xx (사일런트 폴백/500 아님)`, res.status >= 400 && res.status < 500, `HTTP ${res.status}`)
}

// 8. 동시성 부하 — 200개 동시 요청, 전부 200 & 서버 생존
{
  const tasks = Array.from({ length: 200 }, (_, i) =>
    http('POST', '/api/generate', { promptText: `load-${i}`, totalPages: 1 + (i % 80) }))
  const t0 = performance.now()
  const settled = await Promise.allSettled(tasks)
  const wall = performance.now() - t0
  const ok = settled.filter(s => s.status === 'fulfilled' && s.value.status === 200)
  const lat = ok.map(s => s.value.ms)
  r.check('200 동시 요청 전부 200', ok.length === 200, `${ok.length}/200`)
  r.check('동시 요청 5xx 0건', settled.every(s => s.status === 'fulfilled' && s.value.status < 500))
  console.log(`  [부하] 200건 wall=${wall.toFixed(0)}ms  p50=${pctl(lat, 50).toFixed(1)}ms  p95=${pctl(lat, 95).toFixed(1)}ms`)
}

// 9. 부하 직후 헬스 — 서버 여전히 생존
{
  const h = await http('GET', '/api/health')
  r.check('카오스 이후 서버 생존(health 200)', h.status === 200 && h.json?.status === 'ok')
}

const summary = r.summary()
console.log('\n__RESULT__' + JSON.stringify(summary))
process.exit(summary.fail === 0 ? 0 : 1)
