import { createContext, useContext, useState, ReactNode } from 'react'
import type { Lang } from '../types'

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (ru: string, en: string) => string
}

const LangContext = createContext<LangContextType | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang) || 'ru'
  })

  function handleSetLang(l: Lang) {
    setLang(l)
    localStorage.setItem('lang', l)
  }

  function t(ru: string, en: string) {
    return lang === 'ru' ? ru : en
  }

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
