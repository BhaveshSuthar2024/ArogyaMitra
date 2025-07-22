import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  age: {
    type: Number
  },
  aadharHash: {
    type: String,
    required: true,
    unique: true
  },
  aadharNo: {
    type: String,
    required: true,
    unique: true,
    length: 12
  },
  mobileNo: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  address: {
    village: String,
    district: String,
    state: String,
    pincode: String
  },
  guardian: {
    name: String,
    relation: String,
    mobileNo: String
  },

  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  },
  height: {
    type: Number, // in cm
    min: 30,
    max: 300
  },
  weight: {
    type: Number, // in kg
    min: 1,
    max: 500
  },
  BMI: {
    type: Number
  },

  preferredLanguage: {
    type: String,
    enum: ["en", "hi", "gu", "ta", "te", "bn", "mr", "other"],
    default: "en"
  },
  

  medicalHistory: [
    {
      condition: String,
      diagnosisDate: Date,
      notes: String
    }
  ],
  currentMedications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      prescribedBy: String
    }
  ],
  allergies: [String],
  vitals: [
    {
      timestamp: {
        type: Date,
        default: Date.now
      },
      temperature: Number,
      bloodPressure: String,
      heartRate: Number,
      oxygenLevel: Number,
      bloodSugar: Number
    }
  ],
  appointments: [
    {
      doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
      },
      date: Date,
      purpose: String,
      status: {
        type: String,
        enum: ["Scheduled", "Completed", "Cancelled"],
        default: "Scheduled"
      }
    }
  ],
  prescriptions: [
    {
      date: Date,
      prescribedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
      },
      medications: [
        {
          name: String,
          dosage: String,
          duration: String
        }
      ],
      notes: String
    }
  ],
  kioskVisits: [
    {
      visitDate: Date,
      reason: String,
      handledByKioskAI: Boolean,
      reportGenerated: Boolean
    }
  ],
  aiDiagnosis: [
  {
    title: String,
    description: String,
    confidence: String,
    date: Date
  }
],
healthAlerts: [
  {
    title: String,
    description: String,
    priority: { type: String, enum: ["Low", "Medium", "High"] },
    date: Date
  }
],
reminders: [
  {
    type: { type: String, enum: ["medicine", "appointment", "general"] },
    message: String,
    scheduledAt: Date,
    status: { type: String, enum: ["pending", "sent"], default: "pending" }
  }
],
documents: [
  {
    name: String,
    type: { type: String },
    fileUrl: String,
    uploadedAt: Date,
    doctor: String,
    icon: String
  }
],
emergencyContacts: [
  {
    name: String,
    relation: String,
    mobileNo: String,
    avatar: String
  }
],
videoConsultations: [
  {
    roomId: String,
    createdAt: { type: Date, default: Date.now },
    consultationType: { type: String, enum: ["video", "chat", "audio"] },
    status: { type: String, enum: ["pending", "active", "completed", "cancelled"], default: "pending" },
    symptoms: String,
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    }
  }
],
preferences: {
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  receiveNotifications: { type: Boolean, default: true }
},

  createdAt: {
    type: Date,
    default: Date.now
  }
});


userSchema.pre("save", function (next) {
  if (this.isModified("dateOfBirth") || this.isNew) {
    const today = new Date();
    const dob = new Date(this.dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    this.age = age;
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("aadharNo")) {
    this.aadharHash = crypto.createHash("sha256").update(this.aadharNo).digest("hex");
    this.aadharNo = await bcrypt.hash(this.aadharNo, 12);
  }
  next();
});

userSchema.methods.compareAadhar = async function (enteredAadhar) {
  return await bcrypt.compare(enteredAadhar, this.aadharNo);
};

export default mongoose.model("User", userSchema);