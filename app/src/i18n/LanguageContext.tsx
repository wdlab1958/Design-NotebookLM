import { useState, useEffect, type ReactNode } from 'react'
import { LanguageContext, translations, type Lang } from './lang'

// 이 파일은 컴포넌트(LanguageProvider)만 export 한다 (fast-refresh 친화).
// 컨텍스트/훅/타입은 ./lang 에서 가져온다.
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('notebooklm_lang') as Lang) || 'ko'
  })

  useEffect(() => {
    localStorage.setItem('notebooklm_lang', lang)
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}
