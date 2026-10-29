| # | Action | Code | Changed |
|---|---|---|---|
| 1 | `Init` |  | `deck` = << [nums \|-> <<>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<>>, xc \|-> FALSE, xz \|-> FALSE] >>; `merged` = <<>>; `n` = 3; `plan` = << [count \|-> 2, start \|-> 1, end \|-> 2, idx \|-> 1], [count \|-> 1, start \|-> 3, end \|-> 3, idx \|-> 2] >> |
| 2 | `Render(1)` | app/src/lib/unified.ts:107-120 | `deck` = << [nums \|-> <<1, 2>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<>>, xc \|-> FALSE, xz \|-> FALSE] >> |
| 3 | `Render(2)` | app/src/lib/unified.ts:107-120 | `deck` = << [nums \|-> <<1, 2>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<2>>, xc \|-> FALSE, xz \|-> FALSE] >> |
| 4 | `Merge` ⚠ | app/src/lib/unified.ts:103 | `merged` = << [extra \|-> "none", num \|-> 1], [extra \|-> "none", num \|-> 2], [extra \|-> "none", num \|-> 2] >> |
