// 3단계 NotebookLM 프롬프트 생성 로직 (서버측 단일 출처).
// 프론트엔드 CustomizePage 의 generateStep1/2/3 을 이식하고,
// 그동안 사용되지 않던 customPrompt(사용자 지정 프롬프트)를 실제로 주입한다 (Gap #3 해결).

import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// 통합(원클릭) 사양서 생성기는 프론트엔드와 공유하는 단일 출처 TS 모듈을 그대로 사용 (Node 22 type-stripping).
const __dirname = dirname(fileURLToPath(import.meta.url))
const { buildUnified } = await import(resolve(__dirname, '../../app/src/lib/unified.mjs'))

/**
 * @typedef {Object} GenConfig
 * @property {string} [categoryName]
 * @property {string} [categoryNameEn]
 * @property {string} promptText
 * @property {string} [designStyleName]
 * @property {string} [designStyleNameEn]
 * @property {string} [designRefUrl]
 * @property {string} [targetAudience]
 * @property {string} [presentationObjective]
 * @property {number} totalPages
 * @property {string} [customPrompt]   // 설정 모달의 "사용자 지정 프롬프트"
 */

function customBlock(customPrompt) {
  const c = (customPrompt || '').trim()
  if (!c) return ''
  return `\n\n[사용자 지정 추가 지시 (User Custom Instructions) — 최우선 반영]\n${c}`
}

export function generateStep1(config) {
  const style = config.designStyleNameEn || 'Modern'
  return `업로드한 [이미지]의 디자인 스타일(전체 콘셉트, 컬러 HEX코드, 톤앤매너, 주요 도형 및 그래픽 특징)을 정밀하게 분석하십시오.

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
3. Execution: 메인 JSON 시스템이 통제하는 '슬라이드 개수와 콘텐츠 경계'를 엄격히 준수할 것. 개별 슬라이드의 논리적 섹션에 맞춰 Type A~D 중 가장 대비와 시각적 위계가 높은 레이아웃을 배정할 것.${customBlock(config.customPrompt)}`
}

export function generateStep2(config) {
  return `# Role: Chief Content Architect
Task: Analyze ALL uploaded sources and generate a consistent ${config.totalPages}-page [Master Script Report].

## [Variables]
- Target Audience: <<<${config.targetAudience || ''}>>>
- Presentation Objective: <<<${config.presentationObjective || ''}>>>
- Category: ${config.categoryName || '일반'}
- Theme: ${config.promptText}

## Instruction Guidelines
1. 업로드된 모든 소스 문서의 핵심 팩트와 데이터를 통합하여 논리적 흐름(서론-본론-결론)을 구축하라.
2. 지정된 [Target Audience]의 수준과 관심사에 맞춘 전문적인 용어와 설득력 있는 문체를 사용하라.

## Output Format (Strictly Follow)
슬라이드 번호: (1~${config.totalPages})
제목: (해당 페이지의 핵심 헤드라인)
화면 텍스트: (핵심 데이터 및 키워드 3~4줄 요약)
상세 대본: (발표자가 읽을 구어체 설명 3~5줄)${customBlock(config.customPrompt)}`
}

export function generateStep3Batches(config) {
  const batches = []
  let remaining = config.totalPages
  let start = 1
  let idx = 1
  while (remaining > 0) {
    const count = Math.min(remaining, 20)
    batches.push({ start, end: start + count - 1, idx })
    start += count
    remaining -= count
    idx++
  }

  const designUrl = config.designRefUrl || 'https://www.behance.net/'
  const totalBatches = batches.length
  const extra = customBlock(config.customPrompt)

  return batches.map(b => {
    const isFirst = b.idx === 1
    const isLast = b.idx === totalBatches
    const count = b.end - b.start + 1
    const rules = []

    rules.push(`Source scope: Use ONLY the Master Script slides numbered ${b.start} through ${b.end} that were generated in Step 2 ("슬라이드 번호: ${b.start}" ~ "슬라이드 번호: ${b.end}"). IGNORE every Master Script slide outside this range — do not reference, summarize, paraphrase, or merge their content into this deck under any circumstance.`)
    rules.push(`Output count: Generate EXACTLY ${count} slides, mapped 1:1 to Master Script slides ${b.start}–${b.end}. Master Script "슬라이드 번호: N" becomes deck slide N. Carry over its 제목 as the slide title, 화면 텍스트 as the on-screen body, and 상세 대본 as the speaker notes — verbatim. DO NOT compress, summarize, or merge multiple Master Script slides into one output slide. DO NOT split one Master Script slide across multiple output slides.`)
    rules.push(`Apply the [Global Design System] (<<<${designUrl}>>>) and the Visual Identity / Dynamic Layout Rules from the Step 1 Adaptive Presentation Design System exactly to every slide — same colors, typography, spacing, layout types (A/B/C/D).`)
    if (!isFirst) {
      rules.push(`DO NOT generate any cover, title, agenda, table-of-contents, or introduction slide. The deck must start IMMEDIATELY with body content corresponding to Master Script slide ${b.start}.`)
    }
    if (!isLast) {
      rules.push(`DO NOT generate any ending, thank-you, summary, conclusion, or closing slide. The deck must end with body content corresponding to Master Script slide ${b.end} — no wrap-up of any kind.`)
    }
    if (isLast && totalBatches > 1) {
      rules.push(`Place the SINGLE ending/closing slide at the position of Master Script slide ${b.end} only. Do not add any extra closing slide before or after.`)
    }

    const header = totalBatches === 1
      ? `[Slide Rendering — Single Batch]\nRender exactly ${count} presentation slides corresponding 1:1 to the Master Script slides numbered ${b.start} through ${b.end} that were generated in Step 2.`
      : `[Slide Rendering — Batch ${b.idx} of ${totalBatches}]\nThis is one of ${totalBatches} sequential batches splitting a ${config.totalPages}-slide deck. Render exactly ${count} presentation slides corresponding 1:1 to the Master Script slides numbered ${b.start} through ${b.end} that were generated in Step 2. Run this batch as its OWN NotebookLM Studio generation — DO NOT combine it with other batches in the same chat message, or you will receive a duplicated summary instead of sequential content.`

    return `${header}

[Global Design System]
<<<${designUrl}>>>

[Strict Rules]
${rules.map((r, i) => `${i + 1}. ${r}`).join('\n\n')}${extra}`
  })
}

/** 전체 묶음을 반환 — 기존 3단계(채팅 흐름) + 통합 사양서(원클릭 소스 흐름) */
export function generateAll(config) {
  const { unified, studioPrompts } = buildUnified(config)
  return {
    step1: generateStep1(config),
    step2: generateStep2(config),
    step3Batches: generateStep3Batches(config),
    batchCount: Math.max(1, Math.ceil((config.totalPages || 1) / 20)),
    unified,
    studioPrompts,
  }
}
