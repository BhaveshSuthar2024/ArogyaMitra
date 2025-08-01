"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useLanguage } from "../contexts/LanguageContext"
import "./DoctorManagement.css"

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Filters
  const [filters, setFilters] = useState({
    status: "all",
    specialization: "all",
    location: "all",
    dateRange: "all",
    search: "",
  })

  const [sortBy, setSortBy] = useState("recent")

  const navigate = useNavigate()
  const { user } = useAuth()
  const { language, t } = useLanguage()

  // Mock doctor data
  const mockDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "+91 9876543210",
      specialization: "Cardiology",
      experience: 8,
      location: "Mumbai",
      status: "pending",
      profilePicture: "public/woman_5732666.png",
      dateRegistered: "2024-01-15",
      dob: "1985-03-15",
      gender: "Female",
      qualifications: ["MBBS", "MD Cardiology", "Fellowship in Interventional Cardiology"],
      registrationNumber: "MH12345",
      documents: {
        degree: "degree_certificate.pdf",
        license: "medical_license.pdf",
        id: "government_id.pdf",
      },
      availability: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM",
        saturday: "9:00 AM - 1:00 PM",
        sunday: "Closed",
      },
      isActive: true,
    },
    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 9876543211",
      specialization: "Pediatrics",
      experience: 12,
      location: "Delhi",
      status: "verified",
      profilePicture: "public/man_11696179.png",
      dateRegistered: "2024-01-10",
      dob: "1980-07-22",
      gender: "Male",
      qualifications: ["MBBS", "MD Pediatrics", "Diploma in Child Health"],
      registrationNumber: "DL67890",
      documents: {
        degree: "degree_certificate.pdf",
        license: "medical_license.pdf",
        id: "government_id.pdf",
      },
      availability: {
        monday: "10:00 AM - 6:00 PM",
        tuesday: "10:00 AM - 6:00 PM",
        wednesday: "10:00 AM - 6:00 PM",
        thursday: "10:00 AM - 6:00 PM",
        friday: "10:00 AM - 6:00 PM",
        saturday: "10:00 AM - 2:00 PM",
        sunday: "Closed",
      },
      isActive: true,
    },
    {
      id: 3,
      name: "Dr. Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 9876543212",
      specialization: "Dermatology",
      experience: 6,
      location: "Bangalore",
      status: "pending",
      profilePicture: "public/woman_5732666.png",
      dateRegistered: "2024-01-20",
      dob: "1988-11-10",
      gender: "Female",
      qualifications: ["MBBS", "MD Dermatology", "Fellowship in Cosmetic Dermatology"],
      registrationNumber: "KA11223",
      documents: {
        degree: "degree_certificate.pdf",
        license: "medical_license.pdf",
        id: "government_id.pdf",
      },
      availability: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM",
        saturday: "Closed",
        sunday: "Closed",
      },
      isActive: true,
    },
    {
      id: 4,
      name: "Dr. Amit Patel",
      email: "amit.patel@email.com",
      phone: "+91 9876543213",
      specialization: "Orthopedics",
      experience: 15,
      location: "Ahmedabad",
      status: "rejected",
      profilePicture: "public/man_11696179.png",
      dateRegistered: "2024-01-05",
      dob: "1975-05-18",
      gender: "Male",
      qualifications: ["MBBS", "MS Orthopedics", "Fellowship in Joint Replacement"],
      registrationNumber: "GJ44556",
      documents: {
        degree: "degree_certificate.pdf",
        license: "medical_license.pdf",
        id: "government_id.pdf",
      },
      availability: {
        monday: "8:00 AM - 4:00 PM",
        tuesday: "8:00 AM - 4:00 PM",
        wednesday: "8:00 AM - 4:00 PM",
        thursday: "8:00 AM - 4:00 PM",
        friday: "8:00 AM - 4:00 PM",
        saturday: "8:00 AM - 12:00 PM",
        sunday: "Closed",
      },
      isActive: false,
      rejectionReason: "Incomplete documentation - Medical license verification failed",
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDoctors(mockDoctors)
      setFilteredDoctors(mockDoctors)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = [...doctors]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          doctor.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          doctor.registrationNumber.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((doctor) => doctor.status === filters.status)
    }

    // Specialization filter
    if (filters.specialization !== "all") {
      filtered = filtered.filter((doctor) => doctor.specialization === filters.specialization)
    }

    // Location filter
    if (filters.location !== "all") {
      filtered = filtered.filter((doctor) => doctor.location === filters.location)
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const today = new Date()
      const filterDate = new Date()

      switch (filters.dateRange) {
        case "today":
          filterDate.setDate(today.getDate())
          break
        case "week":
          filterDate.setDate(today.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(today.getMonth() - 1)
          break
      }

      filtered = filtered.filter((doctor) => new Date(doctor.dateRegistered) >= filterDate)
    }

    // Sorting
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "recent":
        filtered.sort((a, b) => new Date(b.dateRegistered) - new Date(a.dateRegistered))
        break
      case "experience":
        filtered.sort((a, b) => b.experience - a.experience)
        break
    }

    // Highlight unverified doctors at top
    const pending = filtered.filter((doctor) => doctor.status === "pending")
    const others = filtered.filter((doctor) => doctor.status !== "pending")
    filtered = [...pending, ...others]

    setFilteredDoctors(filtered)
    setCurrentPage(1)
  }, [doctors, filters, sortBy])

  const handleVerifyDoctor = (doctorId) => {
    setDoctors((prev) => prev.map((doctor) => (doctor.id === doctorId ? { ...doctor, status: "verified" } : doctor)))
    // Here you would send notification to doctor
    alert("Doctor verified successfully! Notification sent.")
  }

  const handleRejectDoctor = (doctorId) => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor.id === doctorId ? { ...doctor, status: "rejected", rejectionReason: rejectReason } : doctor,
      ),
    )
    setShowRejectModal(false)
    setRejectReason("")
    setSelectedDoctor(null)
    // Here you would send notification to doctor
    alert("Doctor rejected. Notification sent with reason.")
  }

  const handleDeleteDoctor = (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor? This action cannot be undone.")) {
      setDoctors((prev) => prev.filter((doctor) => doctor.id !== doctorId))
      alert("Doctor deleted successfully")
    }
  }

  const handleToggleActive = (doctorId) => {
    setDoctors((prev) =>
      prev.map((doctor) => (doctor.id === doctorId ? { ...doctor, isActive: !doctor.isActive } : doctor)),
    )
  }

  const openDoctorProfile = (doctor) => {
    setSelectedDoctor(doctor)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedDoctor(null)
  }

  const openRejectModal = (doctor) => {
    setSelectedDoctor(doctor)
    setShowRejectModal(true)
  }

  const closeRejectModal = () => {
    setShowRejectModal(false)
    setSelectedDoctor(null)
    setRejectReason("")
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "status-pending",
      verified: "status-verified",
      rejected: "status-rejected",
    }

    const statusText = {
      pending: "Pending",
      verified: "Verified",
      rejected: "Rejected",
    }

    return <span className={`status-badge ${statusClasses[status]}`}>{statusText[status]}</span>
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading doctors...</p>
      </div>
    )
  }

  return (
    <div className="doctor-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
            ← Back to Admin Dashboard
          </button>
          <h1 className="page-title">
            <img src="public/doctor_2008176.png" alt="" className="emoji" />
            Doctor Management
          </h1>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{doctors.filter((d) => d.status === "pending").length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{doctors.filter((d) => d.status === "verified").length}</span>
            <span className="stat-label">Verified</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{doctors.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, email, or registration number..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="search-input"
          />
          <img src="public/search_2811806.png" alt="" className="search-icon" />
        </div>

        <div className="filters-row">
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.specialization}
            onChange={(e) => setFilters((prev) => ({ ...prev, specialization: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Specializations</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>

          <select
            value={filters.location}
            onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Locations</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Ahmedabad">Ahmedabad</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
            <option value="recent">Most Recent</option>
            <option value="name">Name A-Z</option>
            <option value="experience">Most Experienced</option>
          </select>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="table-container">
        <table className="doctors-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Contact</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((doctor) => (
              <tr key={doctor.id} className={doctor.status === "pending" ? "highlight-pending" : ""}>
                <td>
                  <div className="profile-cell">
                    <img
                      src={doctor.profilePicture || "/placeholder.svg"}
                      alt={doctor.name}
                      className="profile-picture"
                    />
                    <div className={`active-indicator ${doctor.isActive ? "active" : "inactive"}`}></div>
                  </div>
                </td>
                <td>
                  <div className="name-cell">
                    <h4 className="doctor-name">{doctor.name}</h4>
                    <p className="registration-number">Reg: {doctor.registrationNumber}</p>
                  </div>
                </td>
                <td>
                  <span className="specialization-badge">{doctor.specialization}</span>
                </td>
                <td>
                  <div className="contact-cell">
                    <p className="email">{doctor.email}</p>
                    <p className="phone">{doctor.phone}</p>
                  </div>
                </td>
                <td>
                  <span className="experience-badge">{doctor.experience} years</span>
                </td>
                <td>{getStatusBadge(doctor.status)}</td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="btn btn-small btn-secondary"
                      onClick={() => openDoctorProfile(doctor)}
                      title="View Profile"
                    >
                      <img src="public/eye_2574244.png" alt="" className="action-icon" />
                    </button>

                    {doctor.status === "pending" && (
                      <>
                        <button
                          className="btn btn-small btn-success"
                          onClick={() => handleVerifyDoctor(doctor.id)}
                          title="Verify Doctor"
                        >
                          <img src="public/check-box_12503615.png" alt="" className="action-icon" />
                        </button>
                        <button
                          className="btn btn-small btn-warning"
                          onClick={() => openRejectModal(doctor)}
                          title="Reject Doctor"
                        >
                          <img src="public/close_143604.png" alt="" className="action-icon" />
                        </button>
                      </>
                    )}

                    <button
                      className={`btn btn-small ${doctor.isActive ? "btn-warning" : "btn-success"}`}
                      onClick={() => handleToggleActive(doctor.id)}
                      title={doctor.isActive ? "Deactivate" : "Activate"}
                    >
                      <img
                        src={doctor.isActive ? "public/pause_2404385.png" : "public/play_2404388.png"}
                        alt=""
                        className="action-icon"
                      />
                    </button>

                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      title="Delete Doctor"
                    >
                      <img src="public/delete_6861362.png" alt="" className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className="page-info">
          Page {currentPage} of {totalPages} ({filteredDoctors.length} doctors)
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Doctor Profile Modal */}
      {showModal && selectedDoctor && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal doctor-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Doctor Profile</h2>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="profile-section">
                <div className="profile-header">
                  <img
                    src={selectedDoctor.profilePicture || "/placeholder.svg"}
                    alt={selectedDoctor.name}
                    className="profile-picture-large"
                  />
                  <div className="profile-info">
                    <h3 className="doctor-name">{selectedDoctor.name}</h3>
                    <p className="specialization">{selectedDoctor.specialization}</p>
                    <p className="experience">{selectedDoctor.experience} years experience</p>
                    {getStatusBadge(selectedDoctor.status)}
                  </div>
                </div>

                <div className="profile-details">
                  <div className="detail-section">
                    <h4>Personal Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Date of Birth:</label>
                        <span>{selectedDoctor.dob}</span>
                      </div>
                      <div className="detail-item">
                        <label>Gender:</label>
                        <span>{selectedDoctor.gender}</span>
                      </div>
                      <div className="detail-item">
                        <label>Registration Number:</label>
                        <span>{selectedDoctor.registrationNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Contact Information</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Email:</label>
                        <span>{selectedDoctor.email}</span>
                      </div>
                      <div className="detail-item">
                        <label>Phone:</label>
                        <span>{selectedDoctor.phone}</span>
                      </div>
                      <div className="detail-item">
                        <label>Location:</label>
                        <span>{selectedDoctor.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Qualifications</h4>
                    <div className="qualifications-list">
                      {selectedDoctor.qualifications.map((qual, index) => (
                        <span key={index} className="qualification-badge">
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Documents</h4>
                    <div className="documents-list">
                      <div className="document-item">
                        <img src="public/note_4371132.png" alt="" className="document-icon" />
                        <span>Medical Degree</span>
                        <button className="btn btn-small btn-secondary">View</button>
                      </div>
                      <div className="document-item">
                        <img src="public/note_4371132.png" alt="" className="document-icon" />
                        <span>Medical License</span>
                        <button className="btn btn-small btn-secondary">View</button>
                      </div>
                      <div className="document-item">
                        <img src="public/note_4371132.png" alt="" className="document-icon" />
                        <span>Government ID</span>
                        <button className="btn btn-small btn-secondary">View</button>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Availability</h4>
                    <div className="availability-grid">
                      {Object.entries(selectedDoctor.availability).map(([day, time]) => (
                        <div key={day} className="availability-item">
                          <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
                          <span>{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDoctor.status === "rejected" && selectedDoctor.rejectionReason && (
                    <div className="detail-section rejection-section">
                      <h4>Rejection Reason</h4>
                      <p className="rejection-reason">{selectedDoctor.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
              {selectedDoctor.status === "pending" && (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      handleVerifyDoctor(selectedDoctor.id)
                      closeModal()
                    }}
                  >
                    Verify Doctor
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      closeModal()
                      openRejectModal(selectedDoctor)
                    }}
                  >
                    Reject Doctor
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedDoctor && (
        <div className="modal-overlay" onClick={closeRejectModal}>
          <div className="modal reject-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Reject Doctor</h2>
              <button className="close-btn" onClick={closeRejectModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                You are about to reject <strong>{selectedDoctor.name}</strong>.
              </p>
              <p>Please provide a reason for rejection:</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="reject-textarea"
                rows="4"
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeRejectModal}>
                Cancel
              </button>
              <button
                className="btn btn-warning"
                onClick={() => handleRejectDoctor(selectedDoctor.id)}
                disabled={!rejectReason.trim()}
              >
                Reject Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
