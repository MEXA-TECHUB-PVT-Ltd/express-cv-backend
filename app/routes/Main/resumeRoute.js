const express = require("express");
const controller = require('../../controllers/Main/resumeController')
const resumesRouter = express.Router();

resumesRouter.post("/add-resume", controller.addResumes);
resumesRouter.put("/update-resume", controller.updateResumes);
resumesRouter.delete("/delete-resume", controller.deleteResume);
resumesRouter.get("/get-all-resumes", controller.getAll);
resumesRouter.get("/get-user-resumes", controller.getUserResumes);
resumesRouter.get("/get-resumes-by-id", controller.getResumesById);
resumesRouter.post("/remove-education-in-resume", controller.removeResumeEducation);
resumesRouter.post("/remove-experience-in-resume", controller.removeResumeExperience);
resumesRouter.post("/add-downloaded", controller.addDownloaded);

resumesRouter.get("/getByDate", controller.getByDate);
resumesRouter.get("/getByWeek", controller.getByWeek);
resumesRouter.get("/getByMonth", controller.getByMonth);
resumesRouter.get("/getByYear", controller.getByYear);
module.exports = resumesRouter;