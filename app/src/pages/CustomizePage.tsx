import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Check, ChevronDown, ChevronUp, RefreshCw, Sparkles, Loader2, AlertTriangle, ClipboardCopy } from 'lucide-react'
import { useLang } from '../i18n/lang'
import { api, type GenConfig, type GenResult } from '../lib/api'
import { buildUnified } from '../lib/unified'

interface Config extends GenConfig {
  categoryName?: string
  categoryNameEn?: string
  designStyleName?: string
  designStyleNameEn?: string
}

function customBlock(customPrompt?: string): string {
  const c = (customPrompt || '').trim()
  if (!c) return ''
  return `\n\n[사용자 지정 추가 지시 (User Custom Instructions) — 최우선 반영]\n${c}`
}

// 백엔드 미연결 시 사용하는 로컬 폴백 생성기 (서버 lib/generate.mjs 와 동일 로직).
function localGenerate(config: Config): GenResult {
  const style = config.designStyleNameEn || 'Modern'
  const step1 = `업로드한 [이미지]의 디자인 스타일(전체 콘셉트, 컬러 HEX코드, 톤앤매너, 주요 도형 및 그래픽 특징)을 정밀하게 분석하십시오.

분석한 내용을 바탕으로, NotebookLM의 자동화 시스템 파라미터에 바로 붙여넣을 수 있는 [Adaptive Presentation Design System] 형식의 영문 프롬프트(English Prompt)를 작성하여 코드블록에 출력해 주십시오.

[Design Style Override: ${style}]

[출력 제한 및 필수 지시 조건]
1. 길이 제한: 생성되는 영문 프롬프트의 전체 길이는 공백을 포함하여 800자 이내로 엄격히 제한하십시오.
2. 형식 통제: 모든 이모지와 불필요한 서술어를 배제하고, AI가 명확히 인식할 수 있는 구조화된 명령어(Structured Command)로만 작성하십시오.
3. 단일 모드 강제: 컬러 HEX 코드는 라이트/다크 모드를 절대 혼용하지 마십시오. 원본 이미지의 지배적인 톤에 맞춰 단 1개의 배경색(BG), 1개의 텍스트색(Text), 1개의 포인트 컬러(Accent)로만 단일화하여 확정하십시오.

[반드시 다음 구조를 따르십시오]
1. Visual Identity: 분석된 테마 명칭, 단일 고대비 Hex 컬러 코드(BG/Text/Accent), 핵심 그래픽 요소 및 여백 활용법.
2. Dynamic Layout Rules: 콘텐츠 성격에 맞춰 적용할 수 있는 모듈형 레이아웃 규칙 정의.
   - Type A (Impact/Title): 대형 타이포그래피 중심의 시선 집중형 슬라이드
   - Type B (Content/Body): 가독성과 정보의 위계(Hierarchy)를 강조한 본문형 슬라이드
   - Type C (Data/Metrics): 차트, 데이터 시각화, 지표 강조에 최적화된 슬라이드
   - Type D (Structure/Diagram): 프로세스, 비교, 도식화 등을 위한 분할 화면(Split view) 슬라이드
3. Execution: 메인 JSON 시스템이 통제하는 '슬라이드 개수와 콘텐츠 경계'를 엄격히 준수할 것. 개별 슬라이드의 논리적 섹션에 맞춰 Type A~D 중 가장 대비와 시각적 위계가 높은 레이아웃을 배정할 것.${customBlock(config.customPrompt)}`

  const step2 = `# Role: Chief Content Architect
Task: Analyze ALL uploaded sources and generate a consistent ${config.totalPages}-page [Master Script Report].

## [Variables]
- Target Audience: <<<${config.targetAudience || ''}>>>
- Presentation Objective: <<<${config.presentationObjective || ''}>>>
- Category: ${config.categoryName || '일반'}
- Theme: ${config.promptText}

## Instruction Guidelines
1. 업로드된 모든 소스 문서의 핵심 팩트와 데이터를 통합하여 논리적 흐름(서론-본론-결론)을 구축하라.
2. 지정된 [Target Audience]의 수준과 관심사에 맞춘 전문적인 용어와 설득력 있는 문체를 사용하라.

## Output Format (Strictly Follow)
슬라이드 번호: (1~${config.totalPages})
제목: (해당 페이지의 핵심 헤드라인)
화면 텍스트: (핵심 데이터 및 키워드 3~4줄 요약)
상세 대본: (발표자가 읽을 구어체 설명 3~5줄)${customBlock(config.customPrompt)}`

  const batches: { start: number; end: number; idx: number }[] = []
  let remaining = config.totalPages
  let start = 1
  let idx = 1
  while (remaining > 0) {
    const count = Math.min(remaining, 20)
    batches.push({ start, end: start + count - 1, idx })
    start += count
    remaining -= count
    idx++
  }
  const designUrl = config.designRefUrl || 'https://www.behance.net/'
  const totalBatches = batches.length
  const extra = customBlock(config.customPrompt)
  const step3Batches = batches.map(b => {
    const isFirst = b.idx === 1
    const isLast = b.idx === totalBatches
    const count = b.end - b.start + 1
    const rules: string[] = []
    rules.push(`Source scope: Use ONLY the Master Script slides numbered ${b.start} through ${b.end} that were generated in Step 2 ("슬라이드 번호: ${b.start}" ~ "슬라이드 번호: ${b.end}"). IGNORE every Master Script slide outside this range — do not reference, summarize, paraphrase, or merge their content into this deck under any circumstance.`)
    rules.push(`Output count: Generate EXACTLY ${count} slides, mapped 1:1 to Master Script slides ${b.start}–${b.end}. Master Script "슬라이드 번호: N" becomes deck slide N. Carry over its 제목 as the slide title, 화면 텍스트 as the on-screen body, and 상세 대본 as the speaker notes — verbatim. DO NOT compress, summarize, or merge multiple Master Script slides into one output slide. DO NOT split one Master Script slide across multiple output slides.`)
    rules.push(`Apply the [Global Design System] (<<<${designUrl}>>>) and the Visual Identity / Dynamic Layout Rules from the Step 1 Adaptive Presentation Design System exactly to every slide — same colors, typography, spacing, layout types (A/B/C/D).`)
    if (!isFirst) rules.push(`DO NOT generate any cover, title, agenda, table-of-contents, or introduction slide. The deck must start IMMEDIATELY with body content corresponding to Master Script slide ${b.start}.`)
    if (!isLast) rules.push(`DO NOT generate any ending, thank-you, summary, conclusion, or closing slide. The deck must end with body content corresponding to Master Script slide ${b.end} — no wrap-up of any kind.`)
    if (isLast && totalBatches > 1) rules.push(`Place the SINGLE ending/closing slide at the position of Master Script slide ${b.end} only. Do not add any extra closing slide before or after.`)
    const header = totalBatches === 1
      ? `[Slide Rendering — Single Batch]\nRender exactly ${count} presentation slides corresponding 1:1 to the Master Script slides numbered ${b.start} through ${b.end} that were generated in Step 2.`
      : `[Slide Rendering — Batch ${b.idx} of ${totalBatches}]\nThis is one of ${totalBatches} sequential batches splitting a ${config.totalPages}-slide deck. Render exactly ${count} presentation slides corresponding 1:1 to the Master Script slides numbered ${b.start} through ${b.end} that were generated in Step 2. Run this batch as its OWN NotebookLM Studio generation — DO NOT combine it with other batches in the same chat message, or you will receive a duplicated summary instead of sequential content.`
    return `${header}\n\n[Global Design System]\n<<<${designUrl}>>>\n\n[Strict Rules]\n${rules.map((r, i) => `${i + 1}. ${r}`).join('\n\n')}${extra}`
  })

  return { step1, step2, step3Batches, batchCount: Math.max(1, totalBatches), ...buildUnified(config) }
}

// localStorage 에서 config 를 읽고 설정의 customPrompt 를 병합 (lazy init 용).
function loadConfig(): Config | null {
  const saved = localStorage.getItem('notebooklm_config')
  if (!saved) return null
  try {
    const cfg = JSON.parse(saved) as Config
    const s = JSON.parse(localStorage.getItem('notebooklm_settings') || '{}')
    if (s.customPrompt) cfg.customPrompt = s.customPrompt
    return cfg
  } catch { return null }
}

export default function CustomizePage() {
  const navigate = useNavigate()
  const { lang, t } = useLang()
  // Gap #15: useEffect 내부 동기 setState 대신 lazy initializer 사용.
  const [config] = useState<Config | null>(loadConfig)
  const [gen, setGen] = useState<GenResult | null>(null)
  const [source, setSource] = useState<'backend' | 'local' | null>(null)
  const [copiedStep, setCopiedStep] = useState<number | null>(null)
  // 통합(원클릭) 흐름이 기본이므로 레거시 단계 카드는 접힌 상태로 시작한다.
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(() => new Set())
  const [unifiedExpanded, setUnifiedExpanded] = useState(false)
  const [seqIndex, setSeqIndex] = useState(0)
  const [seqJustCopied, setSeqJustCopied] = useState(false)
  // AI 직접 생성 상태
  const [aiState, setAiState] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [aiText, setAiText] = useState('')
  const [aiErr, setAiErr] = useState('')

  useEffect(() => {
    if (!config) return
    // 백엔드에서 3단계 프롬프트 생성 (async — setState 는 콜백에서만). 실패 시 가시적 폴백.
    api.generate(config)
      // 구버전 백엔드(unified 미지원)와의 호환: 누락 시 공유 모듈로 로컬 보강
      .then(r => { setGen(r.unified ? r : { ...r, ...buildUnified(config) }); setSource('backend') })
      .catch(() => { setGen(localGenerate(config)); setSource('local') })
  }, [config])

  const handleCopy = async (text: string, step: number) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
      }
      setCopiedStep(step)
      setTimeout(() => setCopiedStep(null), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
      setCopiedStep(step)
      setTimeout(() => setCopiedStep(null), 2000)
    }
  }

  const toggleStep = (step: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      if (next.has(step)) next.delete(step); else next.add(step)
      return next
    })
  }

  // Gap #2: 저장된 API Key 로 Claude/Gemini 를 실제 호출하여 마스터 대본 생성.
  const runAiGenerate = async () => {
    if (!config) return
    const s = JSON.parse(localStorage.getItem('notebooklm_settings') || '{}')
    const provider: 'claude' | 'gemini' = s.claudeApiKey ? 'claude' : 'gemini'
    const apiKey = provider === 'claude' ? s.claudeApiKey : s.geminiApiKey
    setAiState('running'); setAiErr(''); setAiText('')
    try {
      const r = await api.llmGenerate(provider, apiKey || '', config)
      setAiText(r.text); setAiState('done')
    } catch (e) {
      setAiErr(e instanceof Error ? e.message : String(e)); setAiState('error')
    }
  }

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-sm text-[#64748b] mb-4">{t.customize.noConfig}</p>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-[#3b82f6] rounded-lg text-xs hover:bg-[#2563eb]">
          {t.customize.goBack}
        </button>
      </div>
    )
  }

  const getCatName = () => lang === 'en' ? (config.categoryNameEn || config.categoryName) : config.categoryName
  const getStyleName = () => lang === 'en' ? (config.designStyleNameEn || config.designStyleName) : config.designStyleName

  if (!gen) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-3">
        <Loader2 className="w-6 h-6 text-[#3b82f6] animate-spin" />
        <p className="text-sm text-[#64748b]">{t.customize.generating}</p>
      </div>
    )
  }

  const step1 = gen.step1
  const step2 = gen.step2
  const step3Batches = gen.step3Batches

  const stepData: { id: number; num: number; title: string; content: string; color: string }[] = [
    { id: 1, num: 1, title: t.customize.step1Title, content: step1, color: '#3b82f6' },
    { id: 2, num: 2, title: t.customize.step2Title, content: step2, color: '#22c55e' },
    ...step3Batches.map((batch, i) => ({
      id: 3 + i,
      num: 3,
      title: step3Batches.length === 1
        ? t.customize.step3Title
        : `${t.customize.step3Title} — ${t.customize.batchLabel} ${i + 1}/${step3Batches.length}`,
      content: batch,
      color: '#f59e0b',
    })),
  ]

  const seqContents = [step1, step2, ...step3Batches]

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Header */}
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-[#334155] transition-colors" aria-label={t.customize.goBack}>
            <ArrowLeft className="w-4 h-4 text-[#94a3b8]" />
          </button>
          <div>
            <h2 className="text-sm font-semibold">{t.customize.title}</h2>
            <p className="text-[10px] text-[#64748b]">
              {getCatName()} · {getStyleName()} · {config.totalPages}{t.customize.pagesSuffix}
              {source && <span className="ml-2 text-[#475569]">· {source === 'backend' ? t.customize.srcBackend : t.customize.srcLocal}</span>}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#334155] hover:bg-[#475569] text-xs transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          {t.customize.reconfigure}
        </button>
      </div>

      {source === 'local' && (
        <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl p-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
          <span className="text-[11px] text-[#f59e0b]">{t.customize.fallbackWarn}</span>
        </div>
      )}

      {/* Config Summary */}
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
        <h3 className="text-xs font-semibold text-[#94a3b8] mb-2">{t.customize.configSummary}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#0f172a] rounded-lg p-2.5 border border-[#334155]">
            <div className="text-[9px] text-[#64748b]">{t.customize.promptLabel}</div>
            <div className="text-[11px] font-medium mt-0.5 truncate">{config.promptText}</div>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-2.5 border border-[#334155]">
            <div className="text-[9px] text-[#64748b]">{t.customize.audienceLabel}</div>
            <div className="text-[11px] font-medium mt-0.5 truncate">{config.targetAudience}</div>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-2.5 border border-[#334155]">
            <div className="text-[9px] text-[#64748b]">{t.customize.objectiveLabel}</div>
            <div className="text-[11px] font-medium mt-0.5 truncate">{config.presentationObjective}</div>
          </div>
        </div>
      </div>

      {/* 통합 원클릭 복사 — NotebookLM 소스 1회 붙여넣기 흐름 (기본 권장) */}
      <div className="bg-[#0f172a] rounded-xl border-2 border-[#3b82f6] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#3b82f6] flex items-center gap-1.5">
              <ClipboardCopy className="w-4 h-4" /> {t.customize.unifiedTitle}
            </h3>
            <p className="text-[10px] text-[#94a3b8] mt-1">{t.customize.unifiedDesc}</p>
          </div>
          <button
            onClick={() => handleCopy(gen.unified, 500)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              copiedStep === 500 ? 'bg-[#22c55e] text-white' : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white'
            }`}
          >
            {copiedStep === 500 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedStep === 500 ? t.customize.unifiedCopied : t.customize.unifiedCopy}
          </button>
        </div>

        <ol className="mt-3 text-[10px] text-[#94a3b8] space-y-1 list-decimal list-inside bg-[#0b1220] rounded-lg p-3 border border-[#334155]">
          {t.customize.unifiedSteps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>

        {/* 배치별 Studio 실행 프롬프트 (짧은 맞춤설정용 — 개별 복사) */}
        <div className="mt-3">
          <div className="text-[10px] font-semibold text-[#94a3b8] mb-1.5">{t.customize.studioPromptsTitle}</div>
          <div className="space-y-1.5">
            {gen.studioPrompts.map((p, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#0b1220] rounded-lg p-2 border border-[#334155]">
                <span className="text-[10px] font-bold text-[#f59e0b] whitespace-nowrap">
                  {gen.studioPrompts.length === 1
                    ? t.customize.studioSingleLabel
                    : `${t.customize.batchLabel} ${i + 1}/${gen.studioPrompts.length}`}
                </span>
                <span className="text-[10px] text-[#64748b] flex-1 truncate">{p}</span>
                <button
                  onClick={() => handleCopy(p, 600 + i)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${
                    copiedStep === 600 + i ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#334155] hover:bg-[#475569] text-[#94a3b8]'
                  }`}
                >
                  {copiedStep === 600 + i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedStep === 600 + i ? t.customize.copied : t.customize.copy}
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setUnifiedExpanded(v => !v)}
          className="mt-3 flex items-center gap-1 text-[10px] text-[#64748b] hover:text-[#94a3b8] transition-colors"
        >
          {unifiedExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {unifiedExpanded ? t.customize.unifiedHide : t.customize.unifiedShow}
        </button>
        {unifiedExpanded && (
          <pre className="mt-2 bg-[#0b1220] rounded-lg p-4 text-[11px] leading-relaxed text-[#94a3b8] overflow-x-auto whitespace-pre-wrap border border-[#334155] max-h-[500px] overflow-y-auto">
            {gen.unified}
          </pre>
        )}
      </div>

      {/* AI 직접 생성 (Gap #2) */}
      <div className="bg-[#0f172a] rounded-xl border border-[#22c55e]/30 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-[#22c55e] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> {t.customize.aiTitle}
            </h3>
            <p className="text-[10px] text-[#64748b] mt-0.5">{t.customize.aiDesc}</p>
          </div>
          <button
            onClick={runAiGenerate}
            disabled={aiState === 'running'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-50 text-white text-xs font-semibold transition-colors"
          >
            {aiState === 'running' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {t.customize.aiRun}
          </button>
        </div>
        {aiState === 'error' && (
          <div className="mt-3 text-[11px] text-[#ef4444] flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {aiErr}
          </div>
        )}
        {aiState === 'done' && (
          <pre className="mt-3 bg-[#0b1220] rounded-lg p-3 text-[11px] leading-relaxed text-[#94a3b8] overflow-x-auto whitespace-pre-wrap border border-[#334155] max-h-[400px] overflow-y-auto">
            {aiText}
          </pre>
        )}
      </div>

      {/* Usage Guide */}
      <div className="bg-[#0f172a] rounded-xl border border-[#3b82f6]/30 p-4">
        <h3 className="text-xs font-semibold text-[#3b82f6] mb-2">{t.customize.usageTitle}</h3>
        <ol className="text-[10px] text-[#94a3b8] space-y-1 list-decimal list-inside">
          {t.customize.usageSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {/* 레거시: 채팅 기반 단계별 흐름 */}
      <div className="flex items-center gap-2 pt-2">
        <div className="h-px flex-1 bg-[#334155]" />
        <span className="text-[10px] text-[#64748b] whitespace-nowrap">{t.customize.legacyTitle}</span>
        <div className="h-px flex-1 bg-[#334155]" />
      </div>

      {/* Steps + Step 3 batches */}
      {stepData.map(step => (
        <div key={step.id} className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
          <div
            role="button"
            tabIndex={0}
            aria-expanded={expandedSteps.has(step.id)}
            onClick={() => toggleStep(step.id)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleStep(step.id) }}
            className="w-full flex items-center justify-between p-3 hover:bg-[#334155]/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: `${step.color}20`, color: step.color }}>
                {step.num}
              </div>
              <h3 className="text-xs font-semibold">{step.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={e => { e.stopPropagation(); handleCopy(step.content, step.id) }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                  copiedStep === step.id
                    ? 'bg-[#22c55e]/20 text-[#22c55e]'
                    : 'bg-[#334155] hover:bg-[#475569] text-[#94a3b8]'
                }`}
              >
                {copiedStep === step.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedStep === step.id ? t.customize.copied : t.customize.copy}
              </button>
              {expandedSteps.has(step.id)
                ? <ChevronUp className="w-4 h-4 text-[#64748b]" />
                : <ChevronDown className="w-4 h-4 text-[#64748b]" />
              }
            </div>
          </div>
          {expandedSteps.has(step.id) && (
            <div className="p-3 pt-0">
              <pre className="bg-[#0f172a] rounded-lg p-4 text-[11px] leading-relaxed text-[#94a3b8] overflow-x-auto whitespace-pre-wrap border border-[#334155] max-h-[500px] overflow-y-auto">
                {step.content}
              </pre>
            </div>
          )}
        </div>
      ))}

      {/* Sequential copy helper */}
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 flex items-center justify-between gap-4">
        <div className="text-xs text-[#94a3b8] flex-1">
          {t.customize.seqCopyDesc}
        </div>
        <button
          onClick={async () => {
            if (seqIndex >= seqContents.length) {
              setSeqIndex(0); setSeqJustCopied(false); return
            }
            await handleCopy(seqContents[seqIndex], 1000 + seqIndex)
            setSeqJustCopied(true)
            setSeqIndex(seqIndex + 1)
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            seqIndex >= seqContents.length
              ? 'bg-[#22c55e] text-white'
              : seqJustCopied
                ? 'bg-[#f59e0b] hover:bg-[#d97706] text-white'
                : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white'
          }`}
        >
          {seqIndex >= seqContents.length
            ? <Check className="w-3.5 h-3.5" />
            : <Copy className="w-3.5 h-3.5" />}
          {seqIndex >= seqContents.length
            ? t.customize.seqDone
            : seqJustCopied
              ? t.customize.seqJustCopied.replace('{n}', String(seqIndex)).replace('{total}', String(seqContents.length))
              : seqIndex === 0
                ? t.customize.seqStart.replace('{total}', String(seqContents.length))
                : t.customize.seqNext.replace('{n}', String(seqIndex + 1)).replace('{total}', String(seqContents.length))}
        </button>
      </div>
    </div>
  )
}
