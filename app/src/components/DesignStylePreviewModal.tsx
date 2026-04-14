import { useState } from 'react'
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import type { DesignStyle } from '../data/designStyles'

interface Props {
  style: DesignStyle
  isSelected: boolean
  onSelect: (id: number) => void
  onClose: () => void
}

/* ================================================================
   Realistic slide-mockup previews for every 30 design styles.
   Each style renders TWO slides: a title slide + a content slide.
   ================================================================ */

function SlideSet({ id }: { id: number }) {
  const slides = getSlides(id)
  const [idx, setIdx] = useState(0)
  const cur = slides[idx]

  return (
    <div className="relative group/slides">
      <div
        className="w-full aspect-[16/9] rounded-lg overflow-hidden relative select-none"
        style={cur.containerStyle}
      >
        {cur.render}
      </div>
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setIdx(i => (i - 1 + slides.length) % slides.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover/slides:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setIdx(i => (i + 1) % slides.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover/slides:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface SlideData { containerStyle: React.CSSProperties; render: React.ReactNode }
const T = ({ w, h = 2, c = '#94a3b8', r = false, className = '' }: { w: string; h?: number; c?: string; r?: boolean; className?: string }) => (
  <div className={`rounded${r ? '-full' : ''} ${className}`} style={{ width: w, height: h, background: c }} />
)
const Dot = ({ c, s = 6 }: { c: string; s?: number }) => (
  <div className="rounded-full flex-shrink-0" style={{ width: s, height: s, background: c }} />
)

function getSlides(id: number): SlideData[] {
  switch (id) {
    case 1: return [
      { containerStyle: { background: '#ffffff' }, render: (
        <div className="absolute inset-0 flex flex-col justify-center items-center px-12">
          <T w="60%" h={5} c="#1e293b" className="mb-2" />
          <T w="40%" h={2} c="#94a3b8" className="mb-6" />
          <T w="30%" h={10} c="#f1f5f9" r className="flex items-center justify-center">
            <span className="text-[7px] text-[#64748b] font-medium absolute">시작하기</span>
          </T>
        </div>
      )},
      { containerStyle: { background: '#ffffff' }, render: (
        <div className="absolute inset-0 p-6 flex flex-col">
          <T w="35%" h={4} c="#1e293b" className="mb-1" />
          <T w="100%" h={1} c="#e2e8f0" className="mb-4" />
          <div className="flex-1 flex flex-col gap-3">
            {[90,80,70,85].map((w,i) => (
              <div key={i} className="flex items-start gap-2">
                <Dot c="#cbd5e1" s={5} />
                <div className="flex-1 flex flex-col gap-1"><T w={`${w}%`} h={2} c="#475569" /><T w={`${w-15}%`} h={1.5} c="#cbd5e1" /></div>
              </div>
            ))}
          </div>
          <div className="flex justify-end"><span className="text-[6px] text-[#cbd5e1]">03</span></div>
        </div>
      )},
    ]
    case 2: return [
      { containerStyle: { background: '#f8fafc' }, render: (
        <div className="absolute inset-0 flex flex-col">
          <div className="h-1 bg-[#1e40af]" />
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="flex items-center gap-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="1" fill="none" stroke="#1e40af" strokeWidth="1.5"/><line x1="2" y1="10" x2="18" y2="10" stroke="#1e40af" strokeWidth="0.7"/><line x1="10" y1="2" x2="10" y2="18" stroke="#1e40af" strokeWidth="0.7"/></svg>
              <T w="120px" h={5} c="#1e40af" />
            </div>
            <T w="55%" h={2} c="#64748b" className="mb-1" /><T w="45%" h={2} c="#94a3b8" />
          </div>
          <div className="h-6 bg-[#1e40af]/5 flex items-center px-4"><T w="60px" h={1.5} c="#1e40af" /></div>
        </div>
      )},
      { containerStyle: { background: '#f8fafc' }, render: (
        <div className="absolute inset-0 flex flex-col"><div className="h-1 bg-[#1e40af]" />
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3"><T w="30%" h={3.5} c="#1e40af" /><T w="40px" h={1.5} c="#94a3b8" /></div>
            <div className="flex-1 grid grid-cols-3 gap-3">
              {['SPEC-A','SPEC-B','SPEC-C'].map((label,i)=>(
                <div key={i} className="bg-white border border-[#dbeafe] rounded-lg p-2 flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="w-4 h-4 rounded bg-[#1e40af]/10 flex items-center justify-center"><span className="text-[5px] text-[#1e40af] font-bold">{i+1}</span></div>
                    <span className="text-[6px] font-bold text-[#1e40af]">{label}</span>
                  </div>
                  <div className="flex-1 border border-dashed border-[#93c5fd] rounded p-1.5 flex flex-col gap-1">
                    <T w="90%" h={1.5} c="#475569" /><T w="70%" h={1.5} c="#94a3b8" />
                    <div className="flex-1 flex items-end"><T w="100%" h={8} c="#dbeafe" /></div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1">
                    <div className="flex-1 h-1 bg-[#e2e8f0] rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#1e40af]" style={{width:`${60+i*15}%`}}/></div>
                    <span className="text-[5px] text-[#1e40af]">{60+i*15}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )},
    ]
    case 3: return [
      { containerStyle: { background: '#f0fdfa' }, render: (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="none" stroke="#0d9488" strokeWidth="1"/><circle cx="18" cy="18" r="10" fill="none" stroke="#0d9488" strokeWidth="0.7"/><circle cx="18" cy="18" r="3" fill="#0d9488"/><ellipse cx="18" cy="18" rx="15" ry="6" fill="none" stroke="#14b8a6" strokeWidth="0.6" transform="rotate(30 18 18)"/><ellipse cx="18" cy="18" rx="15" ry="6" fill="none" stroke="#14b8a6" strokeWidth="0.6" transform="rotate(-30 18 18)"/></svg>
          <T w="50%" h={5} c="#134e4a" className="mt-3 mb-1" /><T w="35%" h={2} c="#5eead4" />
        </div>
      )},
      { containerStyle: { background: '#f8fafc' }, render: (
        <div className="absolute inset-0 flex flex-col p-4">
          <T w="40%" h={3.5} c="#134e4a" className="mb-3" />
          <div className="flex-1 flex gap-3">
            <div className="flex-1 flex flex-col gap-2">
              <div className="bg-white border border-[#ccfbf1] rounded-lg p-2 flex-1 flex items-end gap-[3px]">
                {[35,52,40,68,55,72,48,80,62,90,70,58].map((h,i)=>(<div key={i} className="flex-1 rounded-t" style={{height:`${h}%`,background:`hsl(168,70%,${45+(i%3)*8}%)`}}/>))}
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1"><Dot c="#0d9488" s={4}/><span className="text-[5px] text-[#64748b]">Group A</span></div>
                <div className="flex items-center gap-1"><Dot c="#5eead4" s={4}/><span className="text-[5px] text-[#64748b]">Group B</span></div>
              </div>
            </div>
            <div className="w-[35%] flex flex-col gap-2">
              <div className="bg-white border border-[#ccfbf1] rounded-lg p-2 flex-1 flex items-center justify-center">
                <svg viewBox="0 0 50 50" width="52" height="52"><circle cx="25" cy="25" r="20" fill="none" stroke="#e2e8f0" strokeWidth="5"/><circle cx="25" cy="25" r="20" fill="none" stroke="#0d9488" strokeWidth="5" strokeDasharray="50 80" strokeLinecap="round"/><circle cx="25" cy="25" r="20" fill="none" stroke="#5eead4" strokeWidth="5" strokeDasharray="30 100" strokeDashoffset="-50" strokeLinecap="round"/><text x="25" y="27" textAnchor="middle" fill="#134e4a" fontSize="7" fontWeight="bold">68%</text></svg>
              </div>
              <div className="bg-white border border-[#ccfbf1] rounded-lg p-2">
                <span className="text-[5px] text-[#64748b] block mb-1">P-value</span>
                <T w="100%" h={2} c="#0d9488" />
                <div className="flex justify-between mt-1"><span className="text-[5px] text-[#0d9488] font-bold">0.003</span><span className="text-[5px] text-[#94a3b8]">{'< 0.05'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )},
    ]
    case 4: return [
      { containerStyle: { background: 'linear-gradient(135deg,#fef3c7,#fde68a,#fbbf24)' }, render: (
        <div className="absolute inset-0">
          <div className="absolute w-[120px] h-[120px] rounded-full opacity-20" style={{background:'radial-gradient(circle,#f97316,transparent)',top:'-20px',left:'-20px'}}/>
          <div className="absolute w-[80px] h-[80px] rounded-full opacity-15" style={{background:'radial-gradient(circle,#ef4444,transparent)',bottom:'10px',right:'20px'}}/>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10">
            <div className="text-[14px] font-black text-[#78350f] tracking-tight" style={{fontFamily:'Georgia,serif'}}>Artistry</div>
            <T w="40%" h={1.5} c="#92400e" className="mb-3" /><T w="55%" h={2} c="#78350f" /><T w="35%" h={1.5} c="#92400e80" className="mt-1" />
          </div>
        </div>
      )},
      { containerStyle: { background: 'linear-gradient(180deg,#fffbeb,#fef3c7)' }, render: (
        <div className="absolute inset-0 p-5">
          <T w="45%" h={4} c="#78350f" className="mb-4" />
          <div className="flex gap-4">
            <div className="w-[55%] flex flex-col gap-2.5">
              {[95,80,90,75].map((w,i)=>(
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-0.5 flex-shrink-0" style={{background:['#f59e0b','#f97316','#ef4444','#8b5cf6'][i]}}/>
                  <div className="flex-1"><T w={`${w}%`} h={2} c="#78350f"/><T w={`${w-20}%`} h={1.5} c="#92400e60" className="mt-0.5"/></div>
                </div>
              ))}
            </div>
            <div className="flex-1 rounded-xl overflow-hidden" style={{background:'linear-gradient(135deg,#fbbf2430,#f9731630,#ef444430)'}}>
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 50 50" width="55" height="55"><path d="M25 5 Q40 15 35 30 Q30 45 15 40 Q5 35 10 20 Q15 5 25 5Z" fill="none" stroke="#92400e" strokeWidth="1"/><circle cx="20" cy="22" r="6" fill="#fbbf2440"/><circle cx="30" cy="28" r="4" fill="#f9731630"/></svg>
              </div>
            </div>
          </div>
        </div>
      )},
    ]
    case 5: return [
      { containerStyle: { background: '#faf5ff' }, render: (
        <div className="absolute inset-0">
          <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-[#c084fc]/20"/>
          <div className="absolute bottom-6 left-10 w-16 h-16 rotate-45 bg-[#f472b6]/15 rounded-lg"/>
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <T w="20%" h={1.5} c="#c084fc" className="mb-2"/>
            <div className="text-[14px] font-black text-[#581c87] leading-tight mb-1">Creative</div>
            <div className="text-[14px] font-black text-[#7c3aed] leading-tight mb-3 ml-6">Thinking</div>
            <T w="45%" h={2} c="#a78bfa" className="ml-3"/>
          </div>
        </div>
      )},
      { containerStyle: { background: '#faf5ff' }, render: (
        <div className="absolute inset-0 p-5">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#c084fc]/8 rounded-bl-[60px]"/>
          <T w="35%" h={3.5} c="#581c87" className="mb-4"/>
          <div className="grid grid-cols-2 gap-3 relative z-10">
            {['#7c3aed','#c084fc','#f472b6','#a78bfa'].map((c,i)=>(
              <div key={i} className="rounded-2xl p-2.5 border" style={{borderColor:`${c}40`,background:`${c}08`}}>
                <div className="w-6 h-6 rounded-xl mb-1.5 flex items-center justify-center" style={{background:`${c}20`}}><span className="text-[7px] font-bold" style={{color:c}}>0{i+1}</span></div>
                <T w="85%" h={2} c={c}/><T w="65%" h={1.5} c={`${c}60`} className="mt-1"/>
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 6: return [
      { containerStyle: { background: '#ffffff' }, render: (<div className="absolute inset-0 flex items-center justify-center"><div className="text-[16px] font-light text-[#1e293b] tracking-[0.2em]">MINIMAL</div></div>) },
      { containerStyle: { background: '#ffffff' }, render: (
        <div className="absolute inset-0 flex">
          <div className="w-[45%] flex flex-col justify-center pl-8 pr-4"><T w="60%" h={3.5} c="#1e293b" className="mb-4"/><T w="90%" h={1.5} c="#94a3b8" className="mb-1"/><T w="80%" h={1.5} c="#94a3b8" className="mb-1"/><T w="70%" h={1.5} c="#94a3b8"/></div>
          <div className="flex-1 flex items-center justify-center"><div className="w-20 h-20 rounded-full border border-[#e2e8f0]"/></div>
        </div>
      )},
    ]
    case 7: return [
      { containerStyle: { background: 'linear-gradient(135deg,#1e293b,#334155)' }, render: (
        <div className="absolute inset-0 flex items-center px-8">
          <div className="flex-1"><T w="25%" h={1.5} c="#3b82f6" className="mb-2"/><T w="70%" h={5} c="#f8fafc" className="mb-1"/><T w="50%" h={5} c="#f8fafc" className="mb-3"/><T w="55%" h={2} c="#64748b" className="mb-4"/>
            <div className="w-[70px] h-[24px] rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center"><span className="text-[6px] text-white font-medium">Get Started →</span></div>
          </div>
          <div className="w-[35%] flex items-center justify-center"><div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] shadow-lg shadow-[#3b82f6]/20"/></div>
        </div>
      )},
      { containerStyle: { background: 'linear-gradient(135deg,#1e293b,#334155)' }, render: (
        <div className="absolute inset-0 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4"><T w="35%" h={3.5} c="#f8fafc"/><T w="50px" h={1.5} c="#64748b"/></div>
          <div className="flex-1 grid grid-cols-3 gap-2.5">
            {[0,1,2].map(i=>(
              <div key={i} className="rounded-xl p-3 flex flex-col" style={{background:i===1?'linear-gradient(135deg,#3b82f6,#8b5cf6)':'#1e293b',border:i!==1?'1px solid #334155':'none'}}>
                <div className="w-7 h-7 rounded-lg mb-2 flex items-center justify-center" style={{background:i===1?'rgba(255,255,255,0.2)':'#334155'}}><span className="text-[7px] font-bold" style={{color:i===1?'#fff':'#3b82f6'}}>✦</span></div>
                <T w="80%" h={2.5} c={i===1?'#ffffff':'#e2e8f0'} className="mb-1.5"/><T w="95%" h={1.5} c={i===1?'#ffffff90':'#64748b'} className="mb-0.5"/><T w="75%" h={1.5} c={i===1?'#ffffff60':'#475569'}/>
                <div className="mt-auto pt-2"><T w="50%" h={1.5} c={i===1?'#ffffffcc':'#3b82f6'}/></div>
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 8: return [
      { containerStyle: { background: '#fffbf0' }, render: (
        <div className="absolute inset-0 flex flex-col">
          <div className="mx-6 mt-4 mb-0 border-t-2 border-b border-[#8B6914]" style={{height:4}}/>
          <div className="flex-1 flex flex-col items-center justify-center px-10">
            <div className="text-[12px] font-bold text-[#3B1E08] tracking-wide" style={{fontFamily:'Georgia,serif'}}>Annual Report</div>
            <div className="text-[8px] text-[#8B6914] mt-1 tracking-widest uppercase">Fiscal Year 2025</div>
            <div className="w-16 h-[1px] bg-[#8B6914]/40 my-3"/><T w="55%" h={2} c="#5c3a0e80"/>
          </div>
          <div className="mx-6 mb-4 border-t border-b-2 border-[#8B6914]" style={{height:4}}/>
        </div>
      )},
      { containerStyle: { background: '#fffbf0' }, render: (
        <div className="absolute inset-0 p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-0.5"><span className="text-[6px] text-[#8B6914] tracking-widest uppercase">Chapter II</span><div className="flex-1 h-[0.5px] bg-[#8B6914]/30"/></div>
          <div className="text-[10px] font-bold text-[#3B1E08] mb-3" style={{fontFamily:'Georgia,serif'}}>Key Findings & Analysis</div>
          <div className="flex-1 flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              {[95,85,90,80].map((w,i)=>(
                <div key={i} className="flex gap-2 items-start"><span className="text-[6px] text-[#8B6914] font-bold mt-0.5">{i+1}.</span><div className="flex-1"><T w={`${w}%`} h={2} c="#3B1E08"/><T w={`${w-15}%`} h={1.5} c="#8B691480" className="mt-0.5"/></div></div>
              ))}
            </div>
            <div className="w-[35%] border border-[#8B6914]/20 rounded p-2 bg-[#8B6914]/5">
              <span className="text-[5px] text-[#8B6914] uppercase tracking-wider block mb-1.5">Highlight</span>
              <div className="text-[16px] font-bold text-[#3B1E08] leading-none" style={{fontFamily:'Georgia,serif'}}>42%</div>
              <T w="80%" h={1.5} c="#5c3a0e80" className="mt-1"/><T w="60%" h={1.5} c="#8B691460" className="mt-0.5"/>
            </div>
          </div>
        </div>
      )},
    ]
    case 9: return [
      { containerStyle: { background: '#020617' }, render: (
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'linear-gradient(#3b82f6 1px,transparent 1px),linear-gradient(90deg,#3b82f6 1px,transparent 1px)',backgroundSize:'16px 16px'}}/>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2"><div className="w-6 h-6 rounded border border-[#3b82f6]/50 flex items-center justify-center bg-[#3b82f6]/10"><span className="text-[8px] text-[#3b82f6]">⬡</span></div><div className="text-[14px] font-bold text-[#3b82f6]">TECH</div></div>
            <T w="45%" h={2} c="#06b6d4" className="mb-1"/><T w="35%" h={1.5} c="#0e7490"/>
          </div>
        </div>
      )},
      { containerStyle: { background: '#020617' }, render: (
        <div className="absolute inset-0 p-4">
          <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'linear-gradient(#3b82f6 1px,transparent 1px),linear-gradient(90deg,#3b82f6 1px,transparent 1px)',backgroundSize:'16px 16px'}}/>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3"><T w="30%" h={3.5} c="#e0f2fe"/><div className="flex-1"/><div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" style={{opacity:0.3+i*0.3}}/>)}</div></div>
            <div className="flex-1 grid grid-cols-4 gap-2">
              {['#3b82f6','#06b6d4','#8b5cf6','#22c55e'].map((c,i)=>(
                <div key={i} className="rounded-lg border p-2 flex flex-col" style={{borderColor:`${c}30`,background:`${c}08`}}>
                  <span className="text-[14px] font-bold mb-0.5" style={{color:c}}>{[98,2.4,15,99.9][i]}{['%','M','ms','%'][i]}</span>
                  <T w="90%" h={1.5} c={`${c}80`} className="mb-auto"/>
                  <div className="flex items-end gap-[2px] h-5 mt-1.5">{[30,50,40,70,55,80,65].map((h,j)=>(<div key={j} className="flex-1 rounded-t" style={{height:`${h}%`,background:`${c}50`}}/>))}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )},
    ]
    case 10: return [
      { containerStyle: { background: '#ffffff' }, render: (
        <div className="absolute inset-0 flex">
          <div className="w-[40%] bg-[#1e3a5f] flex flex-col items-center justify-center px-4"><div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-2"><span className="text-[10px] text-white font-bold">Co.</span></div><T w="70%" h={1.5} c="#ffffff60"/></div>
          <div className="flex-1 flex flex-col justify-center pl-6 pr-8"><T w="80%" h={5} c="#1e3a5f" className="mb-1"/><T w="60%" h={5} c="#1e3a5f" className="mb-3"/><T w="70%" h={2} c="#64748b" className="mb-1"/><T w="50%" h={2} c="#94a3b8"/></div>
        </div>
      )},
      { containerStyle: { background: '#ffffff' }, render: (
        <div className="absolute inset-0 flex flex-col"><div className="h-1.5 bg-[#1e3a5f]"/>
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3"><T w="35%" h={3.5} c="#1e3a5f"/><div className="flex gap-1 items-center"><div className="w-2 h-2 rounded-full bg-[#22c55e]"/><span className="text-[5px] text-[#64748b]">Q3 2025</span></div></div>
            <div className="flex-1 flex gap-3">
              <div className="flex-1 bg-[#f8fafc] rounded-lg p-2.5 border border-[#e2e8f0] flex items-end gap-[4px]">{[35,42,38,55,48,62,58,72,65,85,78,90].map((h,i)=>(<div key={i} className="flex-1 rounded-t" style={{height:`${h}%`,background:i>=8?'#1e3a5f':'#94a3b8'}}/>))}</div>
              <div className="w-[30%] flex flex-col gap-2">
                {[{v:'₩12.4B',l:'매출액',c:'#22c55e',d:'+18%'},{v:'₩3.2B',l:'영업이익',c:'#3b82f6',d:'+24%'},{v:'25.8%',l:'영업이익률',c:'#f59e0b',d:'+3.2p'}].map((item,i)=>(
                  <div key={i} className="bg-[#f8fafc] rounded-lg p-2 border border-[#e2e8f0]"><span className="text-[5px] text-[#64748b] block">{item.l}</span><div className="flex items-end gap-1"><span className="text-[9px] font-bold text-[#1e3a5f]">{item.v}</span><span className="text-[5px] font-bold" style={{color:item.c}}>{item.d}</span></div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )},
    ]
    case 11: return [
      { containerStyle: { background: '#ffffff' }, render: (
        <div className="absolute inset-0 p-4 flex flex-col items-center">
          <T w="40%" h={4} c="#1e293b" className="mb-1"/><T w="55%" h={2} c="#94a3b8" className="mb-4"/>
          <div className="flex gap-4 items-end">
            {[{pct:65,c:'#3b82f6',l:'Cat A'},{pct:82,c:'#22c55e',l:'Cat B'},{pct:45,c:'#f59e0b',l:'Cat C'},{pct:90,c:'#ef4444',l:'Cat D'}].map((d,i)=>(
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="relative w-10 h-10"><svg viewBox="0 0 36 36" className="w-full h-full -rotate-90"><circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4"/><circle cx="18" cy="18" r="14" fill="none" stroke={d.c} strokeWidth="4" strokeDasharray={`${d.pct*0.88} 100`} strokeLinecap="round"/></svg><span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold" style={{color:d.c}}>{d.pct}%</span></div>
                <span className="text-[5px] text-[#64748b]">{d.l}</span>
              </div>
            ))}
          </div>
        </div>
      )},
      { containerStyle: { background: '#ffffff' }, render: (
        <div className="absolute inset-0 p-4 flex flex-col"><T w="40%" h={3} c="#1e293b" className="mb-3"/>
          <div className="flex-1 flex flex-col gap-2">
            {[{n:'Step 01',w:85,c:'#3b82f6'},{n:'Step 02',w:70,c:'#8b5cf6'},{n:'Step 03',w:55,c:'#22c55e'},{n:'Step 04',w:40,c:'#f59e0b'}].map((s,i)=>(
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background:`${s.c}15`}}><span className="text-[6px] font-bold" style={{color:s.c}}>{i+1}</span></div>
                <div className="flex-1"><div className="flex items-center justify-between mb-0.5"><span className="text-[5px] font-bold" style={{color:s.c}}>{s.n}</span><span className="text-[5px] text-[#64748b]">{s.w}%</span></div><div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${s.w}%`,background:s.c}}/></div></div>
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 12: return [
      { containerStyle: { background: '#ffffff' }, render: (
        <div className="absolute inset-0 flex">
          <div className="w-[55%] bg-gradient-to-br from-[#374151] via-[#4b5563] to-[#1f2937] flex items-end p-4"><div className="text-[7px] text-white/40 font-light tracking-widest uppercase">Photography by Studio X</div></div>
          <div className="flex-1 flex flex-col justify-center px-4"><div className="w-8 h-[1px] bg-[#ef4444] mb-2"/><div className="text-[11px] font-black text-[#1e293b] leading-tight mb-1">The Future of</div><div className="text-[11px] font-black text-[#1e293b] leading-tight mb-2">Design</div><T w="90%" h={1.5} c="#64748b" className="mb-0.5"/><T w="80%" h={1.5} c="#94a3b8" className="mb-0.5"/><T w="60%" h={1.5} c="#94a3b8"/></div>
        </div>
      )},
      { containerStyle: { background: '#ffffff' }, render: (
        <div className="absolute inset-0 p-4 flex gap-3">
          <div className="w-[38%] flex flex-col"><div className="w-6 h-[1px] bg-[#ef4444] mb-1.5"/><T w="80%" h={3} c="#1e293b" className="mb-3"/><div className="flex-1 rounded-lg bg-gradient-to-br from-[#64748b] to-[#334155]"/></div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex-1 flex flex-col gap-1.5 justify-center">{Array(7).fill(0).map((_,i)=>(<T key={i} w={i===0?'90%':i<6?'100%':'65%'} h={1.5} c={i===0?'#1e293b':'#94a3b8'}/>))}</div>
            <div className="border-t border-[#e2e8f0] pt-2 flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-[#e2e8f0]"/><div><T w="60px" h={1.5} c="#1e293b"/><T w="40px" h={1} c="#94a3b8" className="mt-0.5"/></div></div>
          </div>
        </div>
      )},
    ]
    case 13: return [
      { containerStyle: { background: '#0f172a' }, render: (
        <div className="absolute inset-0 flex flex-col items-center justify-center"><div className="text-[15px] font-bold text-[#f8fafc] mb-1">Dark Mode</div><T w="40%" h={2} c="#475569" className="mb-4"/><div className="flex gap-3"><div className="px-4 py-1.5 rounded-lg bg-[#3b82f6] flex items-center justify-center"><span className="text-[6px] text-white font-medium">Primary</span></div><div className="px-4 py-1.5 rounded-lg border border-[#334155] flex items-center justify-center"><span className="text-[6px] text-[#94a3b8] font-medium">Secondary</span></div></div></div>
      )},
      { containerStyle: { background: '#0f172a' }, render: (
        <div className="absolute inset-0 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3"><T w="30%" h={3.5} c="#f8fafc"/><div className="flex gap-1.5">{['#3b82f6','#22c55e','#f59e0b'].map(c=><Dot key={c} c={c} s={4}/>)}</div></div>
          <div className="flex-1 grid grid-cols-2 gap-2.5">
            {[{t:'Users',v:'24.5K',d:'+12%',c:'#3b82f6'},{t:'Revenue',v:'₩8.2M',d:'+28%',c:'#22c55e'},{t:'Growth',v:'156%',d:'+45%',c:'#8b5cf6'},{t:'Retention',v:'94.2%',d:'+3.1%',c:'#f59e0b'}].map((card,i)=>(
              <div key={i} className="bg-[#1e293b] rounded-xl p-2.5 border border-[#334155] flex flex-col">
                <span className="text-[5px] text-[#64748b] mb-0.5">{card.t}</span>
                <div className="flex items-end gap-1 mb-1.5"><span className="text-[11px] font-bold text-[#f8fafc]">{card.v}</span><span className="text-[5px] font-bold mb-0.5" style={{color:card.c}}>{card.d}</span></div>
                <div className="flex-1 flex items-end gap-[2px]">{[25,40,35,55,50,65,60,75,70,85].map((h,j)=>(<div key={j} className="flex-1 rounded-t" style={{height:`${h}%`,background:j>=7?card.c:`${card.c}30`}}/>))}</div>
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 14: return [
      { containerStyle: { background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#d946ef)' }, render: (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/15 backdrop-blur-sm rounded-3xl px-10 py-6 border border-white/20 flex flex-col items-center"><div className="text-[14px] font-bold text-white mb-1">Gradient</div><T w="80px" h={2} c="rgba(255,255,255,0.5)" className="mb-3"/><div className="px-4 py-1.5 rounded-full bg-white/20 border border-white/30"><span className="text-[6px] text-white font-medium">Explore →</span></div></div>
        </div>
      )},
      { containerStyle: { background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#d946ef)' }, render: (
        <div className="absolute inset-0 p-5 flex flex-col"><T w="35%" h={3.5} c="white" className="mb-4"/>
          <div className="flex-1 grid grid-cols-3 gap-2.5">
            {[0,1,2].map(i=>(
              <div key={i} className="rounded-2xl p-3 flex flex-col items-center border border-white/20" style={{background:'rgba(255,255,255,0.12)',backdropFilter:'blur(10px)'}}>
                <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center mb-2 bg-white/10"><span className="text-[10px]">{['✦','◈','❖'][i]}</span></div>
                <T w="80%" h={2} c="white" className="mb-1"/><T w="90%" h={1.5} c="rgba(255,255,255,0.5)" className="mb-0.5"/><T w="70%" h={1.5} c="rgba(255,255,255,0.3)"/>
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 15: return [
      { containerStyle: { background: 'linear-gradient(180deg,#e0e7ff,#c7d2fe)' }, render: (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5]" style={{transform:'perspective(400px) rotateY(-20deg) rotateX(10deg)',boxShadow:'12px 12px 30px rgba(99,102,241,0.35)'}}/>
          <div className="ml-6 flex flex-col gap-1"><T w="90px" h={5} c="#312e81"/><T w="70px" h={2} c="#6366f1"/></div>
        </div>
      )},
      { containerStyle: { background: 'linear-gradient(180deg,#e0e7ff,#c7d2fe)' }, render: (
        <div className="absolute inset-0 p-5 flex flex-col"><T w="35%" h={3.5} c="#312e81" className="mb-4"/>
          <div className="flex-1 flex gap-3 items-center">
            {[0,1,2].map(i=>(
              <div key={i} className="flex-1 rounded-xl p-3 flex flex-col items-center bg-white" style={{transform:`perspective(400px) rotateY(${(i-1)*5}deg)`,boxShadow:'0 8px 24px rgba(99,102,241,0.15)'}}>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br mb-2" style={{background:['linear-gradient(135deg,#6366f1,#818cf8)','linear-gradient(135deg,#8b5cf6,#a78bfa)','linear-gradient(135deg,#6366f1,#4f46e5)'][i],boxShadow:'0 4px 12px rgba(99,102,241,0.3)'}}/>
                <T w="80%" h={2} c="#312e81" className="mb-1"/><T w="90%" h={1.5} c="#6366f180" className="mb-0.5"/><T w="70%" h={1.5} c="#6366f150"/>
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 16: return [
      { containerStyle: { background: '#ecfdf5' }, render: (
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          <div className="grid grid-cols-2 gap-2"><div className="w-12 h-12 rounded-xl bg-[#22c55e]"/><div className="w-12 h-12 rounded-full bg-[#f59e0b]"/><div className="w-12 h-12 bg-[#3b82f6]" style={{clipPath:'polygon(50% 0%,100% 100%,0% 100%)'}}/><div className="w-12 h-12 rounded-xl bg-[#ef4444] rotate-45"/></div>
          <div className="flex flex-col gap-1"><T w="90px" h={4} c="#166534"/><T w="70px" h={2} c="#16a34a"/></div>
        </div>
      )},
      { containerStyle: { background: '#f0fdf4' }, render: (
        <div className="absolute inset-0 p-4 flex flex-col"><T w="35%" h={3} c="#166534" className="mb-3"/>
          <div className="flex-1 grid grid-cols-4 gap-2">
            {[{c:'#22c55e',ic:'■',l:'Design'},{c:'#3b82f6',ic:'●',l:'Develop'},{c:'#f59e0b',ic:'▲',l:'Test'},{c:'#ef4444',ic:'◆',l:'Deploy'}].map((item,i)=>(
              <div key={i} className="rounded-xl p-2 flex flex-col items-center" style={{background:item.c}}>
                <span className="text-[14px] text-white/80 mb-1">{item.ic}</span><span className="text-[6px] text-white font-bold mb-1">{item.l}</span>
                <T w="80%" h={1.5} c="rgba(255,255,255,0.5)" className="mb-0.5"/><T w="60%" h={1.5} c="rgba(255,255,255,0.3)"/>
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 17: return [
      { containerStyle: { background: '#e2e8f0' }, render: (
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{background:'#e2e8f0',boxShadow:'8px 8px 16px #b8bec7,-8px -8px 16px #ffffff'}}><span className="text-[20px] text-[#64748b]">☉</span></div>
          <div className="flex flex-col gap-2"><T w="90px" h={4} c="#475569"/><T w="70px" h={2} c="#94a3b8"/></div>
        </div>
      )},
      { containerStyle: { background: '#e2e8f0' }, render: (
        <div className="absolute inset-0 p-5 flex flex-col"><T w="35%" h={3.5} c="#475569" className="mb-4"/>
          <div className="flex-1 grid grid-cols-3 gap-3">
            {[0,1,2].map(i=>(
              <div key={i} className="rounded-2xl p-3 flex flex-col items-center" style={{background:'#e2e8f0',boxShadow:i===1?'inset 4px 4px 8px #b8bec7,inset -4px -4px 8px #ffffff':'6px 6px 12px #b8bec7,-6px -6px 12px #ffffff'}}>
                <div className="w-8 h-8 rounded-xl mb-2 flex items-center justify-center" style={{background:'#e2e8f0',boxShadow:i===1?'3px 3px 6px #b8bec7,-3px -3px 6px #ffffff':'inset 3px 3px 6px #b8bec7,inset -3px -3px 6px #ffffff'}}><span className="text-[8px] text-[#64748b]">{['◇','○','□'][i]}</span></div>
                <T w="80%" h={2} c="#475569" className="mb-1"/><T w="65%" h={1.5} c="#94a3b8"/>
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 18: return [
      { containerStyle: { background: '#fef3c7' }, render: (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[14px] font-black text-[#92400e] tracking-wider mb-1" style={{fontFamily:'Impact,sans-serif'}}>RETRO</div>
          <div className="flex gap-2 mb-3">{['#dc2626','#ea580c','#ca8a04','#166534','#1e40af'].map(c=>(<div key={c} className="w-5 h-5 rounded-full" style={{background:c}}/>))}</div>
          <div className="border-2 border-[#92400e] rounded-full px-4 py-1"><span className="text-[6px] text-[#92400e] font-bold tracking-widest uppercase">Since 1970</span></div>
        </div>
      )},
      { containerStyle: { background: '#fef3c7' }, render: (
        <div className="absolute inset-0 p-4 flex flex-col">
          <div className="border-b-2 border-[#92400e] pb-1 mb-3"><div className="text-[9px] font-black text-[#92400e]" style={{fontFamily:'Impact,sans-serif'}}>GROOVY INSIGHTS</div></div>
          <div className="flex-1 flex gap-3">
            <div className="flex-1 flex flex-col gap-2">
              {[{c:'#dc2626',l:'Disco',w:80},{c:'#ea580c',l:'Funk',w:65},{c:'#ca8a04',l:'Soul',w:90}].map((item,i)=>(
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center" style={{borderColor:item.c}}><span className="text-[6px] font-bold" style={{color:item.c}}>{i+1}</span></div>
                  <div className="flex-1"><div className="flex items-center justify-between"><span className="text-[5px] font-bold text-[#92400e]">{item.l}</span><span className="text-[5px] text-[#92400e]">{item.w}%</span></div><div className="w-full h-2.5 bg-[#fde68a] rounded-full overflow-hidden mt-0.5"><div className="h-full rounded-full" style={{width:`${item.w}%`,background:item.c}}/></div></div>
                </div>
              ))}
            </div>
            <div className="w-[35%] rounded-lg border-2 border-dashed border-[#92400e] p-2 flex flex-col items-center justify-center"><span className="text-[18px] font-black text-[#92400e]">78%</span><T w="80%" h={1.5} c="#92400e80"/></div>
          </div>
        </div>
      )},
    ]
    case 19: return [
      { containerStyle: { background: '#020617' }, render: (
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 50% 120%,rgba(6,182,212,0.15) 0%,transparent 60%)'}}/>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[14px] font-black tracking-[0.3em]" style={{background:'linear-gradient(90deg,#06b6d4,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>FUTURE</div>
            <T w="35%" h={1.5} c="#06b6d440" className="mt-2"/>
            <div className="flex gap-1 mt-4">{[0,1,2,3,4,5,6].map(i=><div key={i} className="w-[3px] h-4 rounded-full" style={{background:`rgba(6,182,212,${0.15+i*0.12})`}}/>)}</div>
          </div>
        </div>
      )},
      { containerStyle: { background: '#020617' }, render: (
        <div className="absolute inset-0 p-4">
          <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 80% 20%,rgba(139,92,246,0.08) 0%,transparent 50%)'}}/>
          <div className="relative z-10 flex flex-col h-full"><T w="35%" h={3.5} c="#06b6d4" className="mb-3"/>
            <div className="flex-1 flex gap-3">
              {[0,1,2].map(i=>(
                <div key={i} className="flex-1 rounded-lg border p-2.5 flex flex-col" style={{borderColor:`rgba(6,182,212,${0.15+i*0.1})`,background:`rgba(6,182,212,${0.03+i*0.02})`}}>
                  <div className="flex items-center gap-1 mb-2"><div className="w-1.5 h-1.5 rounded-full" style={{background:'#06b6d4',boxShadow:'0 0 6px #06b6d4'}}/><span className="text-[5px] text-[#06b6d4] font-mono">SYS.0{i+1}</span></div>
                  <div className="text-[12px] font-bold mb-1" style={{background:'linear-gradient(90deg,#06b6d4,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{['99.9%','< 1ms','∞'][i]}</div>
                  <T w="85%" h={1.5} c="#06b6d450" className="mb-0.5"/><T w="65%" h={1.5} c="#06b6d430"/>
                  <div className="flex-1"/>
                  <div className="h-3 flex items-end gap-[1px]">{Array(12).fill(0).map((_,j)=>(<div key={j} className="flex-1 rounded-t" style={{height:`${20+Math.sin(j*0.8+i)*40+40}%`,background:`rgba(6,182,212,${0.2+j*0.06})`}}/>))}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )},
    ]
    case 20: return [
      { containerStyle: { background: 'linear-gradient(180deg,#ecfdf5,#d1fae5)' }, render: (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 80 80" width="80" height="80" className="absolute opacity-20"><path d="M40 5 Q65 15 60 40 Q55 65 30 60 Q5 55 15 35 Q25 10 40 5Z" fill="#10b981"/></svg>
          <div className="relative flex flex-col items-center"><div className="text-[13px] font-bold text-[#065f46]">Organic</div><T w="60px" h={2} c="#34d399" className="mt-1"/></div>
        </div>
      )},
      { containerStyle: { background: 'linear-gradient(180deg,#f0fdf4,#ecfdf5)' }, render: (
        <div className="absolute inset-0 p-5 flex flex-col"><T w="35%" h={3.5} c="#065f46" className="mb-4"/>
          <div className="flex-1 flex gap-3">
            {[0,1,2].map(i=>(
              <div key={i} className="flex-1 rounded-[20px] p-3 flex flex-col items-center" style={{background:`hsl(${152+i*10},${60-i*5}%,${95-i*3}%)`,border:`1px solid hsl(${152+i*10},40%,85%)`}}>
                <div className="w-10 h-10 rounded-full mb-2 flex items-center justify-center" style={{background:`hsl(${152+i*10},60%,70%)`}}><span className="text-white text-[10px]">{['🌿','💧','☀'][i]}</span></div>
                <T w="80%" h={2} c="#065f46" className="mb-1"/><T w="90%" h={1.5} c="#065f4660" className="mb-0.5"/><T w="70%" h={1.5} c="#065f4640"/>
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 21: return [
      { containerStyle: { background: '#f8fafc' }, render: (
        <div className="absolute inset-0"><div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'repeating-linear-gradient(60deg,#6366f1 0,#6366f1 1px,transparent 1px,transparent 24px),repeating-linear-gradient(-60deg,#6366f1 0,#6366f1 1px,transparent 1px,transparent 24px)'}}/>
          <div className="absolute inset-0 flex items-center justify-center gap-5">
            <div className="grid grid-cols-2 gap-2"><div className="w-10 h-10" style={{clipPath:'polygon(50% 0,100% 100%,0 100%)',background:'#6366f1'}}/><div className="w-10 h-10 rotate-45 bg-[#8b5cf6]"/><div className="w-10 h-10 rounded-full bg-[#a78bfa]"/><div className="w-10 h-10" style={{clipPath:'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)',background:'#c4b5fd'}}/></div>
            <div className="flex flex-col gap-1"><T w="100px" h={5} c="#312e81"/><T w="70px" h={2} c="#6366f1"/></div>
          </div>
        </div>
      )},
      { containerStyle: { background: '#f8fafc' }, render: (
        <div className="absolute inset-0 p-4 flex flex-col"><T w="35%" h={3.5} c="#312e81" className="mb-3 relative z-10"/>
          <div className="flex-1 flex gap-2 relative z-10">
            {[0,1,2,3].map(i=>(
              <div key={i} className="flex-1 bg-white/90 rounded-xl p-2 border border-[#e0e7ff] flex flex-col"><span className="text-[7px] font-bold text-[#6366f1] mb-1">0{i+1}</span><T w="90%" h={2} c="#312e81" className="mb-1"/><T w="80%" h={1.5} c="#6366f180" className="mb-0.5"/><T w="60%" h={1.5} c="#6366f150"/></div>
            ))}
          </div>
        </div>
      )},
    ]
    case 22: return [
      { containerStyle: { background: '#1e293b' }, render: (<div className="absolute inset-0 flex flex-col justify-center px-6"><div className="text-[18px] font-black text-white leading-none">Typography</div><div className="text-[18px] font-black text-white/40 leading-none">Is Power</div><div className="w-10 h-[2px] bg-[#3b82f6] mt-3"/></div>) },
      { containerStyle: { background: '#1e293b' }, render: (
        <div className="absolute inset-0 flex flex-col p-5"><div className="text-[10px] font-black text-white leading-tight mb-4">Key Metrics That<br/>Drive Growth</div>
          <div className="flex-1 flex flex-col justify-end gap-2">
            {[{l:'ENGAGEMENT',v:'94%',c:'#3b82f6'},{l:'CONVERSION',v:'3.2×',c:'#22c55e'},{l:'RETENTION',v:'87%',c:'#f59e0b'}].map((item,i)=>(
              <div key={i} className="flex items-end justify-between border-b border-[#334155] pb-1.5"><span className="text-[6px] text-[#64748b] tracking-widest">{item.l}</span><span className="text-[14px] font-black" style={{color:item.c}}>{item.v}</span></div>
            ))}
          </div>
        </div>
      )},
    ]
    case 23: return [
      { containerStyle: { background: '#000' }, render: (
        <div className="absolute inset-0"><div className="absolute inset-0 bg-gradient-to-br from-[#374151] via-[#4b5563] to-[#1f2937]"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
          <div className="absolute bottom-0 left-0 right-0 p-5"><T w="25%" h={1.5} c="#ffffff60" className="mb-1"/><div className="text-[12px] font-bold text-white leading-tight">Visual Storytelling</div><T w="55%" h={2} c="#ffffff80" className="mt-1"/></div>
        </div>
      )},
      { containerStyle: { background: '#000' }, render: (
        <div className="absolute inset-0 flex"><div className="w-[60%] bg-gradient-to-br from-[#475569] via-[#64748b] to-[#334155] relative"><div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40"/></div>
          <div className="flex-1 bg-[#111] flex flex-col justify-center px-4"><T w="60%" h={3} c="#f8fafc" className="mb-2"/><T w="95%" h={1.5} c="#94a3b8" className="mb-0.5"/><T w="85%" h={1.5} c="#94a3b8" className="mb-0.5"/><T w="70%" h={1.5} c="#64748b" className="mb-3"/><div className="flex gap-2"><div className="px-3 py-1 rounded bg-white"><span className="text-[5px] text-black font-bold">Details</span></div><div className="px-3 py-1 rounded border border-[#475569]"><span className="text-[5px] text-[#94a3b8]">Next →</span></div></div></div>
        </div>
      )},
    ]
    case 24: return [
      { containerStyle: { background: '#fef2f2' }, render: (
        <div className="absolute inset-0 flex items-center justify-center gap-5">
          <svg viewBox="0 0 80 80" width="70" height="70"><circle cx="40" cy="25" r="14" fill="#fca5a5"/><rect x="26" y="38" width="28" height="30" rx="6" fill="#f87171"/><circle cx="30" cy="25" r="3" fill="#1e293b"/><circle cx="50" cy="25" r="3" fill="#1e293b"/><path d="M36 32 Q40 36 44 32" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <div className="flex flex-col gap-1"><T w="90px" h={4} c="#991b1b"/><T w="65px" h={2} c="#f8717180"/></div>
        </div>
      )},
      { containerStyle: { background: '#fef2f2' }, render: (
        <div className="absolute inset-0 p-4 flex gap-4">
          <div className="flex-1 flex flex-col"><T w="50%" h={3.5} c="#991b1b" className="mb-3"/>
            <div className="flex-1 flex flex-col gap-2">
              {[0,1,2].map(i=>(
                <div key={i} className="flex items-center gap-2 bg-white rounded-xl p-2 border border-[#fecaca]">
                  <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" fill={['#fca5a5','#fdba74','#fde68a'][i]}/><circle cx="9" cy="10" r="1.5" fill="#1e293b"/><circle cx="15" cy="10" r="1.5" fill="#1e293b"/><path d={`M9 ${14+i} Q12 ${16+i} 15 ${14+i}`} fill="none" stroke="#1e293b" strokeWidth="1" strokeLinecap="round"/></svg>
                  <div className="flex-1"><T w="85%" h={2} c="#991b1b"/><T w="65%" h={1.5} c="#f8717160" className="mt-0.5"/></div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[35%] rounded-2xl overflow-hidden bg-gradient-to-b from-[#fee2e2] to-[#fecaca] flex items-center justify-center">
            <svg viewBox="0 0 60 80" width="50" height="65"><rect x="10" y="20" width="40" height="50" rx="8" fill="#f87171"/><circle cx="30" cy="15" r="12" fill="#fca5a5"/><circle cx="25" cy="13" r="2" fill="#1e293b"/><circle cx="35" cy="13" r="2" fill="#1e293b"/></svg>
          </div>
        </div>
      )},
    ]
    case 25: return [
      { containerStyle: { background: '#0f172a' }, render: (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex gap-3 mb-3">{['#3b82f6','#22c55e','#f59e0b','#ef4444'].map(c=>(<div key={c} className="w-3 h-12 rounded-full" style={{background:`linear-gradient(180deg,${c},${c}30)`}}/>))}</div>
          <T w="40%" h={4} c="#f8fafc" className="mb-1"/><T w="30%" h={2} c="#64748b"/>
        </div>
      )},
      { containerStyle: { background: '#0f172a' }, render: (
        <div className="absolute inset-0 p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2"><T w="25%" h={3} c="#f8fafc"/></div>
          <div className="flex-1 flex gap-2">
            <div className="flex-[2] bg-[#1e293b] rounded-lg p-2 border border-[#334155] flex items-end gap-[3px]">{[25,38,32,55,48,62,42,70,55,80,68,90].map((h,i)=>(<div key={i} className="flex-1 rounded-t" style={{height:`${h}%`,background:['#3b82f6','#22c55e','#f59e0b'][i%3]}}/>))}</div>
            <div className="flex-1 flex flex-col gap-2">{[{v:'2.4M',l:'Total',c:'#3b82f6'},{v:'↑23%',l:'Growth',c:'#22c55e'},{v:'98.5',l:'Score',c:'#f59e0b'}].map((d,i)=>(<div key={i} className="bg-[#1e293b] rounded-lg p-2 border border-[#334155] flex-1"><span className="text-[4px] text-[#64748b] block">{d.l}</span><span className="text-[10px] font-bold block" style={{color:d.c}}>{d.v}</span></div>))}</div>
          </div>
        </div>
      )},
    ]
    case 26: return [
      { containerStyle: { background: '#fffbeb' }, render: (
        <div className="absolute inset-0 flex flex-col items-center justify-center"><div className="text-[6px] text-[#92400e] tracking-widest uppercase mb-1">Chapter One</div><div className="text-[13px] font-bold text-[#78350f]">The Journey Begins</div><div className="w-12 h-[1px] bg-[#d97706] my-2"/><T w="45%" h={2} c="#92400e80"/></div>
      )},
      { containerStyle: { background: '#fffbeb' }, render: (
        <div className="absolute inset-0 p-4 flex flex-col"><T w="40%" h={3} c="#78350f" className="mb-3"/>
          <div className="flex-1 flex items-center gap-2">
            {[{n:'01',t:'Discovery',c:'#f59e0b'},{n:'02',t:'Research',c:'#f97316'},{n:'03',t:'Design',c:'#ef4444'},{n:'04',t:'Launch',c:'#dc2626'}].map((step,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5 z-10" style={{background:step.c}}><span className="text-[6px] font-bold text-white">{step.n}</span></div>
                <span className="text-[5px] font-bold text-[#78350f] mb-1">{step.t}</span><T w="80%" h={1.5} c="#92400e60"/><T w="60%" h={1.5} c="#92400e40" className="mt-0.5"/>
                {i<3&&<div className="absolute top-4 left-[60%] w-[80%] h-[1px] bg-[#d9770640]"/>}
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 27: return [
      { containerStyle: { background: '#fef08a' }, render: (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4"><div className="text-[18px] font-black text-black leading-none tracking-tighter" style={{fontFamily:'Impact,sans-serif'}}>BRUTAL.</div><div className="w-24 h-1 bg-black mt-2 mb-2"/><div className="border-3 border-black px-4 py-1"><span className="text-[7px] font-black text-black uppercase">Enter Now</span></div></div>
      )},
      { containerStyle: { background: '#fef08a' }, render: (
        <div className="absolute inset-0 p-3 flex flex-col"><div className="text-[10px] font-black text-black uppercase border-b-4 border-black pb-1 mb-2">Key Points</div>
          <div className="flex-1 flex gap-2">
            {[{c:'#ef4444',t:'white'},{c:'white',t:'black'},{c:'#3b82f6',t:'white'}].map((s,i)=>(
              <div key={i} className="flex-1 border-4 border-black p-2 flex flex-col" style={{background:s.c}}>
                <span className="text-[16px] font-black" style={{color:s.t}}>0{i+1}</span><T w="90%" h={2} c={s.t} className="mt-auto mb-0.5"/><T w="70%" h={1.5} c={`${s.t}60`}/>
              </div>
            ))}
          </div>
        </div>
      )},
    ]
    case 28: return [
      { containerStyle: { background: 'linear-gradient(135deg,#7c3aed,#2563eb,#06b6d4)' }, render: (
        <div className="absolute inset-0"><div className="absolute w-20 h-20 rounded-full bg-[#f472b6]/30 -top-4 -left-4"/><div className="absolute w-16 h-16 rounded-full bg-[#fbbf24]/20 bottom-2 right-8"/>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-3xl px-8 py-5 border border-white/25 flex flex-col items-center" style={{background:'rgba(255,255,255,0.12)',backdropFilter:'blur(12px)'}}>
              <div className="text-[13px] font-bold text-white mb-1">Glassmorphism</div><T w="80px" h={2} c="rgba(255,255,255,0.5)" className="mb-3"/><div className="px-4 py-1.5 rounded-full border border-white/30" style={{background:'rgba(255,255,255,0.15)'}}><span className="text-[6px] text-white font-medium">Learn More</span></div>
            </div>
          </div>
        </div>
      )},
      { containerStyle: { background: 'linear-gradient(135deg,#7c3aed,#2563eb,#06b6d4)' }, render: (
        <div className="absolute inset-0 p-5"><div className="absolute w-24 h-24 rounded-full bg-[#f472b6]/20 -top-6 right-10"/><div className="absolute w-16 h-16 rounded-full bg-[#fbbf24]/15 bottom-4 left-4"/>
          <div className="relative z-10 flex flex-col h-full"><T w="30%" h={3.5} c="white" className="mb-4"/>
            <div className="flex-1 grid grid-cols-3 gap-3">
              {[0,1,2].map(i=>(
                <div key={i} className="rounded-2xl border border-white/20 p-3 flex flex-col items-center" style={{background:'rgba(255,255,255,0.1)',backdropFilter:'blur(10px)'}}>
                  <div className="w-8 h-8 rounded-full border border-white/30 mb-2 flex items-center justify-center" style={{background:'rgba(255,255,255,0.15)'}}><span className="text-[8px] text-white">{['✦','◈','❖'][i]}</span></div>
                  <T w="80%" h={2} c="white" className="mb-1.5"/><T w="95%" h={1.5} c="rgba(255,255,255,0.4)" className="mb-0.5"/><T w="70%" h={1.5} c="rgba(255,255,255,0.25)"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )},
    ]
    case 29: return [
      { containerStyle: { background: '#faf7f2' }, render: (
        <div className="absolute inset-0 flex flex-col items-center justify-center"><div className="absolute inset-3 border-2 border-[#8B4513]/15 rounded-sm"/><div className="absolute inset-4 border border-[#8B4513]/10 rounded-sm"/>
          <div className="flex gap-[3px] mb-3">{['#C73535','#3B5BA5','#F5C242','#2D8B4E','#FFFFFF'].map((c,i)=>(<div key={i} className="w-3 h-10 rounded-sm" style={{background:c,border:c==='#FFFFFF'?'1px solid #ddd':'none'}}/>))}</div>
          <div className="text-[12px] font-bold text-[#3B1E08] mb-1">한국의 아름다움</div><T w="40%" h={2} c="#8B4513"/>
        </div>
      )},
      { containerStyle: { background: '#faf7f2' }, render: (
        <div className="absolute inset-0 p-4 flex flex-col">
          <div className="absolute inset-3 border border-[#8B4513]/10 rounded-sm"/>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3"><div className="flex gap-[2px]">{['#C73535','#3B5BA5','#F5C242'].map(c=><div key={c} className="w-1.5 h-4 rounded-sm" style={{background:c}}/>)}</div><T w="30%" h={3.5} c="#3B1E08"/></div>
            <div className="flex-1 grid grid-cols-3 gap-2">
              {[{t:'仁 (인)',c:'#C73535',d:'Benevolence'},{t:'義 (의)',c:'#3B5BA5',d:'Righteousness'},{t:'禮 (예)',c:'#2D8B4E',d:'Propriety'}].map((item,i)=>(
                <div key={i} className="rounded-lg p-2.5 flex flex-col items-center border" style={{borderColor:`${item.c}20`,background:`${item.c}08`}}>
                  <div className="text-[12px] font-bold mb-1" style={{color:item.c}}>{item.t}</div><span className="text-[5px] text-[#8B4513] mb-1.5">{item.d}</span>
                  <T w="90%" h={1.5} c="#3B1E08" className="mb-0.5"/><T w="70%" h={1.5} c="#8B451380"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )},
    ]
    case 30: return [
      { containerStyle: { background: 'linear-gradient(135deg,#1e293b 50%,#f8fafc 50%)' }, render: (
        <div className="absolute inset-0 flex items-center justify-center"><div className="bg-[#3b82f6] rounded-2xl px-6 py-4 flex flex-col items-center shadow-lg"><div className="text-[12px] font-bold text-white">Hybrid</div><T w="60px" h={2} c="rgba(255,255,255,0.5)" className="mt-1"/></div></div>
      )},
      { containerStyle: { background: '#f8fafc' }, render: (
        <div className="absolute inset-0 flex">
          <div className="w-[35%] bg-[#1e293b] p-4 flex flex-col justify-center"><T w="80%" h={3} c="#f8fafc" className="mb-2"/><T w="95%" h={1.5} c="#64748b" className="mb-0.5"/><T w="80%" h={1.5} c="#475569" className="mb-3"/><div className="flex gap-1.5"><div className="px-2 py-1 rounded bg-[#3b82f6]"><span className="text-[5px] text-white">Action</span></div><div className="px-2 py-1 rounded border border-[#475569]"><span className="text-[5px] text-[#94a3b8]">More</span></div></div></div>
          <div className="flex-1 p-4 flex flex-col gap-2"><div className="flex-1 grid grid-cols-2 gap-2">
            {['#3b82f6','#22c55e','#f59e0b','#8b5cf6'].map((c,i)=>(
              <div key={i} className="rounded-xl p-2 border border-[#e2e8f0] bg-white flex flex-col"><div className="w-5 h-5 rounded-lg mb-1" style={{background:`${c}15`}}><div className="w-full h-full rounded-lg flex items-center justify-center"><Dot c={c} s={5}/></div></div><T w="80%" h={2} c="#1e293b" className="mb-0.5"/><T w="95%" h={1.5} c="#94a3b8"/></div>
            ))}
          </div></div>
        </div>
      )},
    ]
    default: return [{ containerStyle: { background: '#f1f5f9' }, render: (<div className="absolute inset-0 flex items-center justify-center"><T w="40%" h={3} c="#94a3b8"/></div>) }]
  }
}

export default function DesignStylePreviewModal({ style, isSelected, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-slide-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-[#1e293b] rounded-2xl border border-[#334155] w-[620px] max-w-[92vw] max-h-[92vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/20 flex items-center justify-center text-sm font-bold text-[#3b82f6]">{style.id}</div>
            <div><h2 className="text-sm font-semibold text-white">{style.name}</h2><p className="text-[10px] text-[#64748b]">{style.nameEn}</p></div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#334155] transition-colors"><X className="w-4 h-4 text-[#94a3b8]" /></button>
        </div>
        <div className="p-5">
          <p className="text-[10px] text-[#64748b] mb-2">← → 좌우 화살표로 타이틀/콘텐츠 슬라이드를 확인하세요</p>
          <div className="rounded-xl overflow-hidden border border-[#334155] shadow-lg"><SlideSet id={style.id} /></div>
        </div>
        <div className="px-5 pb-3">
          <div className="bg-[#0f172a] rounded-lg p-3 border border-[#334155]">
            <h4 className="text-[10px] font-semibold text-[#64748b] mb-1">디자인 설명</h4>
            <p className="text-xs text-[#94a3b8] leading-relaxed">{style.description}</p>
          </div>
        </div>
        <div className="p-4 border-t border-[#334155] flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#334155] hover:bg-[#475569] text-xs text-[#94a3b8] transition-colors">닫기</button>
          <button onClick={() => { onSelect(style.id); onClose() }} className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold transition-colors ${isSelected ? 'bg-[#22c55e] text-white' : 'bg-[#3b82f6] hover:bg-[#2563eb] text-white'}`}>
            {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
            {isSelected ? '선택됨' : '이 스타일 선택'}
          </button>
        </div>
      </div>
    </div>
  )
}
