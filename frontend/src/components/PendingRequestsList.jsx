"use client"

import { useState } from "react"
import "./PendingRequests.css"

const PendingRequestsList = ({ pendingRequests = [], onAccept, onReject }) => {
  const [loading, setLoading] = useState(false)

  const handleAccept = async (requestId) => {
    setLoading(true)
    try {
      await onAccept(requestId)
    } catch (error) {
      console.error("Error accepting request:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (requestId) => {
    setLoading(true)
    try {
      await onReject(requestId)
    } catch (error) {
      console.error("Error rejecting request:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getPriorityLevel = (symptoms) => {
    const urgentKeywords = ["chest pain", "difficulty breathing", "severe", "emergency", "critical"]
    const mediumKeywords = ["pain", "fever", "headache", "nausea"]

    const symptomsLower = symptoms.toLowerCase()

    if (urgentKeywords.some((keyword) => symptomsLower.includes(keyword))) {
      return "high"
    } else if (mediumKeywords.some((keyword) => symptomsLower.includes(keyword))) {
      return "medium"
    }
    return "low"
  }

  if (loading) {
    return (
      <div className="pending-requests-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <div className="loading-text">Processing request...</div>
        </div>
      </div>
    )
  }

  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="pending-requests-container">
        <div className="requests-header">
          <h2 className="requests-title">Pending Consultation Requests</h2>
          <span className="requests-count">0 Requests</span>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No Pending Requests</h3>
          <p>All consultation requests have been processed. New requests will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pending-requests-container">
      <div className="requests-header">
        <h2 className="requests-title">Pending Consultation Requests</h2>
        <span className="requests-count">
          {pendingRequests.length} Request{pendingRequests.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="requests-table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Symptoms</th>
              <th>Request Time</th>
              <th>Priority</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((request) => (
              <tr key={request._id}>
                <td>
                  <div className="patient-name">{request.patient?.name || "Unknown Patient"}</div>
                </td>
                <td>
                  <div className="symptoms-cell" title={request.symptoms}>
                    {request.symptoms}
                  </div>
                </td>
                <td>
                  <div className="time-cell">{formatTime(request.requestedAt)}</div>
                </td>
                <td>
                  <span className={`status-badge ${getPriorityLevel(request.symptoms)}`}>
                    {getPriorityLevel(request.symptoms) === "high" && "🚨"}
                    {getPriorityLevel(request.symptoms) === "medium" && "⚠️"}
                    {getPriorityLevel(request.symptoms) === "low" && "✅"}
                    {getPriorityLevel(request.symptoms).toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="location-cell">Remote Kiosk</div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="btn btn-success btn-small"
                      onClick={() => handleAccept(request._id)}
                      disabled={loading}
                    >
                      ✅ Accept
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleReject(request._id)}
                      disabled={loading}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-requests">
        {pendingRequests.map((request) => (
          <div key={request._id} className="request-card">
            <div className="request-card-header">
              <div className="request-card-patient">{request.patient?.name || "Unknown Patient"}</div>
              <div className="request-card-time">{formatTime(request.requestedAt)}</div>
            </div>

            <div className="request-card-body">
              <div className="request-card-symptoms">
                <strong>Symptoms:</strong> {request.symptoms}
              </div>

              <div className="request-card-meta">
                <span className={`status-badge ${getPriorityLevel(request.symptoms)}`}>
                  {getPriorityLevel(request.symptoms) === "high" && "🚨"}
                  {getPriorityLevel(request.symptoms) === "medium" && "⚠️"}
                  {getPriorityLevel(request.symptoms) === "low" && "✅"}
                  {getPriorityLevel(request.symptoms).toUpperCase()}
                </span>
                <div className="location-cell">Remote Kiosk</div>
              </div>
            </div>

            <div className="request-card-actions">
              <button
                className="btn btn-success btn-small"
                onClick={() => handleAccept(request._id)}
                disabled={loading}
              >
                ✅ Accept
              </button>
              <button className="btn btn-danger btn-small" onClick={() => handleReject(request._id)} disabled={loading}>
                ❌ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingRequestsList
