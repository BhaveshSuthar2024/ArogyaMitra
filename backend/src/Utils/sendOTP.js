import crypto from 'crypto';
import twilio from 'twilio';
import dotenv from 'dotenv';
import OTP from '../Models/OTP.model.js';

dotenv.config({ path: "../.env" });

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE = process.env.TWILIO_PHONE;

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTP = async (mobileNo) => {
  if (!mobileNo) throw new Error('Mobile number is required');

  const formattedNumber = mobileNo.startsWith('+') ? mobileNo : `+91${mobileNo}`;
  const otp = generateOTP();

  await OTP.deleteMany({ mobileNo: formattedNumber });

  await OTP.create({
    mobileNo: formattedNumber,
    OTP: otp,
  });

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: TWILIO_PHONE,
      to: formattedNumber
    });

    return { success: true, message: 'OTP sent successfully' };
  } catch (err) {
    console.error('Twilio Error:', err.message);
    throw new Error('Failed to send OTP');
  }
};

export default sendOTP;