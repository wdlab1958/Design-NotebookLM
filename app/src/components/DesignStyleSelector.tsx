import { designStyles } from '../data/designStyles'
import { useLang } from '../i18n/LanguageContext'

interface Props {
  selectedStyle: number | null
  onSelect: (id: number) => void
}

export default function DesignStyleSelector({ selectedStyle, onSelect }: Props) {
  const { lang, t } = useLang()

  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
      <div className="p-3 border-b border-[#334155]">
        <h3 className="text-xs font-semibold text-[#94a3b8]">{t.designStyle.title}</h3>
      </div>
      <div className="p-2 grid grid-cols-3 gap-1 max-h-[350px] overflow-y-auto">
        {designStyles.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`text-left p-2 rounded-lg text-xs transition-colors ${
              selectedStyle === s.id
                ? 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40'
                : 'hover:bg-[#334155] text-[#94a3b8]'
            }`}
          >
            <div className="font-medium text-[11px]">{lang === 'en' ? s.nameEn : s.name}</div>
            <div className="text-[9px] text-[#64748b] mt-0.5">
              {lang === 'en' ? s.descriptionEn : s.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
