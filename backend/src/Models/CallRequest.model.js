import mongoose from "mongoose";

const callRequestSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },

    symptoms: {
      type: [String],
      required: true,
      default: [],
    },

    consultationType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "in-progress",
        "completed",
        "missed",
      ],
      default: "pending",
    },

    roomUrl: {
      type: String,
    },

    rejectionReason: String,
    cancellationReason: String,

    patientFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
    },

    doctorNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CallRequest", callRequestSchema);
