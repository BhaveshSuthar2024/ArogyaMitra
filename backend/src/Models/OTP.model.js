import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const OTPSchema = mongoose.Schema({
    email: {
        type: String,
    },
    mobileNo: {
        type: Number,
    },
    OTP: {
        type: "String",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    },   
}
);

OTPSchema.pre('save', async function(next){
    if (!this.isModified('OTP')) return next();

    this.OTP = await bcrypt.hash(this.OTP, 12);
    next()
});

OTPSchema.methods.checkOTP = async function(otp){
    return await bcrypt.compare(otp, this.OTP);
}

const OTP = mongoose.model('OTP', OTPSchema);
export default OTP;