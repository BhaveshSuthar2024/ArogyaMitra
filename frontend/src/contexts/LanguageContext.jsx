"use client"

import { createContext, useContext, useState } from "react"

const translations = {
  en: {
    // Auth Welcome
    "auth.welcome.title": "Rural Health Kiosk",
    "auth.welcome.subtitle":
      "Your trusted healthcare companion for rural communities. Access quality medical services with ease.",

    // Auth Forms
    "auth.signin.title": "Sign In",
    "auth.signin.subtitle": "Enter your mobile number to access healthcare services",
    "auth.signup.title": "Sign Up",
    "auth.signup.subtitle": "Create your account to get started",
    "auth.signup.success": "Account created successfully! Please sign in.",

    // Form Fields
    "auth.name.label": "Full Name",
    "auth.name.placeholder": "Enter your full name",
    "auth.mobile.label": "Mobile Number",
    "auth.mobile.placeholder": "Enter 10-digit mobile number",
    "auth.mobile.info": "We'll send a 6-digit OTP to verify your mobile number",

    // Date of Birth
    "auth.dob.label": "Date of Birth",
    "auth.dob.day": "Day",
    "auth.dob.month": "Month",
    "auth.dob.year": "Year",
    "auth.dob.day.placeholder": "Day",
    "auth.dob.month.placeholder": "Select Month",
    "auth.dob.year.placeholder": "Year",

    "auth.gender.label": "Gender",
    "auth.gender.male": "Male",
    "auth.gender.female": "Female",
    "auth.gender.other": "Other",
    "auth.aadhaar.label": "Aadhaar Number",
    "auth.aadhaar.placeholder": "1234 5678 9012",
    "auth.aadhaar.info": "Your Aadhaar information is encrypted and secure",

    // OTP
    "auth.otp.label": "Enter 6-Digit OTP",
    "auth.otp.sent": "OTP sent successfully to your mobile number",
    "auth.otp.resent": "OTP resent successfully",
    "auth.otp.verified": "OTP verified successfully!",
    "auth.otp.timer": "Resend OTP in",
    "auth.otp.not.received": "Didn't receive OTP?",
    "auth.otp.resend": "Resend OTP",
    "auth.demo.otp": "Demo OTP",

    // Buttons
    "auth.send.otp": "Send OTP",
    "auth.sending.otp": "Sending OTP...",
    "auth.verify.signin": "Verify & Sign In",
    "auth.verifying": "Verifying...",
    "auth.continue": "Continue",
    "auth.back": "Back",
    "auth.create.account": "Create Account",
    "auth.creating.account": "Creating Account...",

    // Navigation
    "auth.have.account": "Already have an account?",
    "auth.no.account": "Don't have an account?",
    "auth.seconds": "seconds",

    // Errors
    "auth.error.name.required": "Full name is required",
    "auth.error.mobile.required": "Mobile number is required",
    "auth.error.mobile.invalid": "Please enter a valid 10-digit mobile number",
    "auth.error.dob.required": "Please select your complete date of birth",
    "auth.error.gender.required": "Please select your gender",
    "auth.error.aadhaar.required": "Aadhaar number is required",
    "auth.error.aadhaar.invalid": "Please enter a valid 12-digit Aadhaar number",
    "auth.error.otp.incomplete": "Please enter complete 6-digit OTP",
    "auth.error.otp.invalid": "Invalid OTP. Please try again.",
    "auth.error.otp.send": "Failed to send OTP. Please try again.",
    "auth.error.otp.verify": "Failed to verify OTP. Please try again.",

    // Welcome Page
    "welcome.subtitle": "Welcome to Rural Health Kiosk",
    "welcome.title": "Everybody's health improves every day",
    "welcome.description":
      "We provide all kinds of medical services to our patients according to their daily needs starting from special conditions",
    "welcome.enter": "Enter Health Kiosk",
    "welcome.learn": "Learn More",

    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.department": "Department",
    "nav.contact": "Contact",
    "nav.support": "Support",
    "nav.appointment": "📅 Appointment",

    // Quick Access
    "quick.emergency": "Emergency",
    "quick.screening": "Health Check",
    "quick.consult": "Consult",
    "quick.pharmacy": "Pharmacy",

    // Header
    "header.title": "Rural Health Kiosk",
    "header.subtitle": "Your Community Healthcare Partner",
    "header.location": "Rural Health Center",
    "header.back": "← Back to Welcome",

    // Language
    "language.switch": "🌐 EN",
    "language.english": "English",
    "language.hindi": "हिंदी",

    // Emergency
    "emergency.title": "Emergency Services",
    "emergency.text": "For life-threatening emergencies, call 911 immediately",
    "emergency.button": "Emergency",

    // Services
    "services.screening.title": "Health Screening",
    "services.screening.description": "Quick health assessment and vital signs check",
    "services.screening.button": "Start Screening",

    "services.consult.title": "Consult Doctor",
    "services.consult.description": "Video consultation with healthcare professionals",
    "services.consult.button": "Connect Now",

    "services.appointment.title": "Book Appointment",
    "services.appointment.description": "Schedule visit with local healthcare provider",
    "services.appointment.button": "Schedule Visit",

    "services.records.title": "Health Records",
    "services.records.description": "Access your medical history and test results",
    "services.records.button": "View Records",

    "services.education.title": "Health Education",
    "services.education.description": "Learn about preventive care and wellness",
    "services.education.button": "Learn More",

    "services.pharmacy.title": "Pharmacy Services",
    "services.pharmacy.description": "Prescription refills and medication information",
    "services.pharmacy.button": "Pharmacy",

    // Stats
    "stats.available": "Available Service",
    "stats.patients": "Patients Served",
    "stats.waittime": "Average Wait Time",

    // Contact
    "contact.title": "Contact Information",
    "contact.emergency": "Emergency Contacts",
    "contact.local": "Local Healthcare",
    "contact.emergency.services": "Emergency Services:",
    "contact.poison.control": "Poison Control:",
    "contact.mental.health": "Mental Health Crisis:",
    "contact.clinic": "Rural Health Clinic:",
    "contact.pharmacy": "Pharmacy:",
    "contact.transport": "Transport Service:",

    // Patient Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.greeting.morning": "Good Morning",
    "dashboard.greeting.afternoon": "Good Afternoon",
    "dashboard.greeting.evening": "Good Evening",
    "dashboard.greeting.question": "How are you feeling today?",
    "dashboard.health.portal": "Health Portal",
    "dashboard.last.visit": "Last Visit",
    "dashboard.next.appointment": "Next Appointment",
    "dashboard.notifications": "Notifications",
    "dashboard.new": "New",
    "dashboard.years": "years",
    "dashboard.male": "Male",
    "dashboard.female": "Female",

    // Navigation Items
    "nav.dashboard": "Dashboard",
    "nav.health.summary": "Health Summary",
    "nav.medical.history": "Medical History",
    "nav.prescriptions": "Prescriptions",
    "nav.health.scanner": "Health Scanner",
    "nav.appointments": "My Appointments",
    "nav.video.consultation": "Video Consultation",
    "nav.reports": "Reports & Documents",
    "nav.notifications": "Notifications",
    "nav.profile.settings": "Profile Settings",
    "nav.emergency.contacts": "Emergency Contacts",

    // Section Titles
    "section.main": "Main",
    "section.appointments": "Appointments",
    "section.documents": "Documents & Reports",
    "section.settings": "Settings",

    // Health Summary
    "health.current.vitals": "Current Vitals",
    "health.ai.diagnosis": "AI Diagnosis",
    "health.conditions": "Health Conditions",
    "health.alerts": "Health Alerts",
    "health.heart.rate": "Heart Rate",
    "health.blood.pressure": "Blood Pressure",
    "health.temperature": "Temperature",
    "health.spo2": "SpO2",
    "health.normal": "normal",
    "health.high": "high",
    "health.low": "low",

    // Buttons
    "btn.view.trends": "📊 View Trends",
    "btn.sync.devices": "🔄 Sync Devices",
    "btn.export.pdf": "📄 Export PDF",
    "btn.share": "📤 Share",
    "btn.set.reminders": "🔔 Set Reminders",
    "btn.order.refill": "🏥 Order Refill",
    "btn.view.calendar": "📅 View Calendar",
    "btn.book.appointment": "➕ Book Appointment",
    "btn.back.dashboard": "← Back to Main Dashboard",
    "btn.sign.out": "🚪 Sign Out",
    "btn.emergency.call": "🆘 Emergency Call",
    "btn.call.now": "Call Now: 911",

    // Emergency
    "emergency.support": "24/7 Medical Support",

    // Language Toggle
    "language.title": "Language / भाषा",
  },
  hi: {
    // Auth Welcome
    "auth.welcome.title": "ग्रामीण स्वास्थ्य कियोस्क",
    "auth.welcome.subtitle":
      "ग्रामीण समुदायों के लिए आपका विश्वसनीय स्वास्थ्य साथी। आसानी से गुणवत्तापूर्ण चिकित्सा सेवाओं का उपयोग करें।",

    // Auth Forms
    "auth.signin.title": "साइन इन करें",
    "auth.signin.subtitle": "स्वास्थ्य सेवाओं का उपयोग करने के लिए अपना मोबाइल नंबर दर्ज करें",
    "auth.signup.title": "साइन अप करें",
    "auth.signup.subtitle": "शुरुआत करने के लिए अपना खाता बनाएं",
    "auth.signup.success": "खाता सफलतापूर्वक बनाया गया! कृपया साइन इन करें।",

    // Form Fields
    "auth.name.label": "पूरा नाम",
    "auth.name.placeholder": "अपना पूरा नाम दर्ज करें",
    "auth.mobile.label": "मोबाइल नंबर",
    "auth.mobile.placeholder": "10 अंकों का मोबाइल नंबर दर्ज करें",
    "auth.mobile.info": "हम आपके मोबाइल नंबर को सत्यापित करने के लिए 6 अंकों का OTP भेजेंगे",

    // Date of Birth
    "auth.dob.label": "जन्म तिथि",
    "auth.dob.day": "दिन",
    "auth.dob.month": "महीना",
    "auth.dob.year": "साल",
    "auth.dob.day.placeholder": "दिन",
    "auth.dob.month.placeholder": "महीना चुनें",
    "auth.dob.year.placeholder": "साल",

    "auth.gender.label": "लिंग",
    "auth.gender.male": "पुरुष",
    "auth.gender.female": "महिला",
    "auth.gender.other": "अन्य",
    "auth.aadhaar.label": "आधार नंबर",
    "auth.aadhaar.placeholder": "1234 5678 9012",
    "auth.aadhaar.info": "आपकी आधार जानकारी एन्क्रिप्टेड और सुरक्षित है",

    // OTP
    "auth.otp.label": "6 अंकों का OTP दर्ज करें",
    "auth.otp.sent": "आपके मोबाइल नंबर पर OTP सफलतापूर्वक भेजा गया",
    "auth.otp.resent": "OTP सफलतापूर्वक दोबारा भेजा गया",
    "auth.otp.verified": "OTP सफलतापूर्वक सत्यापित!",
    "auth.otp.timer": "OTP दोबारा भेजें",
    "auth.otp.not.received": "OTP नहीं मिला?",
    "auth.otp.resend": "OTP दोबारा भेजें",
    "auth.demo.otp": "डेमो OTP",

    // Buttons
    "auth.send.otp": "OTP भेजें",
    "auth.sending.otp": "OTP भेजा जा रहा है...",
    "auth.verify.signin": "सत्यापित करें और साइन इन करें",
    "auth.verifying": "सत्यापित कर रहे हैं...",
    "auth.continue": "जारी रखें",
    "auth.back": "वापस",
    "auth.create.account": "खाता बनाएं",
    "auth.creating.account": "खाता बनाया जा रहा है...",

    // Navigation
    "auth.have.account": "पहले से खाता है?",
    "auth.no.account": "खाता नहीं है?",
    "auth.seconds": "सेकंड में",

    // Errors
    "auth.error.name.required": "पूरा नाम आवश्यक है",
    "auth.error.mobile.required": "मोबाइल नंबर आवश्यक है",
    "auth.error.mobile.invalid": "कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें",
    "auth.error.dob.required": "कृपया अपनी पूरी जन्म तिथि चुनें",
    "auth.error.gender.required": "कृपया अपना लिंग चुनें",
    "auth.error.aadhaar.required": "आधार नंबर आवश्यक है",
    "auth.error.aadhaar.invalid": "कृपया वैध 12 अंकों का आधार नंबर दर्ज करें",
    "auth.error.otp.incomplete": "कृपया पूरा 6 अंकों का OTP दर्ज करें",
    "auth.error.otp.invalid": "गलत OTP। कृपया दोबारा कोशिश करें।",
    "auth.error.otp.send": "OTP भेजने में विफल। कृपया दोबारा कोशिश करें।",
    "auth.error.otp.verify": "OTP सत्यापित करने में विफल। कृपया दोबारा कोशिश करें।",

    // Welcome Page
    "welcome.subtitle": "ग्रामीण स्वास्थ्य कियोस्क में आपका स्वागत है",
    "welcome.title": "हर दिन सभी का स्वास्थ्य बेहतर होता है",
    "welcome.description":
      "हम अपने मरीजों को उनकी दैनिक आवश्यकताओं के अनुसार विशेष स्थितियों से शुरू करके सभी प्रकार की चिकित्सा सेवाएं प्रदान करते हैं",
    "welcome.enter": "स्वास्थ्य कियोस्क में प्रवेश करें",
    "welcome.learn": "और जानें",

    // Navigation
    "nav.home": "होम",
    "nav.about": "हमारे बारे में",
    "nav.services": "सेवाएं",
    "nav.department": "विभाग",
    "nav.contact": "संपर्क",
    "nav.support": "सहायता",
    "nav.appointment": "📅 अपॉइंटमेंट",

    // Quick Access
    "quick.emergency": "आपातकाल",
    "quick.screening": "स्वास्थ्य जांच",
    "quick.consult": "सलाह",
    "quick.pharmacy": "फार्मेसी",

    // Header
    "header.title": "ग्रामीण स्वास्थ्य कियोस्क",
    "header.subtitle": "आपका सामुदायिक स्वास्थ्य साझीदार",
    "header.location": "ग्रामीण स्वास्थ्य केंद्र",
    "header.back": "← स्वागत पृष्ठ पर वापस",

    // Language
    "language.switch": "🌐 हि",
    "language.english": "English",
    "language.hindi": "हिंदी",

    // Emergency
    "emergency.title": "आपातकालीन सेवाएं",
    "emergency.text": "जीवन-घातक आपातकाल के लिए तुरंत 911 पर कॉल करें",
    "emergency.button": "आपातकाल",

    // Services
    "services.screening.title": "स्वास्थ्य जांच",
    "services.screening.description": "त्वरित स्वास्थ्य मूल्यांकन और महत्वपूर्ण संकेत जांच",
    "services.screening.button": "जांच शुरू करें",

    "services.consult.title": "डॉक्टर से सलाह",
    "services.consult.description": "स्वास्थ्य पेशेवरों के साथ वीडियो परामर्श",
    "services.consult.button": "अभी जुड़ें",

    "services.appointment.title": "अपॉइंटमेंट बुक करें",
    "services.appointment.description": "स्थानीय स्वास्थ्य प्रदाता के साथ मुलाकात का समय निर्धारित करें",
    "services.appointment.button": "मुलाकात निर्धारित करें",

    "services.records.title": "स्वास्थ्य रिकॉर्ड",
    "services.records.description": "अपने चिकित्सा इतिहास और परीक्षण परिणामों तक पहुंचें",
    "services.records.button": "रिकॉर्ड देखें",

    "services.education.title": "स्वास्थ्य शिक्षा",
    "services.education.description": "निवारक देखभाल और कल्याण के बारे में जानें",
    "services.education.button": "और जानें",

    "services.pharmacy.title": "फार्मेसी सेवाएं",
    "services.pharmacy.description": "प्रिस्क्रिप्शन रिफिल और दवा की जानकारी",
    "services.pharmacy.button": "फार्मेसी",

    // Stats
    "stats.available": "उपलब्ध सेवा",
    "stats.patients": "मरीजों की सेवा की गई",
    "stats.waittime": "औसत प्रतीक्षा समय",

    // Contact
    "contact.title": "संपर्क जानकारी",
    "contact.emergency": "आपातकालीन संपर्क",
    "contact.local": "स्थानीय स्वास्थ्य सेवा",
    "contact.emergency.services": "आपातकालीन सेवाएं:",
    "contact.poison.control": "विष नियंत्रण:",
    "contact.mental.health": "मानसिक स्वास्थ्य संकट:",
    "contact.clinic": "ग्रामीण स्वास्थ्य क्लिनिक:",
    "contact.pharmacy": "फार्मेसी:",
    "contact.transport": "परिवहन सेवा:",

    // Patient Dashboard
    "dashboard.welcome": "वापसी पर स्वागत है",
    "dashboard.greeting.morning": "सुप्रभात",
    "dashboard.greeting.afternoon": "नमस्कार",
    "dashboard.greeting.evening": "शुभ संध्या",
    "dashboard.greeting.question": "आज आप कैसा महसूस कर रहे हैं?",
    "dashboard.health.portal": "स्वास्थ्य पोर्टल",
    "dashboard.last.visit": "अंतिम मुलाकात",
    "dashboard.next.appointment": "अगली अपॉइंटमेंट",
    "dashboard.notifications": "सूचनाएं",
    "dashboard.new": "नई",
    "dashboard.years": "वर्ष",
    "dashboard.male": "पुरुष",
    "dashboard.female": "महिला",

    // Navigation Items
    "nav.dashboard": "डैशबोर्ड",
    "nav.health.summary": "स्वास्थ्य सारांश",
    "nav.medical.history": "चिकित्सा इतिहास",
    "nav.prescriptions": "दवाएं",
    "nav.health.scanner": "स्वास्थ्य स्कैनर",
    "nav.appointments": "मेरी अपॉइंटमेंट्स",
    "nav.video.consultation": "वीडियो परामर्श",
    "nav.reports": "रिपोर्ट और दस्तावेज",
    "nav.notifications": "सूचनाएं",
    "nav.profile.settings": "प्रोफाइल सेटिंग्स",
    "nav.emergency.contacts": "आपातकालीन संपर्क",

    // Section Titles
    "section.main": "मुख्य",
    "section.appointments": "अपॉइंटमेंट्स",
    "section.documents": "दस्तावेज और रिपोर्ट",
    "section.settings": "सेटिंग्स",

    // Health Summary
    "health.current.vitals": "वर्तमान जीवन संकेत",
    "health.ai.diagnosis": "AI निदान",
    "health.conditions": "स्वास्थ्य स्थितियां",
    "health.alerts": "स्वास्थ्य चेतावनी",
    "health.heart.rate": "हृदय गति",
    "health.blood.pressure": "रक्तचाप",
    "health.temperature": "तापमान",
    "health.spo2": "ऑक्सीजन स्तर",
    "health.normal": "सामान्य",
    "health.high": "उच्च",
    "health.low": "कम",

    // Buttons
    "btn.view.trends": "📊 रुझान देखें",
    "btn.sync.devices": "🔄 डिवाइस सिंक करें",
    "btn.export.pdf": "📄 PDF निर्यात करें",
    "btn.share": "📤 साझा करें",
    "btn.set.reminders": "🔔 रिमाइंडर सेट करें",
    "btn.order.refill": "🏥 दवा मंगवाएं",
    "btn.view.calendar": "📅 कैलेंडर देखें",
    "btn.book.appointment": "➕ अपॉइंटमेंट बुक करें",
    "btn.back.dashboard": "← मुख्य डैशबोर्ड पर वापस",
    "btn.sign.out": "🚪 साइन आउट",
    "btn.emergency.call": "🆘 आपातकालीन कॉल",
    "btn.call.now": "अभी कॉल करें: 911",

    // Emergency
    "emergency.support": "24/7 चिकित्सा सहायता",

    // Language Toggle
    "language.title": "Language / भाषा",
  },
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en")

  const t = (key) => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
