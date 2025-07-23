"use client"

import { useState, useRef } from "react"
import { useLanguage } from "../contexts/LanguageContext"
import "./DoctorAuth.css"
import axios from "axios"

const DoctorAuth = ({ onAuthSuccess }) => {
  const { language, translations } = useLanguage()
  const [currentStep, setCurrentStep] = useState("signin") // 'signin', 'signup', 'otp'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [qualificationInput, setQualificationInput] = useState("");

  const BASE_URL = "http://localhost:3000";

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  })

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    profileImage: null,
    licenseNumber: "",
    specialty: "",
    qualifications: [],
    experience: "",
    languagesSpoken: [],
    clinicAddress: "",
    availableDays: [],
    availableTimeSlots: [],
    password: "",
    confirmPassword: "",
    licenseCertificate: null,
    idProof: null,
  })

  const [currentSignUpStep, setCurrentSignUpStep] = useState(1)
  const fileInputRefs = {
    profileImage: useRef(null),
    licenseCertificate: useRef(null),
    idProof: useRef(null),
  }

  const specialties = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Gynecology",
    "Neurology",
    "Psychiatry",
    "Ophthalmology",
    "ENT",
    "Radiology",
    "Anesthesiology",
  ]

  const languages = [
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Bengali",
    "Marathi",
    "Gujarati",
    "Punjabi",
  ]

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const timeSlots = ["09:00-12:00", "10:00-13:00", "14:00-17:00", "15:00-18:00", "18:00-21:00", "19:00-22:00"]

  const sendDoctorOTP = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/doctor/requestOTP`, {
        email: signUpData.email,
      });

      console.log("OTP sent");
      setCurrentStep("otp");
      setEmail(signUpData.email);
      setOtp("");
    } catch (err) {
      console.log(err);
      
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleSignUpSubmit = async () => {
    setLoading(true);
    setError("");
    console.log("Hello my self Bhavesh");
    

    try {
      const formData = new FormData();

      // Add all signup data
      for (let key in signUpData) {
      const value = signUpData[key];
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value)); // ✅ Ensure numbers are strings
      }
    }

      formData.append("otp", otp); // collected in OTP step

      const res = await axios.post(`${BASE_URL}/api/v1/doctor/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      console.log("ASD :- ", data);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Step Navigation
  const handleSignUpNext = () => {
    if (validateCurrentStep()) {
      if (currentSignUpStep < 4) {
        setCurrentSignUpStep(currentSignUpStep + 1)
      }
      else if(currentSignUpStep == 4){
        sendDoctorOTP();
      }
      else {
        handleSignUpSubmit()
      }
    }
  }

  const handleSignUpPrev = () => {
    if (currentSignUpStep > 1) {
      setCurrentSignUpStep(currentSignUpStep - 1)
    }
  }

  // Validate current step
  const validateCurrentStep = () => {
    setError("");

    switch (currentSignUpStep) {
      case 1:
        if (!signUpData.name || !signUpData.email || !signUpData.phone || !signUpData.gender) {
          setError("Please fill all required fields");
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
          setError("Please enter a valid email address");
          return false;
        }
        if (!/^\d{10}$/.test(signUpData.phone)) {
          setError("Please enter a valid 10-digit phone number");
          return false;
        }
        break;
      case 2:
        if (
          !signUpData.licenseNumber ||
          !signUpData.specialty ||
          signUpData.qualifications.length === 0 || // ✅ corrected
          signUpData.experience === "" ||           // ✅ added
          isNaN(signUpData.experience) ||           // ✅ optional numeric check
          Number(signUpData.experience) < 0
        ) {
          setError("Please fill all professional details properly");
          return false;
        }
        break;
      case 3:
        if (signUpData.availableDays.length === 0 || signUpData.availableTimeSlots.length === 0) {
          setError("Please select your availability");
          return false;
        }
        break;
      case 4:
        if (!signUpData.password || !signUpData.confirmPassword) {
          setError("Please enter password and confirm password");
          return false;
        }
        if (signUpData.password !== signUpData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        if (signUpData.password.length < 8) {
          setError("Password must be at least 8 characters long");
          return false;
        }
        break;
    }
    return true;
  };


  // Handle file upload
  const handleFileUpload = (field, file) => {
    if (file) {
      setSignUpData((prev) => ({
        ...prev,
        [field]: file,
      }))
    }
  }

  // Handle array fields
  const handleArrayField = (field, value, isAdd = true) => {
    setSignUpData((prev) => ({
      ...prev,
      [field]: isAdd ? [...prev[field], value] : prev[field].filter((item) => item !== value),
    }))
  }

  // Add qualification
  const addQualification = (qualification) => {
    if (!qualification || signUpData.qualifications.includes(qualification)) return;
    handleArrayField("qualifications", qualification, true);
  };

  // Remove qualification
  const removeQualification = (qualification) => {
    handleArrayField("qualifications", qualification, false)
  }

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await axios.post(`${BASE_URL}/api/v1/doctor/requestOTP`, {
        email: signUpData.email,
      });
      console.log("OTP resent");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await axios.post(
      `${BASE_URL}/api/v1/doctor/login`,
      {
        email: signInData.email,
        password: signInData.password,
      },
      {
        withCredentials: true, // Send cookie
      }
    );

    const doctor = res.data?.doctor;

    if (doctor) {
      // ✅ Optionally pass doctor data to parent or global context
      onAuthSuccess?.(doctor);

      // Navigate to doctor dashboard (if using react-router)
      window.location.href = "/doctor";
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (err) {
    console.error(err);
    setError(
      err.response?.data?.message || "Login failed. Please check your credentials."
    );
  } finally {
    setLoading(false);
  }
};

  if (currentStep === "otp") {
    return (
      <div className="doctor-auth-container">
        <div className="doctor-auth-background">
          <div className="auth-decoration"></div>
          <div className="auth-decoration"></div>
          <div className="auth-decoration"></div>
        </div>

        <div className="doctor-auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-icon">🏥</div>
              <h1>Doctor Portal</h1>
            </div>
          </div>

          <div className="auth-step">
            <div className="step-header">
              <h2>Verify OTP</h2>
              <p>Enter the 6-digit code sent to {email}</p>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(), handleSignUpSubmit()}}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input otp-input"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength="6"
                  required
                />
              </div>

              <button type="submit" className="auth-btn primary" disabled={loading || otp.length !== 6}>
                {loading ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </button>
            </form>

            <div className="auth-actions">
              <button
                className="link-btn"
                onClick={() => {
                  const confirmBack = window.confirm("Going back will lose your progress. Continue?");
                  if (confirmBack) setCurrentStep("signin");
                }}
              >
                ← Back to Sign In
              </button>
              <button className="link-btn" onClick={handleResendOtp}>Resend OTP</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="doctor-auth-container">
      <div className="doctor-auth-background">
        <div className="auth-decoration"></div>
        <div className="auth-decoration"></div>
        <div className="auth-decoration"></div>
      </div>

      <div className="doctor-auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">🏥</div>
            <h1>Doctor Portal</h1>
          </div>
        </div>

        {/* Sign In Form */}
        {currentStep === "signin" && (
          <div className="auth-step">
            <div className="step-header">
              <h2>Doctor Sign In</h2>
              <p>Access your medical practice dashboard</p>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="doctor@hospital.com"
                  value={signInData.email}
                  onChange={(e) =>
                    setSignInData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={signInData.password}
                  onChange={(e) =>
                    setSignInData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <button type="submit" className="auth-btn primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                New doctor?
                <button className="link-btn" onClick={() => setCurrentStep("signup")}>
                  Register Here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Sign Up Form */}
        {currentStep === "signup" && (
          <div className="auth-step">
            <div className="signup-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(currentSignUpStep / 4) * 100}%` }}></div>
              </div>
              <div className="progress-text">Step {currentSignUpStep} of 4</div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentSignUpStep === 1 && (
              <div className="signup-step">
                <div className="step-header">
                  <h2>Personal Information</h2>
                  <p>Tell us about yourself</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Dr. John Smith"
                    value={signUpData.name}
                    onChange={(e) =>
                      setSignUpData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="doctor@hospital.com"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="9876543210"
                      value={signUpData.phone}
                      onChange={(e) =>
                        setSignUpData((prev) => ({
                          ...prev,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <div className="gender-selector">
                    {["Male", "Female", "Other"].map((gender) => (
                      <div key={gender} className="radio-option">
                        <input
                          type="radio"
                          id={`gender-${gender}`}
                          name="gender"
                          value={gender}
                          checked={signUpData.gender === gender}
                          onChange={(e) =>
                            setSignUpData((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                        />
                        <label htmlFor={`gender-${gender}`} className="radio-label">
                          {gender === "Male" ? "👨‍⚕️" : gender === "Female" ? "👩‍⚕️" : "⚕️"}
                          {gender}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Image</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      ref={fileInputRefs.profileImage}
                      accept="image/*"
                      onChange={(e) => handleFileUpload("profileImage", e.target.files[0])}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="file-upload-btn"
                      onClick={() => fileInputRefs.profileImage.current?.click()}
                    >
                      📷 Upload Profile Photo
                    </button>
                    {signUpData.profileImage && <span className="file-name">{signUpData.profileImage.name}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {currentSignUpStep === 2 && (
              <div className="signup-step">
                <div className="step-header">
                  <h2>Professional Details</h2>
                  <p>Your medical credentials</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Medical License Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MCI-12345"
                      value={signUpData.licenseNumber}
                      onChange={(e) =>
                        setSignUpData((prev) => ({
                          ...prev,
                          licenseNumber: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specialty *</label>
                    <select
                      className="form-select"
                      value={signUpData.specialty}
                      onChange={(e) =>
                        setSignUpData((prev) => ({
                          ...prev,
                          specialty: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select Specialty</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Qualifications *</label>
                  <div className="qualification-input">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., MBBS, MD, MS"
                      value={qualificationInput}
                      onChange={(e) => setQualificationInput(e.target.value)}
                      onBlur={(e) => {
                      const trimmed = e.target.value.trim();
                      if (trimmed && !signUpData.qualifications.includes(trimmed)) {
                        addQualification(trimmed);
                        setQualificationInput("");
                      }
                    }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const trimmed = qualificationInput.trim();
                          if (trimmed && !signUpData.qualifications.includes(trimmed)) {
                            addQualification(trimmed);
                            setQualificationInput("");
                          }
                        }
                      }}
                    />
                    <small className="form-hint">Press Enter to add qualification</small>
                  </div>
                  <div className="qualification-tags">
                    {signUpData.qualifications.map((qual) => (
                      <span key={qual} className="qualification-tag">
                        {qual}
                        <button type="button" onClick={() => removeQualification(qual)} className="remove-tag">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Experience (Years)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="5"
                      min="0"
                      max="50"
                      value={signUpData.experience}
                      onChange={(e) =>
                        setSignUpData((prev) => ({
                          ...prev,
                          experience: Number(e.target.value), // ✅ convert to number
                        }))
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Languages Spoken</label>
                    <select
                      className="form-select"
                      onChange={(e) => {
                        if (e.target.value && !signUpData.languagesSpoken.includes(e.target.value)) {
                          handleArrayField("languagesSpoken", e.target.value, true)
                        }
                        e.target.value = ""
                      }}
                    >
                      <option value="">Add Language</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="language-tags">
                  {signUpData.languagesSpoken.map((lang) => (
                    <span key={lang} className="language-tag">
                      {lang}
                      <button
                        type="button"
                        onClick={() => handleArrayField("languagesSpoken", lang, false)}
                        className="remove-tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Clinic Address</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Enter your clinic/hospital address"
                    rows="3"
                    value={signUpData.clinicAddress}
                    onChange={(e) =>
                      setSignUpData((prev) => ({
                        ...prev,
                        clinicAddress: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {/* Step 3: Availability */}
            {currentSignUpStep === 3 && (
              <div className="signup-step">
                <div className="step-header">
                  <h2>Availability Schedule</h2>
                  <p>When are you available for consultations?</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Available Days *</label>
                  <div className="days-selector">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="day-option">
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          checked={signUpData.availableDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleArrayField("availableDays", day, true)
                            } else {
                              handleArrayField("availableDays", day, false)
                            }
                          }}
                        />
                        <label htmlFor={`day-${day}`} className="day-label">
                          {day.slice(0, 3)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Available Time Slots *</label>
                  <div className="time-slots-selector">
                    {timeSlots.map((slot) => (
                      <div key={slot} className="time-slot-option">
                        <input
                          type="checkbox"
                          id={`slot-${slot}`}
                          checked={signUpData.availableTimeSlots.includes(slot)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleArrayField("availableTimeSlots", slot, true)
                            } else {
                              handleArrayField("availableTimeSlots", slot, false)
                            }
                          }}
                        />
                        <label htmlFor={`slot-${slot}`} className="time-slot-label">
                          {slot}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Security & Documents */}
            {currentSignUpStep === 4 && (
              <form action="">
              <div className="signup-step">
                <div className="step-header">
                  <h2>Security & Documents</h2>
                  <p>Complete your registration</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Create strong password"
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        setSignUpData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Medical License Certificate</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      ref={fileInputRefs.licenseCertificate}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload("licenseCertificate", e.target.files[0])}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="file-upload-btn"
                      onClick={() => fileInputRefs.licenseCertificate.current?.click()}
                    >
                      📄 Upload License Certificate
                    </button>
                    {signUpData.licenseCertificate && (
                      <span className="file-name">{signUpData.licenseCertificate.name}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ID Proof (Aadhaar/PAN)</label>
                  <div className="file-upload-area">
                    <input
                      type="file"
                      ref={fileInputRefs.idProof}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload("idProof", e.target.files[0])}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="file-upload-btn"
                      onClick={() => fileInputRefs.idProof.current?.click()}
                    >
                      🆔 Upload ID Proof
                    </button>
                    {signUpData.idProof && <span className="file-name">{signUpData.idProof.name}</span>}
                  </div>
                </div>
              </div>
              </form>
            )}

            {/* Navigation Buttons */}
            <div className="signup-navigation">
              {currentSignUpStep > 1 && (
                <button type="button" className="auth-btn secondary" onClick={handleSignUpPrev}>
                  ← Previous
                </button>
              )}

              <button type="button" className="auth-btn primary" onClick={handleSignUpNext} disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    {currentSignUpStep === 4 ? "Registering..." : "Processing..."}
                  </>
                ) : currentSignUpStep === 4 ? (
                  "Complete Registration"
                ) : (
                  "Next →"
                )}
              </button>
            </div>

            <div className="auth-switch">
              <p>
                Already have an account?
                <button className="link-btn" onClick={() => setCurrentStep("signin")}>
                  Sign In
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorAuth
