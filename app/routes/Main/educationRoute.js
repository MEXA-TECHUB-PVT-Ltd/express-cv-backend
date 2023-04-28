const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/educationController")

router.post("/addEducation" , controller.addeducations);
router.put("/updateEducation" , controller.updateeducation);
router.delete("/deleteEducation" , controller.deleteeducation);
router.get("/getAllEducations" , controller.getAlleducations);
router.get("/getEducationById" , controller.geteducationById);


module.exports = router;