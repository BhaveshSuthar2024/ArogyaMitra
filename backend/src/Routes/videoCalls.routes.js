import express from "express";
import {
  createCallRequest,
  acceptVideoCall,
  rejectVideoCall,
  getPendingCalls,
  startVideoCall,
  completeVideoCall,
  cancelVideoCall
} from "../Controllers/VideoCall.controller.js";

const router = express.Router();

/**
 * 🔍 [DOCTOR] Fetch all pending video consultation requests
 * Optional: Filter by consultationType or specialization via query
 */
router.get("/pending", getPendingCalls);

/**
 * 🧑‍⚕️ [PATIENT] Request a new video consultation
 * Body: { patientId, symptoms, consultationType }
 */
router.post("/request", createCallRequest);

router.put("/:id/accept", acceptVideoCall);
router.put("/:id/reject", rejectVideoCall);

/**
 * 🚪 [DOCTOR or PATIENT] Mark self as joined
 * Params: :id (videoCallId)
 * Body: { role: 'doctor' | 'patient' }
 */
router.patch("/:id/start", startVideoCall);

/**
 * 📞 [SYSTEM] Mark a call as completed
 * Params: :id (videoCallId)
 */
router.patch("/:id/complete", completeVideoCall);

/**
 * 🛑 [PATIENT or SYSTEM] Cancel a call before it's accepted
 * Params: :id (videoCallId)
 * Body: { cancellationReason?, cancelledBy? }
 */
router.patch("/:id/cancel", cancelVideoCall);

export default router;
