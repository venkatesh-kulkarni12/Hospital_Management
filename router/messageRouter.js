import express from "express";
import { getMessages, sendMessage } from "../controller/messageController.js";
import {isAdmin} from '../middlewares/auth.js'

const router =express.Router()

router.post("/send",sendMessage)
router.get('/getall',isAdmin,getMessages)

export default router