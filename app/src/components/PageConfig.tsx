import { Minus, Plus, Info } from 'lucide-react'

interface Props {
  totalPages: number
  onChange: (pages: number) => void
}

export default function PageConfig({ totalPages, onChange }: Props) {
  const batches = []
  let remaining = totalPages
  let start = 1
  while (remaining > 0) {
    const count = Math.min(remaining, 20)
    batches.push({ start, end: start + count - 1, count })
    start += count
    remaining -= count
  }

  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
      <div className="p-3 border-b border-[#334155]">
        <h3 className="text-xs font-semibold text-[#94a3b8]">슬라이드 페이지 설정</h3>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="text-xs text-[#94a3b8] mb-2 block">총 생성 페이지 수</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChange(Math.max(1, totalPages - 5))}
              className="w-8 h-8 rounded-lg bg-[#334155] hover:bg-[#475569] flex items-center justify-center transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              value={totalPages}
              onChange={e => {
                const v = parseInt(e.target.value)
                if (v >= 1 && v <= 100) onChange(v)
              }}
              min={1}
              max={100}
              className="w-20 bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-1.5 text-center text-sm font-semibold focus:outline-none focus:border-[#3b82f6]"
            />
            <button
              onClick={() => onChange(Math.min(100, totalPages + 5))}
              className="w-8 h-8 rounded-lg bg-[#334155] hover:bg-[#475569] flex items-center justify-center transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
            <span className="text-xs text-[#64748b]">페이지</span>
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-lg p-3 border border-[#334155]">
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="w-3 h-3 text-[#3b82f6]" />
            <span className="text-[10px] font-medium text-[#3b82f6]">분기 렌더링 계획 (최대 20장/배치)</span>
          </div>
          <div className="space-y-1">
            {batches.map((b, i) => (
              <div key={i} className="flex items-center justify-between text-[10px]">
                <span className="text-[#94a3b8]">
                  FUNCTION_{String(i + 1).padStart(2, '0')}: 슬라이드 {b.start} ~ {b.end}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                  i === 0 ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                }`}>
                  {b.count}p
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-[#334155] text-[10px] text-[#64748b]">
            총 {batches.length}개 배치로 분기 실행 | 첫 배치 실행 후 순차 실행
          </div>
        </div>
      </div>
    </div>
  )
}
