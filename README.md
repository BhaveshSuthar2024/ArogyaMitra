# 🩺 Arogyamitra – AI-Powered Remote Medical Kiosk  

> _“Bringing healthcare to every corner – one kiosk at a time.”_

Arogyamitra is an **AI-powered remote medical kiosk** designed to provide **primary healthcare services, doctor consultations, and medicine dispensing** to underserved and rural areas.  
Think of it as an **ATM for healthcare** – scan your ID, check vitals, consult a doctor live, and get medicines instantly.

---

## ✨ Features

- **Patient Onboarding**  
  - Aadhaar/ID scanning  
  - Speech-enabled multilingual authentication  
  - Automatic patient history retrieval  

- **Health Screening**  
  - Sensors for vitals (BP, temperature, SpO₂, heart rate)  
  - Symptom-based AI assessment  
  - Pain level and health questionnaire  

- **Doctor Consultation**  
  - Real-time video consultation with doctors via 100ms / Daily.co  
  - Dynamic room creation and token-based joining  
  - Doctor notification system with accept/reject options  

- **AI-Powered Prescriptions**  
  - AI recommends initial diagnosis and prescriptions  
  - Doctor can approve/modify prescriptions remotely  
  - Separate models for medications and prescriptions  

- **Medicine Dispensing**  
  - Integrated storage and dispensing system  
  - Real-time stock monitoring  

- **Multilingual & Accessible**  
  - English + Hindi support  
  - Speech synthesis (native + meSpeak.js fallback)  

- **Admin Dashboard**  
  - Real-time monitoring of kiosks  
  - Patient records and analytics  
  - Doctor scheduling and management  

---

## 🏗️ Tech Stack

### Frontend
- React 18 with Hooks + Context API
- Tailwind CSS + Shadcn UI  
- Socket.io-client for real-time events  
- SpeechSynthesis & meSpeak.js for voice prompts  

### Backend
- Node.js + Express.js
- MongoDB + Mongoose  
- JWT authentication  
- Socket.io for real-time doctor notifications  
- Integration with 100ms/Daily.co API for video rooms  
- Cloud storage for medical data  

### Hardware Integration
- Raspberry Pi / Touchscreen interface  
- IoT sensors (temperature, BP, SpO₂, heart rate)  
- Automated medicine dispenser  
