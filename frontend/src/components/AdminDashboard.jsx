import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import "./AdminDashboard.css"
import Calendar from "./Calendar.jsx"
import Patients from "./Patients.jsx"

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState("dashboard") // dashboard, calendar

  const navigate = useNavigate()
  const { logout } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSignOut = () => {
    logout()
    navigate("/auth")
  }

  const statsData = [
    {
      icon: "🏃",
      number: "4,569",
      label: "Patient",
      type: "patient",
    },
    {
      icon: "📋",
      number: "23,009",
      label: "Encounters",
      type: "encounters",
    },
    {
      icon: "📅",
      number: "56",
      label: "Appointments",
      type: "appointments",
    },
    {
      icon: "🧪",
      number: "12,100",
      label: "Lab",
      type: "lab",
    },
    {
      icon: "💊",
      number: "14,023",
      label: "Prescription",
      type: "prescription",
    },
    {
      icon: "🔄",
      number: "4,567",
      label: "Referral",
      type: "referral",
    },
  ]

  const chartData = [
    {
      title: "New Patient",
      change: "14.21% High then last month",
      changeType: "positive",
      stats: [
        { label: "Overall", value: "78.51%" },
        { label: "Monthly", value: "17.39%" },
        { label: "Day", value: "7.12%" },
      ],
    },
    {
      title: "OPD Patients",
      change: "11.12% less then last month",
      changeType: "negative",
      stats: [
        { label: "Overall", value: "78.51%" },
        { label: "Monthly", value: "17.39%" },
        { label: "Day", value: "7.12%" },
      ],
    },
    {
      title: "Treatment",
      change: "19.5% High then last month",
      changeType: "positive",
      stats: [
        { label: "Overall", value: "78.51%" },
        { label: "Monthly", value: "17.39%" },
        { label: "Day", value: "7.12%" },
      ],
    },
  ]

  const navItems = [
    { icon: "📊", label: "Dashboard", active: currentView === "dashboard", view: "dashboard" },
    { icon: "📅", label: "Appointments", active: currentView === "calendar", view: "calendar" },
    { icon: "👥", label: "Patients", active: currentView === "patients", view: "patients" },
    { icon: "👨‍⚕️", label: "Doctors" },
    { icon: "⭐", label: "Features" },
    { icon: "📋", label: "Forms, Tables & Charts" },
    { icon: "🧩", label: "Apps & Widgets" },
    { icon: "🔐", label: "Authentication" },
    { icon: "📦", label: "Miscellaneous" },
  ]

  const handleNavClick = (item) => {
    if (item.view) {
      setCurrentView(item.view)
    }
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">+</div>
            Rhythm Admin
          </div>
        </div>

        <button className="emergency-help">
          <span>🎤</span>
          <div>
            <div>Emergency</div>
            <div>help</div>
          </div>
        </button>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <div key={index} className={`nav-item ${item.active ? "active" : ""}`} onClick={() => handleNavClick(item)}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="appointment-banner">
          <h4>Make an Appointments</h4>
          <p>Best Health Care here</p>
          <button>→</button>
        </div>

        <div className="sidebar-footer">
          <p>
            Rhythm Admin Dashboard
            <br />© 2022 All Rights Reserved
          </p>
        </div>
      </aside>

      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Search" />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="header-right">
          <div className="header-icon">🔍</div>
          <div className="header-icon">🔔</div>
          <div className="header-icon">⚙️</div>
          <div className="user-profile">
            <div className="user-avatar">JD</div>
            <div className="user-info">
              <h4>Johen Doe</h4>
              <p>ADMIN</p>
            </div>
          </div>
          <button className="sign-out-btn" onClick={handleSignOut}>
            🚪 Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        {/* Back to Welcome Button */}
        <div style={{ marginBottom: "20px" }}>
          <button className="btn btn-secondary" onClick={() => navigate("/welcome")}>
            ← Back to Welcome
          </button>
        </div>

        {currentView === "dashboard" ? (
          <>
            {/* Stats Grid */}
            <div className="stats-grid">
              {statsData.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-header">
                    <div className={`stat-icon ${stat.type}`}>{stat.icon}</div>
                  </div>
                  <h3 className="stat-number">{stat.number}</h3>
                  <span className={`stat-label ${stat.type}`}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              {chartData.map((chart, index) => (
                <div key={index} className="chart-card">
                  <div className="chart-header">
                    <h3 className="chart-title">{chart.title}</h3>
                    <span className={`chart-change ${chart.changeType}`}>{chart.change}</span>
                  </div>
                  <div className="chart-placeholder">Chart Visualization</div>
                  <div className="chart-stats">
                    {chart.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="chart-stat">
                        <h4>{stat.label}</h4>
                        <p>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="bottom-section">
              {/* Current Vitals */}
              <div className="vitals-card">
                <div className="vitals-header">
                  <h3 className="vitals-title">Current Vitals</h3>
                  <span>🔍</span>
                </div>

                <div className="patient-info">
                  <p>
                    <strong>Patient Name:</strong> Jonsahn &nbsp;&nbsp;&nbsp; <strong>Patient Id:</strong> 1254896
                  </p>
                </div>

                <div className="vitals-grid">
                  <div className="vital-item">
                    <h4 className="vital-value">
                      230 <span className="vital-unit">lbs</span>
                    </h4>
                    <p className="vital-label">Weight</p>
                  </div>
                  <div className="vital-item">
                    <h4 className="vital-value">
                      6'1 <span className="vital-unit"></span>
                    </h4>
                    <p className="vital-label">Height</p>
                  </div>
                  <div className="vital-item">
                    <h4 className="vital-value">30.34</h4>
                    <p className="vital-label">BMI</p>
                  </div>
                </div>

                <div className="blood-pressure">
                  <h4>Blood Pressure</h4>
                  <div className="bp-values">
                    <div className="bp-value">
                      <h3 className="bp-number">150</h3>
                      <p className="bp-label">
                        Systolic <span className="bp-unit">mmHg</span>
                      </p>
                    </div>
                    <div className="bp-value">
                      <h3 className="bp-number">90</h3>
                      <p className="bp-label">
                        Diastolic <span className="bp-unit">mmHg</span>
                      </p>
                    </div>
                  </div>
                </div>

                <p className="vitals-date">Recorded on 25/05/2018</p>

                <div className="smoking-status">📍 Smoking Status : current every day smoker</div>
              </div>

              {/* Doctor of the Month */}
              <div className="doctor-card">
                <h3>Doctor of the Month</h3>
                <div className="doctor-avatar">👨‍⚕️</div>
                <h4 className="doctor-name">Dr. Johen Doe</h4>
                <p className="doctor-specialty">Cardiologists</p>
                <div className="doctor-stats">
                  <div className="doctor-stat">
                    <h4 className="doctor-stat-number">10</h4>
                    <p className="doctor-stat-label">Operations</p>
                  </div>
                  <div className="doctor-stat">
                    <h4 className="doctor-stat-number">47</h4>
                    <p className="doctor-stat-label">Patients</p>
                  </div>
                </div>
              </div>

              {/* Patients In Chart */}
              <div className="patients-chart">
                <h3>Patients In</h3>
                <div className="chart-container">
                  <div className="donut-chart">
                    <div className="chart-center">
                      <h4>Patients In</h4>
                      <p>Daily Data</p>
                    </div>
                  </div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color icu"></div>
                    ICU
                  </div>
                  <div className="legend-item">
                    <div className="legend-color opd"></div>
                    OPD
                  </div>
                  <div className="legend-item">
                    <div className="legend-color emergency"></div>
                    Emergency
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : currentView === "calendar" ? (
          <Calendar />
        ) : currentView === "patients" ? (
          <Patients />
        ) : (
          <>{/* Existing dashboard content */}</>
        )}
      </main>
    </div>
  )
}