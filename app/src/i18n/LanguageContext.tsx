import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { ko } from './ko'
import { en } from './en'

export type Lang = 'ko' | 'en'
type Translations = typeof ko

const translations: Record<Lang, Translations> = { ko, en }

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  setLang: () => {},
  t: ko,
})

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

export function useLang() {
  return useContext(LanguageContext)
}
