// Mock data for Disease Analytics Dashboard

// Generate mock disease data
export const mockDiseaseData = Array.from({ length: 500 }, (_, index) => {
  const diseases = [
    "Malaria",
    "Dengue",
    "Typhoid",
    "Diabetes",
    "Hypertension",
    "Respiratory Infection",
    "Skin Disease",
    "Gastroenteritis",
  ]
  const regions = [
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
    "Gujarat",
    "Rajasthan",
    "West Bengal",
    "Uttar Pradesh",
    "Punjab",
    "Kerala",
  ]
  const ageGroups = ["0-12", "13-30", "31-50", "51+"]
  const severities = ["mild", "moderate", "critical"]
  const sources = ["ai", "doctor", "kiosk"]

  const randomDate = new Date()
  randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90)) // Last 90 days

  return {
    id: index + 1,
    patientId: `P${String(index + 1).padStart(6, "0")}`,
    age: Math.floor(Math.random() * 80) + 1,
    region: regions[Math.floor(Math.random() * regions.length)],
    disease: diseases[Math.floor(Math.random() * diseases.length)],
    ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    date: randomDate.toISOString().split("T")[0],
    timestamp: randomDate.toISOString(),
  }
})

// Mock regional data for heatmap
export const mockRegionalData = [
  {
    name: "Maharashtra",
    totalCases: 1250,
    topDiseases: ["Dengue", "Malaria", "Diabetes"],
    density: "high",
  },
  {
    name: "Delhi",
    totalCases: 980,
    topDiseases: ["Respiratory Infection", "Hypertension", "Dengue"],
    density: "high",
  },
  {
    name: "Karnataka",
    totalCases: 850,
    topDiseases: ["Malaria", "Typhoid", "Skin Disease"],
    density: "medium",
  },
  {
    name: "Tamil Nadu",
    totalCases: 720,
    topDiseases: ["Dengue", "Gastroenteritis", "Diabetes"],
    density: "medium",
  },
  {
    name: "Gujarat",
    totalCases: 650,
    topDiseases: ["Malaria", "Hypertension", "Respiratory Infection"],
    density: "medium",
  },
  {
    name: "Rajasthan",
    totalCases: 580,
    topDiseases: ["Typhoid", "Skin Disease", "Malaria"],
    density: "low",
  },
  {
    name: "West Bengal",
    totalCases: 520,
    topDiseases: ["Dengue", "Malaria", "Gastroenteritis"],
    density: "low",
  },
  {
    name: "Uttar Pradesh",
    totalCases: 480,
    topDiseases: ["Typhoid", "Respiratory Infection", "Diabetes"],
    density: "low",
  },
  {
    name: "Punjab",
    totalCases: 420,
    topDiseases: ["Hypertension", "Diabetes", "Skin Disease"],
    density: "low",
  },
  {
    name: "Kerala",
    totalCases: 380,
    topDiseases: ["Dengue", "Gastroenteritis", "Malaria"],
    density: "low",
  },
]

// Mock trend data for line charts
export const mockTrendData = Array.from({ length: 30 }, (_, index) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - index))

  return {
    date: date.toISOString().split("T")[0],
    Malaria: Math.floor(Math.random() * 50) + 10,
    Dengue: Math.floor(Math.random() * 40) + 15,
    Typhoid: Math.floor(Math.random() * 30) + 5,
    Diabetes: Math.floor(Math.random() * 35) + 20,
    Hypertension: Math.floor(Math.random() * 45) + 25,
    "Respiratory Infection": Math.floor(Math.random() * 25) + 8,
    "Skin Disease": Math.floor(Math.random() * 20) + 5,
    Gastroenteritis: Math.floor(Math.random() * 15) + 3,
  }
})

// Export all mock data
export default {
  mockDiseaseData,
  mockRegionalData,
  mockTrendData,
}
