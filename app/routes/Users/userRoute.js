const express = require('express');

const router = express.Router();

const controller = require("../../controllers/Users/userController")

router.post("/register_user" , controller.registerUser);
router.post("/login" , controller.login);
router.put("/updateProfile" , controller.updateProfile);
router.put("/updatePassword" , controller.updatePassword)
router.get("/view_user_profile" , controller.viewProfile)
router.get("/getAllUsers" , controller.getAllUsers)
router.delete("/deleteUser" , controller.deleteUser)






module.exports = router;