// 공용 테스트 유틸
export const BASE = process.env.BASE || 'http://127.0.0.1:8013'

export async function http(method, path, body) {
  const t0 = performance.now()
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)),
  })
  const ms = performance.now() - t0
  let json = null
  try { json = await res.json() } catch { /* non-json */ }
  return { status: res.status, json, ms }
}

export function makeReporter(name) {
  const results = []
  return {
    check(desc, cond, detail = '') {
      const ok = !!cond
      results.push({ desc, ok, detail })
      const tag = ok ? 'PASS' : 'FAIL'
      console.log(`  [${tag}] ${desc}${detail ? ' — ' + detail : ''}`)
      return ok
    },
    summary() {
      const pass = results.filter(r => r.ok).length
      const fail = results.length - pass
      console.log(`\n[${name}] ${pass}/${results.length} passed, ${fail} failed`)
      return { name, total: results.length, pass, fail, results }
    },
  }
}

// 테스트용 독립 참조 구현 (백엔드와 동일 계약을 다른 코드로 재현 → 차분 검증)
export function refBatchPlan(totalPages) {
  const plan = []
  let remaining = totalPages, start = 1, idx = 1
  while (remaining > 0) {
    const count = Math.min(remaining, 20)
    plan.push({ idx, start, end: start + count - 1, count })
    start += count; remaining -= count; idx++
  }
  return plan
}

export function pctl(arr, p) {
  if (!arr.length) return 0
  const s = [...arr].sort((a, b) => a - b)
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))]
}
