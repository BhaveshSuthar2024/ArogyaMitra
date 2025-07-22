import User from '../Models/user.model.js';
import CustomError from '../Utils/CustomError.js';
import asyncHandler from '../Utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendOTP from '../Utils/sendOTP.js';
import verifyOTP from '../Utils/varifyOTP.js';

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
    const { mobileNo } = req.body;

    console.log(req.body);
    

    if (!mobileNo) {
        return next(new CustomError("Mobile number is required", 400));
    }

    await sendOTP(mobileNo);

    res.status(200).json({ success: true, message: 'OTP sent to mobile number' });
});

const registerUser = asyncHandler(async (req, res, next) => {
    const { name, aadharNo, mobileNo, dateOfBirth, gender, otp } = req.body;

    if (!name || !aadharNo || !mobileNo || !dateOfBirth || !gender || !otp) {
      return next(new CustomError("All fields including OTP are mandatory", 400));
    }

    const alreadyExistUsers = await User.find({ mobileNo });
    if (alreadyExistUsers.length >= 4) {
      return next(new CustomError("Maximum user limit reached for this mobile number", 401));
    }

    const aadharHash = crypto.createHash("sha256").update(aadharNo).digest("hex");
    const existingUser = await User.findOne({ aadharHash });

    if (existingUser) {
      return next(new CustomError("Aadhar already registered", 409));
    }

    try {
        await verifyOTP(mobileNo, otp);
    } catch (err) {
        return next(new CustomError(err.message, 400));
    }

    const user = await User.create({
        name,
        aadharNo,
        aadharHash,
        mobileNo,
        dateOfBirth,
        gender
    });

    if (!user) {
      return next(new CustomError("There was an error while creating the user", 403));
    }

    const AccessToken = await GenerateAccessToken(user._id);
    res.cookie('jwt', AccessToken, options);

    res.status(201).json({
        status: "Success",
        data: user
    });
});

const loginRequestOTP = asyncHandler(async (req, res, next) => {
  const { mobileNo } = req.body;

  if (!mobileNo) {
    return next(new CustomError("Mobile number is required", 400));
  }

  const user = await User.findOne({ mobileNo });
  if (!user) {
    return next(new CustomError("No user registered with this mobile number", 404));
  }

  await sendOTP(mobileNo);

  res.status(200).json({ success: true, message: "OTP sent to registered mobile number" });
});

const loginVerifyOTP = asyncHandler(async (req, res, next) => {
  const { mobileNo, otp } = req.body;

  if (!mobileNo || !otp) {
    return next(new CustomError("Mobile number and OTP are required", 400));
  }

  const user = await User.findOne({ mobileNo });
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  try {
    await verifyOTP(mobileNo, otp);
  } catch (err) {
    return next(new CustomError(err.message, 400));
  }

  const accessToken = await GenerateAccessToken(user._id);
  res.cookie('jwt', accessToken, options);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user
  });
});

export { requestOTP, registerUser, loginRequestOTP, loginVerifyOTP };