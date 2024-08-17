import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";
import {
  isAdmin,
  isPatient,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatient, postAppointment);
router.get("/get", isAdmin, getAllAppointments);
router.put("/update/:id", isAdmin, updateAppointmentStatus);
router.delete("/delete/:id", isAdmin, deleteAppointment);

export default router;