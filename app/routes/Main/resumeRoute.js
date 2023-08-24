const express = require("express");
const controller = require('../../controllers/Main/resumeController')
const resumesRouter = express.Router();

resumesRouter.post("/add-resume", controller.addResumes);
resumesRouter.put("/update-resume", controller.updateResumes);
resumesRouter.delete("/delete-resume", controller.deleteResume);
resumesRouter.get("/get-all-resumes");
resumesRouter.get("/get-user-resumes", controller.getUserResumes);
resumesRouter.get("/get-resumes-by-id", controller.getResumesById);
resumesRouter.post("/remove-education-in-resume", controller.removeResumeEducation);
resumesRouter.post("/remove-experience-in-resume", controller.removeResumeExperience);
module.exports = resumesRouter;