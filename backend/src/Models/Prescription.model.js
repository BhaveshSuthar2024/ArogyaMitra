import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  medications: [
    {
      name: {
        type: String,
        required: true
      },
      dosage: {
        type: String,
        required: true
      },
      frequency: {
        type: String, // e.g., "Once a day", "Twice daily"
        required: true
      },
      duration: {
        type: String, // e.g., "5 days", "1 week"
        required: true
      }
    }
  ],
  diagnosis: {
    type: String // Optional: Reason for the prescription
  },
  notes: {
    type: String // Optional: Additional doctor instructions
  },
  prescribedAt: {
    type: Date,
    default: Date.now
  },
  nextVisitDate: {
    type: Date // Optional: Follow-up schedule
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model("Prescription", prescriptionSchema);
