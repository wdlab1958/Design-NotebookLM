import { BookOpen, Settings, Bell, Languages } from 'lucide-react'
import { useState } from 'react'
import SettingsModal from './SettingsModal'
import { useLang } from '../i18n/lang'
import { api, type HealthResult } from '../lib/api'

export default function Header() {
  const [showSettings, setShowSettings] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [health, setHealth] = useState<HealthResult | null>(null)
  const [healthErr, setHealthErr] = useState<string | null>(null)
  const { lang, setLang, t } = useLang()

  // Gap #14: 죽어있던 Bell 버튼을 실제 백엔드 상태 표시로 연결.
  const toggleStatus = async () => {
    const next = !showStatus
    setShowStatus(next)
    if (next) {
      setHealth(null); setHealthErr(null)
      try { setHealth(await api.health()) }
      catch (e) { setHealthErr(e instanceof Error ? e.message : String(e)) }
    }
  }

  return (
    <>
      <header className="h-14 bg-[#1e293b] border-b border-[#334155] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#3b82f6]" />
          <h1 className="text-sm font-semibold">{t.appTitle}</h1>
          <span className="text-[10px] bg-[#3b82f6]/20 text-[#3b82f6] px-2 py-0.5 rounded-full font-medium">
            v1.0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[#334155] transition-colors text-[#94a3b8] text-xs"
            title={t.langToggleTitle}
            aria-label={t.langToggleTitle}
          >
            <Languages className="w-4 h-4" />
            <span className="font-medium">{lang === 'ko' ? 'EN' : 'KO'}</span>
          </button>
          <div className="relative">
            <button
              onClick={toggleStatus}
              className="relative p-2 rounded-lg hover:bg-[#334155] transition-colors"
              title={t.apiStatus.title}
              aria-label={t.apiStatus.title}
            >
              <Bell className="w-4 h-4 text-[#94a3b8]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            </button>
            {showStatus && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0f172a] border border-[#334155] rounded-lg p-3 z-50 shadow-xl">
                <h3 className="text-xs font-semibold mb-2">{t.apiStatus.title}</h3>
                {!health && !healthErr && (
                  <p className="text-[10px] text-[#64748b]">{t.apiStatus.checking}</p>
                )}
                {healthErr && (
                  <p className="text-[10px] text-[#ef4444]">{t.apiStatus.offline}: {healthErr}</p>
                )}
                {health && (
                  <ul className="text-[10px] text-[#94a3b8] space-y-1">
                    <li className="text-[#22c55e]">● {t.apiStatus.online}</li>
                    <li>{t.apiStatus.categories}: {health.categories}</li>
                    <li>{t.apiStatus.designStyles}: {health.designStyles}</li>
                    <li>{t.apiStatus.totalPrompts}: {health.totalPrompts}</li>
                    <li>LLM: {health.llm.claude} / {health.llm.gemini}</li>
                  </ul>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-[#334155] transition-colors"
            title={t.settings.title}
            aria-label={t.settings.title}
          >
            <Settings className="w-4 h-4 text-[#94a3b8]" />
          </button>
        </div>
      </header>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
