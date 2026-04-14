import { useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'
import { categories, type Category } from '../data/categories'
import { useLang } from '../i18n/LanguageContext'

interface Props {
  selectedCategory: number | null
  onSelect: (cat: Category) => void
}

const groupKeys = ['business', 'tech', 'education', 'medical', 'science', 'art', 'social', 'industry', 'government', 'special'] as const
const groupRanges: [number, number][] = [
  [1, 10], [11, 28], [29, 38], [39, 48], [49, 58],
  [59, 68], [69, 78], [79, 88], [89, 98], [99, 108],
]

export default function CategorySelector({ selectedCategory, onSelect }: Props) {
  const [search, setSearch] = useState('')
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const { lang, t } = useLang()

  const getCatName = (cat: Category) => lang === 'en' ? cat.nameEn : cat.name

  const filteredCategories = search
    ? categories.filter(c => {
        const name = getCatName(c)
        return name.toLowerCase().includes(search.toLowerCase())
      })
    : categories

  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
      <div className="p-3 border-b border-[#334155]">
        <h3 className="text-xs font-semibold text-[#94a3b8] mb-2">{t.category.title}</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-[#64748b]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.category.searchPlaceholder}
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
                <span className="truncate">{getCatName(cat)}</span>
              </button>
            ))}
          </div>
        ) : (
          groupKeys.map((key, gi) => {
            const [start, end] = groupRanges[gi]
            const groupLabel = t.category.groups[key]
            return (
              <div key={key}>
                <button
                  onClick={() => setExpandedGroup(expandedGroup === key ? null : key)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#94a3b8] hover:bg-[#334155]/50 transition-colors"
                >
                  <span>{groupLabel}</span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${expandedGroup === key ? 'rotate-90' : ''}`} />
                </button>
                {expandedGroup === key && (
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
                        <span className="truncate">{getCatName(cat)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
