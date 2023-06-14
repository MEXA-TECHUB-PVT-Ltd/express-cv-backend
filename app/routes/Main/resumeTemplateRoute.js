
const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/resumeTemplateController")

const auth = require("../../middlewares/auth")


router.post("/addTemplate" , auth , controller.addTemplate);
router.put("/updateTemplate" , auth ,  controller.updateTemplate);
router.delete("/deleteTemplate" , auth , controller.deleteTemplate);
router.get("/getAllTemplates"  , controller.getAllTemplates);
router.get("/getTemplateById" , controller.getTemplateById);


module.exports = router;
