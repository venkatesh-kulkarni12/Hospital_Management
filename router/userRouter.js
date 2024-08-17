import express from "express";
import { addAdmin,login,patientRegister,getDoctors,userDetails, logoutAdmin, logoutPatient, addDoctor } from "../controller/userController.js";
import { isAdmin,isPatient} from "../middlewares/auth.js";

const router=express.Router()

router.post("/patient/register",patientRegister)
router.post('/login',login)
router.post('/admin/addNew',isAdmin,addAdmin)
router.get('/doctors',getDoctors)
router.get('/admin/me',isAdmin,userDetails)
router.get('/patient/me',isPatient,userDetails)
router.get('/admin/logout',isAdmin,logoutAdmin)
router.get('/patient/logout',isPatient,logoutPatient)
router.post('/doctor/addNew',isAdmin,addDoctor)

export default router