"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useLanguage } from "../contexts/LanguageContext"
import "./MedicalServicesDirectory.css"

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MedicalServicesDirectory = () => {
  const { language, t } = useLanguage()
  const [currentView, setCurrentView] = useState("categories") // categories, list, map
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(null)

  // Mock medical services data
  const mockServices = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      nameHindi: "डॉ. राजेश कुमार",
      role: "Doctor",
      roleHindi: "डॉक्टर",
      specialization: "General Medicine",
      specializationHindi: "सामान्य चिकित्सा",
      avatar: "👨‍⚕️",
      status: "online",
      distance: "2.5 km",
      phone: "+91 9876543210",
      location: { lat: 28.6139, lng: 77.209 },
      category: "doctor",
      experience: "15 years",
      languages: ["Hindi", "English"],
      consultationFee: "₹200",
      rating: 4.8,
      availability: "9:00 AM - 6:00 PM",
    },
    {
      id: 2,
      name: "Nurse Priya Sharma",
      nameHindi: "नर्स प्रिया शर्मा",
      role: "Nurse",
      roleHindi: "नर्स",
      specialization: "Primary Care",
      specializationHindi: "प्राथमिक देखभाल",
      avatar: "👩‍⚕️",
      status: "online",
      distance: "1.8 km",
      phone: "+91 9876543211",
      location: { lat: 28.6129, lng: 77.208 },
      category: "nurse",
      experience: "8 years",
      languages: ["Hindi", "English"],
      consultationFee: "₹100",
      rating: 4.6,
      availability: "8:00 AM - 8:00 PM",
    },
    {
      id: 3,
      name: "Dr. Sunita Devi",
      nameHindi: "डॉ. सुनीता देवी",
      role: "Doctor",
      roleHindi: "डॉक्टर",
      specialization: "Pediatrics",
      specializationHindi: "बाल चिकित्सा",
      avatar: "👩‍⚕️",
      status: "offline",
      distance: "3.2 km",
      phone: "+91 9876543212",
      location: { lat: 28.6149, lng: 77.21 },
      category: "doctor",
      experience: "12 years",
      languages: ["Hindi"],
      consultationFee: "₹250",
      rating: 4.9,
      availability: "10:00 AM - 4:00 PM",
    },
    {
      id: 4,
      name: "Ambulance Service",
      nameHindi: "एम्बुलेंस सेवा",
      role: "Emergency",
      roleHindi: "आपातकाल",
      specialization: "24/7 Emergency",
      specializationHindi: "24/7 आपातकाल",
      avatar: "🚑",
      status: "online",
      distance: "0.5 km",
      phone: "108",
      location: { lat: 28.6119, lng: 77.207 },
      category: "emergency",
      experience: "Always Available",
      languages: ["Hindi", "English"],
      consultationFee: "Free",
      rating: 4.7,
      availability: "24/7",
    },
    {
      id: 5,
      name: "Lab Technician Amit",
      nameHindi: "लैब तकनीशियन अमित",
      role: "Lab Tech",
      roleHindi: "लैब तकनीशियन",
      specialization: "Blood Tests",
      specializationHindi: "रक्त जांच",
      avatar: "🧑‍🔬",
      status: "online",
      distance: "2.1 km",
      phone: "+91 9876543213",
      location: { lat: 28.6159, lng: 77.211 },
      category: "staff",
      experience: "6 years",
      languages: ["Hindi", "English"],
      consultationFee: "₹150",
      rating: 4.5,
      availability: "7:00 AM - 7:00 PM",
    },
    {
      id: 6,
      name: "Pharmacist Ravi",
      nameHindi: "फार्मासिस्ट रवि",
      role: "Pharmacist",
      roleHindi: "फार्मासिस्ट",
      specialization: "Medicine Supply",
      specializationHindi: "दवा आपूर्ति",
      avatar: "💊",
      status: "online",
      distance: "1.2 km",
      phone: "+91 9876543214",
      location: { lat: 28.6109, lng: 77.206 },
      category: "staff",
      experience: "10 years",
      languages: ["Hindi", "English"],
      consultationFee: "Free Consultation",
      rating: 4.4,
      availability: "8:00 AM - 10:00 PM",
    },
  ]

  const categories = [
    {
      id: "all",
      name: "All Services",
      nameHindi: "सभी सेवाएं",
      icon: "🏥",
      color: "bg-blue-500",
    },
    {
      id: "doctor",
      name: "Doctors",
      nameHindi: "डॉक्टर",
      icon: "👨‍⚕️",
      color: "bg-green-500",
    },
    {
      id: "nurse",
      name: "Nurses",
      nameHindi: "नर्स",
      icon: "👩‍⚕️",
      color: "bg-purple-500",
    },
    {
      id: "staff",
      name: "Medical Staff",
      nameHindi: "चिकित्सा कर्मचारी",
      icon: "🧑‍🔬",
      color: "bg-orange-500",
    },
    {
      id: "emergency",
      name: "Emergency",
      nameHindi: "आपातकाल",
      icon: "🚑",
      color: "bg-red-500",
    },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setServices(mockServices)
      setLoading(false)
    }, 1000)

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Location access denied")
          // Default to Delhi coordinates
          setUserLocation({ lat: 28.6139, lng: 77.209 })
        },
      )
    }
  }, [])

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.nameHindi.includes(searchTerm) ||
      service.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.specializationHindi.includes(searchTerm)
    return matchesCategory && matchesSearch
  })

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentView("list")
  }

  const handleServiceAction = (service, action) => {
    switch (action) {
      case "consult":
        alert(`Starting consultation with ${service.name}`)
        break
      case "call":
        window.open(`tel:${service.phone}`)
        break
      case "book":
        alert(`Booking appointment with ${service.name}`)
        break
      default:
        break
    }
  }

  const LocationMarker = () => {
    const map = useMap()

    useEffect(() => {
      if (userLocation) {
        map.setView([userLocation.lat, userLocation.lng], 13)
      }
    }, [map, userLocation])

    return userLocation ? (
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>
          <div className="text-center">
            <strong>{language === "hi" ? "आपका स्थान" : "Your Location"}</strong>
          </div>
        </Popup>
      </Marker>
    ) : null
  }

  if (loading) {
    return (
      <div className="medical-directory-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <h2 className={language === "hi" ? "hindi-text" : ""}>
            {language === "hi" ? "चिकित्सा सेवाएं लोड हो रही हैं..." : "Loading Medical Services..."}
          </h2>
          <p className={language === "hi" ? "hindi-text" : ""}>
            {language === "hi" ? "कृपया प्रतीक्षा करें" : "Please wait"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="medical-directory-container">
      {/* Header */}
      <div className="directory-header">
        <div className="header-content">
          <div className="header-title">
            <h1 className={language === "hi" ? "hindi-text" : ""}>
              🏥 {language === "hi" ? "उपलब्ध चिकित्सा सेवाएं" : "Available Medical Services"}
            </h1>
            <p className={language === "hi" ? "hindi-text" : ""}>
              {language === "hi" ? "अपने आस-पास के स्वास्थ्य सेवा प्रदाताओं को खोजें" : "Find healthcare providers near you"}
            </p>
          </div>
          <div className="header-actions">
            <button className="view-toggle-btn" onClick={() => setCurrentView(currentView === "list" ? "map" : "list")}>
              {currentView === "list" ? "🗺️" : "📋"}
              <span className={language === "hi" ? "hindi-text" : ""}>
                {currentView === "list" ? (language === "hi" ? "मानचित्र" : "Map") : language === "hi" ? "सूची" : "List"}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder={language === "hi" ? "डॉक्टर या सेवा खोजें..." : "Search for doctors or services..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories View */}
      {currentView === "categories" && (
        <div className="categories-section">
          <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
            {language === "hi" ? "सेवा श्रेणी चुनें" : "Select Service Category"}
          </h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <button key={category.id} className="category-card" onClick={() => handleCategorySelect(category.id)}>
                <div className={`category-icon ${category.color}`}>
                  <span className="icon-emoji">{category.icon}</span>
                </div>
                <h3 className={`category-name ${language === "hi" ? "hindi-text" : ""}`}>
                  {language === "hi" ? category.nameHindi : category.name}
                </h3>
                <div className="category-count">
                  {category.id === "all" ? services.length : services.filter((s) => s.category === category.id).length}{" "}
                  {language === "hi" ? "उपलब्ध" : "available"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {currentView === "list" && (
        <div className="services-section">
          <div className="section-header">
            <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
              {language === "hi" ? "चिकित्सा सेवाएं" : "Medical Services"}
              <span className="service-count">({filteredServices.length})</span>
            </h2>
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="filter-icon">{category.icon}</span>
                  <span className={language === "hi" ? "hindi-text" : ""}>
                    {language === "hi" ? category.nameHindi : category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="services-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-header">
                  <div className="service-avatar">
                    <span className="avatar-emoji">{service.avatar}</span>
                    <div className={`status-indicator ${service.status}`}></div>
                  </div>
                  <div className="service-info">
                    <h3 className={`service-name ${language === "hi" ? "hindi-text" : ""}`}>
                      {language === "hi" ? service.nameHindi : service.name}
                    </h3>
                    <p className={`service-role ${language === "hi" ? "hindi-text" : ""}`}>
                      {language === "hi" ? service.roleHindi : service.role}
                    </p>
                    <p className={`service-specialization ${language === "hi" ? "hindi-text" : ""}`}>
                      {language === "hi" ? service.specializationHindi : service.specialization}
                    </p>
                  </div>
                  <div className="service-status">
                    <span className={`status-badge ${service.status}`}>
                      {service.status === "online"
                        ? language === "hi"
                          ? "उपलब्ध"
                          : "Available"
                        : language === "hi"
                          ? "व्यस्त"
                          : "Busy"}
                    </span>
                  </div>
                </div>

                <div className="service-details">
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{service.distance}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⭐</span>
                    <span className="detail-text">{service.rating}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <span className="detail-text">{service.consultationFee}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🕒</span>
                    <span className="detail-text">{service.availability}</span>
                  </div>
                </div>

                <div className="service-actions">
                  {service.category === "emergency" ? (
                    <button className="action-btn emergency" onClick={() => handleServiceAction(service, "call")}>
                      <span className="btn-icon">📞</span>
                      <span className={language === "hi" ? "hindi-text" : ""}>
                        {language === "hi" ? "तुरंत कॉल करें" : "Call Now"}
                      </span>
                    </button>
                  ) : (
                    <>
                      <button
                        className="action-btn primary"
                        onClick={() => handleServiceAction(service, "consult")}
                        disabled={service.status === "offline"}
                      >
                        <span className="btn-icon">💬</span>
                        <span className={language === "hi" ? "hindi-text" : ""}>
                          {language === "hi" ? "परामर्श" : "Consult"}
                        </span>
                      </button>
                      <button className="action-btn secondary" onClick={() => handleServiceAction(service, "book")}>
                        <span className="btn-icon">📅</span>
                        <span className={language === "hi" ? "hindi-text" : ""}>
                          {language === "hi" ? "अपॉइंटमेंट" : "Book"}
                        </span>
                      </button>
                      <button className="action-btn tertiary" onClick={() => handleServiceAction(service, "call")}>
                        <span className="btn-icon">📞</span>
                        <span className={language === "hi" ? "hindi-text" : ""}>
                          {language === "hi" ? "कॉल" : "Call"}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3 className={language === "hi" ? "hindi-text" : ""}>
                {language === "hi" ? "कोई सेवा नहीं मिली" : "No Services Found"}
              </h3>
              <p className={language === "hi" ? "hindi-text" : ""}>
                {language === "hi"
                  ? "कृपया अपनी खोज बदलें या अन्य श्रेणी चुनें"
                  : "Please try a different search or select another category"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Map View */}
      {currentView === "map" && (
        <div className="map-section">
          <div className="map-header">
            <h2 className={`section-title ${language === "hi" ? "hindi-text" : ""}`}>
              {language === "hi" ? "सेवा स्थान मानचित्र" : "Service Locations Map"}
            </h2>
            <button
              className="locate-btn"
              onClick={() => {
                if (userLocation && mapRef.current) {
                  mapRef.current.setView([userLocation.lat, userLocation.lng], 15)
                }
              }}
            >
              <span className="btn-icon">📍</span>
              <span className={language === "hi" ? "hindi-text" : ""}>
                {language === "hi" ? "मुझे खोजें" : "Locate Me"}
              </span>
            </button>
          </div>

          <div className="map-container">
            <MapContainer
              center={userLocation || [28.6139, 77.209]}
              zoom={13}
              style={{ height: "500px", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
              {filteredServices.map((service) => (
                <Marker key={service.id} position={[service.location.lat, service.location.lng]}>
                  <Popup>
                    <div className="map-popup">
                      <div className="popup-header">
                        <span className="popup-avatar">{service.avatar}</span>
                        <div className="popup-info">
                          <h4 className={language === "hi" ? "hindi-text" : ""}>
                            {language === "hi" ? service.nameHindi : service.name}
                          </h4>
                          <p className={language === "hi" ? "hindi-text" : ""}>
                            {language === "hi" ? service.specializationHindi : service.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="popup-details">
                        <p>
                          <strong>{language === "hi" ? "दूरी:" : "Distance:"}</strong> {service.distance}
                        </p>
                        <p>
                          <strong>{language === "hi" ? "शुल्क:" : "Fee:"}</strong> {service.consultationFee}
                        </p>
                        <p>
                          <strong>{language === "hi" ? "समय:" : "Hours:"}</strong> {service.availability}
                        </p>
                      </div>
                      <div className="popup-actions">
                        {service.category === "emergency" ? (
                          <button className="popup-btn emergency" onClick={() => handleServiceAction(service, "call")}>
                            {language === "hi" ? "तुरंत कॉल करें" : "Call Now"}
                          </button>
                        ) : (
                          <button
                            className="popup-btn primary"
                            onClick={() => handleServiceAction(service, "consult")}
                            disabled={service.status === "offline"}
                          >
                            {language === "hi" ? "परामर्श करें" : "Consult"}
                          </button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
        <button
          className="nav-btn"
          onClick={() => setCurrentView("categories")}
          disabled={currentView === "categories"}
        >
          <span className="nav-icon">🏠</span>
          <span className={language === "hi" ? "hindi-text" : ""}>{language === "hi" ? "होम" : "Home"}</span>
        </button>
        <button className="nav-btn" onClick={() => window.history.back()}>
          <span className="nav-icon">↩️</span>
          <span className={language === "hi" ? "hindi-text" : ""}>{language === "hi" ? "वापस" : "Back"}</span>
        </button>
        <button className="nav-btn" onClick={() => alert("Help section coming soon!")}>
          <span className="nav-icon">❓</span>
          <span className={language === "hi" ? "hindi-text" : ""}>{language === "hi" ? "सहायता" : "Help"}</span>
        </button>
      </div>
    </div>
  )
}

export default MedicalServicesDirectory