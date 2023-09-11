const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/contactUsController")

router.post("/add" , controller.add);
router.get("/get" , controller.get);
router.put("/update" , controller.update);
router.delete("/Delete" , controller.delete);
router.put("/updateStatus" , controller.updateStatus);
router.get("/getById" , controller.getById);


module.exports = router;
