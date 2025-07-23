import { useState } from "react"
import "./Patients.css"

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const patientsPerPage = 10

  const [patients] = useState([
    {
      id: "P001",
      name: "Anna McCoy",
      avatar: "👩",
      location: "Mumbai, Maharashtra",
      status: "general",
      lastVisit: "May 12, 2022",
      time: "10:30 AM",
      phone: "+91 9876543210",
      email: "anna.mccoy@email.com",
      age: 34,
      gender: "Female",
      bloodGroup: "O+",
      aadhaar: "1234 5678 9012",
      address: "123 Main Street, Andheri, Mumbai",
      visits: [
        { date: "May 12, 2022", reason: "Regular Checkup", doctor: "Dr. Sarah Wilson" },
        { date: "Mar 15, 2022", reason: "Fever and Cold", doctor: "Dr. Michael Brown" },
        { date: "Jan 08, 2022", reason: "Blood Test", doctor: "Dr. Emily Chen" },
      ],
    },
    {
      id: "P002",
      name: "Brooklyn Simmons",
      avatar: "👨",
      location: "Delhi, NCR",
      status: "vip",
      lastVisit: "August 7, 2022",
      time: "2:15 PM",
      phone: "+91 9876543211",
      email: "brooklyn.simmons@email.com",
      age: 28,
      gender: "Male",
      bloodGroup: "A+",
      aadhaar: "2345 6789 0123",
      address: "456 Park Avenue, Connaught Place, Delhi",
      visits: [
        { date: "August 7, 2022", reason: "Specialist Consultation", doctor: "Dr. James Miller" },
        { date: "June 20, 2022", reason: "Follow-up", doctor: "Dr. Sarah Wilson" },
      ],
    },
    {
      id: "P003",
      name: "Marvin McKinney",
      avatar: "👨",
      location: "Bangalore, Karnataka",
      status: "general",
      lastVisit: "May 9, 2022",
      time: "11:45 AM",
      phone: "+91 9876543212",
      email: "marvin.mckinney@email.com",
      age: 42,
      gender: "Male",
      bloodGroup: "B+",
      aadhaar: "3456 7890 1234",
      address: "789 Tech Park, Whitefield, Bangalore",
      visits: [
        { date: "May 9, 2022", reason: "Diabetes Checkup", doctor: "Dr. Emily Chen" },
        { date: "Feb 14, 2022", reason: "Blood Pressure Monitoring", doctor: "Dr. Michael Brown" },
      ],
    },
    {
      id: "P004",
      name: "Darlene Robertson",
      avatar: "👩",
      location: "Chennai, Tamil Nadu",
      status: "followup",
      lastVisit: "March 5, 2022",
      time: "9:00 AM",
      phone: "+91 9876543213",
      email: "darlene.robertson@email.com",
      age: 56,
      gender: "Female",
      bloodGroup: "AB+",
      aadhaar: "4567 8901 2345",
      address: "321 Beach Road, Marina, Chennai",
      visits: [
        { date: "March 5, 2022", reason: "Post-Surgery Follow-up", doctor: "Dr. James Miller" },
        { date: "Jan 20, 2022", reason: "Surgery", doctor: "Dr. James Miller" },
      ],
    },
    {
      id: "P005",
      name: "Cameron Williamson",
      avatar: "👨",
      location: "Pune, Maharashtra",
      status: "emergency",
      lastVisit: "July 14, 2022",
      time: "3:30 PM",
      phone: "+91 9876543214",
      email: "cameron.williamson@email.com",
      age: 31,
      gender: "Male",
      bloodGroup: "O-",
      aadhaar: "5678 9012 3456",
      address: "654 IT Hub, Hinjewadi, Pune",
      visits: [
        { date: "July 14, 2022", reason: "Emergency - Chest Pain", doctor: "Dr. Sarah Wilson" },
        { date: "May 30, 2022", reason: "Routine Checkup", doctor: "Dr. Emily Chen" },
      ],
    },
    {
      id: "P006",
      name: "Savannah Nguyen",
      avatar: "👩",
      location: "Hyderabad, Telangana",
      status: "general",
      lastVisit: "June 18, 2022",
      time: "4:45 PM",
      phone: "+91 9876543215",
      email: "savannah.nguyen@email.com",
      age: 29,
      gender: "Female",
      bloodGroup: "A-",
      aadhaar: "6789 0123 4567",
      address: "987 HITEC City, Madhapur, Hyderabad",
      visits: [
        { date: "June 18, 2022", reason: "Pregnancy Checkup", doctor: "Dr. Sarah Wilson" },
        { date: "Apr 25, 2022", reason: "General Consultation", doctor: "Dr. Michael Brown" },
      ],
    },
    {
      id: "P007",
      name: "Ralph Edwards",
      avatar: "👨",
      location: "Kolkata, West Bengal",
      status: "vip",
      lastVisit: "September 2, 2022",
      time: "1:20 PM",
      phone: "+91 9876543216",
      email: "ralph.edwards@email.com",
      age: 48,
      gender: "Male",
      bloodGroup: "B-",
      aadhaar: "7890 1234 5678",
      address: "147 Park Street, Central Kolkata",
      visits: [
        { date: "September 2, 2022", reason: "Executive Health Checkup", doctor: "Dr. James Miller" },
        { date: "July 10, 2022", reason: "Cardiology Consultation", doctor: "Dr. Emily Chen" },
      ],
    },
    {
      id: "P008",
      name: "Kristin Watson",
      avatar: "👩",
      location: "Ahmedabad, Gujarat",
      status: "general",
      lastVisit: "April 22, 2022",
      time: "10:15 AM",
      phone: "+91 9876543217",
      email: "kristin.watson@email.com",
      age: 35,
      gender: "Female",
      bloodGroup: "O+",
      aadhaar: "8901 2345 6789",
      address: "258 SG Highway, Satellite, Ahmedabad",
      visits: [
        { date: "April 22, 2022", reason: "Skin Consultation", doctor: "Dr. Sarah Wilson" },
        { date: "Feb 08, 2022", reason: "Allergy Testing", doctor: "Dr. Michael Brown" },
      ],
    },
  ])

  const filters = ["All", "General", "VIP", "Emergency", "Follow-up"]

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = activeFilter === "All" || patient.status.toLowerCase() === activeFilter.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage)
  const startIndex = (currentPage - 1) * patientsPerPage
  const currentPatients = filteredPatients.slice(startIndex, startIndex + patientsPerPage)

  const stats = {
    total: patients.length,
    new: patients.filter((p) => new Date(p.lastVisit).getMonth() === new Date().getMonth()).length,
    active: patients.filter((p) => p.status === "general" || p.status === "vip").length,
    emergency: patients.filter((p) => p.status === "emergency").length,
  }

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient)
  }

  const handleExport = () => {
    // Export functionality
    const csvContent = patients.map((p) => `${p.id},${p.name},${p.location},${p.status},${p.lastVisit}`).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "patients.csv"
    a.click()
  }

  return (
    <div className="patients-page">
      {/* Header */}
      <div className="patients-header">
        <div>
          <h1 className="patients-title">Patients</h1>
          <p className="patients-subtitle">Manage and view all patient records</p>
        </div>
        <div className="patients-actions">
          <button className="export-btn" onClick={handleExport}>
            📊 Export
          </button>
          <button className="add-patient-btn">+ Add Patient</button>
        </div>
      </div>

      {/* Stats */}
      <div className="patients-stats">
        <div className="stat-card">
          <h3 className="stat-number">{stats.total.toLocaleString()}</h3>
          <p className="stat-label">Total Patients</p>
          <div className="stat-change positive">+12% from last month</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{stats.new}</h3>
          <p className="stat-label">New This Month</p>
          <div className="stat-change positive">+8% from last month</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{stats.active}</h3>
          <p className="stat-label">Active Patients</p>
          <div className="stat-change positive">+5% from last month</div>
        </div>
        <div className="stat-card">
          <h3 className="stat-number">{stats.emergency}</h3>
          <p className="stat-label">Emergency Cases</p>
          <div className="stat-change negative">-2% from last month</div>
        </div>
      </div>

      {/* Patients List */}
      <div className="patients-container">
        <div className="patients-list-header">
          <div className="patients-count">All patients ({filteredPatients.length.toLocaleString()})</div>
          <div className="patients-filters">
            <div className="filter-tabs">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`filter-tab ${activeFilter === filter ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="patients-list">
          {currentPatients.map((patient) => (
            <div key={patient.id} className="patient-item" onClick={() => handlePatientClick(patient)}>
              <div className="patient-avatar">{patient.avatar}</div>
              <div className="patient-info">
                <div>
                  <h4 className="patient-name">{patient.name}</h4>
                  <p className="patient-id">ID: {patient.id}</p>
                </div>
                <div className="patient-location">{patient.location}</div>
                <div>
                  <span className={`patient-status ${patient.status}`}>
                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                  </span>
                </div>
                <div className="patient-date">{patient.lastVisit}</div>
                <div className="patient-date">{patient.time}</div>
                <div className="patient-actions">
                  <button className="action-btn primary" title="View Details">
                    👁️
                  </button>
                  <button className="action-btn" title="Edit">
                    ✏️
                  </button>
                  <button className="action-btn" title="More">
                    ⋯
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(startIndex + patientsPerPage, filteredPatients.length)} of{" "}
            {filteredPatients.length} patients
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="patient-modal" onClick={() => setSelectedPatient(null)}>
          <div className="patient-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="patient-modal-header">
              <h2 className="patient-modal-title">Patient Details</h2>
              <button className="close-btn" onClick={() => setSelectedPatient(null)}>
                ×
              </button>
            </div>
            <div className="patient-modal-body">
              <div className="patient-detail-grid">
                <div className="patient-detail-item">
                  <span className="detail-label">Patient Name</span>
                  <span className="detail-value">{selectedPatient.name}</span>
                </div>
                <div className="patient-detail-item">
                  <span className="detail-label">Patient ID</span>
                  <span className="detail-value">{selectedPatient.id}</span>
                </div>
                <div className="patient-detail-item">
                  <span className="detail-label">Age</span>
                  <span className="detail-value">{selectedPatient.age} years</span>
                </div>
                <div className="patient-detail-item">
                  <span className="detail-label">Gender</span>
                  <span className="detail-value">{selectedPatient.gender}</span>
                </div>
                <div className="patient-detail-item">
                  <span className="detail-label">Blood Group</span>
                  <span className="detail-value">{selectedPatient.bloodGroup}</span>
                </div>
                <div className="patient-detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{selectedPatient.phone}</span>
                </div>
                <div className="patient-detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{selectedPatient.email}</span>
                </div>
                <div className="patient-detail-item">
                  <span className="detail-label">Aadhaar</span>
                  <span className="detail-value">{selectedPatient.aadhaar}</span>
                </div>
                <div className="patient-detail-item" style={{ gridColumn: "1 / -1" }}>
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{selectedPatient.address}</span>
                </div>
              </div>

              <div className="visit-history">
                <h3 className="visit-history-title">Visit History</h3>
                {selectedPatient.visits.map((visit, index) => (
                  <div key={index} className="visit-item">
                    <div className="visit-date">{visit.date}</div>
                    <div className="visit-reason">
                      {visit.reason} - {visit.doctor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}