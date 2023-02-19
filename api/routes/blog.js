import express from "express"

import {paginateBlogs,createBlog,updateBlog,getBlog,getBlogAndCreateKizilay,elasticSearchBlogs} from "../controllers/blog.js";

import {isLogin} from "../middlewares/auth.js";



const router =express.Router()

router.get("/",elasticSearchBlogs)

router.get("/:slug",getBlog)

router.get("/scraping/kizilay",getBlogAndCreateKizilay)

router.post("/create",isLogin,createBlog);

router.put("/update",updateBlog)






export default router
