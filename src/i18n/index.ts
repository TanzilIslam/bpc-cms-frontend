import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { bnTranslations } from "@/i18n/resources/bn"
import { enTranslations } from "@/i18n/resources/en"

export const supportedLanguages = ["bn", "en"] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

const LANGUAGE_STORAGE_KEY = "bpc-cms-language"

export function normalizeLanguage(language: string | null | undefined): SupportedLanguage {
  const normalized = language?.toLowerCase() ?? ""

  if (normalized.startsWith("en")) {
    return "en"
  }

  return "bn"
}

function getStoredLanguage(): SupportedLanguage | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return value ? normalizeLanguage(value) : null
  } catch {
    return null
  }
}

function detectInitialLanguage(): SupportedLanguage {
  const stored = getStoredLanguage()

  if (stored) {
    return stored
  }

  if (typeof window === "undefined") {
    return "bn"
  }

  return normalizeLanguage(window.navigator.language)
}

export function setLanguagePreference(language: SupportedLanguage): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Ignore storage write errors (private mode, restricted browser settings).
  }
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: enTranslations,
      },
      bn: {
        translation: bnTranslations,
      },
    },
    lng: detectInitialLanguage(),
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  })
}

export default i18n
