import { useState, useRef, useMemo } from "react"
import { useLanguage } from "../contexts/LanguageContext.jsx"
import "./HealthScanner.css"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx"
import axios from "axios";
import { useEffect } from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
// import { LineChart } from '@mui/x-charts/LineChart';
import { useSensors } from "../contexts/sensorContext.jsx";
import { generateReportHTML } from "./reportTemplate";

export default function HealthScanner() {

  const [scanningState, setScanningState] = useState("idle") // idle, scanning, completed
  const [scanProgress, setScanProgress] = useState(0)
  const [showResults, setShowResults] = useState(true);
  const [isScanning, setisScanning] = useState(false);
  const [prepCountdown, setPrepCountdown] = useState(10);
  const [scanBuffer, setScanBuffer] = useState([]);
  const [finalResults, setFinalResults] = useState(null);
  const [loading, setloading] = useState(false);
  // const [ecgArray, setEcgArray] = useState([]);
  // const timeRef = useRef(0);
  // const [formData, setformData] = useState({})

  const { sensors, loading: sensorsLoading } = useSensors();

  // const ECG_WINDOW_SECONDS = 5; 
  
    const { logout } = useAuth();

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const { language, setLanguage, t } = useLanguage();

  const BASE_URL = "https://arogyamitra-asdf.onrender.com/api/v1"; 

  const getStatusFromValue = (value, normalMin, normalMax) => {
    if (value < normalMin) return "warning";
    if (value > normalMax) return "danger";
    return "normal";
  };

  const testResults = useMemo(() => {

    const hrValue = isScanning
    ? sensors?.HeartRate?.value ?? 0
    : finalResults?.heartRate ?? 0;

    const spo2Value = isScanning
      ? sensors?.SpO2?.value ?? 0
      : finalResults?.spo2 ?? 0;

    const tempValue = isScanning
      ? sensors?.TemperatureF?.value ?? 0
      : finalResults?.temp ?? 0;

  
  return [
     {
      id: 1,
      name: "Heart Rate",
      reading: hrValue,
      unit: "BPM",
      min: 40,
      max: 180,
      normalMin: 60,
      normalMax: 100,
      status: getStatusFromValue( hrValue, 60, 100),
      icon: "/heart_4252630.png",
      range: "60-100 BPM",
      description: "Your heart rate is within normal range",
    },
    {
      id: 2,
      name: "Blood Pressure",
      reading: 120, // systolic example
      unit: "mmHg",
      min: 60,
      max: 200,
      normalMin: 90,
      normalMax: 140,
      status: "normal",
      icon: "/blood_1240843.png",
      range: "90-140 mmHg",
      description: "Blood pressure is optimal",
    },
    {
      id: 3,
      name: "Oxygen Saturation",
      reading: spo2Value,
      unit: "%",
      min: 85,
      max: 100,
      normalMin: 95,
      normalMax: 100,
      status: getStatusFromValue(spo2Value, 95, 100),
      icon: "/lungs_1834842.png",
      range: "95-100%",
      description: "Oxygen levels are excellent",
    },
    {
      id: 4,
      name: "Body Temperature",
      reading: tempValue,
      unit: "°F",
      min: 90,
      max: 105,
      normalMin: 97,
      normalMax: 99,
      status: getStatusFromValue( tempValue, 97, 99 ),
      icon: "/thermometer_1400304.png",
      range: "97-99°F",
      description: "Temperature is normal",
    },
    {
      id: 5,
      name: "Stress Level",
      reading: 35,
      unit: "%",
      min: 0,
      max: 100,
      normalMin: 0,
      normalMax: 40,
      status:  getStatusFromValue(35, 0, 40),
      icon: "/meditation_4897166.png",
      range: "Low-Medium",
      description: "Stress levels are well managed",
    },
    {
      id: 6,
      name: "Hydration",
      reading: 70,
      unit: "%",
      min: 0,
      max: 100,
      normalMin: 60,
      normalMax: 100,
      status: getStatusFromValue(70, 60, 100),
      icon: "/drop_616546.png",
      range: "Good-Excellent",
      description: "Hydration levels are adequate",
    },
  ]}, [sensors, isScanning, finalResults]);

  useEffect(() => {
    if (!isScanning) return;
    if (!sensors) return;

    const hr = sensors?.HeartRate?.value;
    const spo2 = sensors?.SpO2?.value;
    const temp = sensors?.TemperatureF?.value;

    if (!hr || !spo2 || !temp) return; // skip junk

    setScanBuffer(prev => [
      ...prev,
      { heartRate: hr, spo2, temp, time: Date.now() }
    ]);
  }, [sensors, isScanning]);



  const normalize = (value, min, max) => {
    if (min === undefined || max === undefined) return 0;
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  };

  const getVitalColor = (value, normalMin, normalMax) => {
    if (value < normalMin) return "#ff7b00"; // low
    if (value > normalMax) return "#ff0000"; // high
    return "#00a308"; // normal
  };

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

  // function gaussian(x, mu, sigma, amp) {
  //   return amp * Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));
  // }

  // function generateECGPoint(time, heartRate = 72) {
  //   const beatDuration = 60 / heartRate;
  //   const phase = (time % beatDuration) / beatDuration;

  //   // Gaussian-based ECG components
  //   const p  = gaussian(phase, 0.15, 0.025,  0.12);   // P wave
  //   const q  = gaussian(phase, 0.28, 0.008, -0.25);   // Q
  //   const r  = gaussian(phase, 0.30, 0.006,  1.2);    // R
  //   const s  = gaussian(phase, 0.32, 0.010, -0.35);   // S
  //   const t  = gaussian(phase, 0.55, 0.05,   0.35);   // T wave

  //   // Baseline wander + noise
  //   const baseline = 0.02 * Math.sin(2 * Math.PI * time * 0.33);
  //   const noise = (Math.random() - 0.5) * 0.01;

  //   return +(p + q + r + s + t + baseline + noise).toFixed(3);
  // }


  // useEffect(() => {
  //   const dt = 0.01; // 10 ms
  //   let lastT = 0;

  //   const interval = setInterval(() => {
  //     const rawTime = timeRef.current;
  //     const t = rawTime % ECG_WINDOW_SECONDS;
  //     const v = generateECGPoint(rawTime, sensorData || 72);

  //     setEcgArray(prev => {
  //       // 🔥 TIME WRAPPED → CLEAR BUFFER
  //       if (t < lastT) {
  //         return [{ time: t, voltage: v }];
  //       }

  //       return [...prev, { time: t, voltage: v }];
  //     });

  //     lastT = t;
  //     timeRef.current += dt;
  //   }, 10);

  //   return () => clearInterval(interval);
  // }, [sensorData]);

  useEffect(() => {
    if (scanningState !== "idle") return;

    if (prepCountdown === 0) {
      startScan();
      return;
    }

    const timer = setTimeout(() => {
      setPrepCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [prepCountdown, scanningState]);


  const [scanMessageIndex, setScanMessageIndex] = useState(0)
  const scanMessages = [
    "Please place your hands on the scanner...",
    "Scanning in progress...",
    "Collecting health information...",
    "Analyzing vital signs...",
    "Almost done..."
  ]

  const computeFinalResults = (buffer, sensors) => {
    if (buffer.length > 1) {
      return {
        heartRate: Math.round(
          buffer.reduce((s, v) => s + v.heartRate, 0) / buffer.length
        ),
        spo2: Math.round(
          buffer.reduce((s, v) => s + v.spo2, 0) / buffer.length
        ),
        temp: (
          buffer.reduce((s, v) => s + v.temp, 0) / buffer.length
        ).toFixed(1)
      };
    }

    if (buffer.length === 1) {
      return buffer[0];
    }

    return {
      heartRate: sensors?.HeartRate?.value || 0,
      spo2: sensors?.SpO2?.value || 0,
      temp: sensors?.TemperatureF?.value || 0,
    };
  };


  const startScan = () => {
    setScanBuffer([]);   // reset history
    setFinalResults(null);
    setScanningState("scanning");
    setScanProgress(0);
    setShowResults(false);
    setScanMessageIndex(0);
    setisScanning(true);

    const messageInterval = setInterval(() => {
      setScanMessageIndex((prev) => (prev + 1) % scanMessages.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          if (prev >= 100) {
            clearInterval(progressInterval);
            clearInterval(messageInterval);

            setScanningState("completed");
            setisScanning(false);
            
            const avg = computeFinalResults(scanBuffer, sensors);

            console.log("This is the average:", avg);
            

            setFinalResults(avg);
            setShowResults(true);
            return 100;
          }
        }
        return prev + 2;
      });
    }, 400); // progress increments every second
  };

  
  

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
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
    console.log("Error starting video consultation:", err);
    alert("Failed to initiate video consultation");
  } finally {
    setLoading(false);
  }
};

  const handlePreview = () => {
    const html = generateReportHTML(formData, sensors);
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  };

  const handlePrint = () => {
    const html = generateReportHTML(formData, sensors);
    const w = window.open("", "_blank");
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.onload = () => w.print();
  };


  const handleDownload = () => {
    const html = generateReportHTML(formData, sensors);
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ArogyaMitra-Health-Report.html";
    link.click();
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
    logout();
    navigate("/auth")
  }

  // const ecgArray = Object.entries(ecg || {}).map(([time, voltage]) => ({
  //   time: parseFloat(time),
  //   voltage,
  // }));

  return (
    <div className="health-scanner">
      {scanningState === "idle" ? (
        <div className="futuristic-scanner-container">
          <div className="scanner-card glass">

            <div className="scanner-hands-wrapper">
              <div className="pulse-rings">
                <span></span><span></span><span></span>
              </div>

              <svg className="scanner-arc" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" />
                <circle 
                  cx="100" cy="100" r="90" 
                  style={{
                    strokeDashoffset: 565 - (565 * (10 - prepCountdown)) / 10
                  }} 
                />
              </svg>

              <div className="countdown-number">
                {prepCountdown}
              </div>
            </div>

            <h2 className="scanner-title">
              Place your hands on the sensor pads
            </h2>

            <p className="scanner-subtitle">
              Scanning will start automatically
            </p>

            <button className="skip-btn" onClick={startScan}>
              Skip & Start Now
            </button>

            <p className="ai-brand">
              Powered by <strong>ArogyaMitra AI</strong>
            </p>

          </div>
        </div>
      ): (
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
            <img src="/logout_14723873.png" alt="" className="emoji" /> Sign Out
          </button>

          <button 
            onClick={toggleLanguage} 
            className={`${language === "hi" ? "hindi-text" : ""} btn btn-secondary language-toggle`}
            style={{ marginLeft: "10px", padding: language ==="hi"? "10.5px 32px": "14px 32px" }}
          >
            <img src="/globe_12925125.png" alt="" className="emoji" /> {language === "en" ? "English" : "हिंदी"}
          </button>
        </div>
        <div className="results-container">
          <div className="results-header">
            <h2 className={`results-title ${language === "hi" ? "hindi-text" : ""}`}>Health Scan Results</h2>
            <p className={`results-subtitle ${language === "hi" ? "hindi-text" : ""}`}>
              Your health parameters have been analyzed
            </p>
            <div className="results-actions">
              <button className="btn btn-secondary userChoice" onClick={() => {setScanningState("idle"); setPrepCountdown(10); setFinalResults(null); setScanBuffer([])}}><img src="/reload_17926872.png" alt="" className="emoji" /> Scan Again</button>
              <button className="btn btn-primary userChoice"><img src="/floppy-disk_2011797.png" alt="" className="emoji" /> Save Results</button>
              <button className="btn btn-primary userChoice"><img src="/printer_8139457.png" alt="" className="emoji" /> Print Report</button>
              <button className="btn btn-success userChoice"><img src="/share_16786846.png" alt="" className="emoji" /> Share with Doctor</button>
              <button className="btn btn-success userChoice" onClick={handleConsultWithDoctor}> {loading ? "Connecting..." : <><img src="/doctor_3467875.png" alt="" className="emoji" /> Consult with Doctor</>}</button>
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
                
                  {!isScanning ? (
                    <>
                      <div className="test-value-section">
                        <div className="test-value">
                          <span className="value-number">{test.reading}</span>
                          {test.unit && <span className="value-unit">{test.unit}</span>}
                        </div>
                        <div
                          className="test-status"
                          style={{
                            backgroundColor: getVitalColor(
                              test.reading,
                              test.normalMin,
                              test.normalMax
                            ),
                            color: "white",
                          }}
                        >
                          {getStatusText(test.status)}
                        </div>
                      </div>

                      <div className="test-description">
                        <p>{test.description}</p>
                      </div>
                    </>
                  ) : (
                    <div className="gauge_section">
                      {(() => {
                        const percent = normalize(test.reading, test.min, test.max);
                        const color = getVitalColor(
                          test.reading,
                          test.normalMin,
                          test.normalMax
                        );

                        console.log("gauge percent:", percent)

                        return (
                          <div className="gauge_section" style={{ position: "relative", width: 200, height: 200 }}>
                           <Gauge
                              value={normalize(test.reading, test.min, test.max)} // arc percentage
                              startAngle={-110}
                              endAngle={110}
                              width={200}
                              height={200}
                              sx={{
                                [`& .${gaugeClasses.valueText}`]: {
                                  fontSize: 0, // hide default text
                                  fontWeight: "bold",
                                  fill: getVitalColor(test.reading, test.normalMin, test.normalMax),
                                },
                              }}
                            />

                            {/* Actual value overlay */}
                            <div
                              style={{
                                position: "absolute",
                                top: "64%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: getVitalColor(test.reading, test.normalMin, test.normalMax),
                                textAlign: "center",
                              }}
                            >
                              {test.reading} {test.unit || ""}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                <div className="test-trend">
                  <div className="trend-indicator">
                    <span className="trend-icon"><img src="/bar_14968536.png" alt="" className="emoji" /></span>
                    <span className="trend-text">Stable</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        {scanningState === "completed" && (
          <div className="ecg-card">
            {/* <LineChart
              dataset={ecgArray}
              xAxis={[
                {
                  dataKey: "time",
                  min: 0,
                  max: ECG_WINDOW_SECONDS,
                  scaleType: "linear",
                  tickNumber: 0,
                }
              ]}
              yAxis={[
                {
                  min: -1.5,
                  max: 1.5,
                  label: "Voltage (mV)",
                }
              ]}
              series={[
                {
                  dataKey: "voltage",
                  showMark: false,
                }
              ]}
              height={300}
              width={800}
              animation={false}
            /> */}

            
              <div className="health-report-bar">
              <div className="report-left">
                <h2>Health Report</h2>
                <p>
                  Consolidated diagnostic report generated from health scan
                </p>
              </div>

              <div className="report-right">
                <button className="btn btn-secondary" onClick={() => {handlePreview()}}>
                  <img src="/eye_709612.png" className="emoji" /> Preview
                </button>

                <button className="btn btn-primary" onClick={() => {handleDownload()}}>
                  <img src="/download_724933.png" className="emoji" /> Download
                </button>

                <button className="btn btn-success" onClick={() => {handlePrint()}}>
                  <img src="/printer_8139457.png" className="emoji" /> Print
                </button>

                <button className="btn btn-success">
                  <img src="/share_16786846.png" className="emoji" /> Share
                </button>
              </div>
            </div>
            
          </div>
        )}

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
                    <li><img src="/check-box_12503615.png" alt="" className="emoji" /> Continue regular exercise routine</li>
                    <li><img src="/check-box_12503615.png" alt="" className="emoji" /> Maintain balanced diet</li>
                    <li><img src="/check-box_12503615.png" alt="" className="emoji" /> Stay hydrated throughout the day</li>
                    <li><img src="/schedule_3174027.png" alt="" className="emoji" /> Schedule next check-up in 3 months</li>
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

