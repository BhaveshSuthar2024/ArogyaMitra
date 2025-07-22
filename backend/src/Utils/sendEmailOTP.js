import crypto from 'crypto';
import OTP from '../Models/OTP.model.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTP = async (email) => {
  try {
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save new OTP to DB with 5 min expiry
    await OTP.create({
      email,
      OTP: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });


    // Nodemailer config
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for MedKiosk',
      html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
        <small>If you did not request this, please ignore this email.</small>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};

export default sendOTP;