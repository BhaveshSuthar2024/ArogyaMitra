import User from "../Models/user.model.js";
import asyncHandler from "../Utils/asyncHandler.js";

export const getLoggedInPatientDashboard = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .select("-aadharNo -aadharHash") // remove sensitive data
    .populate("appointments.doctorId", "name specialization") // optional
    .populate("prescriptions.prescribedBy", "name");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});