const express = require("express");
const userController = require("../../controllers/Users/userController");
const userRouter = express.Router();


userRouter.post("/create-user", userController.createUser);
userRouter.get("/sign-in-user", userController.signInUser);


module.exports =  userRouter;