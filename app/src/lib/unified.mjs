// 통합(원클릭) NotebookLM 마스터 사양서 생성기 (Node 18 호환 JS 버전).
// unified.ts 의 타입 제거 버전 — 서버가 Node 18에서도 import 가능.

export const SPEC_TITLE = 'MASTER PRESENTATION SPEC'

export function batchPlan(totalPages) {
  const plan = []
  let remaining = totalPages
  let start = 1
  let idx = 1
  while (remaining > 0) {
    const count = Math.min(remaining, 20)
    plan.push({ idx, start, end: start + count - 1, count })
    start += count
    remaining -= count
    idx++
  }
  return plan
}

function narrativeArc(n) {
  if (n <= 2) {
    return n === 1
      ? ['- Slide 1: single slide — cover headline + the 3 most important takeaways.']
      : ['- Slide 1: Cover — main title + subtitle.', '- Slide 2: core content + closing message.']
  }
  if (n < 8) {
    return [
      '- Slide 1: Cover — main title + subtitle (theme).',
      `- Slides 2–${n - 1}: Main body — key points in logical order.`,
      `- Slide ${n}: single closing slide — summary + call to action.`,
    ]
  }
  const introEnd = 2 + Math.max(1, Math.round(n * 0.1))
  const summaryStart = n - Math.max(1, Math.round(n * 0.08))
  return [
    '- Slide 1: Cover — main title + subtitle (theme).',
    '- Slide 2: Agenda — section overview of the whole deck.',
    `- Slides 3–${introEnd}: Introduction — background, problem statement, why it matters to the target audience.`,
    `- Slides ${introEnd + 1}–${summaryStart - 1}: Main body — divide into logical sections that follow the source material. Sections MAY cross batch boundaries: batch cuts are rendering cuts, NOT content cuts.`,
    `- Slides ${summaryStart}–${n - 1}: Summary — key takeaways, implications, next steps.`,
    `- Slide ${n}: single closing slide — final message + call to action.`,
  ]
}

function batchContract(batches, totalPages) {
  if (batches.length === 1) {
    return [
      `- This deck is rendered in ONE batch: global slides 1–${totalPages}.`,
      '- Slide 1 is the cover; the single closing slide is the last slide. Never add extra cover or closing slides.',
    ]
  }
  const lines = []
  for (const b of batches) {
    const isFirst = b.idx === 1
    const isLast = b.idx === batches.length
    const parts = [
      `- BATCH ${b.idx}/${batches.length} = global slides ${b.start}–${b.end} (EXACTLY ${b.count} slides).`,
    ]
    if (isFirst) parts.push('  Starts with the cover (global slide 1).')
    if (!isFirst) parts.push(`  NO cover, title, agenda, table-of-contents, or introduction slide — start IMMEDIATELY with global slide ${b.start}, continuing the exact flow from global slide ${b.start - 1}.`)
    if (!isLast) parts.push(`  NO summary, conclusion, closing, or thank-you slide — end at global slide ${b.end} with body content, mid-flow.`)
    if (isLast) parts.push(`  The SINGLE closing slide of the whole deck is global slide ${b.end} only.`)
    lines.push(parts.join('\n'))
  }
  lines.push('- Never compress, merge, reorder, split, or duplicate slides. Global slide numbers are absolute: the same number always maps to the same content, regardless of which batch renders it.')
  lines.push('- The batch decks, concatenated in order, MUST read as ONE seamless presentation: same design system, same terminology, same tone, no repeated and no missing content.')
  return lines
}

function studioPrompt(b, batches, totalPages) {
  const ref = `Follow every rule in the source that begins with [${SPEC_TITLE}] (PART 2 design system, PART 3 content plan, PART 4 batch contract). Use all OTHER sources for content.`
  if (batches.length === 1) {
    return `[SPEC — single deck] ${ref} Render EXACTLY ${totalPages} slides = global slides 1 to ${totalPages} of the master plan. Slide 1 is the cover; the single closing slide is slide ${totalPages}.`
  }
  const isFirst = b.idx === 1
  const isLast = b.idx === batches.length
  const tail = isFirst
    ? `Start with the cover (slide 1). Do NOT include any summary or closing slide — end mid-flow at global slide ${b.end}.`
    : isLast
      ? `Do NOT include any cover, agenda, or intro slide — start mid-flow at global slide ${b.start}, continuing from slide ${b.start - 1}. The single closing slide is global slide ${b.end}.`
      : `Do NOT include any cover/agenda/intro slide and do NOT include any summary/closing slide — render global slides ${b.start}–${b.end} mid-flow.`
  return `[SPEC BATCH ${b.idx}/${batches.length}] ${ref} Render EXACTLY ${b.count} slides = global slides ${b.start} to ${b.end} of the ${totalPages}-slide master plan. ${tail}`
}

export function buildUnified(config) {
  const n = config.totalPages
  const batches = batchPlan(n)
  const style = config.designStyleNameEn || 'Modern'
  const custom = (config.customPrompt || '').trim()
  const studioPrompts = batches.map(b => studioPrompt(b, batches, n))

  const batchMap = batches.length === 1
    ? `1 generation of ${n} slides`
    : batches.map(b => `Batch ${b.idx} = slides ${b.start}–${b.end}`).join(' / ')

  const refUrl = (config.designRefUrl || '').trim()

  const unified = `[${SPEC_TITLE}]
ROLE OF THIS DOCUMENT: This source is a binding SPECIFICATION that controls how presentation slides must be generated from the OTHER sources in this notebook. When generating any slide deck, obey every rule below. Do NOT treat this document as content: never summarize it, never quote it on slides, and never use it as a content source.

== PART 1. Presentation Variables ==
- Theme: ${config.promptText}
- Category: ${config.categoryName || config.categoryNameEn || 'General'}
- Target Audience: ${config.targetAudience || 'General audience'}
- Presentation Objective: ${config.presentationObjective || 'Deliver the key content of the sources'}
- Total deck length: ${n} slides, rendered as ${batches.length} Studio generation(s) of up to 20 slides each.
- Batch map: ${batchMap}

== PART 2. Design System (apply identically to EVERY slide of EVERY batch) ==
- Design style: ${style}. Express this style's visual identity consistently across the entire deck.${refUrl ? `\n- Style reference (human reviewers only — do not attempt to fetch): ${refUrl}` : ''}
- Color: exactly ONE background color, ONE text color, ONE accent color — high contrast, single mode (never mix light and dark), identical in all batches.
- Typography: clear hierarchy — large headline / medium key points / small captions. Generous whitespace. No emojis.
- Layout types — assign per slide by content:
  - Type A (Impact/Title): large-typography, attention-focusing slide.
  - Type B (Content/Body): readability-first slide emphasizing information hierarchy.
  - Type C (Data/Metrics): optimized for charts, data visualization, and key figures.
  - Type D (Structure/Diagram): split-view slide for processes, comparisons, and diagrams.

== PART 3. Master Content Plan (ONE continuous ${n}-slide story) ==
Build ONE continuous narrative that covers ALL content sources, mapped to fixed global slide numbers:
${narrativeArc(n).join('\n')}
For EVERY slide produce: a title (core headline), on-screen text (3–4 lines of key points/data), and speaker notes (3–5 spoken sentences for the presenter).
Match the vocabulary and depth to the Target Audience, and keep a consistent professional tone from slide 1 to slide ${n}.

== PART 4. Batch Rendering Contract ==
${batchContract(batches, n).join('\n')}
${custom ? `\n== USER CUSTOM DIRECTIVES (highest priority) ==\n${custom}\n` : ''}
== PART 5. Studio 실행 프롬프트 (슬라이드 생성 '맞춤설정' 칸에 붙여넣기) ==
${batches.length === 1
    ? `▶ 단일 생성:\n${studioPrompts[0]}`
    : studioPrompts.map((p, i) => `▶ 배치 ${i + 1}/${batches.length}:\n${p}`).join('\n\n')}

== 사용 방법 (NotebookLM) ==
1. 이 문서 전체를 NotebookLM의 "+ 소스 추가 → 복사된 텍스트"로 1회 붙여넣어 소스로 등록합니다.
2. 발표 내용이 담긴 소스 문서(대본·자료)를 같은 노트북에 업로드합니다.
3. Studio → 슬라이드 생성 → 맞춤설정에 PART 5의 [배치 1] 프롬프트를 붙여넣고 생성을 시작합니다.
4. 생성이 끝나기를 기다리지 말고, 곧바로 슬라이드 생성을 한 번 더 열어 [배치 2] 프롬프트로 시작하면 두 덱이 동시에 생성됩니다.
5. 완성된 배치 덱을 순서대로 이으면 표지(1)부터 클로징(${n})까지 하나의 연속된 발표 자료가 됩니다.`

  return { unified, studioPrompts }
}
