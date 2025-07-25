"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LanguageProvider } from "./contexts/LanguageContext"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import WelcomePage from "./components/WelcomePage"
import MedicalKioskHome from "./components/MedicalKioskHome"
import AdminDashboard from "./components/AdminDashboard"
import AuthForm from "./components/AuthForm"
import PatientDashboard from "./components/PatientDashboard"
import DoctorDashboard from "./components/DoctorDashboard"
import "./App.css"
import WaitingRoom from "./components/WaitingRoom";
import DoctorAuth from './components/DoctorAuth.jsx'
import MedicalServicesDirectory from "./components/MedicalServicesDirectory.jsx"


function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth"
        element={
            <AuthForm />
        }
      />

      <Route path="/waiting-room" element={<WaitingRoom />} />

      {/* Protected Routes */}
      <Route
        path="/welcome"
        element={
          
            <WelcomePage user={user} />
          
        }
      />

      <Route
        path="/doctorAuth"
        element={
          
            <DoctorAuth/>
          
        }
      />

      <Route
        path="/home"
        element={
          
            <MedicalKioskHome user={user} />
          
        }
      />

      <Route
        path="/admin"
        element={
          
            <AdminDashboard />
          
        }
      />

      <Route
        path="/patient"
        element={
          
            <PatientDashboard patient={user} />
          
        }
      />

      <Route
        path="/doctor"
        element={
          
            <DoctorDashboard />
          
        }
      />

       <Route
        path="/services"
        element={
            <MedicalServicesDirectory />
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/welcome" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
