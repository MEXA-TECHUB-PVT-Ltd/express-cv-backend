
const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/languageController")

router.post("/addLanguage" , controller.addlanguage);
router.put("/updateLanguage" , controller.updatelanguage);
router.delete("/deleteLanguage" , controller.deletelanguage);
router.get("/getAllLanguages" , controller.getAlllanguages);
router.get("/getLanguageById" , controller.getlanguageById);
router.get("/userLanguages" , controller.getlanguagesByuser_id);


module.exports = router;
