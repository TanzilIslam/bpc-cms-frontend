import { useTranslation } from "react-i18next"

import {
  normalizeLanguage,
  setLanguagePreference,
  supportedLanguages,
  type SupportedLanguage,
} from "@/i18n"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type LanguageSwitcherProps = {
  className?: string
}

const languageLabel: Record<SupportedLanguage, string> = {
  bn: "বাংলা",
  en: "English",
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()
  const currentLanguage = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language)

  function handleChange(language: SupportedLanguage) {
    setLanguagePreference(language)
    void i18n.changeLanguage(language)
  }

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={t("language.label")}
    >
      {supportedLanguages.map((language) => (
        <Button
          key={language}
          type="button"
          size="sm"
          variant={currentLanguage === language ? "default" : "outline"}
          className="h-8 px-2 text-xs"
          onClick={() => handleChange(language)}
        >
          {languageLabel[language]}
        </Button>
      ))}
    </div>
  )
}
