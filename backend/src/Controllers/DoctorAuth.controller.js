import Doctor from '../Models/Doctor.model.js';
import CustomError from '../Utils/CustomError.js';
import asyncHandler from '../Utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import sendEmailOTP from '../Utils/sendEmailOTP.js';
import verifyEmailOTP from '../Utils/varifyEmailOTP.js';
import OTP from '../Models/OTP.model.js';
import UploadOnCloudinary from '../Utils/Cloudinary.js'
import CallRequest from '../Models/CallRequest.model.js'

const options = {
    maxAge: parseInt(process.env.EXPIRES_IN),
    httpOnly: true,
    sameSite: "Lax",
    secure: false
};

const GenerateAccessToken = async (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_STRING, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const requestOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next(new CustomError("Mobile number is required", 400));
  }
  
  await sendEmailOTP(email);

  res.status(200).json({ success: true, message: 'OTP sent to email' });
});

const registerDoctor = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    gender,
    licenseNumber,
    specialty,
    qualifications,
    experience,
    languagesSpoken,
    clinicAddress,
    availableDays, 
    availableTimeSlots,
    password,
    confirmPassword,
    otp
  } = req.body;

  console.log(" :- ", req.body);

  // ✅ Field validation
  if (
    !name || !email || !phone || !gender || !licenseNumber || !specialty ||
    !languagesSpoken || !clinicAddress ||
    !password || !confirmPassword || !otp
  ) {
    return next(new CustomError("All fields including OTP are required", 400));
  }

  // ✅ File validation
  const profileImageLocal = req.files?.profileImage?.[0]?.path;
  const licenseCertificateLocal = req.files?.licenseCertificate?.[0]?.path;
  const idProofLocal = req.files?.idProof?.[0]?.path;

  console.log(":- ", profileImageLocal);
  console.log(":- ", licenseCertificateLocal);
  console.log(":- ", idProofLocal);
  

  if (!profileImageLocal || !licenseCertificateLocal || !idProofLocal) {
    return next(new CustomError("All 3 images must be uploaded", 400));
  }

  if (password !== confirmPassword) {
    return next(new CustomError("Passwords do not match", 400));
  }

  const existing = await Doctor.findOne({ email });
  if (existing) {
    return next(new CustomError("Doctor with this email already exists", 409));
  }

  const isValidOtp = await verifyEmailOTP(email, otp);
  
  if (!isValidOtp) {
    return next(new CustomError("Invalid or expired OTP", 401));
  }

  // ✅ Upload images to Cloudinary
  const profileImageUpload = await UploadOnCloudinary(profileImageLocal);
  const licenseCertificateUpload = await UploadOnCloudinary(licenseCertificateLocal);
  const idProofUpload = await UploadOnCloudinary(idProofLocal);

  if (!profileImageUpload || !licenseCertificateUpload || !idProofUpload) {
    return next(new CustomError("Failed to upload one or more documents", 500));
  }

  // ✅ Save doctor
  const newDoctor = await Doctor.create({
    name,
    email,
    phone,
    gender,
    profileImage: profileImageUpload.secure_url,
    licenseNumber,
    specialty,
    qualifications: JSON.parse(qualifications),
    experience,
    languagesSpoken: JSON.parse(languagesSpoken),
    clinicAddress,
    availability: {
      days: JSON.parse(availableDays || "[]"),
      timeSlots: JSON.parse(availableTimeSlots || "[]"),
    },
    password,
    licenseCertificate: licenseCertificateUpload.secure_url,
    idProof: idProofUpload.secure_url,
    isVerified: false,
    verificationStatus: "pending",
  });

  await OTP.deleteMany({ email });

  res.status(201).json({
    success: true,
    message: "Doctor registered successfully",
    doctorId: newDoctor._id,
  });
});

const loginDoctor = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // ✅ 1. Check fields
  if (!email || !password) {
    return next(new CustomError("Email and password are required", 400));
  }

  // ✅ 2. Find doctor and include password
  const doctor = await Doctor.findOne({ email }).select("+password");
  if (!doctor) {
    return next(new CustomError("Invalid credentials", 401));
  }

  // ✅ 3. Check if doctor is verified by admin
  if (!doctor.isVerified || doctor.verificationStatus !== "approved") {
    return next(new CustomError("Your account is pending approval by admin", 403));
  }

  // ✅ 4. Compare password
  const isPasswordMatch = await doctor.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new CustomError("Invalid credentials", 401));
  }

  // ✅ 5. Generate JWT token
  const AccessToken = await GenerateAccessToken(doctor._id);

  console.log(AccessToken);
  

  res.cookie('jwt', AccessToken, options);

  // ✅ 6. Send response
  res.status(200).json({
    success: true,
    message: "Login successful",
    doctor: {
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      verified: doctor.isVerified,
      role: "doctor"
    },
  });
});

const getCurrentDoctor = asyncHandler(async (req, res, next) => {
  const doctor = req.doctor;

  res.status(200).json({
    success: true,
    doctor
  });
});


const getCallRequests = asyncHandler(async (req, res) => {
  const { specialization } = req.query;

  const filter = {
    status: "pending",
  };

  if (specialization) {
    filter.consultationType = specialization;
  }

  const requests = await CallRequest.find(filter)
    .populate("patient", "name gender age")
    .sort({ requestedAt: -1 });

  res.status(200).json({
    message: "Pending call requests",
    count: requests.length,
    data: requests,
  });
});

export { requestOTP, registerDoctor, loginDoctor, getCurrentDoctor, getCallRequests };