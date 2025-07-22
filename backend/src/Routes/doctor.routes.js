import express from "express";
import { registerDoctor, requestOTP, loginDoctor, getCurrentDoctor, getCallRequests } from "../Controllers/DoctorAuth.controller.js";
import upload from "../Middlewares/multer.middleware.js";
import isDoctorAuthenticated from '../Middlewares/isDoctorAuthenticated.js'

const router = express.Router();

router.post("/requestOTP", requestOTP);
router.post(
  "/register",
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'licenseCertificate', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
  ]),
  registerDoctor
);
router.post("/login", loginDoctor);
router.get("/call-requests/pending", getCallRequests);
router.get("/me", isDoctorAuthenticated, getCurrentDoctor);

export default router;