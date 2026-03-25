import { LayoutDashboard, Palette, FileText, Wand2, BookOpen } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLang()

  const navItems = [
    { icon: LayoutDashboard, label: t.nav.home, path: '/' },
    { icon: Palette, label: t.nav.design, path: '/' },
    { icon: FileText, label: t.nav.prompt, path: '/customize' },
    { icon: Wand2, label: t.nav.generate, path: '/customize' },
    { icon: BookOpen, label: t.nav.notebookLM, path: '/customize' },
  ]

  return (
    <aside className="w-[72px] bg-[#1e293b] border-r border-[#334155] flex flex-col items-center py-4 gap-2 shrink-0">
      <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center mb-4">
        <BookOpen className="w-5 h-5 text-white" />
      </div>
      {navItems.map((item, i) => {
        const isActive = location.pathname === item.path && (i === 0 ? location.pathname === '/' : i > 1)
        return (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive
                ? 'bg-[#3b82f6]/20 text-[#3b82f6]'
                : 'text-[#94a3b8] hover:bg-[#334155]'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-[9px]">{item.label}</span>
          </button>
        )
      })}
    </aside>
  )
}
