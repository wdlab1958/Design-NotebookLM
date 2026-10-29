// Contract checker — the executable twin of formal/batch-rendering-contract/tla/Spec.tla.
//
// 1. parseFlags(text)      : reads the per-batch prompt text the code emits and extracts the
//                            three contract toggles of the model (ScopeContract, CountContract,
//                            RoleContract) plus the slide range.
// 2. adversarialRender()   : the model's Render(b) action instantiated with the legacy choice —
//                            the renderer does everything the text does not forbid, in the way
//                            NotebookLM did before fbd3053 (summarise the source from the top,
//                            add its default title / thank-you slides).
// 3. checkDeck()           : P1_SingleCover, P2_SingleClosing, P3_ExactDeck of Properties.tla.
// 4. checkPlan()           : C1_BatchBound, C2_PlanPartition of Properties.tla.
//
// Pure functions, no I/O: used by tests/batch_contract_test.mjs (current code) and by
// repro/legacy_85f2104.mjs (pre-fix code from git history).

export const BATCH_SIZE = 20

export function parseFlags(text) {
  const f = {
    start: null, end: null, count: null,
    scope: false,          // ScopeContract: only slides start..end, everything else ignored
    exactCount: false,     // CountContract: EXACTLY count slides
    coverForbidden: false, closingForbidden: false,   // RoleContract halves
    coverStated: false, closingStated: false,         // the prompt itself places cover / closing
  }
  let m
  // unified.ts studioPrompt (multi-batch and single)
  if ((m = text.match(/Render EXACTLY (\d+) slides = global slides (\d+) to (\d+)/))) {
    f.count = +m[1]; f.start = +m[2]; f.end = +m[3]; f.exactCount = true; f.scope = true
  }
  // server/lib/generate.mjs generateStep3Batches (current legacy-chat flow)
  if ((m = text.match(/Use ONLY the Master Script slides numbered (\d+) through (\d+)/))) {
    f.start = +m[1]; f.end = +m[2]
    f.scope = /IGNORE every Master Script slide outside this range/.test(text)
  }
  if ((m = text.match(/Generate EXACTLY (\d+) slides/))) { f.count = +m[1]; f.exactCount = true }
  // 85f2104 CustomizePage.tsx generateStep3 (pre-fix): a range hint without exclusivity, length "dynamic"
  if ((m = text.match(/Source Script Slides (\d+) to (\d+)/))) { f.start = +m[1]; f.end = +m[2] }

  f.coverForbidden = /DO NOT generate any cover|DO NOT generate a cover|Do NOT include any cover/.test(text)
  f.closingForbidden = /DO NOT generate any ending|Do NOT include any summary|do NOT include any summary/.test(text)
  f.coverStated = /Start with the cover \(slide 1\)|Slide 1 is the cover/.test(text)
  f.closingStated = /closing slide is (?:global )?slide \d+|Place the SINGLE ending\/closing slide|Place the ONLY ending slide/.test(text)
  return f
}

// Spec.tla Render(b): one concrete choice among everything the contract leaves open.
export function adversarialRender(f, n, batchSize = BATCH_SIZE) {
  const lo = f.scope ? f.start : 1
  const hi = f.scope ? f.end : n
  const avail = hi - lo + 1
  // CountContract off  ->  legacy "length: dynamic": the renderer fills a full batch from the top of the source.
  const count = f.exactCount ? f.count : Math.min(batchSize, avail)
  const nums = Array.from({ length: Math.min(count, avail) }, (_, i) => lo + i)
  // Spec.tla Extras: suppressed only by RoleContract or CountContract (or when the prompt places them itself).
  const extraCover = !(f.coverForbidden || f.coverStated || f.exactCount)
  const extraClosing = !(f.closingForbidden || f.closingStated || f.exactCount)
  return [
    ...(extraCover ? [{ num: 0, extra: 'cover' }] : []),
    ...nums.map(num => ({ num, extra: 'none' })),
    ...(extraClosing ? [{ num: 0, extra: 'closing' }] : []),
  ]
}

// Spec.tla Merge: concatenate batch decks in batch order.
export function merge(decks) { return decks.flat() }

// Properties.tla P1..P3 on a merged deck for a deck of n slides.
export function checkDeck(merged, n) {
  const isCover = s => s.extra === 'cover' || s.num === 1
  const isClosing = s => s.extra === 'closing' || s.num === n
  const covers = merged.map((s, i) => isCover(s) ? i + 1 : 0).filter(Boolean)
  const closings = merged.map((s, i) => isClosing(s) ? i + 1 : 0).filter(Boolean)
  const nums = merged.map(s => s.num)
  const expected = Array.from({ length: n }, (_, i) => i + 1)
  return {
    P1_SingleCover: covers.length === 1 && covers[0] === 1,
    P2_SingleClosing: closings.length === 1 && closings[0] === merged.length,
    P3_ExactDeck: nums.length === n && nums.every((v, i) => v === expected[i]),
    detail: { covers, closings, nums },
  }
}

// Properties.tla C1 / C2 on a plan [{idx,start,end,count}] for n slides.
export function checkPlan(plan, n, batchSize = BATCH_SIZE) {
  const nb = plan.length
  const formula = n === 0 ? 1 : Math.ceil(n / batchSize)
  const C1 = plan.every(b => b.count >= 1 && b.count <= batchSize)
  const C2 = nb >= 1 && plan[0].start === 1 && plan[nb - 1].end === n
    && plan.every((b, i) => b.idx === i + 1 && b.count === b.end - b.start + 1 && (i === 0 || b.start === plan[i - 1].end + 1))
    && nb === formula
  return { C1_BatchBound: C1, C2_PlanPartition: C2 }
}

// Whole pipeline for a list of per-batch prompt texts.
export function checkPrompts(prompts, n, batchSize = BATCH_SIZE) {
  const flags = prompts.map(parseFlags)
  const plan = flags.map((f, i) => ({ idx: i + 1, start: f.start, end: f.end, count: f.end - f.start + 1 }))
  const decks = flags.map(f => adversarialRender(f, n, batchSize))
  const merged = merge(decks)
  return { flags, plan, decks, merged, ...checkPlan(plan, n, batchSize), ...checkDeck(merged, n) }
}
