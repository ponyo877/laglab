import { createContext, useContext, useMemo, type ReactNode } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import type { Lang } from "@/types"
import ja from "@/i18n/ja.json"
import en from "@/i18n/en.json"

type TranslationData = typeof ja

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string, params?: Record<string, string | number>) => string
  translations: TranslationData
}

const translations: Record<Lang, TranslationData> = {
  jp: ja,
  en: en,
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

// Helper to get nested value from object using dot notation
const getNestedValue = (obj: unknown, path: string): string => {
  const keys = path.split(".")
  let result: unknown = obj
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof result === "string" ? result : path
}

// Replace {{param}} placeholders with values
const interpolate = (text: string, params?: Record<string, string | number>): string => {
  if (!params) return text
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, "g"), String(value)),
    text
  )
}

interface LanguageProviderProps {
  children: ReactNode
  lang: Lang
}

export function LanguageProvider({ children, lang }: LanguageProviderProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const setLang = (newLang: Lang) => {
    const pathParts = location.pathname.split("/")
    if (pathParts.length >= 2) {
      pathParts[1] = newLang
    }
    navigate(`${pathParts.join("/")}${location.search}`, { replace: true })
  }

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      const translation = getNestedValue(translations[lang], key)
      return interpolate(translation, params)
    }
  }, [lang])

  const value: LanguageContextValue = {
    lang,
    setLang,
    t,
    translations: translations[lang],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
