const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/blogController")

router.post("/addBlog" , controller.addBlog);
router.put("/updateBlog" , controller.updateBlog);
router.delete("/deleteBlog" , controller.deleteBlog);
router.get("/getAllBlogs" , controller.getAllBlogs);
router.get("/getBlogById" , controller.getBlogById);


module.exports = router;