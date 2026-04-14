import { useState } from 'react'
import { Eye } from 'lucide-react'
import { designStyles, type DesignStyle } from '../data/designStyles'
import { useLang } from '../i18n/LanguageContext'
import DesignStylePreviewModal from './DesignStylePreviewModal'

interface Props {
  selectedStyle: number | null
  onSelect: (id: number) => void
}

export default function DesignStyleSelector({ selectedStyle, onSelect }: Props) {
  const { lang, t } = useLang()
  const [previewStyle, setPreviewStyle] = useState<DesignStyle | null>(null)

  return (
    <>
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
        <div className="p-3 border-b border-[#334155]">
          <h3 className="text-xs font-semibold text-[#94a3b8]">{t.designStyle.title}</h3>
        </div>
        <div className="p-2 grid grid-cols-3 gap-1 max-h-[350px] overflow-y-auto">
          {designStyles.map(s => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`group relative text-left p-2 rounded-lg text-xs transition-colors ${
                selectedStyle === s.id
                  ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40'
                  : 'hover:bg-[#334155] text-[#94a3b8]'
              }`}
            >
              <div className="font-medium text-[11px]">{lang === 'en' ? s.nameEn : s.name}</div>
              <div className="text-[9px] text-[#64748b] mt-0.5">
                {lang === 'en' ? s.descriptionEn : s.description}
              </div>

              {/* Preview icon */}
              <div
                onClick={e => { e.stopPropagation(); setPreviewStyle(s) }}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded flex items-center justify-center bg-[#475569]/0 group-hover:bg-[#475569]/80 opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-[#3b82f6] hover:text-white"
                title={lang === 'en' ? 'Preview' : '미리보기'}
              >
                <Eye className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewStyle && (
        <DesignStylePreviewModal
          style={previewStyle}
          isSelected={selectedStyle === previewStyle.id}
          onSelect={onSelect}
          onClose={() => setPreviewStyle(null)}
        />
      )}
    </>
  )
}
