| # | Action | Code | Changed |
|---|---|---|---|
| 1 | `Init` |  | `deck` = << [nums \|-> <<>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<>>, xc \|-> FALSE, xz \|-> FALSE] >>; `merged` = <<>>; `n` = 5; `plan` = << [count \|-> 2, start \|-> 1, end \|-> 2, idx \|-> 1], [count \|-> 2, start \|-> 3, end \|-> 4, idx \|-> 2], [count \|-> 1, start \|-> 5, end \|-> 5, idx \|-> 3] >> |
| 2 | `Render(1)` | app/src/lib/unified.ts:107-120 | `deck` = << [nums \|-> <<1, 2>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<>>, xc \|-> FALSE, xz \|-> FALSE] >> |
| 3 | `Render(2)` | app/src/lib/unified.ts:107-120 | `deck` = << [nums \|-> <<1, 2>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<3, 4>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<>>, xc \|-> FALSE, xz \|-> FALSE] >> |
| 4 | `Render(3)` | app/src/lib/unified.ts:107-120 | `deck` = << [nums \|-> <<1, 2>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<3, 4>>, xc \|-> FALSE, xz \|-> FALSE], [nums \|-> <<5>>, xc \|-> FALSE, xz \|-> FALSE] >> |
| 5 | `Merge` ⚠ | app/src/lib/unified.ts:103 | `merged` = << [extra \|-> "none", num \|-> 1], [extra \|-> "none", num \|-> 2], [extra \|-> "none", num \|-> 3], [extra \|-> "none", num \|-> 4], [extra \|-> "none", num \|-> 5] >> |
