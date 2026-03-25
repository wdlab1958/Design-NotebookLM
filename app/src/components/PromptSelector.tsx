import { FileText } from 'lucide-react'
import type { Category } from '../data/categories'

interface Props {
  category: Category | null
  selectedPrompt: string
  onSelect: (prompt: string) => void
}

export default function PromptSelector({ category, selectedPrompt, onSelect }: Props) {
  if (!category) {
    return (
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
        <FileText className="w-8 h-8 text-[#334155] mb-2" />
        <p className="text-xs text-[#64748b]">왼쪽에서 카테고리를 선택하면<br />10가지 프롬프트 샘플이 표시됩니다</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
      <div className="p-3 border-b border-[#334155]">
        <h3 className="text-xs font-semibold text-[#94a3b8]">
          {category.icon} {category.name} — 프롬프트 샘플 (10개)
        </h3>
      </div>
      <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto">
        {category.prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onSelect(p)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
              selectedPrompt === p
                ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40'
                : 'hover:bg-[#334155] text-[#94a3b8]'
            }`}
          >
            <span className="text-[#64748b] mr-2">{String(i + 1).padStart(2, '0')}.</span>
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
