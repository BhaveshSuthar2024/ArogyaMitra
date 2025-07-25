import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useLanguage } from "../contexts/LanguageContext.jsx"

export default function WelcomePage({ user }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  const handleNavClick = (section) => {
    alert(`${section} section - Coming soon!`)
  }

  const handleQuickAccess = (service) => {
    if (service === "emergency") {
      alert("Emergency services activated!")
    } else {
      navigate("/home")
    }
  }

  const handleSignOut = () => {
    logout()
    navigate("/auth")
  }

  return (
    <div className="welcome-page">
      {/* Background Decorations */}
      <div className="bg-decoration"></div>
      <div className="bg-decoration"></div>
      <div className="bg-decoration"></div>

      {/* Header Navigation */}
      <header className="header-nav">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon"><img src="public/hospital_1392165.png" alt="" className="emoji" /></div>
            <span>RURAL HEALTH</span>
          </div>

          <nav>
            <ul className="nav-menu">
              <li className="nav-item">
                <span className="nav-link active" onClick={() => handleNavClick("Home")}>
                  {t("nav.home")}
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={() => handleNavClick("About")}>
                  {t("nav.about")}
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={() => handleNavClick("Services")}>
                  {t("nav.services")}
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={() => handleNavClick("Department")}>
                  {t("nav.department")}
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={() => handleNavClick("Contact")}>
                  {t("nav.contact")}
                </span>
              </li>
              <li className="nav-item">
                <span className="nav-link" onClick={() => handleNavClick("Support")}>
                  {t("nav.support")}
                </span>
              </li>
              <li className="nav-item">
                <button className="language-selector" onClick={handleLanguageToggle}>
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("language.switch")}</span>
                </button>
              </li>
              <li className="nav-item">
                <button className="appointment-btn" onClick={() => navigate("/home")}>
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("nav.appointment")}</span>
                </button>
              </li>
              {user && (
                <li className="nav-item">
                  <button className="sign-out-btn" onClick={handleSignOut}>
                    <span className={language === "hi" ? "hindi-text" : ""}>Sign Out</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <p className={`hero-subtitle ${language === "hi" ? "hindi-text" : ""}`}>{t("welcome.subtitle")}</p>
          <h1 className={`hero-title ${language === "hi" ? "hindi-text" : ""}`}>{t("welcome.title")}</h1>
          <p className={`hero-description ${language === "hi" ? "hindi-text" : ""}`}>{t("welcome.description")}</p>

          <div className="hero-buttons">
            <button
              className={`btn-primary ${language === "hi" ? "hindi-text" : ""}`}
              onClick={() => navigate("/auth")}
            >
              {t("welcome.enter")} →
            </button>
            <button
              className={`btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
              onClick={() => handleNavClick("Learn More")}
            >
              {t("welcome.learn")}
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img src="nurse.png" alt="Healthcare Professional" />
        </div>
      </section>

      {/* Quick Access Menu */}
      <div className="quick-access">
        <div className="quick-item" onClick={() => handleQuickAccess("emergency")}>
          <span className="quick-icon"><img src="public/alert_3329142.png" alt="" className="emoji_home" /></span>
          <p className={`quick-title ${language === "hi" ? "hindi-text" : ""}`}>{t("quick.emergency")}</p>
        </div>
        <div className="quick-item" onClick={() => handleQuickAccess("screening")}>
          <span className="quick-icon"><img src="public/stethoscope_2002576.png" alt="" className="emoji_home" /></span>
          <p className={`quick-title ${language === "hi" ? "hindi-text" : ""}`}>{t("quick.screening")}</p>
        </div>
        <div className="quick-item" onClick={() => handleQuickAccess("consult")}>
          <span className="quick-icon"><img src="public/doctor_3467875.png" alt="" className="emoji_home" /></span>
          <p className={`quick-title ${language === "hi" ? "hindi-text" : ""}`}>{t("quick.consult")}</p>
        </div>
        <div className="quick-item" onClick={() => handleQuickAccess("pharmacy")}>
          <span className="quick-icon"><img src="public/capsule_2008183.png" alt="" className="emoji_home" /></span>
          <p className={`quick-title ${language === "hi" ? "hindi-text" : ""}`}>{t("quick.pharmacy")}</p>
        </div>
      </div>

      {/* Navigation buttons for testing */}
      {user && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
          <button
            onClick={() => navigate("/welcome")}
            style={{
              margin: "5px",
              padding: "10px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Welcome
          </button>
          <button
            onClick={() => navigate("/home")}
            style={{
              margin: "5px",
              padding: "10px",
              background: "#059669",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/admin")}
            style={{
              margin: "5px",
              padding: "10px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Admin
          </button>
          <button
            onClick={() => navigate("/patient")}
            style={{
              margin: "5px",
              padding: "10px",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Patient
          </button>
          <button
            onClick={() => navigate("/doctor")}
            style={{
              margin: "5px",
              padding: "10px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Doctor
          </button>
          <button
            onClick={handleSignOut}
            style={{
              margin: "5px",
              padding: "10px",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
