import express from "express";
import isLogined from "../Middlewares/isLogined.js";
import { getLoggedInPatientDashboard } from "../Controllers/Patients.controller.js";

const router = express.Router();

router.get("/me/dashboard", isLogined, getLoggedInPatientDashboard);

export default router;