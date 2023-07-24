const express = require("express");
const controller = require("../../controllers/Main/resumeTemplateController")
const multer = require("multer");
const upload = multer({ dest: 'uploads/templates' });
const resumeTemplateRoute = express.Router();

resumeTemplateRoute.post("/post-resume-template", upload.single('image'), controller.postResume);
resumeTemplateRoute.get("/get-resume-template", controller.getAllResumes);

module.exports = resumeTemplateRoute;