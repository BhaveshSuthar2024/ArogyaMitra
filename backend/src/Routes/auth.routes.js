import express from 'express';
import { requestOTP, registerUser, loginRequestOTP, loginVerifyOTP } from '../Controllers/Auth.controller.js';

const router = express.Router();

router.post('/request-otp', requestOTP);
router.post('/register', registerUser);

router.post('/login/request-otp', loginRequestOTP);
router.post('/login/verify', loginVerifyOTP);

export default router;
