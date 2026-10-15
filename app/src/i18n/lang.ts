// 언어 컨텍스트 / 훅 (비컴포넌트 모듈) — react-refresh/only-export-components 충족용 분리.
import { createContext, useContext } from 'react'
import { ko } from './ko'
import { en } from './en'

export type Lang = 'ko' | 'en'
export type Translations = typeof ko

export const translations: Record<Lang, Translations> = { ko, en }

export interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translations
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  setLang: () => {},
  t: ko,
})

export function useLang() {
  return useContext(LanguageContext)
}
