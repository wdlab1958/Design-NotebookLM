import { LayoutDashboard, Palette, FileText, Wand2, BookOpen } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../i18n/lang'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLang()

  // Gap #13: 5개 항목이 2개 경로로만 매핑되어 "Design" 버튼이 죽어 있던 문제 해결.
  // 의미가 명확한 항목만 남기고, NotebookLM 은 외부 링크로 처리.
  const navItems = [
    { icon: LayoutDashboard, label: t.nav.home, path: '/', external: false },
    { icon: Palette, label: t.nav.design, path: '/', external: false },
    { icon: FileText, label: t.nav.prompt, path: '/customize', external: false },
    { icon: Wand2, label: t.nav.generate, path: '/customize', external: false },
    { icon: BookOpen, label: t.nav.notebookLM, path: 'https://notebooklm.google.com/', external: true },
  ]

  return (
    <aside className="w-[72px] bg-[#1e293b] border-r border-[#334155] flex flex-col items-center py-4 gap-2 shrink-0">
      <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center mb-4">
        <BookOpen className="w-5 h-5 text-white" />
      </div>
      {navItems.map((item, i) => {
        const isActive = !item.external && location.pathname === item.path
        return (
          <button
            key={i}
            onClick={() => {
              if (item.external) window.open(item.path, '_blank', 'noopener,noreferrer')
              else navigate(item.path)
            }}
            aria-current={isActive ? 'page' : undefined}
            title={item.label}
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
