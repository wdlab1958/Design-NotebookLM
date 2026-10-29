// Historic reproduction: run the contract checker against the PRE-FIX generateStep3()
// taken verbatim from git (commit 85f2104, parent of fbd3053 "80페이지가 동일 20페이지 4번 반복").
// Expected: FAIL (exit 1). This is the evidence/test_before.log of finding F1.
//
//   node formal/batch-rendering-contract/repro/legacy_85f2104.mjs   (from the repo root; needs git + app/node_modules/esbuild)
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { checkPrompts, BATCH_SIZE } from './contract_checker.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const COMMIT = process.env.LEGACY_COMMIT || '85f2104'
const src = execFileSync('git', ['-C', root, 'show', `${COMMIT}:app/src/pages/CustomizePage.tsx`], { encoding: 'utf8' })
const m = src.match(/function generateStep3\(config: Config\): string \{[\s\S]*?\n\}\n/)
if (!m) { console.error('generateStep3 not found in', COMMIT); process.exit(2) }
const esbuild = createRequire(resolve(root, 'app/package.json'))('esbuild')
const js = esbuild.transformSync(m[0], { loader: 'ts', format: 'esm' }).code
const generateStep3 = new Function(`${js}\nreturn generateStep3`)()

let failures = 0
for (const n of [21, 40, 45, 80]) {
  const text = generateStep3({ promptText: 'x', totalPages: n, designRefUrl: '' })
  // one FUNCTION_NN_CALL_STUDIO block per batch (the legacy pseudocode wrapper)
  const blocks = text.split(/(?=FUNCTION_\d+_CALL_STUDIO\(\))/).filter(b => /FUNCTION_\d+/.test(b))
  const r = checkPrompts(blocks, n, BATCH_SIZE)
  const ok = r.P1_SingleCover && r.P2_SingleClosing && r.P3_ExactDeck
  console.log(`[${ok ? 'PASS' : 'FAIL'}] n=${n} batches=${blocks.length} flags(batch1)=${JSON.stringify({ scope: r.flags[0].scope, exactCount: r.flags[0].exactCount, coverForbidden: r.flags[0].coverForbidden, closingForbidden: r.flags[0].closingForbidden })}`)
  console.log(`       P1_SingleCover=${r.P1_SingleCover} covers@${JSON.stringify(r.detail.covers)}  P2_SingleClosing=${r.P2_SingleClosing} closings@${JSON.stringify(r.detail.closings)}`)
  console.log(`       P3_ExactDeck=${r.P3_ExactDeck} merged=${r.detail.nums.length} slides, first 24 nums=${JSON.stringify(r.detail.nums.slice(0, 24))}`)
  if (!ok) failures++
}
console.log(failures ? `\n${failures} configuration(s) violate the frozen properties on ${COMMIT} (pre-fix code) — F1 reproduced` : '\nall pass')
process.exit(failures ? 1 : 0)
