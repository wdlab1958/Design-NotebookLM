import { X, Key, Save } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Props {
  onClose: () => void
}

export default function SettingsModal({ onClose }: Props) {
  const [claudeKey, setClaudeKey] = useState('')
  const [geminiKey, setGeminiKey] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('notebooklm_settings')
    if (saved) {
      const s = JSON.parse(saved)
      setClaudeKey(s.claudeApiKey || '')
      setGeminiKey(s.geminiApiKey || '')
      setCustomPrompt(s.customPrompt || '')
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('notebooklm_settings', JSON.stringify({
      claudeApiKey: claudeKey,
      geminiApiKey: geminiKey,
      customPrompt,
    }))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] w-[520px] animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-[#334155]">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Key className="w-4 h-4 text-[#3b82f6]" />
            설정
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#334155]">
            <X className="w-4 h-4 text-[#94a3b8]" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#94a3b8] mb-1 block">Claude API Key</label>
            <input
              type="password"
              value={claudeKey}
              onChange={e => setClaudeKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3b82f6]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#94a3b8] mb-1 block">Gemini API Key</label>
            <input
              type="password"
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              placeholder="AIza..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3b82f6]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#94a3b8] mb-1 block">사용자 지정 프롬프트 (선택)</label>
            <textarea
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="추가로 반영하고 싶은 프롬프트를 입력하세요..."
              rows={3}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3b82f6] resize-none"
            />
          </div>
        </div>

        <div className="p-4 border-t border-[#334155] flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs rounded-lg bg-[#334155] hover:bg-[#475569] transition-colors">
            취소
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-xs rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] transition-colors flex items-center gap-1">
            <Save className="w-3 h-3" />
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
