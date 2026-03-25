import { ExternalLink, Globe } from 'lucide-react'

interface Props {
  designRefUrl: string
  onChange: (url: string) => void
}

const refSites = [
  { name: 'Behance', url: 'https://www.behance.net/', desc: 'Adobe 디자인 포트폴리오 플랫폼' },
  { name: 'Dribbble', url: 'https://dribbble.com/', desc: '디자이너 커뮤니티 & 영감' },
  { name: '나노바나나', url: 'https://www.nanobanana.com/', desc: '프레젠테이션 디자인 전문' },
]

export default function DesignRefPanel({ designRefUrl, onChange }: Props) {
  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden">
      <div className="p-3 border-b border-[#334155]">
        <h3 className="text-xs font-semibold text-[#94a3b8]">디자인 참고 사이트</h3>
      </div>
      <div className="p-3 space-y-2">
        {refSites.map(site => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] hover:border-[#3b82f6]/40 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#64748b]" />
              <div>
                <div className="text-xs font-medium">{site.name}</div>
                <div className="text-[9px] text-[#64748b]">{site.desc}</div>
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-[#64748b] group-hover:text-[#3b82f6]" />
          </a>
        ))}

        <div className="mt-3">
          <label className="text-xs font-medium text-[#94a3b8] mb-1 block">
            디자인 참고 URL (Behance/Dribbble에서 선택 후 붙여넣기)
          </label>
          <input
            value={designRefUrl}
            onChange={e => onChange(e.target.value)}
            placeholder="https://www.behance.net/gallery/..."
            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#3b82f6]"
          />
        </div>
      </div>
    </div>
  )
}
