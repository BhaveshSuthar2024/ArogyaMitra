"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "../contexts/LanguageContext.jsx"
import { useNavigate } from "react-router-dom"
import { authTranslations } from "./SpeechSync.js"
import axios from "axios"
import "./Auth.css"

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
  const speechQueue = useRef([])
  const isSpeaking = useRef(false)

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

  // Initialize Speech with Hindi and English support
  useEffect(() => {
    const initializeSpeech = async () => {
      try {
        if ("speechSynthesis" in window) {
          console.log("Initializing Web Speech API with Hindi support...")

          // Wait for voices to load
          const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices()
            setAvailableVoices(voices)

            // Find Hindi voices
            const hindiVoices = voices.filter(
              (voice) =>
                voice.lang.includes("hi") ||
                voice.lang.includes("hi-IN") ||
                voice.name.toLowerCase().includes("hindi") ||
                voice.name.toLowerCase().includes("devanagari"),
            )

            // Find English voices
            const englishVoices = voices.filter(
              (voice) =>
                voice.lang.includes("en") ||
                voice.lang.includes("en-US") ||
                voice.lang.includes("en-IN") ||
                voice.name.toLowerCase().includes("english"),
            )

            // Set preferred voices
            if (hindiVoices.length > 0) {
              // Prefer Indian English or Hindi voices
              const preferredHindi =
                hindiVoices.find((voice) => voice.lang === "hi-IN" || voice.name.toLowerCase().includes("indian")) ||
                hindiVoices[0]
              setHindiVoice(preferredHindi)
              console.log("Hindi voice found:", preferredHindi.name)
            }

            if (englishVoices.length > 0) {
              // Prefer Indian English voices for better accent
              const preferredEnglish =
                englishVoices.find((voice) => voice.lang === "en-IN" || voice.name.toLowerCase().includes("indian")) ||
                englishVoices.find((voice) => voice.lang === "en-US") ||
                englishVoices[0]
              setEnglishVoice(preferredEnglish)
              console.log("English voice found:", preferredEnglish.name)
            }

            setIsSpeechReady(true)

            // Test speech with appropriate language
            const welcomeMessage = language === "hi" ? "मेडिकल कियोस्क में आपका स्वागत है" : "Welcome to the medical kiosk"
            speak(welcomeMessage)
          }

          // Load voices immediately if available
          if (window.speechSynthesis.getVoices().length > 0) {
            loadVoices()
          } else {
            // Wait for voices to load
            window.speechSynthesis.onvoiceschanged = loadVoices

            // Fallback timeout
            setTimeout(() => {
              if (window.speechSynthesis.getVoices().length > 0) {
                loadVoices()
              }
            }, 1000)
          }
        } else {
          // Fallback to mespeak.js
          console.log("Web Speech API not available, attempting to load mespeak.js...")
          await loadMeSpeak()
        }
      } catch (error) {
        console.error("Error initializing speech:", error)
        setIsSpeechReady(false)
      }
    }

    initializeSpeech()
  }, [])

  // Update voices when language changes
  useEffect(() => {
    if (isSpeechReady && availableVoices.length > 0) {
      console.log(`Language changed to: ${language}`)

      // Test speech in new language
      const testMessage = language === "hi" ? "भाषा बदल गई है" : "Language has been changed"

      setTimeout(() => {
        speak(testMessage)
      }, 500)
    }
  }, [language, isSpeechReady, availableVoices])

  const loadMeSpeak = () => {
    return new Promise((resolve, reject) => {
      if (window.meSpeak) {
        initializeMeSpeak().then(resolve).catch(reject)
        return
      }

      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/mespeak@1.9.2/src/mespeak.js"
      script.onload = () => {
        console.log("MeSpeak loaded from CDN")
        initializeMeSpeak().then(resolve).catch(reject)
      }
      script.onerror = () => {
        console.error("Failed to load mespeak from CDN")
        reject(new Error("MeSpeak loading failed"))
      }
      document.head.appendChild(script)
    })
  }

  const initializeMeSpeak = () => {
    return new Promise((resolve, reject) => {
      if (!window.meSpeak) {
        reject(new Error("MeSpeak not available"))
        return
      }

      try {
        window.meSpeak.loadConfig("https://cdn.jsdelivr.net/npm/mespeak@1.9.2/src/mespeak_config.json")
        window.meSpeak.loadVoice("https://cdn.jsdelivr.net/npm/mespeak@1.9.2/voices/en/en-us.json", (success) => {
          if (success) {
            console.log("MeSpeak voice loaded successfully")
            setIsSpeechReady(true)
            window.meSpeak.speak("Welcome to the medical kiosk!", {
              amplitude: 100,
              pitch: 50,
              speed: 175,
            })
            resolve()
          } else {
            console.error("Failed to load MeSpeak voice")
            reject(new Error("Voice loading failed"))
          }
        })
      } catch (error) {
        console.error("Error initializing MeSpeak:", error)
        reject(error)
      }
    })
  }

  // Enhanced speak function with Hindi/English voice selection
  const speak = (text, options = {}) => {
    if (!isSpeechReady || !text) {
      console.warn("Speech not ready or no text provided")
      return
    }

    // Add to queue with language context
    speechQueue.current.push({
      text,
      options,
      language: language, // Current language context
    })

    if (!isSpeaking.current) {
      processSpeechQueue()
    }
  }

  const processSpeechQueue = () => {
    if (speechQueue.current.length === 0) {
      isSpeaking.current = false
      return
    }

    isSpeaking.current = true
    const { text, options, language: textLanguage } = speechQueue.current.shift()

    try {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)

        // Select appropriate voice based on language
        let selectedVoice = null
        if (textLanguage === "hi" && hindiVoice) {
          selectedVoice = hindiVoice
          utterance.lang = "hi-IN"
        } else if (textLanguage === "en" && englishVoice) {
          selectedVoice = englishVoice
          utterance.lang = "en-IN"
        } else {
          // Fallback to any available voice
          const voices = window.speechSynthesis.getVoices()
          selectedVoice = voices.find((voice) => voice.lang.includes(textLanguage)) || voices[0]
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice
          console.log(`Speaking in ${textLanguage} using voice: ${selectedVoice.name}`)
        }

        // Configure speech parameters
        utterance.rate = options.speed ? options.speed / 175 : textLanguage === "hi" ? 0.7 : 0.8
        utterance.pitch = options.pitch ? options.pitch / 50 : textLanguage === "hi" ? 0.9 : 1.0
        utterance.volume = options.amplitude ? options.amplitude / 100 : 1

        utterance.onend = () => {
          setTimeout(() => {
            processSpeechQueue()
          }, 500)
        }

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event.error)
          setTimeout(() => {
            processSpeechQueue()
          }, 500)
        }

        // Cancel any ongoing speech before starting new one
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
      } else if (window.meSpeak) {
        // MeSpeak fallback (English only)
        const defaultOptions = {
          amplitude: 100,
          pitch: 50,
          speed: 250,
          ...options,
        }

        window.meSpeak.speak(text, {
          ...defaultOptions,
          callback: () => {
            setTimeout(() => {
              processSpeechQueue()
            }, 500)
          },
        })
      } else {
        setTimeout(() => {
          processSpeechQueue()
        }, 100)
      }
    } catch (error) {
      console.error("Error during speech:", error)
      setTimeout(() => {
        processSpeechQueue()
      }, 500)
    }
  }

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
    if (window.meSpeak && window.meSpeak.stop) {
      window.meSpeak.stop()
    }
    speechQueue.current = []
    isSpeaking.current = false
  }

  const generateDays = () => {
    const days = []
    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    return days
  }

  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 100; i--) {
      years.push(i)
    }
    return years
  }

  const months = [
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
  ]

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
        ? "http://localhost:3000/api/v1/auth/request-otp"
        : "http://localhost:3000/api/v1/auth/login/request-otp"
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
      setCurrentStep(2)
    } catch (error) {
      setErrors({ general: error?.response?.data?.error || "Failed to send OTP" })
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
        ? "http://localhost:3000/api/v1/auth/register"
        : "http://localhost:3000/api/v1/auth/login/verify"
      const res = await axios.post(endpoint, { mobileNo, otp }, { withCredentials: true })
      setSuccess(t("auth.otp.verified"))
      return res.data
    } catch (error) {
      setErrors({ otp: error?.response?.data?.error || "OTP verification failed" })
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleSignInStep1 = async (e) => {
    e.preventDefault()
    if (!validateMobile(signInData.mobile)) {
      setErrors({ mobile: t("auth.error.mobile.invalid") })
      return
    }

    const message = language === "en" ? authTranslations.en.auth_otp_info : authTranslations.hi.auth_otp_info
    speak(message)

    setTimeout(() => {
      const otpMessage =
        language === "en" ? authTranslations.en.auth_otp_input_label : authTranslations.hi.auth_otp_input_label
      speak(otpMessage)
    }, 2000)

    setCurrentStep(2)
  }

  const handleSignInStep2 = async (e) => {
    e.preventDefault()
    if (!validateOtp(signInData.otp)) {
      setErrors({ otp: t("auth.error.otp.incomplete") })
      return
    }
    navigate("/patient")
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
      return
    }
    setCurrentStep(2)
  }

  const handleSignUpStep2 = async (e) => {
    e.preventDefault()
    if (!validateOtp(signUpData.otp)) {
      setErrors({ otp: t("auth.error.otp.incomplete") })
      return
    }
    navigate("/patient")
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
      speak(message)
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
    speak(message)

    setTimeout(() => {
      const nameMessage =
        language === "en" ? authTranslations.en.auth_name_prompt : authTranslations.hi.auth_name_prompt
      speak(nameMessage)
    }, 7000)
    resetForm()
  }

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
          stopSpeech()
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

  return (
    <div className="auth-container">
      {/* Left Side - Background */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <img src="public/hospital_1392165.png" alt="" className="emoji" />
          </div>
          <h1 className={`auth-title ${language === "hi" ? "hindi-text" : ""}`}>{t("auth.welcome.title")}</h1>
          <p className={`auth-subtitle ${language === "hi" ? "hindi-text" : ""}`}>{t("auth.welcome.subtitle")}</p>

          {/* Voice Status Indicator */}
          {isSpeechReady && (
            <div className="voice-status">
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
            <img src="public/globe_12925125.png" alt="" className="emoji" />
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

            {/* Step Indicator */}
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
                <img src="public/warning_13898912.png" alt="" className="emoji" />
              </span>{" "}
              {errors.general}
            </div>
          )}

          {success && (
            <div className="success-message">
              <span>
                <img src="public/check-box_12503615.png" alt="" className="emoji" />
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
                      speak(message)
                    }
                  }}
                  maxLength="10"
                  onFocus={(e) => {
                    const message =
                      language === "en"
                        ? authTranslations.en.auth_signin_mobile_prompt
                        : authTranslations.hi.auth_signin_mobile_prompt
                    speak(message)
                    handleElementFocus(e.target)
                  }}
                  autoFocus
                  tabIndex={0}
                />
                {errors.mobile && (
                  <div className="error-message">
                    <img src="public/warning_13898912.png" alt="" className="emoji" /> {errors.mobile}
                  </div>
                )}
              </div>

              <div className="info-message">
                <span>
                  <img src="public/letter-i_9867076.png" alt="" className="emoji" />
                </span>
                <span className={language === "hi" ? "hindi-text" : ""}>{t("auth.mobile.info")}</span>
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
                      onFocus={(e) => handleElementFocus(e.target)}
                      onBlur={() => {
                        const message =
                          language === "en"
                            ? authTranslations.en.auth_otp_verify_tip
                            : authTranslations.hi.auth_otp_verify_tip
                        speak(message)
                      }}
                      maxLength="1"
                      tabIndex={0}
                      className="otp-input"
                    />
                  ))}
                </div>
                {errors.otp && (
                  <div className="error-message">
                    <img src="public/warning_13898912.png" alt="" className="emoji" /> {errors.otp}
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
                      src="public/toppng.com-icons-logos-emojis-user-icon-png-transparent-2400x2305.png"
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
                      speak(message)
                    }
                  }}
                  onFocus={(e) => handleElementFocus(e.target)}
                  tabIndex={0}
                  autoFocus
                />
                {errors.fullName && (
                  <div className="error-message">
                    <img src="public/warning_13898912.png" alt="" className="emoji" /> {errors.fullName}
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                    <span className="form-icon">
                      <img src="public/mobile.png" alt="" className="emoji" />
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
                        speak(message)
                        setTimeout(() => {
                          const dayMessage =
                            language === "en" ? authTranslations.en.auth_dob_day : authTranslations.hi.auth_dob_day
                          speak(dayMessage)
                        }, 3200)
                      }
                    }}
                    maxLength="10"
                    onFocus={(e) => handleElementFocus(e.target)}
                    tabIndex={0}
                  />
                  {errors.mobile && (
                    <div className="error-message">
                      <img src="public/warning_13898912.png" alt="" className="emoji" /> {errors.mobile}
                    </div>
                  )}
                </div>
                <br />
                <div className="form-group">
                  <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                    <span className="form-icon">
                      <img src="public/schedule_3174027.png" alt="" className="emoji" />
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
                          speak(message)
                        }
                      }}
                      onFocus={(e) => handleElementFocus(e.target)}
                      tabIndex={0}
                    >
                      <option value="">{t("auth.dob.day.placeholder")}</option>
                      {generateDays().map((day) => (
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
                          speak(message)
                        }
                      }}
                      onFocus={(e) => handleElementFocus(e.target)}
                      tabIndex={0}
                    >
                      <option value="">{t("auth.dob.month.placeholder")}</option>
                      {months.map((month) => (
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
                          speak(message)
                        }
                      }}
                      onFocus={(e) => handleElementFocus(e.target)}
                      tabIndex={0}
                    >
                      <option value="">{t("auth.dob.year.placeholder")}</option>
                      {generateYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.dateOfBirth && (
                    <div className="error-message">
                      <img src="public/warning_13898912.png" alt="" className="emoji" /> {errors.dateOfBirth}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                  <span className="form-icon">
                    <img src="public/favpng_669931cf74973c56c4d211e84d4a74b2.png" alt="" className="emoji" />
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
                      <img src="public/man_11696179.png" alt="" className="emoji" />
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
                      <img src="public/woman_5732666.png" alt="" className="emoji" />
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
                        src="public/toppng.com-icons-logos-emojis-user-icon-png-transparent-2400x2305.png"
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
                    <img src="public/warning_13898912.png" alt="" className="emoji" /> {errors.gender}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className={`form-label ${language === "hi" ? "hindi-text" : ""}`}>
                  <span className="form-icon">
                    <img src="public/id-card_529593.png" alt="" className="emoji" />
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
                    if (e.target.value.length === 12) {
                      const message =
                        language === "en"
                          ? authTranslations.en.auth_aadhaar_info
                          : authTranslations.hi.auth_aadhaar_info
                      speak(message)
                      setTimeout(() => {
                        const continueMessage =
                          language === "en"
                            ? authTranslations.en.auth_signup_continue_button
                            : authTranslations.hi.auth_signup_continue_button
                        speak(continueMessage)
                      }, 6000)
                    }
                  }}
                  maxLength="14"
                  onFocus={(e) => handleElementFocus(e.target)}
                  tabIndex={0}
                />
                {errors.aadhaarNumber && (
                  <div className="error-message">
                    <img src="public/warning_13898912.png" alt="" className="emoji" /> {errors.aadhaarNumber}
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
                    <img src="public/lock.png" alt="" className="emoji" />
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
                      onFocus={(e) => handleElementFocus(e.target)}
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

          {/* Switch between Sign In/Sign Up */}
          <div className="auth-switch">
            <span className={`auth-switch-text ${language === "hi" ? "hindi-text" : ""}`}>
              {isSignUp ? t("auth.have.account") : t("auth.no.account")}
            </span>
            <span
              className={`auth-switch-link ${language === "hi" ? "hindi-text" : ""}`}
              onClick={switchAuthMode}
              onFocus={(e) => handleElementFocus(e.target)}
              tabIndex={0}
              role="button"
            >
              {isSignUp ? t("auth.signin.title") : t("auth.signup.title")}
            </span>
          </div>

          {/* Demo Info */}
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
