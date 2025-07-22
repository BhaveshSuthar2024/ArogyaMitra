import { useState } from "react"
import "./Calendar.css"

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month") // month, week, day
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("add") // add, edit, view
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "John Smith",
      doctorName: "Dr. Sarah Wilson",
      date: "2024-01-15",
      time: "09:00",
      duration: 30,
      type: "Consultation",
      priority: "routine",
      status: "confirmed",
      notes: "Regular checkup",
      phone: "(555) 123-4567",
      email: "john.smith@email.com",
    },
    {
      id: 2,
      patientName: "Mary Johnson",
      doctorName: "Dr. Michael Brown",
      date: "2024-01-15",
      time: "10:30",
      duration: 45,
      type: "Follow-up",
      priority: "followup",
      status: "scheduled",
      notes: "Post-surgery follow-up",
      phone: "(555) 987-6543",
      email: "mary.johnson@email.com",
    },
    {
      id: 3,
      patientName: "Robert Davis",
      doctorName: "Dr. Emily Chen",
      date: "2024-01-16",
      time: "14:00",
      duration: 60,
      type: "Emergency",
      priority: "urgent",
      status: "confirmed",
      notes: "Chest pain evaluation",
      phone: "(555) 456-7890",
      email: "robert.davis@email.com",
    },
    {
      id: 4,
      patientName: "Lisa Anderson",
      doctorName: "Dr. James Miller",
      date: "2024-01-17",
      time: "11:15",
      duration: 30,
      type: "Consultation",
      priority: "routine",
      status: "scheduled",
      notes: "Annual physical exam",
      phone: "(555) 321-0987",
      email: "lisa.anderson@email.com",
    },
  ])

  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    date: "",
    time: "",
    duration: 30,
    type: "Consultation",
    priority: "routine",
    status: "scheduled",
    notes: "",
    phone: "",
    email: "",
  })

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add previous month's days
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonth.getDate() - i),
      })
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day),
      })
    }

    // Add next month's days
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, day),
      })
    }

    return days
  }

  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0]
    return appointments.filter((apt) => apt.date === dateString)
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const handleCellClick = (date) => {
    setSelectedDate(date)
    setShowSidebar(true)
  }

  const handleAddAppointment = (date = null) => {
    setModalType("add")
    setSelectedAppointment(null)
    setFormData({
      patientName: "",
      doctorName: "",
      date: date ? date.toISOString().split("T")[0] : "",
      time: "",
      duration: 30,
      type: "Consultation",
      priority: "routine",
      status: "scheduled",
      notes: "",
      phone: "",
      email: "",
    })
    setShowModal(true)
  }

  const handleEditAppointment = (appointment) => {
    setModalType("edit")
    setSelectedAppointment(appointment)
    setFormData({ ...appointment })
    setShowModal(true)
  }

  const handleViewAppointment = (appointment) => {
    setModalType("view")
    setSelectedAppointment(appointment)
    setShowModal(true)
  }

  const handleSaveAppointment = () => {
    if (modalType === "add") {
      const newAppointment = {
        ...formData,
        id: appointments.length + 1,
      }
      setAppointments([...appointments, newAppointment])
    } else if (modalType === "edit") {
      setAppointments(appointments.map((apt) => (apt.id === selectedAppointment.id ? formData : apt)))
    }
    setShowModal(false)
  }

  const handleDeleteAppointment = () => {
    if (selectedAppointment) {
      setAppointments(appointments.filter((apt) => apt.id !== selectedAppointment.id))
      setShowModal(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const days = getDaysInMonth(currentDate)
  const todaysAppointments = getAppointmentsForDate(new Date())

  return (
    <div className="calendar-page">
      {/* Calendar Header */}
      <div className="calendar-header">
        <h1 className="calendar-title">Appointment Calendar</h1>
        <div className="calendar-controls">
          <div className="view-toggle">
            <button className={`view-btn ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>
              Month
            </button>
            <button className={`view-btn ${view === "week" ? "active" : ""}`} onClick={() => setView("week")}>
              Week
            </button>
            <button className={`view-btn ${view === "day" ? "active" : ""}`} onClick={() => setView("day")}>
              Day
            </button>
          </div>
          <div className="nav-controls">
            <button className="nav-btn" onClick={() => navigateMonth(-1)}>
              ←
            </button>
            <div className="current-date">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button className="nav-btn" onClick={() => navigateMonth(1)}>
              →
            </button>
          </div>
          <button className="add-appointment-btn" onClick={() => handleAddAppointment()}>
            + Add Appointment
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        <div className="calendar-grid">
          {/* Header Row */}
          {dayNames.map((day) => (
            <div key={day} className="calendar-header-cell">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day.fullDate)
            return (
              <div
                key={index}
                className={`calendar-cell ${!day.isCurrentMonth ? "other-month" : ""} ${
                  isToday(day.fullDate) ? "today" : ""
                }`}
                onClick={() => handleCellClick(day.fullDate)}
              >
                <div className="cell-date">{day.date}</div>
                <div className="cell-appointments">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`appointment-item ${appointment.priority}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewAppointment(appointment)
                      }}
                    >
                      {appointment.time} - {appointment.patientName}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="more-appointments">+{dayAppointments.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Appointments Sidebar */}
      <div className={`appointments-sidebar ${showSidebar ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">
            {selectedDate ? `${selectedDate.toLocaleDateString()}` : "Today's Appointments"}
          </h3>
          <button className="close-btn" onClick={() => setShowSidebar(false)}>
            ×
          </button>
        </div>
        <div className="appointment-list">
          {(selectedDate ? getAppointmentsForDate(selectedDate) : todaysAppointments).map((appointment) => (
            <div key={appointment.id} className="appointment-card" onClick={() => handleViewAppointment(appointment)}>
              <div className="appointment-time">{appointment.time}</div>
              <div className="appointment-patient">{appointment.patientName}</div>
              <div className="appointment-type">{appointment.type}</div>
              <div className="appointment-meta">
                <span className={`priority-badge ${appointment.priority}`}>{appointment.priority}</span>
                <span className={`status-badge ${appointment.status}`}>{appointment.status}</span>
              </div>
            </div>
          ))}
          {(selectedDate ? getAppointmentsForDate(selectedDate) : todaysAppointments).length === 0 && (
            <div style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
              No appointments for this date
              <br />
              <button
                className="btn btn-primary"
                style={{ marginTop: "10px" }}
                onClick={() => handleAddAppointment(selectedDate)}
              >
                Add Appointment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalType === "add"
                  ? "Add Appointment"
                  : modalType === "edit"
                    ? "Edit Appointment"
                    : "Appointment Details"}
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {modalType === "view" ? (
                <div className="appointment-details">
                  <div className="detail-row">
                    <span className="detail-label">Patient Name:</span>
                    <span className="detail-value">{selectedAppointment?.patientName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Doctor:</span>
                    <span className="detail-value">{selectedAppointment?.doctorName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date & Time:</span>
                    <span className="detail-value">
                      {selectedAppointment?.date} at {selectedAppointment?.time}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{selectedAppointment?.duration} minutes</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{selectedAppointment?.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Priority:</span>
                    <span className={`priority-badge ${selectedAppointment?.priority}`}>
                      {selectedAppointment?.priority}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${selectedAppointment?.status}`}>{selectedAppointment?.status}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedAppointment?.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedAppointment?.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Notes:</span>
                    <span className="detail-value">{selectedAppointment?.notes}</span>
                  </div>
                </div>
              ) : (
                <form>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Patient Name</label>
                      <input
                        type="text"
                        name="patientName"
                        className="form-input"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Doctor</label>
                      <select
                        name="doctorName"
                        className="form-select"
                        value={formData.doctorName}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Doctor</option>
                        <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
                        <option value="Dr. Michael Brown">Dr. Michael Brown</option>
                        <option value="Dr. Emily Chen">Dr. Emily Chen</option>
                        <option value="Dr. James Miller">Dr. James Miller</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        name="date"
                        className="form-input"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time</label>
                      <input
                        type="time"
                        name="time"
                        className="form-input"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Duration (minutes)</label>
                      <select
                        name="duration"
                        className="form-select"
                        value={formData.duration}
                        onChange={handleInputChange}
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select name="type" className="form-select" value={formData.type} onChange={handleInputChange}>
                        <option value="Consultation">Consultation</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Therapy">Therapy</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select
                        name="priority"
                        className="form-select"
                        value={formData.priority}
                        onChange={handleInputChange}
                      >
                        <option value="routine">Routine</option>
                        <option value="followup">Follow-up</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea
                      name="notes"
                      className="form-textarea"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Additional notes or instructions..."
                    />
                  </div>
                </form>
              )}
            </div>

            <div className="modal-footer">
              {modalType === "view" ? (
                <>
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  <button className="btn btn-primary" onClick={() => handleEditAppointment(selectedAppointment)}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={handleDeleteAppointment}>
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveAppointment}>
                    {modalType === "add" ? "Add Appointment" : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
