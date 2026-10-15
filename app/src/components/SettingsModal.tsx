import { X, Key, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useLang } from '../i18n/lang'
import { api } from '../lib/api'

interface Props {
  onClose: () => void
}

type TestState = { status: 'idle' | 'testing' | 'ok' | 'fail'; msg?: string }

function loadSettings() {
  try {
    const saved = localStorage.getItem('notebooklm_settings')
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return {}
}

export default function SettingsModal({ onClose }: Props) {
  const { t } = useLang()
  // Gap #15: useEffect+setState 대신 lazy initializer 사용.
  const initial = loadSettings()
  const [claudeKey, setClaudeKey] = useState<string>(initial.claudeApiKey || '')
  const [geminiKey, setGeminiKey] = useState<string>(initial.geminiApiKey || '')
  const [customPrompt, setCustomPrompt] = useState<string>(initial.customPrompt || '')
  const [claudeTest, setClaudeTest] = useState<TestState>({ status: 'idle' })
  const [geminiTest, setGeminiTest] = useState<TestState>({ status: 'idle' })

  const handleSave = () => {
    localStorage.setItem('notebooklm_settings', JSON.stringify({
      claudeApiKey: claudeKey,
      geminiApiKey: geminiKey,
      customPrompt,
    }))
    onClose()
  }

  // Gap #6: 실제 키 유효성 검증 (백엔드 /api/llm/validate).
  const testKey = async (provider: 'claude' | 'gemini') => {
    const key = provider === 'claude' ? claudeKey : geminiKey
    const setState = provider === 'claude' ? setClaudeTest : setGeminiTest
    setState({ status: 'testing' })
    try {
      const r = await api.validateKey(provider, key)
      setState({ status: 'ok', msg: r.model })
    } catch (e) {
      setState({ status: 'fail', msg: e instanceof Error ? e.message : String(e) })
    }
  }

  const renderTest = (s: TestState) => {
    if (s.status === 'idle') return null
    if (s.status === 'testing') return <span className="flex items-center gap-1 text-[10px] text-[#94a3b8]"><Loader2 className="w-3 h-3 animate-spin" />{t.settings.testing}</span>
    if (s.status === 'ok') return <span className="flex items-center gap-1 text-[10px] text-[#22c55e]"><CheckCircle2 className="w-3 h-3" />{t.settings.testOk} ({s.msg})</span>
    return <span className="flex items-center gap-1 text-[10px] text-[#ef4444]"><AlertCircle className="w-3 h-3" />{s.msg}</span>
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] w-[520px] animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-[#334155]">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Key className="w-4 h-4 text-[#3b82f6]" />
            {t.settings.title}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#334155]" aria-label={t.settings.cancel}>
            <X className="w-4 h-4 text-[#94a3b8]" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-[#94a3b8]">{t.settings.claudeApiKey}</label>
              <button
                onClick={() => testKey('claude')}
                disabled={!claudeKey || claudeTest.status === 'testing'}
                className="text-[10px] px-2 py-0.5 rounded bg-[#334155] hover:bg-[#475569] disabled:opacity-40 transition-colors"
              >
                {t.settings.testConnection}
              </button>
            </div>
            <input
              type="password"
              value={claudeKey}
              onChange={e => { setClaudeKey(e.target.value); setClaudeTest({ status: 'idle' }) }}
              placeholder="sk-ant-..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3b82f6]"
            />
            <div className="mt-1 h-4">{renderTest(claudeTest)}</div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-[#94a3b8]">{t.settings.geminiApiKey}</label>
              <button
                onClick={() => testKey('gemini')}
                disabled={!geminiKey || geminiTest.status === 'testing'}
                className="text-[10px] px-2 py-0.5 rounded bg-[#334155] hover:bg-[#475569] disabled:opacity-40 transition-colors"
              >
                {t.settings.testConnection}
              </button>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={e => { setGeminiKey(e.target.value); setGeminiTest({ status: 'idle' }) }}
              placeholder="AIza..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3b82f6]"
            />
            <div className="mt-1 h-4">{renderTest(geminiTest)}</div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#94a3b8] mb-1 block">{t.settings.customPromptLabel}</label>
            <textarea
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder={t.settings.customPromptPlaceholder}
              rows={3}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3b82f6] resize-none"
            />
          </div>
        </div>

        <div className="p-4 border-t border-[#334155] flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs rounded-lg bg-[#334155] hover:bg-[#475569] transition-colors">
            {t.settings.cancel}
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-xs rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] transition-colors flex items-center gap-1">
            <Save className="w-3 h-3" />
            {t.settings.save}
          </button>
        </div>
      </div>
    </div>
  )
}
