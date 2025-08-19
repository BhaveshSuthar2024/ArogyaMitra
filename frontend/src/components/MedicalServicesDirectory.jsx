"use client"
import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import { useLanguage } from "../contexts/LanguageContext";
import "./MedicalServicesDirectory.css";
import "leaflet/dist/leaflet.css";


// Fix for default markers in react-leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

// Custom marker icons for different service types
const createCustomIcon = (color, text) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-pin" style="background-color: ${color};">
             <span class="marker-text">${text}</span>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

const MedicalServicesDirectory = () => {
  const { language, t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [userLocation, setUserLocation] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const mapRef = useRef(null)

  // Enhanced mock services data with more realistic information
  const mockServices = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      nameHindi: "डॉ. राजेश कुमार",
      role: "General Physician",
      roleHindi: "सामान्य चिकित्सक",
      specialization: "Internal Medicine",
      specializationHindi: "आंतरिक चिकित्सा",
      avatar: "👨‍⚕️",
      status: "available",
      distance: "2.5 km",
      phone: "+91 9876543210",
      location: { lat: 28.6139, lng: 77.209 },
      category: "doctor",
      rating: 4.8,
      experience: "15 years",
      experienceHindi: "15 साल",
      availability: "9 AM - 6 PM",
      availabilityHindi: "सुबह 9 - शाम 6",
      consultationFee: "₹500",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop",
      nextSlot: "Today 3:30 PM",
      nextSlotHindi: "आज दोपहर 3:30",
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      nameHindi: "डॉ. प्रिया शर्मा",
      role: "Pediatrician",
      roleHindi: "बाल रोग विशेषज्ञ",
      specialization: "Child Healthcare",
      specializationHindi: "बाल स्वास्थ्य देखभाल",
      avatar: "👩‍⚕️",
      status: "busy",
      distance: "1.8 km",
      phone: "+91 9876543211",
      location: { lat: 28.6129, lng: 77.208 },
      category: "doctor",
      rating: 4.9,
      experience: "12 years",
      experienceHindi: "12 साल",
      availability: "10 AM - 5 PM",
      availabilityHindi: "सुबह 10 - शाम 5",
      consultationFee: "₹600",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=200&fit=crop",
      nextSlot: "Tomorrow 11:00 AM",
      nextSlotHindi: "कल सुबह 11:00",
    },
    {
      id: 3,
      name: "Nurse Sunita",
      nameHindi: "नर्स सुनीता",
      role: "Registered Nurse",
      roleHindi: "पंजीकृत नर्स",
      specialization: "Home Care",
      specializationHindi: "घरेलू देखभाल",
      avatar: "👩‍⚕️",
      status: "available",
      distance: "3.2 km",
      phone: "+91 9876543212",
      location: { lat: 28.6149, lng: 77.21 },
      category: "nurse",
      rating: 4.7,
      experience: "8 years",
      experienceHindi: "8 साल",
      availability: "24/7",
      availabilityHindi: "24/7",
      consultationFee: "₹300",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
      nextSlot: "Available Now",
      nextSlotHindi: "अभी उपलब्ध",
    },
    {
      id: 4,
      name: "Emergency Services",
      nameHindi: "आपातकालीन सेवाएं",
      role: "Ambulance",
      roleHindi: "एम्बुलेंस",
      specialization: "Emergency Response",
      specializationHindi: "आपातकालीन प्रतिक्रिया",
      avatar: "🚑",
      status: "available",
      distance: "0.5 km",
      phone: "108",
      location: { lat: 28.6119, lng: 77.207 },
      category: "emergency",
      rating: 4.9,
      experience: "24/7 Service",
      experienceHindi: "24/7 सेवा",
      availability: "Always Available",
      availabilityHindi: "हमेशा उपलब्ध",
      consultationFee: "Free",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      nextSlot: "Immediate",
      nextSlotHindi: "तत्काल",
    },
    {
      id: 5,
      name: "Dr. Amit Patel",
      nameHindi: "डॉ. अमित पटेल",
      role: "Cardiologist",
      roleHindi: "हृदय रोग विशेषज्ञ",
      specialization: "Heart Specialist",
      specializationHindi: "हृदय विशेषज्ञ",
      avatar: "👨‍⚕️",
      status: "available",
      distance: "4.1 km",
      phone: "+91 9876543213",
      location: { lat: 28.6159, lng: 77.211 },
      category: "doctor",
      rating: 4.9,
      experience: "20 years",
      experienceHindi: "20 साल",
      availability: "11 AM - 7 PM",
      availabilityHindi: "सुबह 11 - शाम 7",
      consultationFee: "₹800",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop",
      nextSlot: "Today 5:00 PM",
      nextSlotHindi: "आज शाम 5:00",
    },
    {
      id: 6,
      name: "Physiotherapy Center",
      nameHindi: "फिजियोथेरेपी केंद्र",
      role: "Physiotherapist",
      roleHindi: "फिजियोथेरेपिस्ट",
      specialization: "Physical Therapy",
      specializationHindi: "भौतिक चिकित्सा",
      avatar: "🏥",
      status: "available",
      distance: "2.8 km",
      phone: "+91 9876543214",
      location: { lat: 28.6109, lng: 77.206 },
      category: "therapy",
      rating: 4.6,
      experience: "10 years",
      experienceHindi: "10 साल",
      availability: "8 AM - 8 PM",
      availabilityHindi: "सुबह 8 - रात 8",
      consultationFee: "₹400",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop",
      nextSlot: "Today 4:15 PM",
      nextSlotHindi: "आज दोपहर 4:15",
    },
  ]

  const categories = [
    { id: "all", name: "All Services", nameHindi: "सभी सेवाएं", count: mockServices.length },
    {
      id: "doctor",
      name: "Doctors",
      nameHindi: "डॉक्टर",
      count: mockServices.filter((s) => s.category === "doctor").length,
    },
    { id: "nurse", name: "Nurses", nameHindi: "नर्स", count: mockServices.filter((s) => s.category === "nurse").length },
    {
      id: "emergency",
      name: "Emergency",
      nameHindi: "आपातकाल",
      count: mockServices.filter((s) => s.category === "emergency").length,
    },
    {
      id: "therapy",
      name: "Therapy",
      nameHindi: "चिकित्सा",
      count: mockServices.filter((s) => s.category === "therapy").length,
    },
  ]

  useEffect(() => {
    setTimeout(() => {
      setServices(mockServices)
      setLoading(false)
    }, 1000)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          setUserLocation({ lat: 28.6139, lng: 77.209 })
        },
      )
    }
  }, [])

  const filteredServices = services.filter(
    (service) => selectedCategory === "all" || service.category === selectedCategory,
  )

  const handleServiceAction = (service) => {
    if (service.category === "emergency") {
      window.open(`tel:${service.phone}`)
    } else {
      setSelectedService(service)
      // You can add booking logic here
      alert(`Booking appointment with ${service.name}...`)
    }
  }

  const getMarkerIcon = (service) => {
    const colors = {
      doctor: "#4CAF50",
      nurse: "#2196F3",
      emergency: "#F44336",
      therapy: "#FF9800",
    }
    return createCustomIcon(colors[service.category] || "#4CAF50", service.avatar)
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
          <div className="location-popup">
            <strong>{language === "hi" ? "आपका स्थान" : "Your Location"}</strong>
          </div>
        </Popup>
      </Marker>
    ) : null
  }

  if (loading) {
    return (
      <div className="medical-directory">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <h2 className={language === "hi" ? "hindi-text" : ""}>
            {language === "hi" ? "लोड हो रहा है..." : "Loading Medical Services..."}
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="medical-directory-split">
      {/* Header */}
      <div className="directory-header-split">
        <div className="header-left">
          <h1 className={language === "hi" ? "hindi-text" : ""}>
            🏥 {language === "hi" ? "चिकित्सा सेवाएं" : "MEDICAL SERVICES"}
          </h1>
          <span className="location-text">📍 {language === "hi" ? "दिल्ली" : "Delhi"}</span>
        </div>
        <div className="header-right">
          <button className="filter-btn">🔍 {language === "hi" ? "फिल्टर परिणाम" : "FILTER RESULTS"} ▼</button>
          <div className="header-tabs">
            <span className="tab active">{language === "hi" ? "परिणाम" : "RESULTS"}</span>
            <span className="tab">{language === "hi" ? "पसंदीदा" : "FAVOURITES"}</span>
          </div>
        </div>
      </div>

      <div className="directory-content-split">
        {/* Map Section */}
        <div className="map-section">
          <MapContainer
            center={userLocation || [28.6139, 77.209]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
            {filteredServices.map((service) => (
              <Marker
                key={service.id}
                position={[service.location.lat, service.location.lng]}
                icon={getMarkerIcon(service)}
              >
                <Popup>
                  <div className="service-popup">
                    <div className="popup-header">
                      <h4>{language === "hi" ? service.nameHindi : service.name}</h4>
                      <div className="popup-rating">⭐ {service.rating}</div>
                    </div>
                    <p className="popup-role">{language === "hi" ? service.roleHindi : service.role}</p>
                    <p className="popup-distance">📍 {service.distance}</p>
                    <p className="popup-fee">{service.consultationFee}</p>
                    <button className="popup-button" onClick={() => handleServiceAction(service)}>
                      {service.category === "emergency"
                        ? language === "hi"
                          ? "तुरंत कॉल करें"
                          : "Call Now"
                        : language === "hi"
                          ? "बुक करें"
                          : "Book Now"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Services List Section */}
        <div className="services-section">
          {/* Category Filters */}
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-filter ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {language === "hi" ? category.nameHindi : category.name}
                <span className="category-count">({category.count})</span>
              </button>
            ))}
          </div>

          {/* Services List */}
          <div className="services-list">
            {filteredServices.map((service) => (
              <div key={service.id} className="service-card-split">
                <div className="service-image">
                  <img src={service.image || "/placeholder.svg"} alt={service.name} />
                  <div className={`status-indicator ${service.status}`}>
                    {service.status === "available" ? "●" : "●"}
                  </div>
                </div>

                <div className="service-details">
                  <div className="service-header">
                    <h3 className={`service-name ${language === "hi" ? "hindi-text" : ""}`}>
                      {language === "hi" ? service.nameHindi : service.name}
                    </h3>
                    <div className="service-price">{service.consultationFee}</div>
                  </div>

                  <p className={`service-role ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "hi" ? service.roleHindi : service.role}
                  </p>

                  <p className={`service-specialization ${language === "hi" ? "hindi-text" : ""}`}>
                    {language === "hi" ? service.specializationHindi : service.specialization}
                  </p>

                  <div className="service-meta">
                    <span className="service-distance">📍 {service.distance}</span>
                    <span className="service-rating">⭐ {service.rating}</span>
                    <span className={`service-experience ${language === "hi" ? "hindi-text" : ""}`}>
                      👨‍⚕️ {language === "hi" ? service.experienceHindi : service.experience}
                    </span>
                  </div>

                  <div className={`service-availability ${language === "hi" ? "hindi-text" : ""}`}>
                    <span className="availability-label">{language === "hi" ? "अगला स्लॉट:" : "Next available:"}</span>
                    <span className="availability-time">
                      {language === "hi" ? service.nextSlotHindi : service.nextSlot}
                    </span>
                  </div>
                </div>

                <div className="service-actions">
                  <button className="action-heart">♡</button>
                  <button
                    className={`action-book ${service.category === "emergency" ? "emergency" : ""}`}
                    onClick={() => handleServiceAction(service)}
                  >
                    {service.category === "emergency"
                      ? language === "hi"
                        ? "📞 कॉल"
                        : "📞 Call"
                      : language === "hi"
                        ? "📅 बुक करें"
                        : "📅 Book"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      

      {/* Back Navigation */}
      <div className="back-navigation">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← {language === "hi" ? "वापस" : "Back"}
        </button>
      </div>
    </div>
  )
}

export default MedicalServicesDirectory
