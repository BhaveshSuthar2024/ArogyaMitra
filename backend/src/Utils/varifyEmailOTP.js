import OTP from '../Models/OTP.model.js';

const verifyEmailOTP = async (email, enteredOTP) => {
  if (!email || !enteredOTP) throw new Error('Email and OTP are required');

  const record = await OTP.findOne({ email });
  if (!record) {
    throw new Error('OTP not found or expired');
  }

  const isMatch = await record.checkOTP(enteredOTP);
  if (!isMatch) {
    throw new Error('Invalid OTP');
  }

  await OTP.deleteMany({ email });

  return { success: true, message: 'OTP verified successfully' };
};

export default verifyEmailOTP;
