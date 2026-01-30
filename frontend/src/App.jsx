import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { LanguageProvider } from "./contexts/LanguageContext"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { SensorProvider } from "./contexts/sensorContext.jsx";
import WelcomePage from "./components/WelcomePage"
import MedicalKioskHome from "./components/MedicalKioskHome"
import AdminDashboard from "./components/AdminDashboard"
import AuthForm from "./components/AuthForm"
import PatientDashboard from "./components/PatientDashboard"
import DoctorDashboard from "./components/DoctorDashboard"
import VoiceForm from "./components/VoiceForm.jsx";
import "./App.css";
import WaitingRoom from "./components/WaitingRoom.jsx";
import DoctorAuth from './components/DoctorAuth.jsx'
import ScreenSaver from './components/ScreenSaver.jsx'
import useIdleTimer from './hooks/useIdleTimer.js'
import MedicalServicesDirectory from "./components/MedicalServicesDirectory.jsx"
import AdminDiseaseAnalytics from './components/AdminDiseaseAnalytics.jsx'


function AppRoutes() {
  const { user } = useAuth();

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
        path="/analytics"
        element={
            <AdminDiseaseAnalytics />
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
          
            <PatientDashboard />
          
        }
      />

      <Route
        path="/doctor"
        element={
          
            <DoctorDashboard />
          
        }
      />

      <Route
        path="/form"
        element={
          
            <VoiceForm />
          
        }
      />

       <Route
        path="/services"
        element={
            <MedicalServicesDirectory />
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}

function App() {
  const isIdle = useIdleTimer(1000000000);
  
  return (
    <LanguageProvider>
      <AuthProvider>
        <SensorProvider>
        <Router>
          <div className="App">
            {isIdle ? (
              <ScreenSaver />      
            ) : (
              <AppRoutes />
            )}
          </div>
        </Router>
        </SensorProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
