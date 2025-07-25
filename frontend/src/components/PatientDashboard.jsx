"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useLanguage } from "../contexts/LanguageContext.jsx"
import "./PatientDashboard.css"
import HealthScanner from "./HealthScanner.jsx"
import axios from "axios"

/**
 * PatientDashboard - Medical Kiosk with Comprehensive Keypad Navigation
 *
 * This component implements a complete keypad navigation system similar to old mobile phones,
 * allowing users to navigate through the entire interface using only arrow keys, Enter, and Backspace.
 *
 * KEYBOARD NAVIGATION FEATURES:
 * ============================
 *
 * Navigation Modes:
 * - SIDEBAR: Navigate through menu items (default mode)
 * - CONTENT: Navigate through buttons and interactive elements in the main content
 * - MODAL: Navigate through modal dialog elements
 *
 * Key Controls:
 * - ↑/↓ Arrow Keys: Navigate up/down in current mode
 * - ←/→ Arrow Keys: Switch between sidebar and content modes
 * - Enter: Activate the currently focused element
 * - Backspace: Go back (return to sidebar from content, or go to back button)
 * - F1 or ?: Show/hide keyboard navigation help
 * - Escape: Close modals or help overlay
 *
 * Visual Feedback:
 * - Focused elements have blue outline and shadow
 * - Sidebar items slide right and change color when focused
 * - Buttons scale up slightly when focused
 * - Icons pulse animation for focused navigation items
 * - Navigation status indicator shows current mode and position
 *
 * Accessibility Features:
 * - All interactive elements are keyboard accessible
 * - Focus management and restoration
 * - Respects prefers-reduced-motion for animations
 * - Clear visual indicators for current focus
 * - Comprehensive help system
 *
 * Implementation Details:
 * - Uses refs to manage focus across different UI sections
 * - Automatic registration of interactive elements in content areas
 * - State management for navigation mode and focus indices
 * - Event handling with proper cleanup
 * - Smooth transitions and animations for better UX
 */

export default function PatientDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)

  const navigate = useNavigate()
  const { logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  // Navigation state
  const [navigationMode, setNavigationMode] = useState("sidebar") // "sidebar", "content", "modal"
  const [focusedSidebarIndex, setFocusedSidebarIndex] = useState(0)
  const [focusedContentIndex, setFocusedContentIndex] = useState(0)
  const [focusedModalIndex, setFocusedModalIndex] = useState(0)

  // Refs for navigation
  const sidebarRefs = useRef([])
  const contentRefs = useRef([])
  const modalRefs = useRef([])
  const backButtonRef = useRef(null)
  const signOutButtonRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  // Comprehensive Keypad Navigation System
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Show keyboard help with F1 or ?
      if (e.key === "F1" || (e.key === "?" && !showModal)) {
        e.preventDefault()
        setShowKeyboardHelp(!showKeyboardHelp)
        return
      }

      // Hide keyboard help if it's showing
      if (showKeyboardHelp && e.key === "Escape") {
        e.preventDefault()
        setShowKeyboardHelp(false)
        return
      }

      // Skip navigation if help is showing
      if (showKeyboardHelp) return

      // Prevent default browser behavior for navigation keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Backspace"].includes(e.key)) {
        e.preventDefault()
      }

      if (showModal) {
        handleModalNavigation(e)
      } else if (navigationMode === "sidebar") {
        handleSidebarNavigation(e)
      } else if (navigationMode === "content") {
        handleContentNavigation(e)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [navigationMode, focusedSidebarIndex, focusedContentIndex, focusedModalIndex, showModal, activeSection])

  // Initialize focus on component mount
  useEffect(() => {
    if (sidebarRefs.current[0]) {
      sidebarRefs.current[0].focus()
    }
  }, [])

  // Update content refs when section changes
  useEffect(() => {
    setFocusedContentIndex(0)
    contentRefs.current = []
  }, [activeSection])

  const handleSidebarNavigation = (e) => {
    const totalSidebarItems = getTotalSidebarItems()

    switch (e.key) {
      case "ArrowDown":
        const nextIndex = (focusedSidebarIndex + 1) % totalSidebarItems
        setFocusedSidebarIndex(nextIndex)
        focusElementByIndex(sidebarRefs.current, nextIndex)
        break

      case "ArrowUp":
        const prevIndex = (focusedSidebarIndex - 1 + totalSidebarItems) % totalSidebarItems
        setFocusedSidebarIndex(prevIndex)
        focusElementByIndex(sidebarRefs.current, prevIndex)
        break

      case "ArrowRight":
      case "Enter":
        if (sidebarRefs.current[focusedSidebarIndex]) {
          sidebarRefs.current[focusedSidebarIndex].click()
          setNavigationMode("content")
          setTimeout(() => {
            if (contentRefs.current[0]) {
              contentRefs.current[0].focus()
            }
          }, 100)
        }
        break

      case "Backspace":
        // Go to back button
        if (backButtonRef.current) {
          backButtonRef.current.focus()
        }
        break
    }
  }

  const handleContentNavigation = (e) => {
    const totalContentItems = contentRefs.current.length

    console.log(contentRefs)

    switch (e.key) {
      case "ArrowDown":
        if (totalContentItems > 0) {
          const nextIndex = (focusedContentIndex + 1) % totalContentItems
          setFocusedContentIndex(nextIndex)
          focusElementByIndex(contentRefs.current, nextIndex)
        }
        break

      case "ArrowUp":
        if (totalContentItems > 0) {
          const prevIndex = (focusedContentIndex - 1 + totalContentItems) % totalContentItems
          setFocusedContentIndex(prevIndex)
          focusElementByIndex(contentRefs.current, prevIndex)
        }
        break

      case "ArrowLeft":
      case "Backspace":
        setNavigationMode("sidebar")
        setTimeout(() => {
          if (sidebarRefs.current[focusedSidebarIndex]) {
            sidebarRefs.current[focusedSidebarIndex].focus()
          }
        }, 100)
        break

      case "Enter":
        if (contentRefs.current[focusedContentIndex]) {
          contentRefs.current[focusedContentIndex].click()
        }
        break
    }
  }

  const handleModalNavigation = (e) => {
    const totalModalItems = modalRefs.current.length

    switch (e.key) {
      case "ArrowDown":
        if (totalModalItems > 0) {
          const nextIndex = (focusedModalIndex + 1) % totalModalItems
          setFocusedModalIndex(nextIndex)
          focusElementByIndex(modalRefs.current, nextIndex)
        }
        break

      case "ArrowUp":
        if (totalModalItems > 0) {
          const prevIndex = (focusedModalIndex - 1 + totalModalItems) % totalModalItems
          setFocusedModalIndex(prevIndex)
          focusElementByIndex(modalRefs.current, prevIndex)
        }
        if (totalModalItems === 0) {
          backButtonRef.current.focus()
        }
        break

      case "Enter":
        if (modalRefs.current[focusedModalIndex]) {
          modalRefs.current[focusedModalIndex].click()
        }
        break

      case "Backspace":
      case "Escape":
        closeModal()
        break
    }
  }

  const getTotalSidebarItems = () => {
    return navigationItems.reduce((total, section) => total + section.items.length, 0)
  }

  const focusElementByIndex = (refs, index) => {
    if (refs[index]) {
      refs[index].focus()
      refs[index].scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }

  // Mock patient data
  const patientData = {
    id: "P001",
    name: "Rajesh Kumar",
    avatar: "public/man_11696179.png",
    age: 34,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 9876543210",
    email: "rajesh.kumar@email.com",
    aadhaar: "1234 5678 9012",
    address: "123 Main Street, Mumbai, Maharashtra",
    lastVisit: "2024-01-10",
    upcomingAppointment: "2024-01-20",
    notifications: 3,
    vitals: {
      heartRate: { value: 72, status: "normal", unit: "BPM" },
      bloodPressure: { value: "120/80", status: "normal", unit: "mmHg" },
      temperature: { value: 98.6, status: "normal", unit: "°F" },
      spo2: { value: 98, status: "normal", unit: "%" },
    },
    aiDiagnosis: [
      {
        title: "Health Assessment",
        description: "Overall health status appears normal based on recent vitals",
        date: "2024-01-15",
        confidence: "95%",
      },
    ],
    conditions: [
      {
        title: "Hypertension",
        description: "Mild hypertension - monitoring required",
        status: "Stable",
        since: "2023-06-15",
      },
    ],
    alerts: [
      {
        title: "Blood Pressure Monitoring",
        description: "Please monitor BP daily and maintain medication schedule",
        priority: "Medium",
        date: "2024-01-15",
      },
    ],
    medicalHistory: [
      {
        date: "2024-01-10",
        title: "Regular Checkup",
        doctor: "Dr. Sarah Wilson",
        notes: "Patient is in good health. Blood pressure slightly elevated. Recommended lifestyle changes.",
        prescriptions: ["Amlodipine 5mg", "Vitamin D3"],
        reports: ["Blood Test Report", "ECG Report"],
      },
      {
        date: "2023-12-15",
        title: "Follow-up Visit",
        doctor: "Dr. Michael Brown",
        notes: "Blood pressure under control. Continue current medication.",
        prescriptions: ["Amlodipine 5mg"],
        reports: ["BP Monitoring Chart"],
      },
      {
        date: "2023-12-15",
        title: "Follow-up Visit",
        doctor: "Dr. Michael Brown",
        notes: "Blood pressure under control. Continue current medication.",
        prescriptions: ["Amlodipine 5mg"],
        reports: ["BP Monitoring Chart"],
      },
    ],
    prescriptions: [
      {
        id: 1,
        name: "Amlodipine",
        type: "Tablet",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "30 days",
        refillDate: "2024-01-25",
        status: "active",
        notes: "Take with food. Monitor blood pressure.",
        doctor: "Dr. Sarah Wilson",
      },
      {
        id: 2,
        name: "Vitamin D3",
        type: "Capsule",
        dosage: "1000 IU",
        frequency: "Once daily",
        duration: "60 days",
        refillDate: "2024-02-10",
        status: "active",
        notes: "Take with meals for better absorption.",
        doctor: "Dr. Sarah Wilson",
      },
    ],
    appointments: [
      {
        id: 1,
        date: "2024-01-20",
        time: "10:30 AM",
        doctor: "Dr. Sarah Wilson",
        type: "Follow-up Consultation",
        status: "scheduled",
        location: "Rural Health Center",
        notes: "Blood pressure monitoring",
      },
      {
        id: 2,
        date: "2024-01-10",
        time: "2:15 PM",
        doctor: "Dr. Michael Brown",
        type: "Regular Checkup",
        status: "completed",
        location: "Rural Health Center",
        notes: "Routine health assessment",
      },
    ],
    documents: [
      {
        id: 1,
        name: "Blood Test Report",
        type: "Lab Report",
        date: "2024-01-10",
        doctor: "Dr. Sarah Wilson",
        icon: "public/test-tube_448364.png",
      },
      {
        id: 2,
        name: "ECG Report",
        type: "Diagnostic Report",
        date: "2024-01-10",
        doctor: "Dr. Sarah Wilson",
        icon: "public/bar_14968536.png",
      },
      {
        id: 3,
        name: "Prescription",
        type: "Medication",
        date: "2024-01-10",
        doctor: "Dr. Sarah Wilson",
        icon: "public/capsule_2008183.png",
      },
    ],
    notifications: [
      {
        id: 1,
        type: "medicine",
        title: "Medicine Reminder",
        message: "Time to take Amlodipine 5mg",
        time: "2 hours ago",
        icon: "public/capsule_2008183.png",
      },
      {
        id: 2,
        type: "appointment",
        title: "Upcoming Appointment",
        message: "Appointment with Dr. Sarah Wilson tomorrow at 10:30 AM",
        time: "1 day ago",
        icon: "public/schedule_3174027.png",
      },
      {
        id: 3,
        type: "alert",
        title: "Health Alert",
        message: "Blood pressure reading was high yesterday. Please monitor closely.",
        time: "2 days ago",
        icon: "public/warning_13898912.png",
      },
    ],
    emergencyContacts: [
      {
        id: 1,
        name: "Priya Kumar",
        relation: "Wife",
        phone: "+91 9876543211",
        avatar: "public/woman_5732666.png",
      },
      {
        id: 2,
        name: "Amit Kumar",
        relation: "Brother",
        phone: "+91 9876543212",
        avatar: "public/man_11696179.png",
      },
    ],
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return t("dashboard.greeting.morning")
    if (hour < 17) return t("dashboard.greeting.afternoon")
    return t("dashboard.greeting.evening")
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  const openModal = (content) => {
    setModalContent(content)
    setShowModal(true)
    setFocusedModalIndex(0)
    modalRefs.current = []
    setTimeout(() => {
      if (modalRefs.current[0]) {
        modalRefs.current[0].focus()
      }
    }, 100)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalContent(null)
    setFocusedModalIndex(0)
    modalRefs.current = []
    // Return focus to content area
    setTimeout(() => {
      if (contentRefs.current[focusedContentIndex]) {
        contentRefs.current[focusedContentIndex].focus()
      }
    }, 100)
  }

  // Helper function to register content buttons for keyboard navigation
  const registerContentButton = (index) => (el) => {
    if (el) {
      contentRefs.current[index] = el
    }
  }

  // Auto-register all interactive elements in content area
  useEffect(() => {
    const contentArea = document.querySelector(".patient-main")
    if (contentArea) {
      const interactiveElements = contentArea.querySelectorAll(
        "button:not([data-exclude-nav]), a:not([data-exclude-nav]), input:not([data-exclude-nav]), [tabindex]:not([data-exclude-nav])",
      )

      // Filter out back and sign out buttons
      const filteredElements = Array.from(interactiveElements).filter(
        (el) => !el.closest("[data-exclude-nav]") && el !== backButtonRef.current && el !== signOutButtonRef.current,
      )

      contentRefs.current = filteredElements

      // Add focused class management
      filteredElements.forEach((el, index) => {
        el.classList.toggle("focused", focusedContentIndex === index && navigationMode === "content")
      })
    }
  }, [activeSection, focusedContentIndex, navigationMode])

  const handleSignOut = () => {
    logout()
    navigate("/auth")
  }

  const navigationItems = [
    {
      section: "main",
      title: t("section.main"),
      items: [
        { id: "dashboard", label: t("nav.dashboard"), icon: "public/house_561263.png", badge: null },
        { id: "health", label: t("nav.health.summary"), icon: "public/love_2545869.png", badge: null },
        { id: "history", label: t("nav.medical.history"), icon: "public/note_4371132.png", badge: null },
        { id: "prescriptions", label: t("nav.prescriptions"), icon: "public/capsule_2008183.png", badge: 2 },
        { id: "scanner", label: t("nav.health.scanner"), icon: "public/microscope_1940643.png", badge: null },
      ],
    },
    {
      section: "appointments",
      title: t("section.appointments"),
      items: [
        { id: "appointments", label: t("nav.appointments"), icon: "public/schedule_3174027.png", badge: 1 },
        { id: "consultation", label: t("nav.video.consultation"), icon: "public/video-camera_726295.png", badge: null },
      ],
    },
    {
      section: "documents",
      title: t("section.documents"),
      items: [
        { id: "reports", label: t("nav.reports"), icon: "public/analytics_2030158.png", badge: null },
        {
          id: "notifications",
          label: t("nav.notifications"),
          icon: "public/bell_232008.png",
          badge: patientData.notifications.length,
        },
      ],
    },
    {
      section: "settings",
      title: t("section.settings"),
      items: [
        { id: "profile", label: t("nav.profile.settings"), icon: "public/setting_653268.png", badge: null },
        { id: "emergency", label: t("nav.emergency.contacts"), icon: "public/sos_595031.png", badge: null },
      ],
    },
  ]

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)

  const BASE_URL = "http://localhost:3000/api/v1"

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/patients/me/dashboard`, {
          withCredentials: true,
        })
        setDashboardData(res.data.data)
        setLoading(false)
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
          <p className="loading-hint">Press F1 for keyboard navigation help once loaded</p>
        </div>
      </div>
    )

  const renderWelcomePanel = () => (
    <>
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
        <button
          className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
          onClick={() => navigate("/welcome")}
        >
          {t("btn.back.dashboard")}
        </button>
        <button
          className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
          onClick={handleSignOut}
          style={{ marginLeft: "10px" }}
        >
          <img src="public/logout_14723873.png" alt="" className="emoji" /> {t("btn.sign.out")}
        </button>

        <button
          onClick={toggleLanguage}
          className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
          style={{ marginLeft: "10px", padding: language === "hi" ? "10.5px 32px" : "14px 32px" }}
        >
          <img src="public/globe_12925125.png" alt="" className="emoji" />{" "}
          {language === "en" ? t("language.english") : t("language.hindi")}
        </button>
      </div>
      <div className="welcome-panel">
        <div className="welcome-content">
          <div className="welcome-header">
            <div className="patient-avatar">
              <img src={patientData.avatar || "/placeholder.svg"} alt="" className="emoji" />
            </div>
            <div className="patient-info">
              <h2 className={language === "hi" ? "hindi-text" : ""}>{dashboardData?.name || patientData.name}</h2>
              <p className="patient-details">
                {dashboardData?.age || patientData.age} {t("dashboard.years")} •{" "}
                {t(`dashboard.${(dashboardData?.gender || patientData.gender).toLowerCase()}`)} • ID:{" "}
                {dashboardData?._id || patientData.id}
              </p>
            </div>
          </div>
          <div className={`greeting-message ${language === "hi" ? "hindi-text" : ""}`}>
            {getGreeting()}, {dashboardData?.name || patientData.name}! {t("dashboard.greeting.question")}
          </div>
          <div className="quick-overview">
            <div className="overview-item">
              <p className="overview-label">{t("dashboard.last.visit")}</p>
              <p className="overview-value">{patientData.lastVisit}</p>
            </div>
            <div className="overview-item">
              <p className="overview-label">{t("dashboard.next.appointment")}</p>
              <p className="overview-value">{patientData.upcomingAppointment}</p>
            </div>
            <div className="overview-item">
              <p className="overview-label">{t("dashboard.notifications")}</p>
              <p className="overview-value">
                {patientData.notifications.length} {t("dashboard.new")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const renderHealthSummary = () => (
    <div className="health-summary">
      <div className="health-card">
        <div className="health-card-header">
          <div className="health-card-icon vitals">
            <img src="public/heart_4252630.png" alt="" className="emoji" />
          </div>
          <h3 className={`health-card-title ${language === "hi" ? "hindi-text" : ""}`}>{t("health.current.vitals")}</h3>
        </div>
        <div className="vitals-grid">
          {Object.entries(patientData.vitals).map(([key, vital]) => (
            <div key={key} className="vital-item">
              <h4 className="vital-value">
                {vital.value} <span style={{ fontSize: "14px", fontWeight: "normal" }}>{vital.unit}</span>
              </h4>
              <p className="vital-label">
                {t(`health.${key.toLowerCase().replace(/([A-Z])/g, ".$1")}`) ||
                  key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </p>
              <span className={`vital-status ${vital.status}`}>{t(`health.${vital.status}`)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="health-card">
        <div className="health-card-header">
          <div className="health-card-icon diagnosis">
            <img src="public/robot_3181656.png" alt="" className="emoji" />
          </div>
          <h3 className={`health-card-title ${language === "hi" ? "hindi-text" : ""}`}>{t("health.ai.diagnosis")}</h3>
        </div>
        {patientData.aiDiagnosis.map((diagnosis, index) => (
          <div key={index} className="diagnosis-item">
            <h4 className="item-title">{diagnosis.title}</h4>
            <p className="item-description">{diagnosis.description}</p>
            <p className="item-date">
              Confidence: {diagnosis.confidence} • {diagnosis.date}
            </p>
          </div>
        ))}
      </div>

      <div className="health-card">
        <div className="health-card-header">
          <div className="health-card-icon conditions">
            <img src="public/global-aid_13179322.png" alt="" className="emoji" />
          </div>
          <h3 className={`health-card-title ${language === "hi" ? "hindi-text" : ""}`}>{t("health.conditions")}</h3>
        </div>
        {patientData.conditions.map((condition, index) => (
          <div key={index} className="condition-item">
            <h4 className="item-title">{condition.title}</h4>
            <p className="item-description">{condition.description}</p>
            <p className="item-date">
              Status: {condition.status} • Since: {condition.since}
            </p>
          </div>
        ))}
      </div>

      <div className="health-card">
        <div className="health-card-header">
          <div className="health-card-icon alerts">
            <img src="public/warning_13898912.png" alt="" className="emoji" />
          </div>
          <h3 className={`health-card-title ${language === "hi" ? "hindi-text" : ""}`}>{t("health.alerts")}</h3>
        </div>
        {patientData.alerts.map((alert, index) => (
          <div key={index} className="alert-item">
            <h4 className="item-title">{alert.title}</h4>
            <p className="item-description">{alert.description}</p>
            <p className="item-date">
              Priority: {alert.priority} • {alert.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            {renderWelcomePanel()}
            {renderHealthSummary()}
          </>
        )

      case "health":
        return (
          <>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={() => navigate("/welcome")}
              >
                {t("btn.back.dashboard")}
              </button>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={handleSignOut}
                style={{ marginLeft: "10px" }}
              >
                <img src="public/logout_14723873.png" alt="" className="emoji" /> {t("btn.sign.out")}
              </button>

              <button
                onClick={toggleLanguage}
                className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
                style={{ marginLeft: "10px", padding: language === "hi" ? "10.5px 32px" : "14px 32px" }}
              >
                <img src="public/globe_12925125.png" alt="" className="emoji" />{" "}
                {language === "en" ? t("language.english") : t("language.hindi")}
              </button>
            </div>
            <div className="content-section">
              <div className="section-header">
                <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>{t("nav.health.summary")}</h2>
                <div className="section-actions">
                  <button className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("btn.view.trends")}
                  </button>
                  <button className={`btn btn-primary ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("btn.sync.devices")}
                  </button>
                </div>
              </div>
              {renderHealthSummary()}
            </div>
          </>
        )

      case "history":
        return (
          <>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={() => navigate("/welcome")}
              >
                {t("btn.back.dashboard")}
              </button>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={handleSignOut}
                style={{ marginLeft: "10px" }}
              >
                <img src="public/logout_14723873.png" alt="" className="emoji" /> {t("btn.sign.out")}
              </button>

              <button
                onClick={toggleLanguage}
                className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
                style={{ marginLeft: "10px", padding: language === "hi" ? "10.5px 32px" : "14px 32px" }}
              >
                <img src="public/globe_12925125.png" alt="" className="emoji" />{" "}
                {language === "en" ? t("language.english") : t("language.hindi")}
              </button>
            </div>
            <div className="content-section">
              <div className="section-header">
                <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>{t("nav.medical.history")}</h2>
                <div className="section-actions">
                  <button className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("btn.export.pdf")}
                  </button>
                  <button className={`btn btn-primary ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("btn.share")}
                  </button>
                </div>
              </div>
              <div className="history-timeline">
                {patientData.medicalHistory.map((visit, index) => (
                  <div key={index} className="history-item">
                    <p className="history-date">{visit.date}</p>
                    <h3 className="history-title">{visit.title}</h3>
                    <p className="history-doctor">{visit.doctor}</p>
                    <p className="history-notes">{visit.notes}</p>
                    <div className="history-actions">
                      <button className="btn btn-small btn-secondary">
                        <img src="public/note_4371132.png" alt="" className="emoji" /> View Report
                      </button>
                      <button className="btn btn-small btn-secondary">
                        <img src="public/capsule_2008183.png" alt="" className="emoji" /> Prescriptions
                      </button>
                      <button className={`btn btn-small btn-primary ${language === "hi" ? "hindi-text" : ""}`}>
                        <img src="public/share_16786846.png" alt="" className="emoji" /> {t("btn.share")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      case "prescriptions":
        return (
          <>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={() => navigate("/welcome")}
              >
                {t("btn.back.dashboard")}
              </button>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={handleSignOut}
                style={{ marginLeft: "10px" }}
              >
                <img src="public/logout_14723873.png" alt="" className="emoji" /> {t("btn.sign.out")}
              </button>

              <button
                onClick={toggleLanguage}
                className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
                style={{ marginLeft: "10px", padding: language === "hi" ? "10.5px 32px" : "14px 32px" }}
              >
                <img src="public/globe_12925125.png" alt="" className="emoji" />{" "}
                {language === "en" ? t("language.english") : t("language.hindi")}
              </button>
            </div>
            <div className="content-section">
              <div className="section-header">
                <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
                  {t("nav.prescriptions")} & Medications
                </h2>
                <div className="section-actions">
                  <button className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("btn.set.reminders")}
                  </button>
                  <button className={`btn btn-primary ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("btn.order.refill")}
                  </button>
                </div>
              </div>
              <div className="prescription-grid">
                {patientData.prescriptions.map((prescription) => (
                  <div key={prescription.id} className="prescription-card">
                    <div className="prescription-header">
                      <div>
                        <h3 className="medicine-name">{prescription.name}</h3>
                        <p className="medicine-type">{prescription.type}</p>
                      </div>
                      <span className={`prescription-status ${prescription.status}`}>{prescription.status}</span>
                    </div>
                    <div className="prescription-details">
                      <div className="detail-item">
                        <h4 className="detail-value">{prescription.dosage}</h4>
                        <p className="detail-label">Dosage</p>
                      </div>
                      <div className="detail-item">
                        <h4 className="detail-value">{prescription.frequency}</h4>
                        <p className="detail-label">Frequency</p>
                      </div>
                      <div className="detail-item">
                        <h4 className="detail-value">{prescription.duration}</h4>
                        <p className="detail-label">Duration</p>
                      </div>
                      <div className="detail-item">
                        <h4 className="detail-value">{prescription.refillDate}</h4>
                        <p className="detail-label">Refill Date</p>
                      </div>
                    </div>
                    <div className="prescription-notes">{prescription.notes}</div>
                    <div className="prescription-actions">
                      <button className="btn btn-small btn-secondary">
                        <img src="public/bell_232008.png" alt="" className="emoji" /> Remind
                      </button>
                      <button className="btn btn-small btn-primary">
                        <img src="public/reload_17926872.png" alt="" className="emoji" /> Refill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      case "appointments":
        return (
          <>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={() => navigate("/welcome")}
              >
                {t("btn.back.dashboard")}
              </button>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={handleSignOut}
                style={{ marginLeft: "10px" }}
              >
                <img src="public/logout_14723873.png" alt="" className="emoji" /> {t("btn.sign.out")}
              </button>

              <button
                onClick={toggleLanguage}
                className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
                style={{ marginLeft: "10px", padding: language === "hi" ? "10.5px 32px" : "14px 32px" }}
              >
                <img src="public/globe_12925125.png" alt="" className="emoji" />{" "}
                {language === "en" ? t("language.english") : t("language.hindi")}
              </button>
            </div>
            <div className="content-section">
              <div className="section-header">
                <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>{t("nav.appointments")}</h2>
                <div className="section-actions">
                  <button className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("btn.view.calendar")}
                  </button>
                  <button className={`btn btn-primary ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("btn.book.appointment")}
                  </button>
                </div>
              </div>
              <div className="appointments-grid">
                {patientData.appointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-header">
                      <div>
                        <h3 className="appointment-date">{appointment.date}</h3>
                        <p className="appointment-time">{appointment.time}</p>
                      </div>
                      <span className={`appointment-status ${appointment.status}`}>{appointment.status}</span>
                    </div>
                    <h4 className="appointment-doctor">{appointment.doctor}</h4>
                    <p className="appointment-type">{appointment.type}</p>
                    <div className="appointment-actions">
                      {appointment.status === "scheduled" && (
                        <>
                          <button className="btn btn-small btn-success">
                            <img src="public/video-camera_726295.png" alt="" className="emoji" /> Join Video
                          </button>
                          <button className="btn btn-small btn-secondary">
                            <img src="public/note_4371132.png" alt="" className="emoji" /> Reschedule
                          </button>
                          <button className="btn btn-small btn-secondary ">
                            <img src="public/close_143604.png" alt="" className="emoji" /> Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === "completed" && (
                        <>
                          <button className="btn btn-small btn-secondary">
                            <img src="public/note_4371132.png" alt="" className="emoji" /> View Report
                          </button>
                          <button className="btn btn-small btn-primary">
                            <img src="public/reload_17926872.png" alt="" className="emoji" /> Book Follow-up
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      case "consultation":
        return (
          <>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={() => navigate("/welcome")}
              >
                {t("btn.back.dashboard")}
              </button>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={handleSignOut}
                style={{ marginLeft: "10px" }}
              >
                <img src="public/logout_14723873.png" alt="" className="emoji" /> {t("btn.sign.out")}
              </button>

              <button
                onClick={toggleLanguage}
                className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
                style={{ marginLeft: "10px", padding: language === "hi" ? "10.5px 32px" : "14px 32px" }}
              >
                <img src="public/globe_12925125.png" alt="" className="emoji" />{" "}
                {language === "en" ? t("language.english") : t("language.hindi")}
              </button>
            </div>
            <div className="video-consultation">
              <h2 className={`video-title ${language === "hi" ? "hindi-text" : ""}`}>
                <img src="public/video-camera_726295.png" alt="" className="emoji" /> {t("nav.video.consultation")}
              </h2>
              <p className="video-description">Connect with healthcare professionals from the comfort of your home</p>
              <div className="video-actions">
                <button className="video-btn">
                  <img src="public/video-camera_726295.png" alt="" className="emoji" /> Start Consultation
                </button>
                <button className="video-btn">
                  <img src="public/pencil_202502.png" alt="" className="emoji" /> Pre-Consult Form
                </button>
                <button className="video-btn">
                  <img src="public/message_5320666.png" alt="" className="emoji" /> Chat Support
                </button>
              </div>
            </div>
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Available Doctors</h2>
              </div>
              <div className="appointments-grid">
                <div className="appointment-card">
                  <div className="appointment-header">
                    <div>
                      <h3 className="appointment-date">Dr. Sarah Wilson</h3>
                      <p className="appointment-time">General Physician</p>
                    </div>
                    <span className="appointment-status scheduled">Available</span>
                  </div>
                  <p className="appointment-type">Next available: Today 3:00 PM</p>
                  <div className="appointment-actions">
                    <button className="btn btn-small btn-success">
                      <img src="public/video-camera_726295.png" alt="" className="emoji" /> Connect Now
                    </button>
                    <button className="btn btn-small btn-primary">
                      <img src="public/schedule_3174027.png" alt="" className="emoji" /> Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case "reports":
        return (
          <>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={() => navigate("/welcome")}
              >
                {t("btn.back.dashboard")}
              </button>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={handleSignOut}
                style={{ marginLeft: "10px" }}
              >
                <img src="public/logout_14723873.png" alt="" className="emoji" /> {t("btn.sign.out")}
              </button>

              <button
                onClick={toggleLanguage}
                className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
                style={{ marginLeft: "10px", padding: language === "hi" ? "10.5px 32px" : "14px 32px" }}
              >
                <img src="public/globe_12925125.png" alt="" className="emoji" />{" "}
                {language === "en" ? t("language.english") : t("language.hindi")}
              </button>
            </div>
            <div className="content-section">
              <div className="section-header">
                <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>{t("nav.reports")}</h2>
                <div className="section-actions">
                  <button className="btn btn-secondary">
                    <img src="public/share_16786846.png" alt="" className="emoji" /> Upload
                  </button>
                  <button className="btn btn-primary">
                    <img src="public/folder_3767094.png" alt="" className="emoji" /> Organize
                  </button>
                </div>
              </div>
              <div className="documents-grid">
                {patientData.documents.map((document) => (
                  <div key={document.id} className="document-card" onClick={() => openModal(document)}>
                    <span className="document-icon">
                      <img src={document.icon || "/placeholder.svg"} alt="" className="emoji" />
                    </span>
                    <h3 className="document-name">{document.name}</h3>
                    <p className="document-date">{document.date}</p>
                    <div className="document-actions">
                      <button className="btn btn-small btn-secondary">
                        <img src="public/eye_2574244.png" alt="" className="emoji" /> View
                      </button>
                      <button className="btn btn-small btn-primary">
                        <img src="public/share_16786846.png" alt="" className="emoji" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      case "notifications":
        return (
          <>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={() => navigate("/welcome")}
              >
                {t("btn.back.dashboard")}
              </button>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={handleSignOut}
                style={{ marginLeft: "10px" }}
              >
                <img src="public/logout_14723873.png" alt="" className="emoji" /> {t("btn.sign.out")}
              </button>

              <button
                onClick={toggleLanguage}
                className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
                style={{ marginLeft: "10px", padding: language === "hi" ? "10.5px 32px" : "14px 32px" }}
              >
                <img src="public/globe_12925125.png" alt="" className="emoji" />{" "}
                {language === "en" ? t("language.english") : t("language.hindi")}
              </button>
            </div>
            <div className="content-section">
              <div className="section-header">
                <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
                  {t("nav.notifications")} & Alerts
                </h2>
                <div className="section-actions">
                  <button className="btn btn-secondary">
                    <img src="public/check-box_12503615.png" alt="" className="emoji" /> Mark All Read
                  </button>
                  <button className="btn btn-primary">
                    <img src="public/setting_653268.png" alt="" className="emoji" /> Settings
                  </button>
                </div>
              </div>
              <div className="notifications-list">
                {patientData.notifications.map((notification) => (
                  <div key={notification.id} className={`notification-item ${notification.type}`}>
                    <span className="notification-icon">
                      <img src={notification.icon || "/placeholder.svg"} alt="" className="emoji" />
                    </span>
                    <div className="notification-content">
                      <h3 className="notification-title">{notification.title}</h3>
                      <p className="notification-message">{notification.message}</p>
                      <p className="notification-time">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      case "profile":
        return (
          <>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={() => navigate("/welcome")}
              >
                {t("btn.back.dashboard")}
              </button>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={handleSignOut}
                style={{ marginLeft: "10px" }}
              >
                <img src="public/logout_14723873.png" alt="" className="emoji" /> {t("btn.sign.out")}
              </button>

              <button
                onClick={toggleLanguage}
                className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
                style={{ marginLeft: "10px", padding: language === "hi" ? "10.5px 32px" : "14px 32px" }}
              >
                <img src="public/globe_12925125.png" alt="" className="emoji" />{" "}
                {language === "en" ? t("language.english") : t("language.hindi")}
              </button>
            </div>
            <div className="content-section">
              <div className="section-header">
                <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
                  {t("nav.profile.settings")}
                </h2>
                <div className="section-actions">
                  <button className="btn btn-secondary">
                    <img src="public/reload_17926872.png" alt="" className="emoji" /> Reset
                  </button>
                  <button className="btn btn-primary">
                    <img src="public/floppy-disk_2011797.png" alt="" className="emoji" /> Save Changes
                  </button>
                </div>
              </div>
              <div className="settings-grid">
                <div className="settings-card">
                  <h3 className="settings-card-title">Personal Information</h3>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" defaultValue={patientData.name} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" defaultValue={patientData.email} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-input" defaultValue={patientData.phone} />
                  </div>
                </div>

                <div className="settings-card">
                  <h3 className="settings-card-title">Identity Verification</h3>
                  <div className="form-group">
                    <label className="form-label">Aadhaar Number</label>
                    <input type="text" className="form-input" defaultValue={patientData.aadhaar} />
                    <div className="verification-status">
                      <span className="status-badge verified">
                        <img src="public/check-box_12503615.png" alt="" className="emoji" /> Verified
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <input type="text" className="form-input" defaultValue={patientData.bloodGroup} />
                  </div>
                </div>

                <div className="settings-card">
                  <h3 className="settings-card-title">Security</h3>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-input" placeholder="Enter current password" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" placeholder="Enter new password" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-input" placeholder="Confirm new password" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case "emergency":
        return (
          <>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={() => navigate("/welcome")}
              >
                {t("btn.back.dashboard")}
              </button>
              <button
                className={`btn btn-secondary ${language === "hi" ? "hindi-text" : ""}`}
                onClick={handleSignOut}
                style={{ marginLeft: "10px" }}
              >
                <img src="public/logout_14723873.png" alt="" className="emoji" /> {t("btn.sign.out")}
              </button>

              <button
                onClick={toggleLanguage}
                className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
                style={{ marginLeft: "10px", padding: language === "hi" ? "10.5px 32px" : "14px 32px" }}
              >
                <img src="public/globe_12925125.png" alt="" className="emoji" />{" "}
                {language === "en" ? t("language.english") : t("language.hindi")}
              </button>
            </div>
            <div className="content-section">
              <div className="section-header">
                <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
                  {t("nav.emergency.contacts")}
                </h2>
                <div className="section-actions">
                  <button className={`btn btn-danger ${language === "hi" ? "hindi-text" : ""}`}>
                    {t("btn.emergency.call")}
                  </button>
                  <button className="btn btn-primary">
                    <img src="public/add_2377877.png" alt="" className="emoji" /> Add Contact
                  </button>
                </div>
              </div>
              <div className="contacts-list">
                {patientData.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="contact-item">
                    <div className="contact-avatar">
                      <img src={contact.avatar || "/placeholder.svg"} alt="" className="emoji" />
                    </div>
                    <div className="contact-info">
                      <h3 className="contact-name">{contact.name}</h3>
                      <p className="contact-relation">{contact.relation}</p>
                      <p className="contact-phone">{contact.phone}</p>
                    </div>
                    <div className="contact-actions">
                      <button className="btn btn-small btn-success">
                        <img src="public/telephone_1840922.png" alt="" className="emoji" /> Call
                      </button>
                      <button className="btn btn-small btn-secondary">
                        <img src="public/pencil_202502.png" alt="" className="emoji" /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )
      case "scanner":
        return <HealthScanner />

      default:
        return renderWelcomePanel()
    }
  }

  return (
    <div className="patient-dashboard">
      {/* Navigation Status Indicator */}
      <div className="nav-status">
        Mode: {navigationMode.charAt(0).toUpperCase() + navigationMode.slice(1)}
        {navigationMode === "sidebar" && ` (${focusedSidebarIndex + 1}/${getTotalSidebarItems()})`}
        {navigationMode === "content" && ` (${focusedContentIndex + 1}/${contentRefs.current.length})`}
        {showModal && ` (${focusedModalIndex + 1}/${modalRefs.current.length})`}
        <span style={{ marginLeft: "8px", opacity: 0.7 }}>Press F1 for help</span>
      </div>
      {/* Sidebar */}
      <aside className={`patient-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="patient-sidebar-header">
          <div className="patient-logo">
            <div className="patient-logo-icon">
              <img src="public/hospital_1392165.png" alt="" className="emoji" />
            </div>
            <span className={language === "hi" ? "hindi-text" : ""}>{t("dashboard.health.portal")}</span>
          </div>
          <p className={`patient-welcome ${language === "hi" ? "hindi-text" : ""}`}>
            {t("dashboard.welcome")}, {dashboardData?.name || patientData.name}
          </p>
        </div>

        <nav className="patient-nav">
          {navigationItems.map((section) => (
            <div key={section.section} className="nav-section">
              <h4 className={`nav-section-title ${language === "hi" ? "hindi-text" : ""}`}>{section.title}</h4>
              {section.items.map((item, itemIndex) => {
                const globalIndex =
                  navigationItems
                    .slice(0, navigationItems.indexOf(section))
                    .reduce((total, prevSection) => total + prevSection.items.length, 0) + itemIndex

                return (
                  <div
                    key={item.id}
                    ref={(el) => (sidebarRefs.current[globalIndex] = el)}
                    className={`nav-item ${activeSection === item.id ? "active" : ""} ${
                      focusedSidebarIndex === globalIndex && navigationMode === "sidebar" ? "focused" : ""
                    }`}
                    onClick={() => setActiveSection(item.id)}
                    tabIndex={0}
                    data-sidebar="true"
                    data-nav-index={globalIndex}
                  >
                    <span className="nav-icon">
                      <img src={item.icon || "/placeholder.svg"} alt="" className="emoji" />
                    </span>
                    <span className={language === "hi" ? "hindi-text" : ""}>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="patient-main">{renderContent()}</main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modalContent?.name}</h2>
              <button
                ref={(el) => (modalRefs.current[0] = el)}
                className={`close-btn ${focusedModalIndex === 0 ? "focused" : ""}`}
                onClick={closeModal}
                tabIndex={0}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Document Type: {modalContent?.type}</p>
              <p>Date: {modalContent?.date}</p>
              <p>Doctor: {modalContent?.doctor}</p>
              <div style={{ textAlign: "center", padding: "40px", background: "#f8fafc", borderRadius: "8px" }}>
                <span style={{ fontSize: "48px" }}>{modalContent?.icon}</span>
                <p>Document preview would appear here</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                ref={(el) => (modalRefs.current[1] = el)}
                className={`btn btn-secondary ${focusedModalIndex === 1 ? "focused" : ""}`}
                onClick={closeModal}
                tabIndex={0}
              >
                Close
              </button>
              <button
                ref={(el) => (modalRefs.current[2] = el)}
                className={`btn btn-primary ${focusedModalIndex === 2 ? "focused" : ""}`}
                tabIndex={0}
              >
                <img src="public/share_16786846.png" alt="" className="emoji" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
