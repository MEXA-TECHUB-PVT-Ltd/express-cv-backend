const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/experienceController")

router.post("/addExperience" , controller.addexperiences);
router.put("/updateExperience" , controller.updateexperience);
router.delete("/deleteExperience" , controller.deleteexperience);
router.get("/getAllExperiences" , controller.getAllexperiences);
router.get("/getExperienceById" , controller.getexperienceById);
router.get("/getAlluserAddedExperiences" , controller.getExperiencesByuser_id);



module.exports = router;