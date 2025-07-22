import VideoCall from "../Models/VideoCall.model.js";
import CustomError from "../Utils/CustomError.js";
import asyncHandler from "../Utils/asyncHandler.js";
import CallRequest from "../Models/CallRequest.model.js";
import Doctor from "../Models/Doctor.model.js";

// POST /api/video-calls/request
export const createCallRequest = asyncHandler(async (req, res) => {
  const { patientId, symptoms, consultationType } = req.body;

  const roomName = `consult_${Date.now()}`;
  const roomUrl = `https://meet.jit.si/${roomName}`;

  // 1. Save request to DB
  const request = await CallRequest.create({
    patient: patientId,
    symptoms,
    consultationType,
    status: "pending",
    roomUrl,
  });

  console.log("📥 Request saved:", request);

  // 2. Find eligible doctors (verified and specialization match)
  const eligibleDoctors = await Doctor.find({
    isVerified: true,
    specialization: consultationType, // Optional filter
  });

  // 3. Emit request to each doctor room
  const io = req.app.get("io");

  eligibleDoctors.forEach((doctor) => {
    const roomName = `doctor-${doctor._id}`;
    io.to(roomName).emit("new-call-request", {
      requestId: request._id,
      patientId,
      symptoms,
      consultationType,
      requestedAt: request.createdAt,
      roomUrl,
    });

    console.log(`📡 Emitted to ${roomName}`);
  });

  res.status(201).json({
    message: "Consultation request sent",
    request,
    roomUrl, // Important for frontend redirection
  });
});


// PUT /api/video-calls/:id/accept
export const acceptVideoCall = asyncHandler(async (req, res) => {
  const { id } = req.params; // call request ID
  const { doctorId } = req.body;

  console.log(id, doctorId);

  const request = await CallRequest.findById(id);
  if (!request) {
    return res.status(404).json({ message: "Call request not found" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ message: "Request is no longer available" });
  }

  request.status = "accepted";
  request.doctor = doctorId;
  await request.save();

  // Notify patient if needed (optional)

  res.status(200).json({
    message: "Call request accepted",
    request,
  });
});

// PUT /api/video-calls/:id/reject
export const rejectVideoCall = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { doctorId } = req.body;

  const request = await CallRequest.findById(id); // ✅ use CallRequest not VideoCallRequest
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ message: "Request already handled" });
  }

  request.status = "rejected";
  request.doctor = doctorId;
  await request.save();

  return res.status(200).json({
    message: "Call request rejected",
    request,
  });
});

// GET /api/video-calls/pending
export const getPendingCalls = asyncHandler(async (req, res) => {
  const { specialization } = req.query;
  let filter = { status: "pending", doctor: null };

  if (specialization) {
    filter.consultationType = specialization;
  }

  const pendingCalls = await VideoCall.find(filter)
    .populate("User", "name gender age")
    .sort({ requestedAt: -1 });

  res.status(200).json({
    message: "Pending video calls fetched",
    count: pendingCalls.length,
    calls: pendingCalls,
  });
});

// PATCH /api/video-calls/:id/start
export const startVideoCall = asyncHandler(async (req, res) => {
  const videoCallId = req.params.id;
  const { role } = req.body;

  if (!role || !["doctor", "patient"].includes(role)) {
    throw new CustomError("Role must be 'doctor' or 'patient'", 400);
  }

  const videoCall = await VideoCall.findById(videoCallId);
  if (!videoCall) {
    throw new CustomError("Video call not found", 404);
  }

  if (role === "doctor") videoCall.isDoctorJoined = true;
  if (role === "patient") videoCall.isPatientJoined = true;

  if (
    videoCall.isDoctorJoined &&
    videoCall.isPatientJoined &&
    !videoCall.startedAt
  ) {
    videoCall.status = "in-progress";
    videoCall.startedAt = Date.now();
  }

  await videoCall.save();

  res.status(200).json({
    message: `${role} marked as joined`,
    status: videoCall.status,
    startedAt: videoCall.startedAt,
  });
});

// PATCH /api/video-calls/:id/complete
export const completeVideoCall = asyncHandler(async (req, res) => {
  const videoCallId = req.params.id;
  const videoCall = await VideoCall.findById(videoCallId);
  if (!videoCall) {
    throw new CustomError("Video call not found", 404);
  }

  if (videoCall.status !== "in-progress") {
    throw new CustomError("Cannot complete a call that is not in progress", 400);
  }

  const now = new Date();
  const durationMs = now - videoCall.startedAt;
  const durationMinutes = Math.ceil(durationMs / 60000);

  videoCall.endedAt = now;
  videoCall.durationInMinutes = durationMinutes;
  videoCall.status = "completed";
  await videoCall.save();

  res.status(200).json({
    message: "Video call marked as completed",
    callId: videoCall._id,
    duration: durationMinutes + " mins",
  });
});

// PATCH /api/video-calls/:id/cancel
export const cancelVideoCall = asyncHandler(async (req, res) => {
  const videoCallId = req.params.id;
  const { cancellationReason, cancelledBy } = req.body;

  const videoCall = await VideoCall.findById(videoCallId);
  if (!videoCall) {
    throw new CustomError("Video call not found", 404);
  }

  if (["in-progress", "completed", "cancelled"].includes(videoCall.status)) {
    throw new CustomError("Call cannot be cancelled at this stage", 400);
  }

  videoCall.status = "cancelled";
  videoCall.cancellationReason = cancellationReason || "User cancelled the request";
  await videoCall.save();

  res.status(200).json({
    message: `Video call cancelled by ${cancelledBy || "user"}`,
    callId: videoCall._id,
    status: videoCall.status,
    reason: videoCall.cancellationReason,
  });
});