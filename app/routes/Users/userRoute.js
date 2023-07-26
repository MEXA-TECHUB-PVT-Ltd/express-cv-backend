const express = require("express");
const userController = require("../../controllers/Users/userController");
const userRouter = express.Router();
const auth = require("../../middlewares/auth")

userRouter.post("/create-user", userController.createUser);
userRouter.post("/sign-in-user", userController.signInUser);
userRouter.get("/get-user-data",auth, userController.getUserData);
userRouter.post("/forget-password", userController.forgetPassword);
module.exports =  userRouter;