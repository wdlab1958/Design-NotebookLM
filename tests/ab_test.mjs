// A/B 테스트 (차분/Differential) — 동일 계약의 두 구현을 비교.
//   Variant A: 백엔드 /api/generate (서버 lib/generate.mjs)
//   Variant B: 본 테스트에 내장된 독립 참조 구현
// 두 변형의 출력 동등성(정확성)과 지연(latency)을 비교 측정한다.
import { http, makeReporter, pctl } from './lib.mjs'

const r = makeReporter('A/B')
console.log('=== A/B (차분) 테스트 시작 ===')

// --- Variant B: 독립 참조 구현 (백엔드와 다른 코드 경로) -------------------
function refGenerate(cfg) {
  const cb = (cp) => (cp && cp.trim()) ? `\n\n[사용자 지정 추가 지시 (User Custom Instructions) — 최우선 반영]\n${cp.trim()}` : ''
  const style = cfg.designStyleNameEn || 'Modern'
  const step1 = `업로드한 [이미지]의 디자인 스타일(전체 콘셉트, 컬러 HEX코드, 톤앤매너, 주요 도형 및 그래픽 특징)을 정밀하게 분석하십시오.

분석한 내용을 바탕으로, NotebookLM의 자동화 시스템 파라미터에 바로 붙여넣을 수 있는 [Adaptive Presentation Design System] 형식의 영문 프롬프트(English Prompt)를 작성하여 코드블록에 출력해 주십시오.

[Design Style Override: ${style}]

[출력 제한 및 필수 지시 조건]
1. 길이 제한: 생성되는 영문 프롬프트의 전체 길이는 공백을 포함하여 800자 이내로 엄격히 제한하십시오.
2. 형식 통제: 모든 이모지와 불필요한 서술어를 배제하고, AI가 명확히 인식할 수 있는 구조화된 명령어(Structured Command)로만 작성하십시오.
3. 단일 모드 강제: 컬러 HEX 코드는 라이트/다크 모드를 절대 혼용하지 마십시오. 원본 이미지의 지배적인 톤에 맞춰 단 1개의 배경색(BG), 1개의 텍스트색(Text), 1개의 포인트 컬러(Accent)로만 단일화하여 확정하십시오.

[반드시 다음 구조를 따르십시오]
1. Visual Identity: 분석된 테마 명칭, 단일 고대비 Hex 컬러 코드(BG/Text/Accent), 핵심 그래픽 요소 및 여백 활용법.
2. Dynamic Layout Rules: 콘텐츠 성격에 맞춰 적용할 수 있는 모듈형 레이아웃 규칙 정의.
   - Type A (Impact/Title): 대형 타이포그래피 중심의 시선 집중형 슬라이드
   - Type B (Content/Body): 가독성과 정보의 위계(Hierarchy)를 강조한 본문형 슬라이드
   - Type C (Data/Metrics): 차트, 데이터 시각화, 지표 강조에 최적화된 슬라이드
   - Type D (Structure/Diagram): 프로세스, 비교, 도식화 등을 위한 분할 화면(Split view) 슬라이드
3. Execution: 메인 JSON 시스템이 통제하는 '슬라이드 개수와 콘텐츠 경계'를 엄격히 준수할 것. 개별 슬라이드의 논리적 섹션에 맞춰 Type A~D 중 가장 대비와 시각적 위계가 높은 레이아웃을 배정할 것.${cb(cfg.customPrompt)}`

  const step2 = `# Role: Chief Content Architect
Task: Analyze ALL uploaded sources and generate a consistent ${cfg.totalPages}-page [Master Script Report].

## [Variables]
- Target Audience: <<<${cfg.targetAudience || ''}>>>
- Presentation Objective: <<<${cfg.presentationObjective || ''}>>>
- Category: ${cfg.categoryName || '일반'}
- Theme: ${cfg.promptText}

## Instruction Guidelines
1. 업로드된 모든 소스 문서의 핵심 팩트와 데이터를 통합하여 논리적 흐름(서론-본론-결론)을 구축하라.
2. 지정된 [Target Audience]의 수준과 관심사에 맞춘 전문적인 용어와 설득력 있는 문체를 사용하라.

## Output Format (Strictly Follow)
슬라이드 번호: (1~${cfg.totalPages})
제목: (해당 페이지의 핵심 헤드라인)
화면 텍스트: (핵심 데이터 및 키워드 3~4줄 요약)
상세 대본: (발표자가 읽을 구어체 설명 3~5줄)${cb(cfg.customPrompt)}`

  const batches = []
  let remaining = cfg.totalPages, start = 1, idx = 1
  while (remaining > 0) { const count = Math.min(remaining, 20); batches.push({ start, end: start + count - 1, idx }); start += count; remaining -= count; idx++ }
  const designUrl = cfg.designRefUrl || 'https://www.behance.net/'
  const total = batches.length
  const extra = cb(cfg.customPrompt)
  const step3Batches = batches.map(b => {
    const isFirst = b.idx === 1, isLast = b.idx === total, count = b.end - b.start + 1
    const rules = []
    rules.push(`Source scope: Use ONLY the Master Script slides numbered ${b.start} through ${b.end} that were generated in Step 2 ("슬라이드 번호: ${b.start}" ~ "슬라이드 번호: ${b.end}"). IGNORE every Master Script slide outside this range — do not reference, summarize, paraphrase, or merge their content into this deck under any circumstance.`)
    rules.push(`Output count: Generate EXACTLY ${count} slides, mapped 1:1 to Master Script slides ${b.start}–${b.end}. Master Script "슬라이드 번호: N" becomes deck slide N. Carry over its 제목 as the slide title, 화면 텍스트 as the on-screen body, and 상세 대본 as the speaker notes — verbatim. DO NOT compress, summarize, or merge multiple Master Script slides into one output slide. DO NOT split one Master Script slide across multiple output slides.`)
    rules.push(`Apply the [Global Design System] (<<<${designUrl}>>>) and the Visual Identity / Dynamic Layout Rules from the Step 1 Adaptive Presentation Design System exactly to every slide — same colors, typography, spacing, layout types (A/B/C/D).`)
    if (!isFirst) rules.push(`DO NOT generate any cover, title, agenda, table-of-contents, or introduction slide. The deck must start IMMEDIATELY with body content corresponding to Master Script slide ${b.start}.`)
    if (!isLast) rules.push(`DO NOT generate any ending, thank-you, summary, conclusion, or closing slide. The deck must end with body content corresponding to Master Script slide ${b.end} — no wrap-up of any kind.`)
    if (isLast && total > 1) rules.push(`Place the SINGLE ending/closing slide at the position of Master Script slide ${b.end} only. Do not add any extra closing slide before or after.`)
    const header = total === 1
      ? `[Slide Rendering — Single Batch]\nRender exactly ${count} presentation slides corresponding 1:1 to the Master Script slides numbered ${b.start} through ${b.end} that were generated in Step 2.`
      : `[Slide Rendering — Batch ${b.idx} of ${total}]\nThis is one of ${total} sequential batches splitting a ${cfg.totalPages}-slide deck. Render exactly ${count} presentation slides corresponding 1:1 to the Master Script slides numbered ${b.start} through ${b.end} that were generated in Step 2. Run this batch as its OWN NotebookLM Studio generation — DO NOT combine it with other batches in the same chat message, or you will receive a duplicated summary instead of sequential content.`
    return `${header}\n\n[Global Design System]\n<<<${designUrl}>>>\n\n[Strict Rules]\n${rules.map((x, i) => `${i + 1}. ${x}`).join('\n\n')}${extra}`
  })
  return { step1, step2, step3Batches }
}

// --- 무작위 구성 N개로 A vs B 비교 ------------------------------------------
const N = 60
const styles = ['Modern', 'Minimal', 'Tech', 'Dark Mode', 'Magazine']
const cats = ['사업계획서', 'IR 피칭', '연구 논문', '제품 소개', '정책 보고서']
const latA = [], latB = []
let mismatches = 0
const mismatchSamples = []

for (let i = 0; i < N; i++) {
  const cfg = {
    promptText: `AB 주제 ${i}`,
    totalPages: 1 + ((i * 7) % 100),                  // 1..100 결정론적 분포
    categoryName: cats[i % cats.length],
    designStyleNameEn: styles[i % styles.length],
    targetAudience: i % 2 ? '투자자' : '심사위원',
    presentationObjective: `목표 ${i}`,
    customPrompt: i % 3 === 0 ? `추가지시-${i}` : '',
    designRefUrl: i % 4 === 0 ? 'https://dribbble.com/x' : '',
  }
  // Variant A: 백엔드
  const a = await http('POST', '/api/generate', cfg)
  latA.push(a.ms)
  // Variant B: 로컬 참조
  const t0 = performance.now()
  const b = refGenerate(cfg)
  latB.push(performance.now() - t0)

  const same = a.json?.step1 === b.step1
    && a.json?.step2 === b.step2
    && JSON.stringify(a.json?.step3Batches) === JSON.stringify(b.step3Batches)
  if (!same) { mismatches++; if (mismatchSamples.length < 3) mismatchSamples.push({ i, pages: cfg.totalPages }) }
}

r.check(`A/B 동등성: ${N}개 구성 전부 출력 일치`, mismatches === 0, `mismatches=${mismatches}${mismatchSamples.length ? ' ' + JSON.stringify(mismatchSamples) : ''}`)
r.check('A(백엔드) 평균 지연 < 50ms', (latA.reduce((s, x) => s + x, 0) / N) < 50, `${(latA.reduce((s, x) => s + x, 0) / N).toFixed(2)}ms`)

const meanA = latA.reduce((s, x) => s + x, 0) / N
const meanB = latB.reduce((s, x) => s + x, 0) / N
console.log('\n[A/B 지표]')
console.log(`  Variant A (백엔드 HTTP): mean=${meanA.toFixed(2)}ms  p50=${pctl(latA, 50).toFixed(2)}ms  p95=${pctl(latA, 95).toFixed(2)}ms`)
console.log(`  Variant B (로컬 참조)   : mean=${meanB.toFixed(3)}ms  p50=${pctl(latB, 50).toFixed(3)}ms  p95=${pctl(latB, 95).toFixed(3)}ms`)
console.log(`  동등 출력 비율: ${(((N - mismatches) / N) * 100).toFixed(1)}%`)

const summary = r.summary()
summary.metrics = { N, meanA_ms: +meanA.toFixed(2), p95A_ms: +pctl(latA, 95).toFixed(2), meanB_ms: +meanB.toFixed(3), equivalencePct: +(((N - mismatches) / N) * 100).toFixed(1) }
console.log('\n__RESULT__' + JSON.stringify(summary))
process.exit(summary.fail === 0 ? 0 : 1)
