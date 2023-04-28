const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/resumeController")

router.post("/createResume" , controller.addCreateResume);
router.get("/getResumsByUser_id" , controller.getResumesByUser_id);
router.get("/ResumeById" , controller.resumeById);
router.put("/Edit_resume" , controller.EditResume);
router.delete("/deleteResume" , controller.deleteResume);
router.post("/downloadResume" , controller.downloadResume);
router.get("/downloadsByYear" , controller.downloadsByYear);
router.get("/downloadsByMonth" , controller.downloadsByMonth);
router.get("/downloadsByWeek" , controller.downloadsByWeek);
router.get("/byRegisteredUsers" , controller.byRegisteredUsers);
router.get("/byDays" , controller.by_days);









module.exports = router;