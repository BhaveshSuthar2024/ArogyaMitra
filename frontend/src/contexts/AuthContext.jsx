import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check for existing session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("medicalKioskUser")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing saved user data:", error)
        localStorage.removeItem("medicalKioskUser")
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("medicalKioskUser", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("medicalKioskUser")
  }

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData }
    setUser(newUserData)
    localStorage.setItem("medicalKioskUser", JSON.stringify(newUserData))
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Medical Kiosk...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
