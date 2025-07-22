import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import GlobalErrorHandler from "./Controllers/GlobalErrorHandler.js";
import authRouter from './Routes/auth.routes.js';
import doctorRoutes from './Routes/doctor.routes.js';
import videoCallRoutes from './Routes/videoCalls.routes.js';
import patientRouter from './Routes/patientRoutes.js';
import doctorRouter from './Routes/doctor.routes.js';

export const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());

app.use(express.json({
    size: "16kb"
}));

app.use('/api/v1/auth', authRouter);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/video-calls", videoCallRoutes);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/doctor", doctorRouter);


app.use(GlobalErrorHandler);