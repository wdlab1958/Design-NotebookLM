// Formal-verification regression guard for concern `batch-rendering-contract`
// (formal/batch-rendering-contract/). Runs WITHOUT a server: imports the generator modules directly.
//
//   node --test batch_contract_test.mjs          (npm run test:formal)
//
// Properties (frozen in formal/batch-rendering-contract/tla/Properties.tla):
//   C1 every batch has 1..20 slides, C2 the plan is a contiguous partition of 1..n with ceil(n/20) batches,
//   P1 exactly one cover (slide 1), P2 exactly one closing (slide n), P3 merged deck = slides 1..n exactly —
//   when each batch is rendered independently by a renderer that obeys ONLY what the emitted prompt text says.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { parseFlags, checkPrompts, checkPlan, BATCH_SIZE } from '../formal/batch-rendering-contract/repro/contract_checker.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { batchPlan, buildUnified } = await import(resolve(root, 'app/src/lib/unified.mjs'))
const { generateAll, generateStep3Batches } = await import(resolve(root, 'server/lib/generate.mjs'))

const MAX_N = Number(process.env.FORMAL_MAX_N || 1000)   // server/index.mjs:89 allows 1..1000
const cfgFor = n => ({
  promptText: 'formal', totalPages: n, categoryName: 'c', designStyleNameEn: 'Tech',
  targetAudience: 'a', presentationObjective: 'o', customPrompt: n % 2 ? 'CUSTOM' : '', designRefUrl: n % 3 ? '' : 'https://x',
})

test('C1/C2: batchPlan(n) is a contiguous partition of 1..n in chunks of 20, length = ceil(n/20) = batchCount', () => {
  for (let n = 1; n <= MAX_N; n++) {
    const plan = batchPlan(n)
    const r = checkPlan(plan, n, BATCH_SIZE)
    assert.ok(r.C1_BatchBound, `C1 violated at n=${n}: ${JSON.stringify(plan)}`)
    assert.ok(r.C2_PlanPartition, `C2 violated at n=${n}: ${JSON.stringify(plan)}`)
    const all = generateAll(cfgFor(n))
    assert.equal(all.step3Batches.length, all.batchCount, `batchCount drift at n=${n}`)
    assert.equal(all.studioPrompts.length, all.batchCount, `studioPrompts count drift at n=${n}`)
  }
})

test('P1/P2/P3 (unified Studio prompts): independent batches obeying only the prompt text merge into exactly slides 1..n', () => {
  for (let n = 1; n <= MAX_N; n++) {
    const { studioPrompts } = buildUnified(cfgFor(n))
    const r = checkPrompts(studioPrompts, n, BATCH_SIZE)
    assert.ok(r.C2_PlanPartition, `ranges parsed from studio prompts do not partition 1..${n}: ${JSON.stringify(r.plan)}`)
    assert.ok(r.P3_ExactDeck, `P3_ExactDeck violated at n=${n}: merged nums=${JSON.stringify(r.detail.nums)}`)
    assert.ok(r.P1_SingleCover, `P1_SingleCover violated at n=${n}: covers at ${JSON.stringify(r.detail.covers)}`)
    assert.ok(r.P2_SingleClosing, `P2_SingleClosing violated at n=${n}: closings at ${JSON.stringify(r.detail.closings)}`)
  }
})

test('P1/P2/P3 (legacy chat flow, generateStep3Batches): same contract holds for the step-3 batch prompts', () => {
  for (let n = 1; n <= MAX_N; n++) {
    const batches = generateStep3Batches(cfgFor(n))
    const r = checkPrompts(batches, n, BATCH_SIZE)
    assert.ok(r.C2_PlanPartition, `step3 ranges do not partition 1..${n}: ${JSON.stringify(r.plan)}`)
    assert.ok(r.P3_ExactDeck, `P3_ExactDeck violated at n=${n}: merged nums=${JSON.stringify(r.detail.nums)}`)
    assert.ok(r.P1_SingleCover, `P1_SingleCover violated at n=${n}: covers at ${JSON.stringify(r.detail.covers)}`)
    assert.ok(r.P2_SingleClosing, `P2_SingleClosing violated at n=${n}: closings at ${JSON.stringify(r.detail.closings)}`)
    // fbd3053 also fixed a duplicated rule number ("3." twice) — rules must be numbered 1..k without gaps
    for (const b of batches) {
      const nums = [...b.matchAll(/^(\d+)\. /gm)].map(m => +m[1])
      assert.deepEqual(nums, nums.map((_, i) => i + 1), `rule numbering broken at n=${n}: ${nums}`)
    }
  }
})

test('contract flags are explicit in every multi-batch prompt (what the model calls Scope/Count/Role contracts)', () => {
  for (const n of [21, 40, 45, 80, 100, 1000]) {
    const { studioPrompts } = buildUnified(cfgFor(n))
    const step3 = generateStep3Batches(cfgFor(n))
    for (const [kind, prompts] of [['studio', studioPrompts], ['step3', step3]]) {
      prompts.forEach((p, i) => {
        const f = parseFlags(p)
        const first = i === 0, last = i === prompts.length - 1
        assert.ok(f.scope && f.exactCount, `${kind} batch ${i + 1}/${prompts.length} (n=${n}) lacks scope/count contract`)
        if (!first) assert.ok(f.coverForbidden, `${kind} batch ${i + 1} (n=${n}) does not forbid a cover slide`)
        if (!last) assert.ok(f.closingForbidden, `${kind} batch ${i + 1} (n=${n}) does not forbid a closing slide`)
        if (last) assert.ok(f.closingStated, `${kind} last batch (n=${n}) does not place the single closing slide`)
      })
    }
  }
})

test('unified.ts (type-stripped) and unified.mjs twin stay identical (drift guard, F2)', async t => {
  let ts
  try { ts = await import(resolve(root, 'app/src/lib/unified.ts')) }
  catch (e) { t.skip(`TypeScript import unavailable in this Node (${e.code || e.message}); run with --experimental-strip-types`); return }
  for (let n = 1; n <= Math.min(MAX_N, 200); n++) {
    const a = ts.buildUnified(cfgFor(n)), b = buildUnified(cfgFor(n))
    assert.equal(a.unified, b.unified, `unified text drift at n=${n}`)
    assert.deepEqual(a.studioPrompts, b.studioPrompts, `studioPrompts drift at n=${n}`)
    assert.deepEqual(ts.batchPlan(n), batchPlan(n), `batchPlan drift at n=${n}`)
  }
})
