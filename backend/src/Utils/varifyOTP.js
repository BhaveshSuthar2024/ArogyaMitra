import OTP from '../Models/OTP.model.js';

const verifyOTP = async (mobileNo, enteredOTP) => {
  if (!mobileNo || !enteredOTP) throw new Error('Mobile number and OTP are required');

  const formattedNumber = mobileNo.startsWith('+') ? mobileNo : `+91${mobileNo}`;

  const record = await OTP.findOne({ mobileNo: formattedNumber });
  if (!record) {
    throw new Error('OTP not found or expired');
  }

  const isMatch = await record.checkOTP(enteredOTP);
  if (!isMatch) {
    throw new Error('Invalid OTP');
  }

  await OTP.deleteMany({ mobileNo: formattedNumber });

  return { success: true, message: 'OTP verified successfully' };
};

export default verifyOTP;
