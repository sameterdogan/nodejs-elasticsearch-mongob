import express from "express"
import {register,login,me,} from "../controllers/auth.js"


import {isLogin, isSuspend} from "../middlewares/auth.js";



const router =express.Router()

router.post("/register",register);

router.post("/login",login)

router.get("/me",isLogin,me)




export default router
