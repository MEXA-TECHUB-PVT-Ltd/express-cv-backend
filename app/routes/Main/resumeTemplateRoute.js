
const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/resumeTemplateController")

router.post("/addTemplate" , controller.addTemplate);
router.put("/updateTemplate" , controller.updateTemplate);
router.delete("/deleteTemplate" , controller.deleteTemplate);
router.get("/getAllTemplates" , controller.getAllTemplates);
router.get("/getTemplateById" , controller.getTemplateById);


module.exports = router;
