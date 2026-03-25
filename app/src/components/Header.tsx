import { BookOpen, Settings, Bell, Languages } from 'lucide-react'
import { useState } from 'react'
import SettingsModal from './SettingsModal'
import { useLang } from '../i18n/LanguageContext'

export default function Header() {
  const [showSettings, setShowSettings] = useState(false)
  const { lang, setLang, t } = useLang()

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
            title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
          >
            <Languages className="w-4 h-4" />
            <span className="font-medium">{lang === 'ko' ? 'EN' : 'KO'}</span>
          </button>
          <button className="relative p-2 rounded-lg hover:bg-[#334155] transition-colors">
            <Bell className="w-4 h-4 text-[#94a3b8]" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-[#334155] transition-colors"
          >
            <Settings className="w-4 h-4 text-[#94a3b8]" />
          </button>
        </div>
      </header>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
