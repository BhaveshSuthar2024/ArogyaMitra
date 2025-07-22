import { useState } from "react"
import { useLanguage } from "../contexts/LanguageContext.jsx"
import axios from "axios"

export default function HealthScreening() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    symptoms: [],
    painLevel: "",
    temperature: "",
    bloodPressure: "",
    heartRate: "",
  })

  const { language, t } = useLanguage()
  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const symptoms = ["fever", "cough", "breath", "chest", "headache", "nausea", "fatigue", "dizziness"]

  const handleSymptomChange = (symptom, checked) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: checked ? [...prev.symptoms, symptom] : prev.symptoms.filter((s) => s !== symptom),
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="kiosk-bg">
      <div className="container">
        <div className="screening-container">
          <div className="progress-card">
            <div className="progress-header">
              <span>✅</span>
              <h2 className={`progress-title ${language === "hi" ? "hindi-text" : ""}`}>{t("screening.title")}</h2>
            </div>
            <p className={`progress-subtitle ${language === "hi" ? "hindi-text" : ""}`}>
              {t("screening.step")} {currentStep} {t("screening.of")} {totalSteps} - {t("screening.instruction")}
            </p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="form-card">
            {currentStep === 1 && (
              <div className="form-section">
                <h3 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
                  {t("screening.basic.title")}
                </h3>

                <div className="form-group">
                  <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`} htmlFor="age">
                    {t("screening.age")}
                  </label>
                  <input
                    id="age"
                    type="number"
                    className="form-input"
                    placeholder={t("screening.age.placeholder")}
                    value={formData.age}
                    onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("screening.gender")}
                  </label>
                  <div className="radio-group">
                    {["male", "female", "other"].map((gender) => (
                      <div key={gender} className="radio-item">
                        <input
                          type="radio"
                          id={gender}
                          name="gender"
                          value={gender}
                          className="radio-input"
                          checked={formData.gender === gender}
                          onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                        />
                        <label htmlFor={gender} className={`radio-label ${language === "hi" ? "hindi-text" : ""}`}>
                          {t(`screening.gender.${gender}`)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-section">
                <h3 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
                  {t("screening.symptoms.title")}
                </h3>
                <p
                  className={`${language === "hi" ? "hindi-text" : ""}`}
                  style={{ marginBottom: "20px", color: "#666" }}
                >
                  {t("screening.symptoms.instruction")}
                </p>

                <div className="checkbox-grid">
                  {symptoms.map((symptom) => (
                    <div key={symptom} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={symptom}
                        className="checkbox-input"
                        checked={formData.symptoms.includes(symptom)}
                        onChange={(e) => handleSymptomChange(symptom, e.target.checked)}
                      />
                      <label htmlFor={symptom} className={`checkbox-label ${language === "hi" ? "hindi-text" : ""}`}>
                        {t(`screening.symptom.${symptom}`)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-section">
                <h3 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
                  {t("screening.pain.title")}
                </h3>

                <div className="form-group">
                  <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("screening.pain.scale")}
                  </label>
                  <div className="pain-scale">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <div key={level} className="pain-item">
                        <input
                          type="radio"
                          id={`pain-${level}`}
                          name="painLevel"
                          value={level.toString()}
                          className="radio-input"
                          checked={formData.painLevel === level.toString()}
                          onChange={(e) => setFormData((prev) => ({ ...prev, painLevel: e.target.value }))}
                        />
                        <label htmlFor={`pain-${level}`} style={{ fontSize: "0.9rem" }}>
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="pain-scale-labels">
                    <span className={language === "hi" ? "hindi-text" : ""}>{t("screening.pain.none")}</span>
                    <span className={language === "hi" ? "hindi-text" : ""}>{t("screening.pain.worst")}</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="form-section">
                <h3 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
                  {t("screening.vitals.title")}
                </h3>
                <p
                  className={`${language === "hi" ? "hindi-text" : ""}`}
                  style={{ marginBottom: "20px", color: "#666" }}
                >
                  {t("screening.vitals.instruction")}
                </p>

                <div className="vitals-grid">
                  <div className="form-group">
                    <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`} htmlFor="temperature">
                      {t("screening.temperature")}
                    </label>
                    <input
                      id="temperature"
                      type="number"
                      step="0.1"
                      className="form-input"
                      placeholder="98.6"
                      value={formData.temperature}
                      onChange={(e) => setFormData((prev) => ({ ...prev, temperature: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`} htmlFor="heartRate">
                      {t("screening.heartrate")}
                    </label>
                    <input
                      id="heartRate"
                      type="number"
                      className="form-input"
                      placeholder="72"
                      value={formData.heartRate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, heartRate: e.target.value }))}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`} htmlFor="bloodPressure">
                      {t("screening.bloodpressure")}
                    </label>
                    <input
                      id="bloodPressure"
                      className="form-input"
                      placeholder="120/80"
                      value={formData.bloodPressure}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bloodPressure: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-navigation">
              <button className="nav-button secondary" onClick={prevStep} disabled={currentStep === 1}>
                <span>←</span>
                <span className={language === "hi" ? "hindi-text" : ""}>{t("screening.previous")}</span>
              </button>

              {currentStep < totalSteps ? (
                <button className="nav-button primary" onClick={nextStep}>
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("screening.next")}</span>
                  <span>→</span>
                </button>
              ) : (
                <button className="nav-button success">
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("screening.complete")}</span>
                  <span>✅</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}