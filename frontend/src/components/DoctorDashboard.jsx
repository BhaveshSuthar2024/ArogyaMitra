import { useState, useEffect } from "react"
import "./DoctorDashboard.css"
import axios from "axios"
import { io } from 'socket.io-client';
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000"); // Match backend


export default function DoctorDashboard({ onBack }) {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isAvailable, setIsAvailable] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])
  

    const [loading, setLoading] = useState(true);
  
    const BASE_URL = "http://localhost:3000/api/v1";
  
    useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/doctor/me`, {
          withCredentials: true
        });
        setDashboardData(res.data.doctor);
        console.log(res.data.doctor);
        setLoading(false);
        
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
  
    fetchDashboardData();
  }, []);

useEffect(() => {
  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/doctor/call-requests/pending`);
      setPendingRequests(data.data);
      console.log(data.data);
      
    } catch (err) {
      console.error("Error fetching call requests", err);
    }
  };

  fetchRequests();
}, []);

useEffect(() => {
    if (!dashboardData?._id) return;

    // join doctor-specific room
    socket.emit("join-doctor-room", dashboardData._id);

    // listen for new call requests
    socket.on("new-call-request", (data) => {
      console.log("🔔 New call request:", data);
      setPendingRequests((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("new-call-request");
    };
  }, [dashboardData]);

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const getPatientAvatarColor = (name) => {
    const colors = ["#667eea", "#f093fb", "#4facfe", "#43e97b", "#fa709a", "#ffecd2"]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const openModal = (content, type) => {
    setModalContent({ ...content, type })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalContent(null)
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setActiveSection("consultation")
  }


const handleAccept = async (requestId) => {
  try {
    const res = await axios.put(`${BASE_URL}/video-calls/${requestId}/accept`, {
      doctorId: dashboardData._id,
    });

    console.log("✅ Accepted:", res.data);

    const roomUrl = res.data.request.roomUrl;

    console.log(" : - ",roomUrl);
    

    if (roomUrl) {
      navigate(`/waiting-room?roomUrl=${encodeURIComponent(roomUrl)}`);
    } else {
      alert("Room URL not available.");
    }

  } catch (err) {
    console.error("❌ Error accepting request:", err);
    alert("Failed to accept request");
  }
};


const handleReject = async (requestId) => {
  try {
    const res = await axios.put(`${BASE_URL}/video-calls/${requestId}/reject`, {
      doctorId: dashboardData._id,
    });

    console.log("❌ Rejected:", res.data);

    // Optionally refetch or filter request out from state
    setPendingRequests((prev) =>
      prev.filter((request) => request._id !== requestId)
    );
  } catch (err) {
    console.log("🚫 Error rejecting request:", err);
    alert("Failed to reject the request");
  }
};

  const navigationItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "requests", icon: "📋", label: "Requests" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "patients", icon: "👥", label: "Patients" },
    { id: "consultation", icon: "🩺", label: "Consultation" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "reports", icon: "📊", label: "Reports" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ]

  const renderDashboard = () => (
    <>
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-greeting">
          {getGreeting()} <span className="doctor-name">{dashboardData?.name}!</span>
        </h1>
        <div className="availability-toggle">
          <div className={`toggle-switch ${isAvailable ? "active" : ""}`} onClick={() => setIsAvailable(!isAvailable)}>
            <div className="toggle-slider"></div>
          </div>
          <span className="availability-text">{isAvailable ? "✅ Available" : "❌ Not Available"}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stats-card">
          <div className="stats-header">
            <h3 className="stats-title">Patients Today</h3>
            <div className="stats-icon patients">👥</div>
          </div>
          <h2 className="stats-number"></h2>
          <div className="stats-change positive">
            <span>📈</span>
            <span>+12% from yesterday</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <h3 className="stats-title">Total Diagnoses</h3>
            <div className="stats-icon diagnoses">🩺</div>
          </div>
          <h2 className="stats-number">{dashboardData?.patientsDiagnosed}</h2>
          <div className="stats-change positive">
            <span>📈</span>
            <span>+8% this month</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <h3 className="stats-title">Upcoming Appointments</h3>
            <div className="stats-icon appointments">📅</div>
          </div>
          <h2 className="stats-number">{dashboardData?.appointments}</h2>
          <div className="stats-change positive">
            <span>📈</span>
            <span>+3 new today</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <h3 className="stats-title">Pending Requests</h3>
            <div className="stats-icon requests">⏳</div>
          </div>
          <h2 className="stats-number">{pendingRequests?.length}</h2>
          <div className="stats-change negative">
            <span>📉</span>
            <span>-2 from yesterday</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {/* Patient List */}
        <div className="patient-list-card">
          <div className="card-header">
            <h2 className="card-title">Patient List</h2>
            <select className="filter-dropdown">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="patient-list">
            {dashboardData?.patientsDiagnosed.map((patient) => (
              <div key={patient.id} className="patient-item" onClick={() => handlePatientSelect(patient)}>
                <div className="patient-avatar" style={{ background: getPatientAvatarColor(patient.name) }}>
                  {patient.avatar}
                </div>
                <div className="patient-info">
                  <h4 className="patient-name">{patient.name}</h4>
                  <p className="patient-type">{patient.type}</p>
                </div>
                <div className="patient-time">{patient.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          {/* Calendar Widget */}
          <div className="calendar-widget">
            <div className="calendar-header">
              <h3 className="calendar-title">Calendar</h3>
              <div className="calendar-nav">
                <button className="calendar-nav-btn">‹</button>
                <button className="calendar-nav-btn">›</button>
              </div>
            </div>
            <div className="calendar-grid">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className="calendar-day-header">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 6
                const isToday = day === 15
                const hasAppointment = [15, 20, 22].includes(day)
                return (
                  <div
                    key={i}
                    className={`calendar-day ${isToday ? "today" : ""} ${hasAppointment ? "has-appointment" : ""}`}
                  >
                    {day > 0 && day <= 30 ? day : ""}
                  </div>
                )
              })}
            </div>
            <div className="upcoming-section">
              <h4 className="upcoming-title">Upcoming</h4>
              <div className="upcoming-event">
                <div className="event-indicator"></div>
                <div className="event-info">
                  <h5 className="event-title">Monthly doctor's meet</h5>
                  <p className="event-time">8 April, 2021 | 04:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Panel */}
          {selectedPatient && (
            <div className="consultation-panel">
              <div className="consultation-header">
                <h3 className="card-title">Consultation</h3>
              </div>
              <div className="patient-details">
                <div
                  className="patient-details-avatar"
                  style={{ background: getPatientAvatarColor(selectedPatient.name) }}
                >
                  {selectedPatient.avatar}
                </div>
                <div className="patient-details-info">
                  <h3>{selectedPatient.name}</h3>
                  <p>Male • 25 Years 3 Months</p>
                </div>
              </div>

              <div className="symptoms-section">
                <h4 className="section-title">Symptoms</h4>
                <div className="symptoms-grid">
                  <div className="symptom-item">
                    <div className="symptom-icon">🤒</div>
                    <div className="symptom-label">Fever</div>
                  </div>
                  <div className="symptom-item">
                    <div className="symptom-icon">😷</div>
                    <div className="symptom-label">Cough</div>
                  </div>
                  <div className="symptom-item">
                    <div className="symptom-icon">💓</div>
                    <div className="symptom-label">Heart Burn</div>
                  </div>
                </div>
              </div>

              <div className="vitals-section">
                <h4 className="section-title">Current Vitals</h4>
                <div className="vitals-grid">
                  <div className="vital-item">
                    <h4 className="vital-value">{selectedPatient.vitals.temp}</h4>
                    <p className="vital-label">Temperature</p>
                  </div>
                  <div className="vital-item">
                    <h4 className="vital-value">{selectedPatient.vitals.bp}</h4>
                    <p className="vital-label">Blood Pressure</p>
                  </div>
                  <div className="vital-item">
                    <h4 className="vital-value">{selectedPatient.vitals.hr}</h4>
                    <p className="vital-label">Heart Rate</p>
                  </div>
                  <div className="vital-item">
                    <h4 className="vital-value">{selectedPatient.vitals.spo2}</h4>
                    <p className="vital-label">SpO2</p>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn btn-primary">📝 Diagnose</button>
                <button className="btn btn-secondary">📋 History</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard()

      case "profile":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-header-title">My Profile</h2>
              <div>
                <button className="btn btn-secondary">📤 Export</button>
                <button className="btn btn-primary">💾 Save Changes</button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" defaultValue={dashboardData?.name} />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input type="text" className="form-input" defaultValue={dashboardData?.specialization} />
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input type="number" className="form-input" defaultValue={dashboardData?.experience} />
              </div>
              <div className="form-group">
                <label className="form-label">Registration Number</label>
                <input type="text" className="form-input" defaultValue={dashboardData?.licenseNumber} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" defaultValue={dashboardData?.email} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-input" defaultValue={dashboardData?.phone} />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Kiosk Location</label>
                <input type="text" className="form-input" defaultValue={dashboardData?.clinicAddress} />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Languages Spoken</label>
                <input type="text" className="form-input" defaultValue={dashboardData?.languagesSpoken?.join(", ")} />
              </div>
            </div>
          </div>
        )

      case "requests":
        return (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Symptoms</th>
                <th>Requested At</th>
                <th>Priority</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests?.map((request) => (
                <tr key={request.requestId} className="request-row">
                  <td className="request-patient">{request.patient?.name || "Unknown"}</td>
                  <td className="request-symptoms">{request.symptoms}</td>
                  <td className="request-time">
                    {new Date(request.requestedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="request-priority">
                    <span className="status-badge high">High</span>
                  </td>
                  <td className="request-location">Remote Kiosk</td>
                  <td className="request-actions">
                    <button
                      className="btn btn-success btn-small"
                      onClick={() => handleAccept(request._id)}
                    >
                      ✅ Accept
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleReject(request._id)}
                    >
                      ❌ Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "appointments":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-header-title">Appointments Management</h2>
              <div>
                <button className="btn btn-secondary">📅 Calendar View</button>
                <button className="btn btn-primary">➕ New Appointment</button>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.type}</td>
                    <td>
                      <span className={`status-badge ${appointment.status}`}>{appointment.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-small">📹 Join</button>
                      <button className="btn btn-secondary btn-small">📝 Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case "patients":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-header-title">Diagnosed Patients</h2>
              <div>
                <button className="btn btn-secondary">📊 Analytics</button>
                <button className="btn btn-primary">📤 Export</button>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Condition</th>
                  <th>Prescription</th>
                  <th>Follow-up</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.patientsDiagnosed.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.date}</td>
                    <td>{patient.condition}</td>
                    <td>{patient.prescription}</td>
                    <td>{patient.followUp}</td>
                    <td>
                      <button className="btn btn-primary btn-small">👁️ View</button>
                      <button className="btn btn-secondary btn-small">📝 Notes</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case "consultation":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-header-title">Active Consultation</h2>
              <div>
                <button className="btn btn-secondary">📋 Patient History</button>
                <button className="btn btn-primary">💾 Save Diagnosis</button>
              </div>
            </div>
            {selectedPatient ? (
              <>
                <div className="patient-details" style={{ marginBottom: "30px" }}>
                  <div
                    className="patient-details-avatar"
                    style={{ background: getPatientAvatarColor(selectedPatient.name) }}
                  >
                    {selectedPatient.avatar}
                  </div>
                  <div className="patient-details-info">
                    <h3>{selectedPatient.name}</h3>
                    <p>Male • 25 Years 3 Months • ID: P{selectedPatient.id.toString().padStart(3, "0")}</p>
                  </div>
                </div>

                <div className="ai-suggestion">
                  <div className="ai-suggestion-header">
                    <span className="ai-icon">🤖</span>
                    <h4 className="ai-title">AI Diagnosis Suggestion</h4>
                  </div>
                  <div className="ai-content">
                    Based on the symptoms (fever, cough, headache) and vitals, the patient likely has a viral upper
                    respiratory infection. Recommended treatment includes rest, fluids, and symptomatic relief.
                  </div>
                  <div className="ai-actions">
                    <button className="ai-btn accept">✅ Accept</button>
                    <button className="ai-btn modify">✏️ Modify</button>
                    <button className="ai-btn reject">❌ Reject</button>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Diagnosis</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Enter your diagnosis..."
                      defaultValue="Viral upper respiratory infection"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prescription</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Enter prescription..."
                      defaultValue="Paracetamol 500mg - 3 times daily for 5 days"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Doctor Notes</label>
                    <textarea className="form-textarea" placeholder="Enter additional notes..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Follow-up Date</label>
                    <input type="date" className="form-input" />
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="btn btn-success">✅ Complete Consultation</button>
                  <button className="btn btn-secondary">📋 Add to History</button>
                  <button className="btn btn-primary">📅 Schedule Follow-up</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
                <h3>No Active Consultation</h3>
                <p>Select a patient from the dashboard to start a consultation</p>
                <button className="btn btn-primary" onClick={() => setActiveSection("dashboard")}>
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        )

      case "messages":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-header-title">Messages & Notifications</h2>
              <div>
                <button className="btn btn-secondary">✅ Mark All Read</button>
                <button className="btn btn-primary">✉️ New Message</button>
              </div>
            </div>
            <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
              <h3>💬 Messages</h3>
              <p>Secure messaging with patients and colleagues</p>
              <button className="btn btn-primary">Coming Soon</button>
            </div>
          </div>
        )

      case "reports":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-header-title">Medical Records & Reports</h2>
              <div>
                <button className="btn btn-secondary">🔍 Search</button>
                <button className="btn btn-primary">📊 Generate Report</button>
              </div>
            </div>
            <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
              <h3>📊 Reports & Analytics</h3>
              <p>Access patient reports and generate analytics</p>
              <button className="btn btn-primary">Coming Soon</button>
            </div>
          </div>
        )

      case "settings":
        return (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-header-title">Settings & Support</h2>
              <div>
                <button className="btn btn-secondary">🔄 Reset</button>
                <button className="btn btn-primary">💾 Save Settings</button>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Notification Preferences</label>
                <select className="form-select">
                  <option>All Notifications</option>
                  <option>Important Only</option>
                  <option>None</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Auto-refresh Interval</label>
                <select className="form-select">
                  <option>30 seconds</option>
                  <option>1 minute</option>
                  <option>5 minutes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Default Consultation Duration</label>
                <select className="form-select">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Time Zone</label>
                <select className="form-select">
                  <option>Asia/Kolkata (IST)</option>
                  <option>Asia/Mumbai (IST)</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: "40px", padding: "20px", background: "#f8fafc", borderRadius: "12px" }}>
              <h3>🆘 Support & Help</h3>
              <p>Need assistance? Contact our support team</p>
              <div className="action-buttons">
                <button className="btn btn-secondary">📞 Call Support</button>
                <button className="btn btn-primary">💬 Chat Support</button>
                <button className="btn btn-secondary">📖 User Manual</button>
              </div>
            </div>
          </div>
        )

      default:
        return renderDashboard()
    }
  }

  return (
    <div className="doctor-dashboard-container">
      {/* Sidebar */}
      <aside className="doctor-sidebar">
        <div className="sidebar-logo">🏥</div>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
              title={item.label}
            >
              {item.icon}
              {item.id === "requests" && pendingRequests?.length > 0 && (
                <div className="notification-badge">{pendingRequests?.length}</div>
              )}
            </div>
          ))}
        </nav>
        <div className="sidebar-profile"><img src={dashboardData?.profileImage} /></div>
      </aside>

      {/* Main Content */}
      <main className="doctor-main">
        {/* Header */}
        <div className="doctor-header">
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Search patients, appointments..." />
            <span className="search-icon">🔍</span>
          </div>
          <div className="header-actions">
            <div className="header-icon">🔔</div>
            <div className="header-icon">💬</div>
            <div className="doctor-profile-header">
              <div className="doctor-avatar"><img src={dashboardData?.profileImage} /></div>
              <div className="doctor-info">
                <h4>{dashboardData?.name}</h4>
                <p>{dashboardData?.specialization}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ marginBottom: "20px" }}>
          <button className="btn btn-secondary" onClick={onBack}>
            ← Back to Main Dashboard
          </button>
        </div>

        {/* Content */}
        {renderContent()}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modalContent?.type} Details</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Modal content would appear here based on the selected item.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}