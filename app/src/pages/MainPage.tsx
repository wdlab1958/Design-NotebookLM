import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import CategorySelector from '../components/CategorySelector'
import PromptSelector from '../components/PromptSelector'
import DesignStyleSelector from '../components/DesignStyleSelector'
import DesignRefPanel from '../components/DesignRefPanel'
import PageConfig from '../components/PageConfig'
import { categories, type Category } from '../data/categories'
import { designStyles } from '../data/designStyles'
import { useLang } from '../i18n/LanguageContext'

export default function MainPage() {
  const navigate = useNavigate()
  const { lang, t } = useLang()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [selectedStyleId, setSelectedStyleId] = useState<number | null>(null)
  const [designRefUrl, setDesignRefUrl] = useState('')
  const [totalPages, setTotalPages] = useState(30)
  const [targetAudience, setTargetAudience] = useState('')
  const [presentationObjective, setPresentationObjective] = useState('')

  const selectedCategory = selectedCategoryId
    ? categories.find(c => c.id === selectedCategoryId) || null
    : null

  const selectedStyle = selectedStyleId
    ? designStyles.find(s => s.id === selectedStyleId) || null
    : null

  const isReady = selectedCategoryId && selectedPrompt && selectedStyleId && targetAudience && presentationObjective

  const handleOpenNotebook = () => {
    const config = {
      categoryId: selectedCategoryId,
      categoryName: selectedCategory?.name,
      categoryNameEn: selectedCategory?.nameEn,
      promptText: selectedPrompt,
      designStyleId: selectedStyleId,
      designStyleName: selectedStyle?.name,
      designStyleNameEn: selectedStyle?.nameEn,
      designRefUrl,
      targetAudience,
      presentationObjective,
      totalPages,
    }
    localStorage.setItem('notebooklm_config', JSON.stringify(config))
    navigate('/customize')
  }

  const steps = [
    { label: t.main.steps.category, done: !!selectedCategoryId },
    { label: t.main.steps.prompt, done: !!selectedPrompt },
    { label: t.main.steps.designStructure, done: !!selectedStyleId },
    { label: t.main.steps.targetObjective, done: !!(targetAudience && presentationObjective) },
    { label: t.main.steps.pageSettings, done: totalPages > 0 },
  ]

  const getCatDisplayName = () => {
    if (!selectedCategory) return t.main.categoryNotSelected
    const name = lang === 'en' ? selectedCategory.nameEn : selectedCategory.name
    return `${selectedCategory.icon} ${name}`
  }

  const getStyleDisplayName = () => {
    if (!selectedStyle) return ''
    return lang === 'en' ? selectedStyle.nameEn : selectedStyle.name
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Progress bar */}
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">{t.main.configTitle}</h2>
          <span className="text-[10px] text-[#64748b]">
            {t.main.stepsCompleted(steps.filter(s => s.done).length, steps.length)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 flex-1">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${
                step.done
                  ? 'bg-[#22c55e]/20 text-[#22c55e]'
                  : 'bg-[#334155] text-[#64748b]'
              }`}>
                {step.done ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {step.label}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px ${step.done ? 'bg-[#22c55e]/40' : 'bg-[#334155]'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Row 1: Category + Prompts */}
      <div className="grid grid-cols-2 gap-4">
        <CategorySelector
          selectedCategory={selectedCategoryId}
          onSelect={(cat: Category) => {
            setSelectedCategoryId(cat.id)
            setSelectedPrompt('')
          }}
        />
        <PromptSelector
          category={selectedCategory}
          selectedPrompt={selectedPrompt}
          onSelect={setSelectedPrompt}
        />
      </div>

      {/* Row 2: Design Style + Design Ref */}
      <div className="grid grid-cols-2 gap-4">
        <DesignStyleSelector
          selectedStyle={selectedStyleId}
          onSelect={setSelectedStyleId}
        />
        <DesignRefPanel
          designRefUrl={designRefUrl}
          onChange={setDesignRefUrl}
        />
      </div>

      {/* Row 3: Audience/Objective + Page Config */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
          <div className="p-3 border-b border-[#334155]">
            <h3 className="text-xs font-semibold text-[#94a3b8]">{t.main.presentationSettings}</h3>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-[#94a3b8] mb-1 block">{t.main.targetAudience}</label>
              <input
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                placeholder={t.main.targetAudiencePlaceholder}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#94a3b8] mb-1 block">{t.main.presentationObjective}</label>
              <input
                value={presentationObjective}
                onChange={e => setPresentationObjective(e.target.value)}
                placeholder={t.main.presentationObjectivePlaceholder}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>
        </div>
        <PageConfig totalPages={totalPages} onChange={setTotalPages} />
      </div>

      {/* Summary + Action */}
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-[#94a3b8]">
              {t.main.selectionSummary} {getCatDisplayName()}
              {selectedStyle ? ` · ${getStyleDisplayName()}` : ''}
              {` · ${totalPages}p`}
            </div>
            {selectedPrompt && (
              <div className="text-[10px] text-[#64748b] max-w-xl truncate">{selectedPrompt}</div>
            )}
          </div>
          <button
            onClick={handleOpenNotebook}
            disabled={!isReady}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
              isReady
                ? 'bg-[#3b82f6] hover:bg-[#2563eb] text-white'
                : 'bg-[#334155] text-[#64748b] cursor-not-allowed'
            }`}
          >
            {t.main.openNotebook}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
