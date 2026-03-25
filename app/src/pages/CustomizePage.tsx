import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Check, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'

interface Config {
  categoryName?: string
  promptText: string
  designStyleName?: string
  designStyleNameEn?: string
  designRefUrl: string
  targetAudience: string
  presentationObjective: string
  totalPages: number
}

function generateStep1(config: Config): string {
  const style = config.designStyleNameEn || 'Modern'
  return `업로드한 [이미지]의 디자인 스타일(전체 콘셉트, 컬러 HEX코드, 톤앤매너, 주요 도형 및 그래픽 특징)을 정밀하게 분석하십시오.

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
3. Execution: 메인 JSON 시스템이 통제하는 '슬라이드 개수와 콘텐츠 경계'를 엄격히 준수할 것. 개별 슬라이드의 논리적 섹션에 맞춰 Type A~D 중 가장 대비와 시각적 위계가 높은 레이아웃을 배정할 것.`
}

function generateStep2(config: Config): string {
  return `# Role: Chief Content Architect
Task: Analyze ALL uploaded sources and generate a consistent ${config.totalPages}-page [Master Script Report].

## [Variables]
- Target Audience: <<<${config.targetAudience}>>>
- Presentation Objective: <<<${config.presentationObjective}>>>
- Category: ${config.categoryName || '일반'}
- Theme: ${config.promptText}

## Instruction Guidelines
1. 업로드된 모든 소스 문서의 핵심 팩트와 데이터를 통합하여 논리적 흐름(서론-본론-결론)을 구축하라.
2. 지정된 [Target Audience]의 수준과 관심사에 맞춘 전문적인 용어와 설득력 있는 문체를 사용하라.

## Output Format (Strictly Follow)
슬라이드 번호: (1~${config.totalPages})
제목: (해당 페이지의 핵심 헤드라인)
화면 텍스트: (핵심 데이터 및 키워드 3~4줄 요약)
상세 대본: (발표자가 읽을 구어체 설명 3~5줄)`
}

function generateStep3(config: Config): string {
  const batches: { start: number; end: number }[] = []
  let remaining = config.totalPages
  let start = 1
  while (remaining > 0) {
    const count = Math.min(remaining, 20)
    batches.push({ start, end: start + count - 1 })
    start += count
    remaining -= count
  }

  const designUrl = config.designRefUrl || 'https://www.behance.net/'

  const functions = batches.map((b, i) => {
    const isFirst = i === 0
    const isLast = i === batches.length - 1

    let steeringRules = `    1. Apply [Global Design System] exactly.
    2. Match Source content 1:1.`

    if (!isLast) {
      steeringRules += `
    3. RULE: DO NOT generate any ending/thank you slide at slide ${b.end}. End with body content.`
    }

    if (!isFirst) {
      steeringRules += `
    3. RULE: DO NOT generate a cover or title slide. Start immediately with slide ${b.start} body content.`
    }

    if (isLast) {
      steeringRules += `
    ${isFirst ? '3' : '4'}. Place the ONLY ending slide at slide ${b.end}.`
    }

    return `FUNCTION_${String(i + 1).padStart(2, '0')}_CALL_STUDIO() {
  target_data: "Source Script Slides ${b.start} to ${b.end}"
  deck_type: "presentation"
  length: "dynamic"
  user_steering_prompt: "
${steeringRules}
  "
}`
  })

  const waitComments = batches.slice(1).map((_, i) =>
    `\n// WAIT FOR FUNCTION_${String(i + 1).padStart(2, '0')} TO COMPLETE, THEN IMMEDIATELY EXECUTE FUNCTION_${String(i + 2).padStart(2, '0')}\n`
  )

  let executionBlock = functions[0]
  for (let i = 1; i < functions.length; i++) {
    executionBlock += waitComments[i - 1] + '\n' + functions[i]
  }

  return `[SYSTEM KERNEL OVERRIDE]
Role: API Execution Terminal
Task: Execute the following algorithmic sequence STRICTLY. Do not summarize, do not combine, do not output conversational text.

## [Global Design System]
<<<${designUrl}>>>

## EXECUTION_SCRIPT_RUN()
WARNING: Merging ${config.totalPages} slides into a single API call causes a FATAL_MEMORY_CRASH. You MUST execute the ${batches.length} functions below sequentially and independently.

${executionBlock}`
}

export default function CustomizePage() {
  const navigate = useNavigate()
  const [config, setConfig] = useState<Config | null>(null)
  const [copiedStep, setCopiedStep] = useState<number | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1, 2, 3]))

  useEffect(() => {
    const saved = localStorage.getItem('notebooklm_config')
    if (saved) {
      setConfig(JSON.parse(saved))
    }
  }, [])

  const handleCopy = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const toggleStep = (step: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      if (next.has(step)) next.delete(step)
      else next.add(step)
      return next
    })
  }

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-sm text-[#64748b] mb-4">설정된 구성이 없습니다. 먼저 메인 페이지에서 설정해주세요.</p>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-[#3b82f6] rounded-lg text-xs hover:bg-[#2563eb]">
          메인으로 돌아가기
        </button>
      </div>
    )
  }

  const step1 = generateStep1(config)
  const step2 = generateStep2(config)
  const step3 = generateStep3(config)

  const stepData = [
    { num: 1, title: '1단계: 슬라이드 영문 디자인 추출 프롬프트', content: step1, color: '#3b82f6' },
    { num: 2, title: '2단계: 마스터 대본 추출 프롬프트', content: step2, color: '#22c55e' },
    { num: 3, title: '3단계: 슬라이드 렌더링 프롬프트', content: step3, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Header */}
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-[#334155] transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#94a3b8]" />
          </button>
          <div>
            <h2 className="text-sm font-semibold">슬라이드 맞춤설정 프롬프트</h2>
            <p className="text-[10px] text-[#64748b]">
              {config.categoryName} · {config.designStyleName} · {config.totalPages}페이지
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#334155] hover:bg-[#475569] text-xs transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          다시 설정
        </button>
      </div>

      {/* Config Summary */}
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4">
        <h3 className="text-xs font-semibold text-[#94a3b8] mb-2">구성 요약</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#0f172a] rounded-lg p-2.5 border border-[#334155]">
            <div className="text-[9px] text-[#64748b]">프롬프트</div>
            <div className="text-[11px] font-medium mt-0.5 truncate">{config.promptText}</div>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-2.5 border border-[#334155]">
            <div className="text-[9px] text-[#64748b]">대상 청중</div>
            <div className="text-[11px] font-medium mt-0.5 truncate">{config.targetAudience}</div>
          </div>
          <div className="bg-[#0f172a] rounded-lg p-2.5 border border-[#334155]">
            <div className="text-[9px] text-[#64748b]">발표 목적</div>
            <div className="text-[11px] font-medium mt-0.5 truncate">{config.presentationObjective}</div>
          </div>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="bg-[#0f172a] rounded-xl border border-[#3b82f6]/30 p-4">
        <h3 className="text-xs font-semibold text-[#3b82f6] mb-2">사용 방법</h3>
        <ol className="text-[10px] text-[#94a3b8] space-y-1 list-decimal list-inside">
          <li>소스파일(대본 문서)을 NotebookLM의 소스로 업로드합니다.</li>
          <li>아래 1~3단계 프롬프트를 순서대로 채팅창에 붙여넣습니다.</li>
          <li>[Global Design System]의 URL은 Behance/Dribbble에서 선택한 디자인의 URL을 사용합니다.</li>
          <li>슬라이드 자료가 배치별로 순차 출력됩니다.</li>
        </ol>
      </div>

      {/* 3 Steps */}
      {stepData.map(step => (
        <div key={step.num} className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
          <button
            onClick={() => toggleStep(step.num)}
            className="w-full flex items-center justify-between p-3 hover:bg-[#334155]/30 transition-colors"
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
                onClick={e => { e.stopPropagation(); handleCopy(step.content, step.num) }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                  copiedStep === step.num
                    ? 'bg-[#22c55e]/20 text-[#22c55e]'
                    : 'bg-[#334155] hover:bg-[#475569] text-[#94a3b8]'
                }`}
              >
                {copiedStep === step.num ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedStep === step.num ? '복사됨' : '복사'}
              </button>
              {expandedSteps.has(step.num)
                ? <ChevronUp className="w-4 h-4 text-[#64748b]" />
                : <ChevronDown className="w-4 h-4 text-[#64748b]" />
              }
            </div>
          </button>
          {expandedSteps.has(step.num) && (
            <div className="p-3 pt-0">
              <pre className="bg-[#0f172a] rounded-lg p-4 text-[11px] leading-relaxed text-[#94a3b8] overflow-x-auto whitespace-pre-wrap border border-[#334155] max-h-[500px] overflow-y-auto">
                {step.content}
              </pre>
            </div>
          )}
        </div>
      ))}

      {/* All-in-one copy */}
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 flex items-center justify-between">
        <div className="text-xs text-[#94a3b8]">
          3개 단계 프롬프트를 한 번에 복사하여 NotebookLM에 붙여넣기
        </div>
        <button
          onClick={() => handleCopy(
            `=== 1단계 ===\n${step1}\n\n=== 2단계 ===\n${step2}\n\n=== 3단계 ===\n${step3}`,
            99
          )}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            copiedStep === 99
              ? 'bg-[#22c55e] text-white'
              : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white'
          }`}
        >
          {copiedStep === 99 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedStep === 99 ? '전체 복사 완료!' : '전체 복사'}
        </button>
      </div>
    </div>
  )
}
