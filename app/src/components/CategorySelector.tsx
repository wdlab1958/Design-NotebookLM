import { useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'
import { categories, type Category } from '../data/categories'

interface Props {
  selectedCategory: number | null
  onSelect: (cat: Category) => void
}

const groupLabels: Record<string, [number, number]> = {
  '비즈니스 & 경영': [1, 10],
  '기술 & IT': [11, 20],
  '교육 & 학술': [21, 30],
  '의료 & 건강': [31, 40],
  '과학 & 공학': [41, 50],
  '예술 & 디자인': [51, 60],
  '사회 & 인문': [61, 70],
  '산업 & 비즈니스': [71, 80],
  '정부 & 공공': [81, 90],
  '특수 & 기타': [91, 100],
}

export default function CategorySelector({ selectedCategory, onSelect }: Props) {
  const [search, setSearch] = useState('')
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const filteredCategories = search
    ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories

  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
      <div className="p-3 border-b border-[#334155]">
        <h3 className="text-xs font-semibold text-[#94a3b8] mb-2">카테고리 선택 (100개)</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-[#64748b]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="카테고리 검색..."
            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#3b82f6]"
          />
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {search ? (
          <div className="p-2 grid grid-cols-2 gap-1">
            {filteredCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onSelect(cat)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  selectedCategory === cat.id
                    ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40'
                    : 'hover:bg-[#334155] text-[#94a3b8]'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        ) : (
          Object.entries(groupLabels).map(([group, [start, end]]) => (
            <div key={group}>
              <button
                onClick={() => setExpandedGroup(expandedGroup === group ? null : group)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#94a3b8] hover:bg-[#334155]/50 transition-colors"
              >
                <span>{group}</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${expandedGroup === group ? 'rotate-90' : ''}`} />
              </button>
              {expandedGroup === group && (
                <div className="px-2 pb-2 grid grid-cols-2 gap-1">
                  {categories.filter(c => c.id >= start && c.id <= end).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => onSelect(cat)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors text-left ${
                        selectedCategory === cat.id
                          ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40'
                          : 'hover:bg-[#334155] text-[#94a3b8]'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
