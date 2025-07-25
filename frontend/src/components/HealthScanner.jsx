import { useState } from "react"
import { useLanguage } from "../contexts/LanguageContext.jsx"
import "./HealthScanner.css"
import Lottie from "lottie-react";
import animationData from "../../public/animation.json";
import animationDataScan from "../../public/Scan.json";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx"
import axios from "axios";
import { useEffect } from "react";

export default function HealthScanner() {
  const [scanningState, setScanningState] = useState("scanning") // idle, scanning, completed
  const [scanProgress, setScanProgress] = useState(0)
  const [showResults, setShowResults] = useState(true)

    const { logout } = useAuth()
  

    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { language, setLanguage, t } = useLanguage()


    const BASE_URL = "http://localhost:3000/api/v1"; 

  // Mock test results data
  const testResults = [
    {
      id: 1,
      name: "Heart Rate",
      value: "72",
      unit: "BPM",
      status: "normal",
      icon: "public/heart_4252630.png",
      range: "60-100 BPM",
      description: "Your heart rate is within normal range",
    },
    {
      id: 2,
      name: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "normal",
      icon: "public/blood_1240843.png",
      range: "90-140/60-90 mmHg",
      description: "Blood pressure is optimal",
    },
    {
      id: 3,
      name: "Oxygen Saturation",
      value: "98",
      unit: "%",
      status: "normal",
      icon: "public/lungs_1834842.png",
      range: "95-100%",
      description: "Oxygen levels are excellent",
    },
    {
      id: 4,
      name: "Body Temperature",
      value: "98.6",
      unit: "°F",
      status: "normal",
      icon: "public/thermometer_1400304.png",
      range: "97-99°F",
      description: "Temperature is normal",
    },
    {
      id: 5,
      name: "Stress Level",
      value: "Low",
      unit: "",
      status: "good",
      icon: "public/meditation_4897166.png",
      range: "Low-Medium",
      description: "Stress levels are well managed",
    },
    {
      id: 6,
      name: "Hydration",
      value: "Good",
      unit: "",
      status: "normal",
      icon: "public/drop_616546.png",
      range: "Good-Excellent",
      description: "Hydration levels are adequate",
    },
  ]

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/patients/me/dashboard`, {
        withCredentials: true,
      });
      setDashboardData(res.data.data);
      console.log("hello how are you");
      
      console.log(res.data.data);
      
    } catch (err) {
      console.error("Failed to fetch patient dashboard", err);
    }
  };

  fetchDashboardData();
}, []);

  const [scanMessageIndex, setScanMessageIndex] = useState(0)
  const scanMessages = [
    "Please place your hands on the scanner...",
    "Scanning in progress...",
    "Collecting health information...",
    "Analyzing vital signs...",
    "Almost done..."
  ]

  const startScan = () => {
  setScanningState("scanning")
  setScanProgress(0)
  setShowResults(false)
  setScanMessageIndex(0)

  

  // Update scanning messages every 1.5s
  const messageInterval = setInterval(() => {
    setScanMessageIndex((prev) => (prev + 1) % scanMessages.length)
  }, 1500)

  // Simulate scanning progress
  const progressInterval = setInterval(() => {
    setScanProgress((prev) => {
      if (prev >= 100) {
        clearInterval(progressInterval)
        clearInterval(messageInterval) // stop message updates
        setScanningState("completed")
        setTimeout(() => {
          setShowResults(true)
        }, 1000)
        return 100
      }
      return prev + 2
    })
  }, 100)
}

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  const resetScan = () => {
    setScanningState("scanning")
    setScanProgress(0)
    setShowResults(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
      case "good":
        return "#10b981"
      case "warning":
        return "#f59e0b"
      case "danger":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const handleConsultWithDoctor = async () => {
  if (!dashboardData?._id) {
    alert("Patient data not found");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(`${BASE_URL}/video-calls/request`, {
      patientId: dashboardData._id,
      symptoms: ["fever", "headache"],
      consultationType: "General",
    });

    console.log("response :- ", res);

    const roomUrl = res.data?.request?.roomUrl;

    if (roomUrl) {
      navigate(`/waiting-room?roomUrl=${encodeURIComponent(roomUrl)}`);
    } else {
      alert("Room URL not returned from server.");
    }

  } catch (err) {
    console.error("Error starting video consultation:", err);
    alert("Failed to initiate video consultation");
  } finally {
    setLoading(false);
  }
};



  const getStatusText = (status) => {
      switch (status) {
        case "normal":
          return "Normal"
        case "good":
          return "Good"
        case "warning":
          return "Attention"
        case "danger":
          return "Critical"
        default:
          return "Unknown"
      }
  }

  const handleSignOut = () => {
    logout()
    navigate("/auth")
  }

  return (
    <div className="health-scanner">
      {!showResults ? (
        <div className="scanner-container">
          <div className="scanner-header">
            <h2 className={`scanner-title ${language === "hi" ? "hindi-text" : ""}`}>Health Scanner</h2>
            <p className={`scanner-subtitle ${language === "hi" ? "hindi-text" : ""}`}>
              Place both hands on the sensor pads to begin health scan
            </p>
          </div>

          <div className="scanner-device">
            <div className="lottie1">
              <Lottie animationData={animationDataScan} loop={true} autoplay={true} style={{ width: 400, height: 400, backgroundColor: "#0000004d", borderRadius: "40px", position: "absolute"}}/>
              <img src="hand2.png" alt="Hand" style={{height: 200, width: 200, position: "absolute"}}/>
            </div>
            
            <Lottie animationData={animationData} loop={true} autoplay={true} style={{ width: 400, height: 400 }}/>

            <div className="lottie2">
              <Lottie animationData={animationDataScan} loop={true} autoplay={true} style={{ width: 400, height: 400, backgroundColor: "#0000004d", borderRadius: "40px", position: "absolute"}}/>
              <img src="hand.png" alt="Hand" style={{height: 200, width: 200, position: "absolute"}}/>
            </div>
          </div>

          {scanningState === "scanning" && (
            <div className="scan-message">
              <p>{scanMessages[scanMessageIndex]}</p>
            </div>
          )}

        </div>
      ) : (
        <>
        <div style={{ marginBottom: "20px", display:"flex", alignItems: "center"}}>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate("/welcome")}
          >
            ← Back to Main Dashboard
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleSignOut} 
            style={{ marginLeft: "10px" }}
          >
            <img src="public/logout_14723873.png" alt="" className="emoji" /> Sign Out
          </button>

          <button 
            onClick={toggleLanguage} 
            className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
            style={{ marginLeft: "10px", padding: language ==="hi"? "10.5px 32px": "14px 32px" }}
          >
            <img src="public/globe_12925125.png" alt="" className="emoji" /> {language === "en" ? "English" : "हिंदी"}
          </button>
        </div>
        <div className="results-container">
          <div className="results-header">
            <h2 className={`results-title ${language === "hi" ? "hindi-text" : ""}`}>Health Scan Results</h2>
            <p className={`results-subtitle ${language === "hi" ? "hindi-text" : ""}`}>
              Your health parameters have been analyzed
            </p>
            <div className="results-actions">
              <button className="btn btn-secondary userChoice" onClick={resetScan}><img src="public/reload_17926872.png" alt="" className="emoji" /> Scan Again</button>
              <button className="btn btn-primary userChoice"><img src="public/floppy-disk_2011797.png" alt="" className="emoji" /> Save Results</button>
              <button className="btn btn-primary userChoice"><img src="public/printer_8139457.png" alt="" className="emoji" /> Print Report</button>
              <button className="btn btn-success userChoice"><img src="public/share_16786846.png" alt="" className="emoji" /> Share with Doctor</button>
              <button className="btn btn-success userChoice" onClick={handleConsultWithDoctor}> {loading ? "Connecting..." : <><img src="public/doctor_3467875.png" alt="" className="emoji" /> Consult with Doctor</>}</button>
            </div>
          </div>

          <div className="test-results-grid">
            {testResults.map((test) => (
              <div key={test.id} className="test-result-card">
                <div className="test-header">
                  <div className="test-icon"><img src={test.icon} alt="" className="emojis" /></div>
                  <div className="test-info">
                    <h3 className="test-name">{test.name}</h3>
                    <p className="test-range">Normal: {test.range}</p>
                  </div>
                </div>

                <div className="test-value-section">
                  <div className="test-value">
                    <span className="value-number">{test.value}</span>
                    {test.unit && <span className="value-unit">{test.unit}</span>}
                  </div>
                  <div
                    className="test-status"
                    style={{
                      backgroundColor: getStatusColor(test.status),
                      color: "white",
                    }}
                  >
                    {getStatusText(test.status)}
                  </div>
                </div>

                <div className="test-description">
                  <p>{test.description}</p>
                </div>

                <div className="test-trend">
                  <div className="trend-indicator">
                    <span className="trend-icon"><img src="public/bar_14968536.png" alt="" className="emoji" /></span>
                    <span className="trend-text">Stable</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="results-summary">
            <div className="summary-card">
              <div className="summary-header">
                <h3>Overall Health Score</h3>
                <div className="health-score">
                  <div className="score-circle">
                    <span className="score-number">92</span>
                    <span className="score-label">/ 100</span>
                  </div>
                </div>
              </div>
              <div className="summary-content">
                <p className="summary-text">
                  Your health parameters are within normal ranges. Continue maintaining your current lifestyle and
                  regular check-ups.
                </p>
                <div className="recommendations">
                  <h4>Recommendations:</h4>
                  <ul>
                    <li><img src="public/check-box_12503615.png" alt="" className="emoji" /> Continue regular exercise routine</li>
                    <li><img src="public/check-box_12503615.png" alt="" className="emoji" /> Maintain balanced diet</li>
                    <li><img src="public/check-box_12503615.png" alt="" className="emoji" /> Stay hydrated throughout the day</li>
                    <li><img src="public/schedule_3174027.png" alt="" className="emoji" /> Schedule next check-up in 3 months</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}

    </div>
  )
}
