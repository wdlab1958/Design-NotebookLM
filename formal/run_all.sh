#!/usr/bin/env bash
# Three-config gate (WDLAB-STD-VERIFY-001 §6.1) + regression test for concern batch-rendering-contract.
# Usage: ./formal/run_all.sh            (from anywhere; needs java + tla2tools.jar, node >= 22)
#   TLA2TOOLS=/path/tla2tools.jar  override jar (default ~/.cache/proof-skills/tla2tools.jar)
#   TLC_WORKERS=N                  TLC worker threads (default 4)
#   SKIP_LEGACY=1                  skip the git-history reproduction (needs git + app/node_modules/esbuild)
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
TLA="$HERE/batch-rendering-contract/tla"
JAR="${TLA2TOOLS:-$HOME/.cache/proof-skills/tla2tools.jar}"
[ -f "$JAR" ] || { echo "tla2tools.jar not found at $JAR (set TLA2TOOLS)"; exit 2; }
WORKERS="${TLC_WORKERS:-4}"
OUT="$(mktemp -d)"; trap 'rm -rf "$OUT"' EXIT
fail=0

run_tlc() { # cfg expected_exit description
  local cfg="$1" want="$2" desc="$3"
  ( cd "$TLA" && java -XX:+UseParallelGC -cp "$JAR" tlc2.TLC -workers "$WORKERS" -config "$cfg.cfg" -metadir "$OUT/$cfg" Properties.tla > "$OUT/$cfg.log" 2>&1 )
  local rc=$?
  rm -f "$TLA"/Properties_TTrace_* 2>/dev/null
  local inv; inv=$(grep -m1 -oE 'Invariant [A-Za-z0-9_]+ is violated|Temporal properties were violated' "$OUT/$cfg.log" || true)
  local st; st=$(grep -m1 -oE '[0-9,]+ distinct states found' "$OUT/$cfg.log" || true)
  if [ "$rc" = "$want" ]; then echo "[PASS] $cfg exit=$rc (expected $want) — $desc ${inv:+[$inv]} ${st:+($st)}"
  else echo "[FAIL] $cfg exit=$rc (expected $want) — $desc ${inv:+[$inv]}"; fail=1; fi
}

echo "== TLC three-config gate (TLC_WORKERS=$WORKERS) =="
run_tlc MC            0  "fix ON, MinN..MaxN=1..5, BatchSize=2, +liveness: must PASS"
run_tlc MC_wide       0  "fix ON, real BatchSize=20, n=1..100: must PASS"
run_tlc MC_bug       12  "legacy prompt (all toggles OFF): must FAIL on P3_ExactDeck"
run_tlc MC_bug_scope 12  "mutation: ScopeContract OFF: must FAIL (duplicated slides)"
run_tlc MC_bug_count 12  "mutation: CountContract OFF: must FAIL (lost slides)"
run_tlc MC_bug_role   0  "mutation: RoleContract OFF: expected PASS (redundant under strict compliance, SCOPE.md A3)"
run_tlc MC_sanity    12  "sanity: a merged 3-batch deck is reachable: must FAIL"

echo "== regression test on real code (node:test) =="
if ( cd "$ROOT/tests" && node --test batch_contract_test.mjs > "$OUT/test.log" 2>&1 ); then
  echo "[PASS] tests/batch_contract_test.mjs $(grep -E '^# pass' "$OUT/test.log" | tr -d '\n')"
else echo "[FAIL] tests/batch_contract_test.mjs"; grep -E '^not ok|AssertionError|expected|actual' "$OUT/test.log" | head -20; fail=1; fi

if [ "${SKIP_LEGACY:-0}" != 1 ] && [ -d "$ROOT/.git" ] && [ -d "$ROOT/app/node_modules/esbuild" ]; then
  echo "== historic reproduction on pre-fix code (git 85f2104): must FAIL =="
  ( cd "$ROOT" && node formal/batch-rendering-contract/repro/legacy_85f2104.mjs > "$OUT/legacy.log" 2>&1 ); rc=$?
  if [ "$rc" = 1 ]; then echo "[PASS] legacy_85f2104.mjs exit=1 (properties violated on pre-fix code, as expected)"
  else echo "[FAIL] legacy_85f2104.mjs exit=$rc (expected 1)"; tail -5 "$OUT/legacy.log"; fail=1; fi
fi

[ $fail = 0 ] && echo "ALL GATES PASSED" || echo "GATE FAILURE"
exit $fail
