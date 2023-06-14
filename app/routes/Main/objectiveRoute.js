const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/objectiveControlller")

router.post("/addObjective" , controller.addObjective);
router.put("/updateObjective" , controller.updateObjective);
router.delete("/deleteObjective" , controller.deleteObjective);
router.get("/getAllObjectives" , controller.getAllObjectives);
router.get("/getAllUserObjectives" , controller.getAllUserObjectives);
router.get("/getObjectiveById" , controller.getObjectiveById);



module.exports = router;