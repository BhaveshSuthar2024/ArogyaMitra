import mongoose from "mongoose";

const videoCallSchema = new mongoose.Schema({
  // === DAILY ROOM ===
  roomUrl: {
    type: String,
    required: true,
    unique: true, // Daily URL is globally unique
  },

  // === PARTICIPANTS ===
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "Patient"
    required: true,
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    default: null,
  },

  // === CALL STATUS ===
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "cancelled", "in-progress", "completed", "missed"],
    default: "pending",
  },

  isPatientJoined: {
    type: Boolean,
    default: false,
  },

  isDoctorJoined: {
    type: Boolean,
    default: false,
  },

  // === MEDICAL CONTEXT ===
  symptoms: {
    type: String,
    default: "",
  },

  consultationType: {
    type: String,
    enum: ["initial", "follow-up", "emergency", "General"],
    default: "initial",
  },

  diagnosisSummary: {
    type: String,
    default: "",
  },

  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prescription",
    default: null,
  },

  // === TIME DETAILS ===
  requestedAt: {
    type: Date,
    default: Date.now,
  },

  startedAt: Date,
  endedAt: Date,
  durationInMinutes: Number,

  // === FEEDBACK ===
  patientFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
  },

  doctorNotes: {
    type: String,
    default: "",
  },
}, { timestamps: true });

const VideoCall = mongoose.model("VideoCall", videoCallSchema);
export default VideoCall;
