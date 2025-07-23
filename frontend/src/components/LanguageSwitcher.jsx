import { useLanguage } from "../contexts/LanguageContext"

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  return (
    <button className="language-switcher" onClick={toggleLanguage} title={t("language.switch")}>
      <span className="language-icon">🌐</span>
      <span className={`language-text ${language === "hi" ? "hindi-text" : ""}`}>
        {language === "en" ? t("language.hindi") : t("language.english")}
      </span>
    </button>
  )
}
