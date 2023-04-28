const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/skillController")

router.post("/addSkill" , controller.addskills);
router.put("/updateSkill" , controller.updateskill);
router.delete("/deleteSkill" , controller.deleteskill);
router.get("/getAllSkills" , controller.getAllskills);
router.get("/getSkillById" , controller.getskillById);
router.get("/userSkills" , controller.getskillsByuser_id);




module.exports = router;