import express from "express";
import {  googleAuth, loginUser, userRegister, verifyemail, } from "../controllers/userController.js";

const userRouter =express.Router();

userRouter.post("/register",userRegister)
userRouter.post("/login",loginUser)
userRouter.post("/verifyemail",verifyemail)
userRouter.get("/googleauth",googleAuth)


export default userRouter;