import express from "express";

import authRouter from "./auth.js";
import blogRouter from "./blog.js";

const router=express.Router();



router.use("/auth",authRouter);
router.use("/blog",blogRouter);


export  default router;
