import express from "express";
import { allUser, changePassword, forgetPassword, getUserbyId, login, logout, register, reVerify, verify, verifyOTP, updateProfile } from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
// import { verify } from "jsonwebtoken";

const router = express.Router()
router.post(`/register`, register)
router.post(`/verify`, verify)
router.post(`/reVerify`, reVerify)
router.post(`/login`, login)
router.post(`/logout`,isAuthenticated, logout)
router.post('/forget_password', forgetPassword)
router.post('/verify_otp/:email', verifyOTP)
router.post('/change_password/:email', changePassword)
router.get('/alluser',isAuthenticated,isAdmin, allUser)
router.get('/getuser/:userId', getUserbyId)
router.put('/update', isAuthenticated, updateProfile)
export default router