import asyncHandler from '../Utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import CustomError from '../Utils/CustomError.js';
import Doctor from '../Models/Doctor.model.js';

const isDoctorAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  console.log(token);
  

  if (!token) {
    return next(new CustomError("Access Denied, Please Login Again", 403));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_STRING);

  const doctor = await Doctor.findById(decoded.id);
  if (!doctor) {
    return next(new CustomError("Doctor not found with this token", 401));
  }

  req.doctor = doctor;
  next();
});

export default isDoctorAuthenticated;
