const express = require("express");
const controller = require("../../controllers/Main/experienceController")
const workExperienceRouter = express.Router();

workExperienceRouter.post("/add-work-experience", controller.addWorkExperience);
workExperienceRouter.put("/edit-objective");
workExperienceRouter.delete("/delete-objective");
workExperienceRouter.get("/get-all-workExperience");
workExperienceRouter.get("/get-user-workExperience", controller.getUserWorkExperience);
workExperienceRouter.get("/get-workExperience-by-id");

module.exports = workExperienceRouter;