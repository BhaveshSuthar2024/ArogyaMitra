import { useState, useEffect, useRef } from "react"
import { useLanguage } from "../contexts/LanguageContext.jsx"
import { useNavigate, useLocation } from "react-router-dom"
import { authTranslations } from "./SpeechSync.js"
import axios from "axios"
import "./Auth.css"

/*
  Notes:
  - Consolidated speech init into a small SpeechAssistant helper.
  - On-focus voice prompts preserved and now open a short recognition session to capture mobile / OTP / aadhaar digits.
  - Kept endpoint URLs and existing navigation behavior intact.
  - Removed duplicate/unused initialization code and reduced noisy state duplication.
*/

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState("")
  const [otpTimer, setOtpTimer] = useState(0)
  const [canResendOtp, setCanResendOtp] = useState(false)
  const [isSpeechReady, setIsSpeechReady] = useState(false)
  const [availableVoices, setAvailableVoices] = useState([])
  const [hindiVoice, setHindiVoice] = useState(null)
  const [englishVoice, setEnglishVoice] = useState(null)

  const { language, setLanguage, t } = useLanguage()
  const focusableRef = useRef([])
  const currentFocusIndex = useRef(0)
  const navigate = useNavigate()
  const location = useLocation()
  const speechAssistantRef = useRef(null)

  // OTP input refs
  const otpRefs = useRef([])

  const [signInData, setSignInData] = useState({
    mobile: "",
    otp: ["", "", "", "", "", ""],
  })

  const [signUpData, setSignUpData] = useState({
    fullName: "",
    mobile: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    gender: "",
    aadhaarNumber: "",
    otp: ["", "", "", "", "", ""],
  })

  // Simple Speech Assistant (synthesis + short recognition helpers)
  useEffect(() => {
    class SpeechAssistant {
      constructor() {
        this.recognition = null
        this.listening = false
        this.initVoices()
      }

      initVoices() {
        if ("speechSynthesis" in window) {
          const tryLoad = () => {
            const voices = window.speechSynthesis.getVoices()
            if (voices && voices.length > 0) {
              setAvailableVoices(voices)
              // choose english/hindi if available
              const hi = voices.find((v) => v.lang?.includes("hi")) || voices[0]
              const en = voices.find((v) => v.lang?.includes("en")) || voices[0]
              setHindiVoice(hi)
              setEnglishVoice(en)
              setIsSpeechReady(true)
            }
          }
          tryLoad()
          window.speechSynthesis.onvoiceschanged = tryLoad
        }
      }

      speak(text, opts = {}) {
        if (!text) return
        if ("speechSynthesis" in window && isSpeechReady) {
          try {
            window.speechSynthesis.cancel()
            const u = new SpeechSynthesisUtterance(text)
            u.lang = language === "hi" ? "hi-IN" : "en-IN"
            u.rate = opts.rate || (language === "hi" ? 0.75 : 0.9)
            u.pitch = opts.pitch || 1.0
            if (language === "hi" && hindiVoice) u.voice = hindiVoice
            else if (englishVoice) u.voice = englishVoice
            window.speechSynthesis.speak(u)
          } catch (e) {
            console.warn("speak failed", e)
          }
        } else if (window.meSpeak && window.meSpeak.speak) {
          // fallback to meSpeak if available
          window.meSpeak.speak(text, { amplitude: 100, speed: 175 })
        } else {
          // No TTS available — no-op
          // Could also populate an aria-live region for screen readers
        }
      }

      // Listen once and return transcript. Mode 'digits' will return only digits found.
      listenOnce({ lang = language === "hi" ? "hi-IN" : "en-IN", mode = "default", timeout = 7000 } = {}) {
        return new Promise((resolve) => {
          if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) {
            resolve(null)
            return
          }
          const SR = window.SpeechRecognition || window.webkitSpeechRecognition
          try {
            const r = new SR()
            r.lang = lang
            r.interimResults = false
            r.maxAlternatives = 1
            let settled = false

            r.onresult = (e) => {
              const text = e.results[0][0].transcript.trim()
              settled = true
              r.stop()
              if (mode === "digits") {
                // extract digits from spoken phrase (handles spaced digits)
                const digits = text.replace(/\D+/g, "")
                resolve(digits || null)
              } else {
                resolve(text || null)
              }
            }

            r.onerror = () => {
              if (!settled) {
                settled = true
                r.stop()
                resolve(null)
              }
            }

            r.onend = () => {
              if (!settled) {
                settled = true
                resolve(null)
              }
            }

            r.start()

            // safety timeout
            setTimeout(() => {
              try {
                if (!settled) {
                  settled = true
                  r.stop()
                  resolve(null)
                }
              } catch {}
            }, timeout)
          } catch (err) {
            resolve(null)
          }
        })
      }
    }

    speechAssistantRef.current = new SpeechAssistant()

    return () => {
      try {
        window.speechSynthesis?.cancel()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // OTP timer
  useEffect(() => {
    let interval = null
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000)
    } else if (otpTimer === 0 && currentStep === 2) {
      setCanResendOtp(true)
    }
    return () => clearInterval(interval)
  }, [otpTimer, currentStep])

  const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile)
  const validateAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar.replace(/\s/g, ""))
  const validateOtp = (otp) => otp.every((d) => d && /^\d$/.test(d))
  const validateDateOfBirth = (day, month, year) => {
    const date = new Date(year, month - 1, day)
    return date && date <= new Date()
  }

  const sendOtp = async (mobile, isResend = false) => {
    setLoading(true)
    try {
      const endpoint = isSignUp
        ? "https://arogyamitra-asdf.onrender.com/api/v1/auth/request-otp"
        : "https://arogyamitra-asdf.onrender.com/api/v1/auth/login/request-otp"
      const body = isSignUp
        ? {
            name: signUpData.fullName,
            mobileNo: mobile,
            dateOfBirth: `${signUpData.dobYear}-${signUpData.dobMonth}-${signUpData.dobDay}`,
            gender: signUpData.gender,
            aadharNo: signUpData.aadhaarNumber.replace(/\s/g, ""),
          }
        : { mobileNo: mobile }

      const res = await axios.post(endpoint, body, { withCredentials: true })
      setSuccess(res.data.message || (isResend ? t("auth.otp.resent") : t("auth.otp.sent")))
      setOtpTimer(30)
      setCanResendOtp(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (otpArray) => {
    setLoading(true)
    const otp = otpArray.join("")
    const mobileNo = isSignUp ? signUpData.mobile : signInData.mobile
    try {
      const endpoint = isSignUp
        ? "https://arogyamitra-asdf.onrender.com/api/v1/auth/register"
        : "https://arogyamitra-asdf.onrender.com/api/v1/auth/login/verify"
      const res = await axios.post(endpoint, { mobileNo, otp }, { withCredentials: true })
      setSuccess(t("auth.otp.verified"))
      navigate("/patient")
      return res.data
    } catch (error) {
      setErrors({ otp: error?.response?.data?.error || "OTP verification failed" })
      return null
    } finally {
      setLoading(false)
    }
  }

  // When moving to Step 2 (OTP), announce and optionally listen for OTP digits
  useEffect(() => {
    if (currentStep === 2) {
      const message = language === "en" ? authTranslations.en.auth_otp_input_label : authTranslations.hi.auth_otp_input_label
      speechAssistantRef.current?.speak(message)
      // short delay; don't auto-send OTP to preserve original flow (sendOtp is triggered elsewhere)
      // but we will auto-listen for OTP digits when user focuses first OTP input or when voice is used
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isSignUp])

  // Handlers
  const handleSignInStep1 = async (e) => {
    e.preventDefault()
    if (!validateMobile(signInData.mobile)) {
      setErrors({ mobile: t("auth.error.mobile.invalid") })
      speechAssistantRef.current?.speak(language === "en" ? authTranslations.en.auth_mobile_invalid : authTranslations.hi.auth_mobile_invalid)
      return
    }

    const message = language === "en" ? authTranslations.en.auth_otp_info : authTranslations.hi.auth_otp_info
    speechAssistantRef.current?.speak(message)

    setTimeout(() => {
      const otpMessage =
        language === "en" ? authTranslations.en.auth_otp_input_label : authTranslations.hi.auth_otp_input_label
      speechAssistantRef.current?.speak(otpMessage)
    }, 1500)

    // preserve original flow: just advance to OTP step (sending OTP left as-is elsewhere)
    setCurrentStep(2)
  }

  const handleSignInStep2 = async (e) => {
    e.preventDefault()
    if (!validateOtp(signInData.otp)) {
      setErrors({ otp: t("auth.error.otp.incomplete") })
      speechAssistantRef.current?.speak(language === "en" ? authTranslations.en.auth_otp_incomplete : authTranslations.hi.auth_otp_incomplete)
      return
    }
    // keep verification logic same as before (prefer manual click or other call)
  }

  const handleSignUpStep1 = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!signUpData.fullName) newErrors.fullName = "Name required"
    if (!validateMobile(signUpData.mobile)) newErrors.mobile = "Invalid mobile"
    if (!validateDateOfBirth(signUpData.dobDay, signUpData.dobMonth, signUpData.dobYear))
      newErrors.dateOfBirth = "Invalid DOB"
    if (!signUpData.gender) newErrors.gender = "Select gender"
    if (!validateAadhaar(signUpData.aadhaarNumber)) newErrors.aadhaarNumber = "Invalid Aadhaar"

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      // Announce first error
      const first = Object.values(newErrors)[0]
      speechAssistantRef.current?.speak(first)
      return
    }
    setCurrentStep(2)
  }

  const handleSignUpStep2 = async (e) => {
    e.preventDefault()
    if (!validateOtp(signUpData.otp)) {
      setErrors({ otp: t("auth.error.otp.incomplete") })
      speechAssistantRef.current?.speak(language === "en" ? authTranslations.en.auth_otp_incomplete : authTranslations.hi.auth_otp_incomplete)
      return
    }
  }

  const handleOtpChange = (index, value, isForSignUp) => {
    if (!/^[0-9]?$/.test(value)) return
    const data = isForSignUp ? [...signUpData.otp] : [...signInData.otp]
    data[index] = value
    ;(isForSignUp ? setSignUpData : setSignInData)((prev) => ({ ...prev, otp: data }))

    if (value && index < 5) otpRefs.current[index + 1]?.focus()
    if (!value && index > 0) otpRefs.current[index - 1]?.focus()
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
    const msg = language === "en" ? "Switched to Hindi" : "Switched to English"
    speechAssistantRef.current?.speak(msg)
  }

  const handleSignInChange = (e) => {
    const { name, value } = e.target
    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSignUpChange = (e) => {
    const { name, value } = e.target
    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleDobChange = (field, value) => {
    setSignUpData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors.dateOfBirth) {
      setErrors((prev) => ({ ...prev, dateOfBirth: "" }))
    }
  }

  const isFirstTime = useRef(true)
  const handleGenderSelect = (gender) => {
    setSignUpData((prev) => ({ ...prev, gender }))
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: "" }))
    }
    if (isFirstTime.current) {
      const message =
        language === "en" ? authTranslations.en.auth_aadhaar_prompt : authTranslations.hi.auth_aadhaar_prompt
      speechAssistantRef.current?.speak(message)
      isFirstTime.current = false
    }
  }

  const formatAadhaar = (value) => {
    const digits = value.replace(/\D/g, "")
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
  }

  const handleAadhaarChange = (e) => {
    const formatted = formatAadhaar(e.target.value)
    if (formatted.replace(/\s/g, "").length <= 12) {
      setSignUpData((prev) => ({ ...prev, aadhaarNumber: formatted }))
    }
  }

  const handleResendOtp = () => {
    const mobile = isSignUp ? signUpData.mobile : signInData.mobile
    sendOtp(mobile, true)
  }

  const handleBack = () => {
    setCurrentStep(1)
    setErrors({})
    setSuccess("")
  }

  const resetForm = () => {
    setCurrentStep(1)
    setErrors({})
    setSuccess("")
    setOtpTimer(0)
    setCanResendOtp(false)
  }

  const switchAuthMode = () => {
    setIsSignUp(!isSignUp)
    const message =
      language === "en" ? authTranslations.en.auth_signup_instruction : authTranslations.hi.auth_signup_instruction
    speechAssistantRef.current?.speak(message)

    setTimeout(() => {
      const nameMessage =
        language === "en" ? authTranslations.en.auth_name_prompt : authTranslations.hi.auth_name_prompt
      speechAssistantRef.current?.speak(nameMessage)
    }, 7000)
    resetForm()
  }

  // keyboard navigation polyfill kept; focus management preserved
  useEffect(() => {
    focusableRef.current = []
    currentFocusIndex.current = 0
  }, [isSignUp, currentStep])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const focusableElements = Array.from(
        document.querySelectorAll(
          'input:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), .gender-option, .auth-switch-link',
        ),
      ).filter((el) => {
        const style = window.getComputedStyle(el)
        return style.display !== "none" && style.visibility !== "hidden" && el.offsetParent !== null
      })

      const activeElement = document.activeElement
      const currentIndex = focusableElements.indexOf(activeElement)

      if (activeElement && activeElement.classList.contains("otp-input")) {
        const otpIndex = otpRefs.current.indexOf(activeElement)
        if (otpIndex !== -1) {
          handleOtpKeyDown(e, otpIndex)
          return
        }
      }

      switch (e.key) {
        case "Tab":
          setTimeout(() => {
            const newActiveElement = document.activeElement
            const newIndex = focusableElements.indexOf(newActiveElement)
            if (newIndex !== -1) {
              currentFocusIndex.current = newIndex
            }
          }, 0)
          break
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault()
          if (currentIndex < focusableElements.length - 1) {
            focusableElements[currentIndex + 1]?.focus()
            currentFocusIndex.current = currentIndex + 1
          }
          break
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault()
          if (currentIndex > 0) {
            focusableElements[currentIndex - 1]?.focus()
            currentFocusIndex.current = currentIndex - 1
          }
          break
        case "Enter":
        case " ":
          if (activeElement) {
            if (activeElement.tagName === "BUTTON") {
              e.preventDefault()
              activeElement.click()
            } else if (activeElement.classList.contains("gender-option")) {
              e.preventDefault()
              activeElement.click()
            } else if (activeElement.classList.contains("auth-switch-link")) {
              e.preventDefault()
              activeElement.click()
            } else if (activeElement.tagName === "SELECT") {
              return
            } else if (activeElement.type === "submit") {
              e.preventDefault()
              activeElement.click()
            }
          }
          break
        case "Escape":
          e.preventDefault()
          try {
            window.speechSynthesis?.cancel()
          } catch {}
          if (currentStep === 2) {
            handleBack()
          } else {
            if (focusableElements.length > 0) {
              focusableElements[0].focus()
              currentFocusIndex.current = 0
            }
          }
          break
        default:
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, isSignUp])

  useEffect(() => {
    setTimeout(() => {
      const firstFocusable = document.querySelector(
        "input:not([disabled]), select:not([disabled]), button:not([disabled])",
      )
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }, 100)
  }, [currentStep, isSignUp])

  const handleOtpKeyDown = (e, index) => {
    const key = e.key
    const lastIndex = otpRefs.current.length - 1

    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Enter", "Backspace", "Tab"].includes(key)) {
      if (key !== "Tab") {
        e.preventDefault()
      }
    }

    switch (key) {
      case "ArrowLeft":
        if (index > 0) {
          otpRefs.current[index - 1]?.focus()
        }
        break
      case "ArrowRight":
        if (index < lastIndex) {
          otpRefs.current[index + 1]?.focus()
        } else {
          const nextButton = document.querySelector(".auth-button:not(.secondary)")
          if (nextButton) {
            nextButton.focus()
          }
        }
        break
      case "ArrowDown":
        const verifyButton = document.querySelector(".auth-button:not(.secondary)")
        if (verifyButton) {
          verifyButton.focus()
        }
        break
      case "ArrowUp":
        if (index === 0) {
          const allInputs = Array.from(document.querySelectorAll("input, select, button"))
          const otpContainer = otpRefs.current[0]?.closest(".otp-container")
          const otpContainerIndex = allInputs.findIndex((el) => otpContainer?.contains(el) || el === otpRefs.current[0])
          if (otpContainerIndex > 0) {
            for (let i = otpContainerIndex - 1; i >= 0; i--) {
              if (allInputs[i] && !allInputs[i].disabled) {
                allInputs[i].focus()
                break
              }
            }
          }
        } else {
          otpRefs.current[index - 1]?.focus()
        }
        break
      case "Backspace":
        if (!e.target.value && index > 0) {
          otpRefs.current[index - 1]?.focus()
        }
        break
      case "Enter":
        const submitButton = document.querySelector(".auth-button:not(.secondary)")
        if (submitButton) {
          submitButton.click()
        }
        break
      default:
        break
    }
  }

  const handleElementFocus = (element) => {
    if (element) {
      const allFocusable = Array.from(
        document.querySelectorAll(
          'input:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), .gender-option, .auth-switch-link',
        ),
      )
      const index = allFocusable.indexOf(element)
      if (index !== -1) {
        currentFocusIndex.current = index
      }
    }
  }

  // Voice-driven short capture helper: when a numeric input is focused, open quick recognition and fill digits.
  const startQuickDigitCapture = async ({ targetType, targetIndex = 0, isForSignUp = false } = {}) => {
    // targetType: 'mobile'|'otp'|'aadhaar'
    if (!speechAssistantRef.current) return
    const mode = "digits"
    const lang = language === "hi" ? "hi-IN" : "en-IN"
    speechAssistantRef.current.speak(
      targetType === "mobile"
        ? language === "hi"
          ? "कृपया अपना मोबाइल नंबर बोलें"
          : "Please speak your mobile number"
        : targetType === "otp"
        ? language === "hi"
          ? "कृपया ओटीपी बोलें"
          : "Please speak the OTP digits"
        : language === "hi"
        ? "कृपया आधार नंबर बोलें"
        : "Please speak your Aadhaar number",
    )

    const digits = await speechAssistantRef.current.listenOnce({ lang, mode, timeout: 8000 })
    if (!digits) {
      speechAssistantRef.current.speak(language === "hi" ? "मैंने कुछ नहीं सुना। कृपया फिर से प्रयास करें।" : "I didn't hear anything. Please try again.")
      return
    }

    if (targetType === "mobile") {
      // accept last 10 digits if longer
      const last10 = digits.slice(-10)
      if (validateMobile(last10)) {
        setSignInData((prev) => ({ ...prev, mobile: last10 }))
        setSignUpData((prev) => ({ ...prev, mobile: last10 }))
        speechAssistantRef.current.speak(language === "hi" ? "मोबाइल नंबर दर्ज कर लिया गया" : "Mobile number recorded")
      } else {
        speechAssistantRef.current.speak(language === "hi" ? "अमान्य मोबाइल नंबर" : "Invalid mobile number")
      }
    } else if (targetType === "aadhaar") {
      const last12 = digits.slice(-12)
      if (validateAadhaar(last12)) {
        const formatted = last12.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
        setSignUpData((prev) => ({ ...prev, aadhaarNumber: formatted }))
        speechAssistantRef.current.speak(language === "hi" ? "आधार नंबर दर्ज कर लिया गया" : "Aadhaar recorded")
      } else {
        speechAssistantRef.current.speak(language === "hi" ? "अमान्य आधार नंबर" : "Invalid Aadhaar number")
      }
    } else if (targetType === "otp") {
      // Fill OTP inputs
      const digitsArr = digits.split("").slice(0, 6)
      const padded = [...digitsArr, ...Array(6 - digitsArr.length).fill("")]
      for (let i = 0; i < padded.length; i++) {
        handleOtpChange(i, padded[i], isForSignUp)
      }
      speechAssistantRef.current.speak(language === "hi" ? "ओटीपी दर्ज कर लिया गया" : "OTP recorded")
      // focus verify button
      const verifyButton = document.querySelector("#verifyOtpBtn")
      if (verifyButton) verifyButton.focus()
    }
  }

  return (
    <div className="auth-container">
      {/* Left Side - Background */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <img src="/hospital_1392165.png" alt="" className="emoji" />
          </div>
          <h1 className={`auth-title ${language === "hi" ? "hindi-text" : ""}`}>{t("auth.welcome.title")}</h1>
          <p className={`auth-subtitle ${language === "hi" ? "hindi-text" : ""}`}>{t("auth.welcome.subtitle")}</p>

          {/* Voice Status Indicator */}
          {isSpeechReady && (
            <div className="voice-status" aria-live="polite">
              <span className="voice-indicator">🔊</span>
              <span className={`voice-text ${language === "hi" ? "hindi-text" : ""}`}>
                {language === "hi"
                  ? `आवाज़ सहायता: ${hindiVoice ? hindiVoice.name : "उपलब्ध"}`
                  : `Voice Support: ${englishVoice ? englishVoice.name : "Available"}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-right">
        {/* Language Switcher */}
        <button
          className="language-switcher-auth"
          onClick={toggleLanguage}
          onFocus={(e) => handleElementFocus(e.target)}
          tabIndex={0}
          id="languageToggleBtn"
        >
          <span className="language-icon">
            <img src="/globe_12925125.png" alt="" className="emoji" />
          </span>
          <span className={language === "hi" ? "hindi-text" : ""}>{language === "en" ? "हिंदी" : "English"}</span>
        </button>

        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2 className={`auth-form-title ${language === "hi" ? "hindi-text" : ""}`}>
              {isSignUp ? t("auth.signup.title") : t("auth.signin.title")}
            </h2>
            <p className={`auth-form-subtitle ${language === "hi" ? "hindi-text" : ""}`}>
              {isSignUp ? t("auth.signup.subtitle") : t("auth.signin.subtitle")}
            </p>

            {(isSignUp || currentStep === 2) && (
              <div className="auth-steps">
                <div className="step-indicator">
                  <div className={`step ${currentStep >= 1 ? "active" : "inactive"}`}>1</div>
                  <div className={`step-line ${currentStep > 1 ? "completed" : ""}`}></div>
                  <div className={`step ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : "inactive"}`}>
                    2
                  </div>
                </div>
              </div>
            )}
          </div>

          {errors.general && (
            <div className="error-message">
              <span>
                <img src="/warning_13898912.png" alt="" className="emoji" />
              </span>{" "}
              {errors.general}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span>
                <img src="/check-box_12503615.png" alt="" className="emoji" />
              </span>{" "}
              {success}
            </div>
          )}

          {/* Sign In Forms */}
          {!isSignUp && currentStep === 1 && (
            <form className="auth-form" onSubmit={handleSignInStep1}>
              <div className="form-group">
                <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                  <span className="form-icon">
                    <img src="mobile.png" alt="" className="emoji" />
                  </span>
                  {t("auth.mobile.label")}
                </label>
                <input
                  type="tel"
                  autoComplete="off"
                  name="mobile"
                  className={`form-input large ${errors.mobile ? "error" : ""}`}
                  placeholder={t("auth.mobile.placeholder")}
                  value={signInData.mobile}
                  onChange={(e) => {
                    handleSignInChange(e)
                    if (e.target.value.length === 10) {
                      const message =
                        language === "en"
                          ? authTranslations.en.auth_signin_sendotp_tip
                          : authTranslations.hi.auth_signin_sendotp_tip
                      speechAssistantRef.current?.speak(message)
                    }
                  }}
                  maxLength="10"
                  onFocus={(e) => {
                    const message =
                      language === "en"
                        ? authTranslations.en.auth_signin_mobile_prompt
                        : authTranslations.hi.auth_signin_mobile_prompt
                    speechAssistantRef.current?.speak(message)
                    handleElementFocus(e.target)
                    // Auto-open quick digit capture on focus when TTS available
                    if (isSpeechReady) startQuickDigitCapture({ targetType: "mobile" })
                  }}
                  autoFocus
                  tabIndex={0}
                />
                {errors.mobile && (
                  <div className="error-message">
                    <img src="/warning_13898912.png" alt="" className="emoji" /> {errors.mobile}
                  </div>
                )}
              </div>

              <div className="info-message">
                <span>
                  <img src="/letter-i_9867076.png" alt="" className="emoji" />
                </span>
                <span className={language === "hi" ? "hindi-text" : ""}>{t("auth.mobile.info")}</span>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
                onFocus={(e) => handleElementFocus(e.target)}
                onClick={() => {
                  sendOtp(signInData?.mobile);// keep previous behavior: advance to OTP screen; the network call sendOtp is available as function
                  setCurrentStep(2)
                }}
                tabIndex={0}
              >
                {loading && <span className="loading-spinner"></span>}
                <span className={language === "hi" ? "hindi-text" : ""}>
                  {loading ? t("auth.sending.otp") : t("auth.send.otp")}
                </span>
              </button>
            </form>
          )}

          {!isSignUp && currentStep === 2 && (
            <form className="auth-form" onSubmit={handleSignInStep2}>
              <div className="form-group">
                <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                  <span className="form-icon">
                    <img src="lock.png" alt="" className="emoji" />
                  </span>
                  {t("auth.otp.label")}
                </label>
                <div className="otp-container">
                  {signInData.otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value, false)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      onFocus={(e) => {
                        handleElementFocus(e.target)
                        // Quick capture for OTP when focused
                        if (isSpeechReady && index === 0) {
                          startQuickDigitCapture({ targetType: "otp", targetIndex: 0, isForSignUp: false })
                        } else {
                          const message =
                            language === "en"
                              ? authTranslations.en.auth_otp_verify_tip
                              : authTranslations.hi.auth_otp_verify_tip
                          speechAssistantRef.current?.speak(message)
                        }
                      }}
                      maxLength="1"
                      tabIndex={0}
                      className="otp-input"
                    />
                  ))}
                </div>
                {errors.otp && (
                  <div className="error-message">
                    <img src="/warning_13898912.png" alt="" className="emoji" /> {errors.otp}
                  </div>
                )}
              </div>

              {otpTimer > 0 && (
                <div className={`timer-display ${language === "hi" ? "hindi-text" : ""}`}>
                  {t("auth.otp.timer")} {otpTimer} {t("auth.seconds")}
                </div>
              )}

              {canResendOtp && (
                <div style={{ textAlign: "center" }}>
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("auth.otp.not.received")} </span>
                  <button
                    type="button"
                    className="resend-button"
                    onClick={handleResendOtp}
                    onFocus={(e) => handleElementFocus(e.target)}
                    tabIndex={0}
                  >
                    <span className={language === "hi" ? "hindi-text" : ""}>{t("auth.otp.resend")}</span>
                  </button>
                </div>
              )}

              <div className="button-row">
                <button
                  type="button"
                  className="auth-button secondary"
                  onClick={handleBack}
                  onFocus={(e) => handleElementFocus(e.target)}
                  tabIndex={0}
                >
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("auth.back")}</span>
                </button>
                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                  onFocus={(e) => handleElementFocus(e.target)}
                  tabIndex={0}
                  onClick={() => {
                    verifyOtp(signInData.otp);// preserve behavior: navigation to form is present in original code
                    navigate("/form")
                  }}
                  id="verifyOtpBtn"
                >
                  {loading && <span className="loading-spinner"></span>}
                  <span className={language === "hi" ? "hindi-text" : ""}>
                    {loading ? t("auth.verifying") : t("auth.verify.signin")}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Forms */}
          {isSignUp && currentStep === 1 && (
            <form className="auth-form" onSubmit={handleSignUpStep1}>
              <div className="form-group">
                <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                  <span className="form-icon">
                    <img
                      src="/toppng.com-icons-logos-emojis-user-icon-png-transparent-2400x2305.png"
                      alt=""
                      className="emoji"
                    />
                  </span>
                  {t("auth.name.label")}
                </label>
                <input
                  type="text"
                  name="fullName"
                  className={`form-input ${errors.fullName ? "error" : ""}`}
                  placeholder={t("auth.name.placeholder")}
                  value={signUpData.fullName}
                  onChange={handleSignUpChange}
                  onBlur={(e) => {
                    if (e.target.value.length !== 0) {
                      const message =
                        language === "en"
                          ? authTranslations.en.auth_mobile_prompt
                          : authTranslations.hi.auth_mobile_prompt
                      speechAssistantRef.current?.speak(message)
                    }
                  }}
                  onFocus={(e) => handleElementFocus(e.target)}
                  tabIndex={0}
                  autoFocus
                />
                {errors.fullName && (
                  <div className="error-message">
                    <img src="/warning_13898912.png" alt="" className="emoji" /> {errors.fullName}
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                    <span className="form-icon">
                      <img src="/mobile.png" alt="" className="emoji" />
                    </span>
                    {t("auth.mobile.label")}
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    className={`form-input ${errors.mobile ? "error" : ""}`}
                    placeholder={t("auth.mobile.placeholder")}
                    value={signUpData.mobile}
                    onChange={(e) => {
                      handleSignUpChange(e)
                      if (e.target.value.length === 10) {
                        const message =
                          language === "en" ? authTranslations.en.auth_dob_prompt : authTranslations.hi.auth_dob_prompt
                        speechAssistantRef.current?.speak(message)
                        setTimeout(() => {
                          const dayMessage =
                            language === "en" ? authTranslations.en.auth_dob_day : authTranslations.hi.auth_dob_day
                          speechAssistantRef.current?.speak(dayMessage)
                        }, 3200)
                      }
                    }}
                    maxLength="10"
                    onFocus={(e) => {
                      handleElementFocus(e.target)
                      if (isSpeechReady) startQuickDigitCapture({ targetType: "mobile" })
                    }}
                    tabIndex={0}
                  />
                  {errors.mobile && (
                    <div className="error-message">
                      <img src="/warning_13898912.png" alt="" className="emoji" /> {errors.mobile}
                    </div>
                  )}
                </div>
                <br />
                <div className="form-group">
                  <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                    <span className="form-icon">
                      <img src="/schedule_3174027.png" alt="" className="emoji" />
                    </span>
                    {t("auth.dob.label")}
                  </label>
                  <div className="dob-labels">
                    <div className={`dob-label ${language === "hi" ? "hindi-text" : ""}`}>{t("auth.dob.day")}</div>
                    <div className={`dob-label ${language === "hi" ? "hindi-text" : ""}`}>{t("auth.dob.month")}</div>
                    <div className={`dob-label ${language === "hi" ? "hindi-text" : ""}`}>{t("auth.dob.year")}</div>
                  </div>
                  <div className="dob-container">
                    <select
                      className={`dob-select ${errors.dateOfBirth ? "error" : ""}`}
                      value={signUpData.dobDay}
                      onChange={(e) => {
                        handleDobChange("dobDay", e.target.value)
                        if (e.target.value) {
                          const message =
                            language === "en" ? authTranslations.en.auth_dob_month : authTranslations.hi.auth_dob_month
                          speechAssistantRef.current?.speak(message)
                        }
                      }}
                      onFocus={(e) => handleElementFocus(e.target)}
                      tabIndex={0}
                    >
                      <option value="">{t("auth.dob.day.placeholder")}</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day.toString().padStart(2, "0")}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <select
                      className={`dob-select ${errors.dateOfBirth ? "error" : ""}`}
                      value={signUpData.dobMonth}
                      onChange={(e) => {
                        handleDobChange("dobMonth", e.target.value)
                        if (e.target.value) {
                          const message =
                            language === "en" ? authTranslations.en.auth_dob_year : authTranslations.hi.auth_dob_year
                          speechAssistantRef.current?.speak(message)
                        }
                      }}
                      onFocus={(e) => handleElementFocus(e.target)}
                      tabIndex={0}
                    >
                      <option value="">{t("auth.dob.month.placeholder")}</option>
                      {[
                        { value: "01", label: "January", hindi: "जनवरी" },
                        { value: "02", label: "February", hindi: "फरवरी" },
                        { value: "03", label: "March", hindi: "मार्च" },
                        { value: "04", label: "April", hindi: "अप्रैल" },
                        { value: "05", label: "May", hindi: "मई" },
                        { value: "06", label: "June", hindi: "जून" },
                        { value: "07", label: "July", hindi: "जुलाई" },
                        { value: "08", label: "August", hindi: "अगस्त" },
                        { value: "09", label: "September", hindi: "सितंबर" },
                        { value: "10", label: "October", hindi: "अक्टूबर" },
                        { value: "11", label: "November", hindi: "नवंबर" },
                        { value: "12", label: "December", hindi: "दिसंबर" },
                      ].map((month) => (
                        <option key={month.value} value={month.value}>
                          {language === "hi" ? month.hindi : month.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className={`dob-select ${errors.dateOfBirth ? "error" : ""}`}
                      value={signUpData.dobYear}
                      onChange={(e) => {
                        handleDobChange("dobYear", e.target.value)
                        if (e.target.value) {
                          const message =
                            language === "en"
                              ? authTranslations.en.auth_gender_prompt
                              : authTranslations.hi.auth_gender_prompt
                          speechAssistantRef.current?.speak(message)
                        }
                      }}
                      onFocus={(e) => handleElementFocus(e.target)}
                      tabIndex={0}
                    >
                      <option value="">{t("auth.dob.year.placeholder")}</option>
                      {(() => {
                        const currentYear = new Date().getFullYear()
                        const years = []
                        for (let i = currentYear; i >= currentYear - 100; i--) years.push(i)
                        return years
                      })().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.dateOfBirth && (
                    <div className="error-message">
                      <img src="/warning_13898912.png" alt="" className="emoji" /> {errors.dateOfBirth}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                  <span className="form-icon">
                    <img src="/favpng_669931cf74973c56c4d211e84d4a74b2.png" alt="" className="emoji" />
                  </span>
                  {t("auth.gender.label")}
                </label>
                <div className="gender-options">
                  <div
                    className={`gender-option ${signUpData.gender === "male" ? "selected" : ""}`}
                    onClick={() => handleGenderSelect("male")}
                    onFocus={(e) => handleElementFocus(e.target)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={signUpData.gender === "male"}
                  >
                    <div className="gender-icon">
                      <img src="/man_11696179.png" alt="" className="emoji" />
                    </div>
                    <div className={`gender-text ${language === "hi" ? "hindi-text" : ""}`}>
                      {t("auth.gender.male")}
                    </div>
                  </div>
                  <div
                    className={`gender-option ${signUpData.gender === "female" ? "selected" : ""}`}
                    onClick={() => handleGenderSelect("female")}
                    onFocus={(e) => handleElementFocus(e.target)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={signUpData.gender === "female"}
                  >
                    <div className="gender-icon">
                      <img src="/woman_5732666.png" alt="" className="emoji" />
                    </div>
                    <div className={`gender-text ${language === "hi" ? "hindi-text" : ""}`}>
                      {t("auth.gender.female")}
                    </div>
                  </div>
                  <div
                    className={`gender-option ${signUpData.gender === "other" ? "selected" : ""}`}
                    onClick={() => handleGenderSelect("other")}
                    onFocus={(e) => handleElementFocus(e.target)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={signUpData.gender === "other"}
                  >
                    <div className="gender-icon">
                      <img
                        src="/toppng.com-icons-logos-emojis-user-icon-png-transparent-2400x2305.png"
                        alt=""
                        className="emoji"
                      />
                    </div>
                    <div className={`gender-text ${language === "hi" ? "hindi-text" : ""}`}>
                      {t("auth.gender.other")}
                    </div>
                  </div>
                </div>
                {errors.gender && (
                  <div className="error-message">
                    <img src="/warning_13898912.png" alt="" className="emoji" /> {errors.gender}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                  <span className="form-icon">
                    <img src="/id-card_529593.png" alt="" className="emoji" />
                  </span>
                  {t("auth.aadhaar.label")}
                </label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  className={`form-input ${errors.aadhaarNumber ? "error" : ""}`}
                  placeholder={t("auth.aadhaar.placeholder")}
                  value={signUpData.aadhaarNumber}
                  onChange={(e) => {
                    handleAadhaarChange(e)
                    if (e.target.value.replace(/\s/g, "").length === 12) {
                      const message =
                        language === "en"
                          ? authTranslations.en.auth_aadhaar_info
                          : authTranslations.hi.auth_aadhaar_info
                      speechAssistantRef.current?.speak(message)
                      setTimeout(() => {
                        const continueMessage =
                          language === "en"
                            ? authTranslations.en.auth_signup_continue_button
                            : authTranslations.hi.auth_signup_continue_button
                        speechAssistantRef.current?.speak(continueMessage)
                      }, 3000)
                    }
                  }}
                  maxLength="14"
                  onFocus={(e) => {
                    handleElementFocus(e.target)
                    if (isSpeechReady) startQuickDigitCapture({ targetType: "aadhaar" })
                  }}
                  tabIndex={0}
                />
                {errors.aadhaarNumber && (
                  <div className="error-message">
                    <img src="/warning_13898912.png" alt="" className="emoji" /> {errors.aadhaarNumber}
                  </div>
                )}
                <div className="info-message">
                  <span>
                    <img src="lock.png" alt="" className="emoji" />
                  </span>
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("auth.aadhaar.info")}</span>
                </div>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
                onFocus={(e) => handleElementFocus(e.target)}
                tabIndex={0}
              >
                {loading && <span className="loading-spinner"></span>}
                <span className={language === "hi" ? "hindi-text" : ""}>
                  {loading ? t("auth.sending.otp") : t("auth.continue")}
                </span>
              </button>
            </form>
          )}

          {isSignUp && currentStep === 2 && (
            <form className="auth-form" onSubmit={handleSignUpStep2}>
              <div className="form-group">
                <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                  <span className="form-icon">
                    <img src="/lock.png" alt="" className="emoji" />
                  </span>
                  {t("auth.otp.label")}
                </label>
                <div className="otp-container">
                  {signUpData.otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      className="otp-input"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value, true)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      onFocus={(e) => {
                        handleElementFocus(e.target)
                        if (isSpeechReady && index === 0) startQuickDigitCapture({ targetType: "otp", isForSignUp: true })
                      }}
                      maxLength="1"
                      tabIndex={0}
                    />
                  ))}
                </div>
                {errors.otp && <div className="error-message">⚠️ {errors.otp}</div>}
              </div>

              {otpTimer > 0 && (
                <div className={`timer-display ${language === "hi" ? "hindi-text" : ""}`}>
                  {t("auth.otp.timer")} {otpTimer} {t("auth.seconds")}
                </div>
              )}

              {canResendOtp && (
                <div style={{ textAlign: "center" }}>
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("auth.otp.not.received")} </span>
                  <button
                    type="button"
                    className="resend-button"
                    onClick={handleResendOtp}
                    onFocus={(e) => handleElementFocus(e.target)}
                    tabIndex={0}
                  >
                    <span className={language === "hi" ? "hindi-text" : ""}>{t("auth.otp.resend")}</span>
                  </button>
                </div>
              )}

              <div className="button-row">
                <button
                  type="button"
                  className="auth-button secondary"
                  onClick={handleBack}
                  onFocus={(e) => handleElementFocus(e.target)}
                  tabIndex={0}
                >
                  <span className={language === "hi" ? "hindi-text" : ""}>{t("auth.back")}</span>
                </button>
                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                  onFocus={(e) => handleElementFocus(e.target)}
                  tabIndex={0}
                >
                  {loading && <span className="loading-spinner"></span>}
                  <span className={language === "hi" ? "hindi-text" : ""}>
                    {loading ? t("auth.creating.account") : t("auth.create.account")}
                  </span>
                </button>
              </div>
            </form>
          )}

          {!isSignUp && currentStep === 2 && (
            <div className="info-message">
              <span className={language === "hi" ? "hindi-text" : ""}>{t("auth.demo.otp")}: 123456</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

}
