import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useLanguage } from "../contexts/LanguageContext.jsx"

export default function MedicalKioskHome({ user }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  const handleSignOut = () => {
    logout()
    navigate("/auth")
  }

  const services = [
    {
      key: "screening",
      icon: "public/thermometer_1400304.png",
      color: "green",
    },
    {
      key: "consult",
      icon: "public/couple_547629.png",
      color: "blue",
    },
    {
      key: "appointment",
      icon: "public/schedule_3174027.png",
      color: "purple",
    },
    {
      key: "records",
      icon: "public/note_4371132.png",
      color: "orange",
    },
    {
      key: "education",
      icon: "public/love_2545869.png",
      color: "teal",
    },
    {
      key: "pharmacy",
      icon: "public/capsule_2008183.png",
      color: "pink",
    },
  ]

  return (
    <div className="kiosk-bg">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <div className="header-icon"><img src="public/stethoscope_2002576.png" alt="" className="emoji" /></div>
            <div>
              <h1 className={`header-title ${language === "hi" ? "hindi-text" : ""}`}>{t("header.title")}</h1>
              <p className={`header-subtitle ${language === "hi" ? "hindi-text" : ""}`}>{t("header.subtitle")}</p>
            </div>
          </div>
          <div className="header-right">
            
            <button className="language-switcher" onClick={toggleLanguage} title={t("language.switch")}>
              <span className="language-icon"><img src="public/globe_12925125.png" alt="" className="emoji" /></span>
              <span className={`language-text ${language === "hi" ? "hindi-text" : ""}`}>
                {language === "en" ? t("language.hindi") : t("language.english")}
              </span>
            </button>
            
              <div className="time-display">
                <span><img src="public/clock_3571703.png" alt="" className="emoji" /></span>
                <span>{currentTime}</span>
              </div>
              <div className={`location-display ${language === "hi" ? "hindi-text" : ""}`}>
                <span><img src="public/lollipop_1824314.png" alt="" className="emoji" /></span>
                <span>{t("header.location")}</span>
              </div>

          </div>
        </div>

        {/* Emergency Alert */}
        <div className="emergency-alert">
          <span className="emergency-icon"><img src="public/warning_13898912.png" alt="" className="emoji" /></span>
          <div className="emergency-content">
            <p className={`emergency-title ${language === "hi" ? "hindi-text" : ""}`}>{t("emergency.title")}</p>
            <p className={`emergency-text ${language === "hi" ? "hindi-text" : ""}`}>{t("emergency.text")}</p>
          </div>
          <button className={`emergency-button ${language === "hi" ? "hindi-text" : ""}`}>
            <span><img src="public/telephone_1840922.png" alt="" className="emoji" /></span>
            {t("emergency.button")}
          </button>
        </div>

        {/* Main Services Grid */}
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.key} className="service-card">
              <div className={`service-icon ${service.color}`}><img src={service.icon} alt="" className="emoji_home" /></div>
              <h3 className={`service-title ${language === "hi" ? "hindi-text" : ""}`}>
                {t(`services.${service.key}.title`)}
              </h3>
              <p className={`service-description ${language === "hi" ? "hindi-text" : ""}`}>
                {t(`services.${service.key}.description`)}
              </p>
              <button className={`service-button ${service.color} ${language === "hi" ? "hindi-text" : ""}`}>
                {t(`services.${service.key}.button`)}
              </button>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number green">24/7</div>
            <p className={`stat-label ${language === "hi" ? "hindi-text" : ""}`}>{t("stats.available")}</p>
          </div>
          <div className="stat-card">
            <div className="stat-number blue">500+</div>
            <p className={`stat-label ${language === "hi" ? "hindi-text" : ""}`}>{t("stats.patients")}</p>
          </div>
          <div className="stat-card">
            <div className="stat-number purple">15min</div>
            <p className={`stat-label ${language === "hi" ? "hindi-text" : ""}`}>{t("stats.waittime")}</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="contact-card">
          <div className="contact-header">
            <span><img src="public/telephone_1840922.png" alt="" className="emoji" /></span>
            <h3 className={`contact-title ${language === "hi" ? "hindi-text" : ""}`}>{t("contact.title")}</h3>
          </div>
          <div className="contact-content">
            <div className="contact-section">
              <h4 className={language === "hi" ? "hindi-text" : ""}>{t("contact.emergency")}</h4>
              <div className="contact-list">
                <div className="contact-item">
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("contact.emergency.services")}</span>
                  <span className="contact-badge emergency">911</span>
                </div>
                <div className="contact-item">
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("contact.poison.control")}</span>
                  <span className="contact-badge normal">1-800-222-1222</span>
                </div>
                <div className="contact-item">
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("contact.mental.health")}</span>
                  <span className="contact-badge normal">988</span>
                </div>
              </div>
            </div>
            <div className="contact-section">
              <h4 className={language === "hi" ? "hindi-text" : ""}>{t("contact.local")}</h4>
              <div className="contact-list">
                <div className="contact-item">
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("contact.clinic")}</span>
                  <span className="contact-badge normal">(555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("contact.pharmacy")}</span>
                  <span className="contact-badge normal">(555) 123-4568</span>
                </div>
                <div className="contact-item">
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("contact.transport")}</span>
                  <span className="contact-badge normal">(555) 123-4569</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
