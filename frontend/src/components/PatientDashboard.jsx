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
      if (e.key === 'F1' || (e.key === '?' && !showModal)) {
        e.preventDefault()
        setShowKeyboardHelp(!showKeyboardHelp)
        return
      }

      // Hide keyboard help if it's showing
      if (showKeyboardHelp && e.key === 'Escape') {
        e.preventDefault()
        setShowKeyboardHelp(false)
        return
      }

      // Skip navigation if help is showing
      if (showKeyboardHelp) return

      // Prevent default browser behavior for navigation keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Backspace'].includes(e.key)) {
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
      case 'ArrowDown':
        const nextIndex = (focusedSidebarIndex + 1) % totalSidebarItems
        setFocusedSidebarIndex(nextIndex)
        focusElementByIndex(sidebarRefs.current, nextIndex)
        break

      case 'ArrowUp':
        const prevIndex = (focusedSidebarIndex - 1 + totalSidebarItems) % totalSidebarItems
        setFocusedSidebarIndex(prevIndex)
        focusElementByIndex(sidebarRefs.current, prevIndex)
        break

      case 'ArrowRight':
      case 'Enter':
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

      case 'Backspace':
        // Go to back button
        if (backButtonRef.current) {
          backButtonRef.current.focus()
        }
        break
    }
  }

  const handleContentNavigation = (e) => {
    const totalContentItems = contentRefs.current.length

    switch (e.key) {
      case 'ArrowDown':
        if (totalContentItems > 0) {
          const nextIndex = (focusedContentIndex + 1) % totalContentItems
          setFocusedContentIndex(nextIndex)
          focusElementByIndex(contentRefs.current, nextIndex)
        }
        break

      case 'ArrowUp':
        if (totalContentItems > 0) {
          const prevIndex = (focusedContentIndex - 1 + totalContentItems) % totalContentItems
          setFocusedContentIndex(prevIndex)
          focusElementByIndex(contentRefs.current, prevIndex)
        }
        break

      case 'ArrowLeft':
      case 'Backspace':
        setNavigationMode("sidebar")
        setTimeout(() => {
          if (sidebarRefs.current[focusedSidebarIndex]) {
            sidebarRefs.current[focusedSidebarIndex].focus()
          }
        }, 100)
        break

      case 'Enter':
        if (contentRefs.current[focusedContentIndex]) {
          contentRefs.current[focusedContentIndex].click()
        }
        break
    }
  }

  const handleModalNavigation = (e) => {
    const totalModalItems = modalRefs.current.length

    switch (e.key) {
      case 'ArrowDown':
        if (totalModalItems > 0) {
          const nextIndex = (focusedModalIndex + 1) % totalModalItems
          setFocusedModalIndex(nextIndex)
          focusElementByIndex(modalRefs.current, nextIndex)
        }
        break

      case 'ArrowUp':
        if (totalModalItems > 0) {
          const prevIndex = (focusedModalIndex - 1 + totalModalItems) % totalModalItems
          setFocusedModalIndex(prevIndex)
          focusElementByIndex(modalRefs.current, prevIndex)
        }
        break

      case 'Enter':
        if (modalRefs.current[focusedModalIndex]) {
          modalRefs.current[focusedModalIndex].click()
        }
        break

      case 'Backspace':
      case 'Escape':
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
      refs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  // Mock patient data
  const patientData = {
    id: "P001",
    name: "Rajesh Kumar",
    avatar: "👨",
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
      }
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
        icon: "🧪",
      },
      {
        id: 2,
        name: "ECG Report",
        type: "Diagnostic Report",
        date: "2024-01-10",
        doctor: "Dr. Sarah Wilson",
        icon: "📈",
      },
      {
        id: 3,
        name: "Prescription",
        type: "Medication",
        date: "2024-01-10",
        doctor: "Dr. Sarah Wilson",
        icon: "💊",
      },
    ],
    notifications: [
      {
        id: 1,
        type: "medicine",
        title: "Medicine Reminder",
        message: "Time to take Amlodipine 5mg",
        time: "2 hours ago",
        icon: "💊",
      },
      {
        id: 2,
        type: "appointment",
        title: "Upcoming Appointment",
        message: "Appointment with Dr. Sarah Wilson tomorrow at 10:30 AM",
        time: "1 day ago",
        icon: "📅",
      },
      {
        id: 3,
        type: "alert",
        title: "Health Alert",
        message: "Blood pressure reading was high yesterday. Please monitor closely.",
        time: "2 days ago",
        icon: "⚠️",
      },
    ],
    emergencyContacts: [
      {
        id: 1,
        name: "Priya Kumar",
        relation: "Wife",
        phone: "+91 9876543211",
        avatar: "👩",
      },
      {
        id: 2,
        name: "Amit Kumar",
        relation: "Brother",
        phone: "+91 9876543212",
        avatar: "👨",
      },
    ],
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
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
    const contentArea = document.querySelector('.patient-main')
    if (contentArea) {
      const interactiveElements = contentArea.querySelectorAll(
        'button:not([data-exclude-nav]), a:not([data-exclude-nav]), input:not([data-exclude-nav]), [tabindex]:not([data-exclude-nav])'
      )
      
      // Filter out back and sign out buttons
      const filteredElements = Array.from(interactiveElements).filter(el => 
        !el.closest('[data-exclude-nav]') && 
        el !== backButtonRef.current && 
        el !== signOutButtonRef.current
      )

      contentRefs.current = filteredElements
      
      // Add focused class management
      filteredElements.forEach((el, index) => {
        el.classList.toggle('focused', focusedContentIndex === index && navigationMode === 'content')
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
      title: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "public/house_561263.png", badge: null },
        { id: "health", label: "Health Summary", icon: "public/love_2545869.png", badge: null },
        { id: "history", label: "Medical History", icon: "public/note_4371132.png", badge: null },
        { id: "prescriptions", label: "Prescriptions", icon: "public/capsule_2008183.png", badge: 2 },
        { id: "scanner", label: "Health Scanner", icon: "public/microscope_1940643.png", badge: null },
      ],
    },
    {
      section: "appointments",
      title: "Appointments",
      items: [
        { id: "appointments", label: "My Appointments", icon: "public/schedule_3174027.png", badge: 1 },
        { id: "consultation", label: "Video Consultation", icon: "public/video-camera_726295.png", badge: null },
      ],
    },
    {
      section: "documents",
      title: "Documents & Reports",
      items: [
        { id: "reports", label: "Reports & Documents", icon: "public/analytics_2030158.png", badge: null },
        { id: "notifications", label: "Notifications", icon: "public/bell_232008.png", badge: patientData.notifications.length },
      ],
    },
    {
      section: "settings",
      title: "Settings",
      items: [
        { id: "profile", label: "Profile Settings", icon: "public/setting_653268.png", badge: null },
        { id: "emergency", label: "Emergency Contacts", icon: "public/sos_595031.png", badge: null },
      ],
    },
  ]

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:3000/api/v1";

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/patients/me/dashboard`, {
        withCredentials: true
      });
      setDashboardData(res.data.data);
      setLoading(false);
      
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  fetchDashboardData();
}, [])

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
        <p className="loading-hint">Press F1 for keyboard navigation help once loaded</p>
      </div>
    </div>
  );
  
  // if (!dashboardData) return (
  //   <div className="error-screen">
  //     <div className="error-content">
  //       <h2>⚠️ No Data Found</h2>
  //       <p>Unable to load your dashboard data. Please try refreshing the page.</p>
  //       <button onClick={() => window.location.reload()} className="btn btn-primary">
  //         🔄 Refresh Page
  //       </button>
  //     </div>
  //   </div>
  // );


  const renderWelcomePanel = () => (
    <div className="welcome-panel">
      <div className="welcome-content">
        <div className="welcome-header">
          <div className="patient-avatar">{patientData.avatar}</div>
          <div className="patient-info">
            <h2 className={language === "hi" ? "hindi-text" : ""}>{dashboardData?.name}</h2>
            <p className="patient-details">
              {dashboardData?.age} years • {dashboardData?.gender} • ID: {dashboardData?._id}
            </p>
          </div>
        </div>
        <div className={`greeting-message ${language === "hi" ? "hindi-text" : ""}`}>
          {getGreeting()}, {dashboardData?.name}! How are you feeling today?
        </div>
        <div className="quick-overview">
          <div className="overview-item">
            <p className="overview-label">Last Visit</p>
            <p className="overview-value">{patientData.lastVisit}</p>
          </div>
          <div className="overview-item">
            <p className="overview-label">Next Appointment</p>
            <p className="overview-value">{patientData.upcomingAppointment}</p>
          </div>
          <div className="overview-item">
            <p className="overview-label">Notifications</p>
            <p className="overview-value">{patientData.notifications.length} New</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderHealthSummary = () => (
    <div className="health-summary">
      <div className="health-card">
        <div className="health-card-header">
          <div className="health-card-icon vitals">🫀</div>
          <h3 className="health-card-title">Current Vitals</h3>
        </div>
        <div className="vitals-grid">
          {Object.entries(patientData.vitals).map(([key, vital]) => (
            <div key={key} className="vital-item">
              <h4 className="vital-value">
                {vital.value} <span style={{ fontSize: "14px", fontWeight: "normal" }}>{vital.unit}</span>
              </h4>
              <p className="vital-label">{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</p>
              <span className={`vital-status ${vital.status}`}>{vital.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="health-card">
        <div className="health-card-header">
          <div className="health-card-icon diagnosis">🤖</div>
          <h3 className="health-card-title">AI Diagnosis</h3>
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
          <div className="health-card-icon conditions">⚕️</div>
          <h3 className="health-card-title">Health Conditions</h3>
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
          <div className="health-card-icon alerts">⚠️</div>
          <h3 className="health-card-title">Health Alerts</h3>
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
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Health Summary</h2>
              <div className="section-actions">
                <button className="btn btn-secondary">📊 View Trends</button>
                <button className="btn btn-primary">🔄 Sync Devices</button>
              </div>
            </div>
            {renderHealthSummary()}
          </div>
        )

      case "history":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Medical History</h2>
              <div className="section-actions">
                <button className="btn btn-secondary">📄 Export PDF</button>
                <button className="btn btn-primary">📤 Share</button>
              </div>
            </div>
            <div className="history-timeline">
              {patientData.medicalHistory.map((visit, index) => (
                <div key={index} className="history-item">
                  <p className="history-date">{visit.date}</p>
                  <h3 className="history-title">{visit.title}</h3>
                  <p className="history-doctor">👨‍⚕️ {visit.doctor}</p>
                  <p className="history-notes">{visit.notes}</p>
                  <div className="history-actions">
                    <button className="btn btn-small btn-secondary">📄 View Report</button>
                    <button className="btn btn-small btn-secondary">💊 Prescriptions</button>
                    <button className="btn btn-small btn-primary">📤 Share</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "prescriptions":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Prescriptions & Medications</h2>
              <div className="section-actions">
                <button className="btn btn-secondary">🔔 Set Reminders</button>
                <button className="btn btn-primary">🏥 Order Refill</button>
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
                    <button className="btn btn-small btn-secondary">🔔 Remind</button>
                    <button className="btn btn-small btn-primary">🔄 Refill</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "appointments":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">My Appointments</h2>
              <div className="section-actions">
                <button className="btn btn-secondary">📅 View Calendar</button>
                <button className="btn btn-primary">➕ Book Appointment</button>
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
                  <h4 className="appointment-doctor">👨‍⚕️ {appointment.doctor}</h4>
                  <p className="appointment-type">{appointment.type}</p>
                  <div className="appointment-actions">
                    {appointment.status === "scheduled" && (
                      <>
                        <button className="btn btn-small btn-success">📹 Join Video</button>
                        <button className="btn btn-small btn-secondary">📝 Reschedule</button>
                        <button className="btn btn-small btn-danger">❌ Cancel</button>
                      </>
                    )}
                    {appointment.status === "completed" && (
                      <>
                        <button className="btn btn-small btn-secondary">📄 View Report</button>
                        <button className="btn btn-small btn-primary">🔄 Book Follow-up</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "consultation":
        return (
          <>
            <div className="video-consultation">
              <h2 className="video-title">🎥 Live Video Consultation</h2>
              <p className="video-description">Connect with healthcare professionals from the comfort of your home</p>
              <div className="video-actions">
                <button className="video-btn">📹 Start Consultation</button>
                <button className="video-btn">📝 Pre-Consult Form</button>
                <button className="video-btn">💬 Chat Support</button>
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
                    <button className="btn btn-small btn-success">📹 Connect Now</button>
                    <button className="btn btn-small btn-primary">📅 Schedule</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )

      case "reports":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Reports & Documents</h2>
              <div className="section-actions">
                <button className="btn btn-secondary">📤 Upload</button>
                <button className="btn btn-primary">📁 Organize</button>
              </div>
            </div>
            <div className="documents-grid">
              {patientData.documents.map((document) => (
                <div key={document.id} className="document-card" onClick={() => openModal(document)}>
                  <span className="document-icon">{document.icon}</span>
                  <h3 className="document-name">{document.name}</h3>
                  <p className="document-date">{document.date}</p>
                  <div className="document-actions">
                    <button className="btn btn-small btn-secondary">👁️ View</button>
                    <button className="btn btn-small btn-primary">📥 Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Notifications & Alerts</h2>
              <div className="section-actions">
                <button className="btn btn-secondary">✅ Mark All Read</button>
                <button className="btn btn-primary">⚙️ Settings</button>
              </div>
            </div>
            <div className="notifications-list">
              {patientData.notifications.map((notification) => (
                <div key={notification.id} className={`notification-item ${notification.type}`}>
                  <span className="notification-icon">{notification.icon}</span>
                  <div className="notification-content">
                    <h3 className="notification-title">{notification.title}</h3>
                    <p className="notification-message">{notification.message}</p>
                    <p className="notification-time">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "profile":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Profile Settings</h2>
              <div className="section-actions">
                <button className="btn btn-secondary">🔄 Reset</button>
                <button className="btn btn-primary">💾 Save Changes</button>
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
                    <span className="status-badge verified">✅ Verified</span>
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
        )

      case "emergency":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Emergency Contacts</h2>
              <div className="section-actions">
                <button className="btn btn-danger">🆘 Emergency Call</button>
                <button className="btn btn-primary">➕ Add Contact</button>
              </div>
            </div>
            <div className="contacts-list">
              {patientData.emergencyContacts.map((contact) => (
                <div key={contact.id} className="contact-item">
                  <div className="contact-avatar">{contact.avatar}</div>
                  <div className="contact-info">
                    <h3 className="contact-name">{contact.name}</h3>
                    <p className="contact-relation">{contact.relation}</p>
                    <p className="contact-phone">{contact.phone}</p>
                  </div>
                  <div className="contact-actions">
                    <button className="btn btn-small btn-success">📞 Call</button>
                    <button className="btn btn-small btn-secondary">✏️ Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
        {navigationMode === 'sidebar' && ` (${focusedSidebarIndex + 1}/${getTotalSidebarItems()})`}
        {navigationMode === 'content' && ` (${focusedContentIndex + 1}/${contentRefs.current.length})`}
        {showModal && ` (${focusedModalIndex + 1}/${modalRefs.current.length})`}
        <span style={{ marginLeft: '8px', opacity: 0.7 }}>Press F1 for help</span>
      </div>
      {/* Sidebar */}
      <aside className={`patient-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="patient-sidebar-header">
          <div className="patient-logo">
            <div className="patient-logo-icon">🏥</div>
            <span>Health Portal</span>
          </div>
          <p className={`patient-welcome ${language === "hi" ? "hindi-text" : ""}`}>Welcome back, {dashboardData?.name}</p>
        </div>

        <nav className="patient-nav">
          {navigationItems.map((section) => (
            <div key={section.section} className="nav-section">
              <h4 className="nav-section-title">{section.title}</h4>
              {section.items.map((item, itemIndex) => {
                const globalIndex = navigationItems
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
                    <span className="nav-icon"><img src={item.icon} alt="" className="emoji" /></span>
                    <span className={language === "hi" ? "hindi-text" : ""}>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="emergency-section">
          <h3 className="emergency-title">🆘 Emergency</h3>
          <p className="emergency-subtitle">24/7 Medical Support</p>
          <button className="emergency-btn">Call Now: 911</button>
        </div>

        <div className="language-switcher-sidebar">
          <h4 className="language-switcher-title">Language / भाषा</h4>
          <div className="language-toggle" onClick={toggleLanguage}>
            <span>🌐</span>
            <span className={language === "hi" ? "hindi-text" : ""}>{language === "en" ? "English" : "हिंदी"}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="patient-main">
        <div style={{ marginBottom: "20px" }} data-exclude-nav>
          <button 
            ref={backButtonRef}
            className="btn btn-secondary" 
            onClick={() => navigate("/welcome")}
            tabIndex={0}
            data-exclude-nav
          >
            ← Back to Main Dashboard
          </button>
          <button 
            ref={signOutButtonRef}
            className="btn btn-danger" 
            onClick={handleSignOut} 
            style={{ marginLeft: "10px" }}
            tabIndex={0}
            data-exclude-nav
          >
            🚪 Sign Out
          </button>
        </div>
        {renderContent()}
      </main>

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
                📥 Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Navigation Help */}
      {showKeyboardHelp && (
        <div className="keyboard-help-overlay">
          <div className="keyboard-help-modal">
            <div className="keyboard-help-header">
              <h2>🎮 Keyboard Navigation Guide</h2>
              <button 
                className="close-btn"
                onClick={() => setShowKeyboardHelp(false)}
              >
                ×
              </button>
            </div>
            <div className="keyboard-help-content">
              <div className="help-section">
                <h3>🧭 Navigation</h3>
                <div className="help-item">
                  <span className="key-combo">↑ ↓</span>
                  <span>Navigate up/down in current area</span>
                </div>
                <div className="help-item">
                  <span className="key-combo">← →</span>
                  <span>Switch between sidebar and content</span>
                </div>
                <div className="help-item">
                  <span className="key-combo">Enter</span>
                  <span>Activate selected item</span>
                </div>
                <div className="help-item">
                  <span className="key-combo">Backspace</span>
                  <span>Go back or return to sidebar</span>
                </div>
              </div>
              
              <div className="help-section">
                <h3>🎯 Current Mode</h3>
                <div className="current-mode">
                  <span className={`mode-indicator ${navigationMode === 'sidebar' ? 'active' : ''}`}>
                    Sidebar
                  </span>
                  <span className={`mode-indicator ${navigationMode === 'content' ? 'active' : ''}`}>
                    Content
                  </span>
                  <span className={`mode-indicator ${showModal ? 'active' : ''}`}>
                    Modal
                  </span>
                </div>
              </div>

              <div className="help-section">
                <h3>🔧 Shortcuts</h3>
                <div className="help-item">
                  <span className="key-combo">F1 or ?</span>
                  <span>Toggle this help</span>
                </div>
                <div className="help-item">
                  <span className="key-combo">Escape</span>
                  <span>Close modals/help</span>
                </div>
              </div>

              <div className="help-section">
                <h3>💡 Tips</h3>
                <ul className="tips-list">
                  <li>Use arrow keys to navigate like an old mobile phone</li>
                  <li>Press Enter to select items</li>
                  <li>Backspace acts like the back button</li>
                  <li>Focus indicators show your current position</li>
                  <li>All buttons and links are keyboard accessible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}