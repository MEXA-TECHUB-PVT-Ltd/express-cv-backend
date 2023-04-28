const express = require('express');

const router = express.Router();

const controller = require("../../controllers/Users/userController")
const auth = require("../../middlewares/auth")


router.post("/register_user" , controller.registerUser);
router.post("/login" , controller.login);
router.put("/updateProfile" , auth ,  controller.updateProfile);
router.put("/updatePassword" , controller.updatePassword)
router.put("/updateBlockStatus" , auth ,  controller.updateBlockStatus)
router.get("/view_user_profile" , auth , controller.viewProfile)
router.get("/getAllUsers" , auth , controller.getAllUsers)
router.delete("/deleteUser" , auth , controller.deleteUser)






module.exports = router;