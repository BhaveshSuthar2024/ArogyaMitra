"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./VideoCallRequest.css"

export default function VideoCallRequest() {
  const [requestStatus, setRequestStatus] = useState("idle") // idle, requesting, waiting, accepted, rejected
  const [roomCode, setRoomCode] = useState("")
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [waitingTime, setWaitingTime] = useState(0)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    let timer
    if (requestStatus === "waiting") {
      timer = setInterval(() => {
        setWaitingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [requestStatus])

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const requestVideoCall = async () => {
    setRequestStatus("requesting")

    try {
      // Generate room code
      const newRoomCode = generateRoomCode()
      setRoomCode(newRoomCode)

      // Simulate API call to request video call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock doctor assignment
      setDoctorInfo({
        name: "Dr. Sarah Wilson",
        specialization: "General Medicine",
        avatar: "SW",
        experience: "8 years",
      })

      setRequestStatus("waiting")

      // Simulate doctor response after some time
      setTimeout(() => {
        setRequestStatus("accepted")
      }, 10000) // 10 seconds for demo
    } catch (error) {
      console.error("Failed to request video call:", error)
      setRequestStatus("rejected")
    }
  }

  const joinVideoCall = () => {
    navigate(`/video-call/${roomCode}`)
  }

  const cancelRequest = () => {
    setRequestStatus("idle")
    setWaitingTime(0)
    setRoomCode("")
    setDoctorInfo(null)
  }

  const formatWaitingTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="video-call-request-container">
      <div className="request-card">
        {requestStatus === "idle" && (
          <div className="request-idle">
            <div className="video-icon">📹</div>
            <h2>Video Consultation</h2>
            <p>Connect with a healthcare professional through secure video call</p>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <span>Secure & Private</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👨‍⚕️</span>
                <span>Licensed Doctors</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⏰</span>
                <span>Available 24/7</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💊</span>
                <span>Digital Prescriptions</span>
              </div>
            </div>

            <button className="btn btn-primary btn-large" onClick={requestVideoCall}>
              Request Video Consultation
            </button>

            <p className="disclaimer">
              By requesting a consultation, you agree to our terms of service and privacy policy.
            </p>
          </div>
        )}

        {requestStatus === "requesting" && (
          <div className="request-loading">
            <div className="loading-animation">
              <div className="spinner"></div>
            </div>
            <h2>Finding Available Doctor</h2>
            <p>Please wait while we connect you with a healthcare professional...</p>
            <div className="loading-steps">
              <div className="step active">Searching for doctors</div>
              <div className="step">Verifying credentials</div>
              <div className="step">Setting up secure room</div>
            </div>
          </div>
        )}

        {requestStatus === "waiting" && (
          <div className="request-waiting">
            <div className="doctor-card">
              <div className="doctor-avatar">{doctorInfo?.avatar}</div>
              <div className="doctor-info">
                <h3>{doctorInfo?.name}</h3>
                <p>{doctorInfo?.specialization}</p>
                <p>{doctorInfo?.experience} experience</p>
              </div>
            </div>

            <div className="waiting-status">
              <div className="pulse-indicator"></div>
              <h2>Waiting for Doctor Response</h2>
              <p>Dr. {doctorInfo?.name.split(" ")[1]} has been notified of your request</p>
              <div className="waiting-time">Waiting time: {formatWaitingTime(waitingTime)}</div>
            </div>

            <div className="room-info">
              <p>
                Room Code: <strong>{roomCode}</strong>
              </p>
            </div>

            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={cancelRequest}>
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {requestStatus === "accepted" && (
          <div className="request-accepted">
            <div className="success-icon">✅</div>
            <h2>Doctor Accepted Your Request!</h2>
            <p>Dr. {doctorInfo?.name.split(" ")[1]} is ready to start the consultation</p>

            <div className="call-info">
              <div className="info-item">
                <span className="info-label">Room Code:</span>
                <span className="info-value">{roomCode}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Doctor:</span>
                <span className="info-value">{doctorInfo?.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Specialization:</span>
                <span className="info-value">{doctorInfo?.specialization}</span>
              </div>
            </div>

            <div className="pre-call-checklist">
              <h4>Before joining the call:</h4>
              <div className="checklist-item">
                <span className="check">✓</span>
                <span>Ensure good lighting</span>
              </div>
              <div className="checklist-item">
                <span className="check">✓</span>
                <span>Check camera and microphone</span>
              </div>
              <div className="checklist-item">
                <span className="check">✓</span>
                <span>Have your medical history ready</span>
              </div>
            </div>

            <button className="btn btn-success btn-large" onClick={joinVideoCall}>
              Join Video Call
            </button>
          </div>
        )}

        {requestStatus === "rejected" && (
          <div className="request-rejected">
            <div className="error-icon">❌</div>
            <h2>Request Could Not Be Processed</h2>
            <p>We're sorry, but no doctors are currently available for video consultation.</p>

            <div className="alternatives">
              <h4>Alternative Options:</h4>
              <div className="alternative-item">
                <span className="alt-icon">📞</span>
                <span>Schedule a phone consultation</span>
              </div>
              <div className="alternative-item">
                <span className="alt-icon">📅</span>
                <span>Book an appointment for later</span>
              </div>
              <div className="alternative-item">
                <span className="alt-icon">💬</span>
                <span>Chat with our support team</span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={() => setRequestStatus("idle")}>
                Try Again
              </button>
              <button className="btn btn-secondary" onClick={() => navigate("/patient")}>
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
