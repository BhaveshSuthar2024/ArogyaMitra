// models/Doctor.js

import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const doctorSchema = new mongoose.Schema({
  // 🔹 Basic Info
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  profileImage: { type: String }, 
  isVerified: { type: Boolean, default: false },

  // 🔹 Professional Info
  licenseNumber: { type: String, required: true, unique: true },
  specialty: { type: String },
  qualifications: { type: [String] },
  experience: { type: Number }, // in years
  languagesSpoken: [{ type: String }],
  clinicAddress: { type: String },

  // 🔒 Authentication & Access Control
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  role: { type: String, enum: ["doctor", "admin"], default: "doctor" },

  // 🔹 Video Calls
  videoCallsAttended: [
    {
      callId: { type: mongoose.Schema.Types.ObjectId, ref: "VideoCall" },
      patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
      date: { type: Date },
      consultationType: { type: String }, // e.g. "general", "emergency"
      status: {
        type: String,
        enum: ["successful", "unsuccessful", "cancelled", "missed"],
        default: "successful",
      },
    },
  ],

  // 🔹 Diagnosed Patients
  patientsDiagnosed: [
    {
      patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
      prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
      diagnosedAt: { type: Date, default: Date.now },
    },
  ],

  // 🔹 Appointments
  appointments: [
    {
      appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
      patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
      scheduledAt: { type: Date },
      status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled", "no-show"],
        default: "scheduled",
      },
    },
  ],

  // 🔹 Summary Stats
  stats: {
    totalAppointments: { type: Number, default: 0 },
    successfulAppointments: { type: Number, default: 0 },
    unsuccessfulAppointments: { type: Number, default: 0 },
    patientsDiagnosedCount: { type: Number, default: 0 },
    videoCallsHandled: { type: Number, default: 0 },
  },

  // 🔹 Availability / Scheduling
  availability: {
    days: [{ type: String }], // e.g., ["Monday", "Wednesday"]
    timeSlots: [{ type: String }], // e.g., ["09:00-12:00", "14:00-16:00"]
  },

  // 🔹 Metadata
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

doctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});


doctorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Doctor", doctorSchema);
