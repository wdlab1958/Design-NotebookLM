// E2E 테스트 — 실행 중인 백엔드(+프론트 프록시)를 대상으로 전체 사용자 흐름을 검증한다.
import { http, makeReporter, refBatchPlan } from './lib.mjs'

const FRONT = process.env.FRONT || 'http://127.0.0.1:3017'
const r = makeReporter('E2E')

console.log('=== E2E 테스트 시작 ===')

// 1. 헬스 + 데이터 통계
{
  const h = await http('GET', '/api/health')
  r.check('GET /api/health → 200', h.status === 200, `HTTP ${h.status}`)
  r.check('health: 카테고리 133개', h.json?.categories === 133, String(h.json?.categories))
  r.check('health: 디자인 스타일 30개', h.json?.designStyles === 30, String(h.json?.designStyles))
  r.check('health: 총 프롬프트 1330개', h.json?.totalPrompts === 1330, String(h.json?.totalPrompts))
  r.check('health: A3 프로젝트 25개', h.json?.a3Projects === 25, String(h.json?.a3Projects))
  r.check('health: LLM 모델 = claude-opus-4-8', h.json?.llm?.claude === 'claude-opus-4-8', h.json?.llm?.claude)
}

// 2. 카테고리/스타일 목록
{
  const c = await http('GET', '/api/categories')
  r.check('GET /api/categories → count 133', c.json?.count === 133 && c.json?.categories?.length === 133)
  r.check('모든 카테고리가 프롬프트 10개 보유', c.json?.categories?.every(x => x.prompts?.length === 10 && x.promptsEn?.length === 10))
  r.check('모든 카테고리 한/영 이름 보유', c.json?.categories?.every(x => x.name && x.nameEn))
  const ids = new Set(c.json?.categories?.map(x => x.id))
  r.check('카테고리 id 중복 없음', ids.size === c.json?.categories?.length)

  const s = await http('GET', '/api/design-styles')
  r.check('GET /api/design-styles → count 30', s.json?.count === 30)
  r.check('모든 스타일 한/영 설명 보유', s.json?.designStyles?.every(x => x.description && x.descriptionEn))
}

// 3. 단일 카테고리 + 404
{
  const ok = await http('GET', '/api/categories/109')
  r.check('GET /api/categories/109 → 200 (100K-Expert)', ok.status === 200 && ok.json?.id === 109)
  const nf = await http('GET', '/api/categories/9999')
  r.check('GET /api/categories/9999 → 404', nf.status === 404)
}

// 4. 3단계 생성 — 경계값(5/20/21/45/80) 배치 분할 검증
for (const pages of [5, 20, 21, 45, 80]) {
  const g = await http('POST', '/api/generate', {
    promptText: `E2E 주제 ${pages}p`, totalPages: pages,
    categoryName: '사업계획서', designStyleNameEn: 'Modern',
    targetAudience: '심사위원', presentationObjective: '과제 발표',
  })
  const expected = refBatchPlan(pages)
  r.check(`generate(${pages}p) → 200`, g.status === 200, `HTTP ${g.status}`)
  r.check(`generate(${pages}p): 배치 수 = ${expected.length}`, g.json?.step3Batches?.length === expected.length, `got ${g.json?.step3Batches?.length}`)
  r.check(`generate(${pages}p): step1/step2 존재`, !!g.json?.step1 && !!g.json?.step2)
  // 각 배치가 정확한 슬라이드 범위를 명시하는지(누락/중복 없음)
  const allCovered = expected.every(b => g.json?.step3Batches?.[b.idx - 1]?.includes(`${b.start} through ${b.end}`))
  r.check(`generate(${pages}p): 배치별 슬라이드 범위 정확`, allCovered)
}

// 5. 80페이지 회귀(동일 20페이지 4회 반복 버그) — 4개 배치가 서로 달라야 함
{
  const g = await http('POST', '/api/generate', { promptText: '회귀검증', totalPages: 80 })
  const b = g.json?.step3Batches || []
  const unique = new Set(b).size
  r.check('80p: 4개 배치 모두 상이(반복 버그 회귀 없음)', b.length === 4 && unique === 4, `${unique} unique of ${b.length}`)
  r.check('80p: 1번 배치는 슬라이드 1–20', b[0]?.includes('1 through 20'))
  r.check('80p: 4번 배치는 슬라이드 61–80', b[3]?.includes('61 through 80'))
}

// 5.5 통합(원클릭) 사양서 — 소스 1회 붙여넣기 흐름 검증
{
  const g = await http('POST', '/api/generate', {
    promptText: '통합검증', totalPages: 40,
    designStyleNameEn: 'Neumorphism', targetAudience: 'AI/ML 개발자', presentationObjective: '검증 방법론',
  })
  const u = g.json?.unified || ''
  const sp = g.json?.studioPrompts || []
  r.check('40p: unified 사양서 존재', u.length > 1000)
  r.check('40p: studioPrompts 2개 (배치당 1개)', sp.length === 2, `got ${sp.length}`)
  r.check('40p: studio 프롬프트는 짧음 (<600자, 맞춤설정 칸 길이 제한 대응)', sp.every(p => p.length < 600), String(sp.map(p => p.length)))
  r.check('40p: 배치 1 = 전역 슬라이드 1–20', sp[0]?.includes('global slides 1 to 20'))
  r.check('40p: 배치 2 = 전역 슬라이드 21–40 + 클로징 40', sp[1]?.includes('global slides 21 to 40') && sp[1]?.includes('closing slide is global slide 40'))
  r.check('40p: 사양서에 배치 경계 계약 포함', u.includes('BATCH 1/2 = global slides 1–20') && u.includes('BATCH 2/2 = global slides 21–40'))
  r.check('40p: 사양서에 연속성(병합 시 단일 덱) 규칙 포함', u.includes('ONE seamless presentation'))
  r.check('40p: 사양서에 디자인 스타일 반영', u.includes('Neumorphism'))
  r.check('40p: 사양서에 Studio 프롬프트 동봉 (1회 복사로 전부 전달)', sp.every(p => u.includes(p)))

  // 경계값: 20p 이하는 단일 생성 프롬프트 1개
  const g20 = await http('POST', '/api/generate', { promptText: 'x', totalPages: 20 })
  r.check('20p: studioPrompts 1개 (단일 생성)', g20.json?.studioPrompts?.length === 1)
  // 80p → 4개, 각 배치 범위 정확
  const g80 = await http('POST', '/api/generate', { promptText: 'x', totalPages: 80 })
  const sp80 = g80.json?.studioPrompts || []
  r.check('80p: studioPrompts 4개', sp80.length === 4, `got ${sp80.length}`)
  r.check('80p: 중간 배치(2,3)는 커버/클로징 모두 금지', sp80[1]?.includes('do NOT include any summary/closing') && sp80[2]?.includes('do NOT include any summary/closing'))
}

// 6. customPrompt 주입 (Gap #3)
{
  const g = await http('POST', '/api/generate', { promptText: 'x', totalPages: 25, customPrompt: 'ZZUNIQUE_TOKEN_42' })
  const inAll = g.json?.step1?.includes('ZZUNIQUE_TOKEN_42')
    && g.json?.step2?.includes('ZZUNIQUE_TOKEN_42')
    && g.json?.step3Batches?.every(x => x.includes('ZZUNIQUE_TOKEN_42'))
  r.check('customPrompt 이 step1/2/3 전체에 주입됨', inAll)
  r.check('customPrompt 이 통합 사양서에도 주입됨', g.json?.unified?.includes('ZZUNIQUE_TOKEN_42'))
}

// 7. 입력 검증 (400)
{
  const e1 = await http('POST', '/api/generate', { totalPages: 5 })
  r.check('promptText 누락 → 400', e1.status === 400)
  const e2 = await http('POST', '/api/generate', { promptText: 'x', totalPages: 0 })
  r.check('totalPages=0 → 400', e2.status === 400)
}

// 8. LLM 엔드포인트: 키 없으면 명시적 400 (사일런트 폴백 금지)
{
  const e = await http('POST', '/api/llm/generate', { provider: 'claude', config: { promptText: 'x', totalPages: 3 } })
  r.check('llm/generate 키 없음 → 400 (사일런트 폴백 아님)', e.status === 400 && /API Key/.test(e.json?.error || ''))
}

// 9. 프론트엔드 가용성 + 프록시
{
  let frontOk = false, proxyOk = false
  try {
    const f = await fetch(`${FRONT}/`); frontOk = f.status === 200
    const p = await fetch(`${FRONT}/api/health`); const pj = await p.json(); proxyOk = pj?.categories === 133
  } catch { /* front may be down in CI */ }
  r.check('프론트엔드 루트 200 (http://127.0.0.1:3017)', frontOk)
  r.check('프론트엔드 → 백엔드 /api 프록시 동작', proxyOk)
}

const summary = r.summary()
console.log('\n__RESULT__' + JSON.stringify(summary))
process.exit(summary.fail === 0 ? 0 : 1)
