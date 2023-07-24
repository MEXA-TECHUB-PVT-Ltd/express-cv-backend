const express = require("express");
const controller = require("../../controllers/Main/contact_detailsController")
const personalInfoRouter = express.Router();

personalInfoRouter.post("/add-persona-info", controller.addPersonalInfo);
personalInfoRouter.put("/edit-persona-info");
personalInfoRouter.delete("/delete-persona-info");
personalInfoRouter.get("/get-all-personalInfo");
personalInfoRouter.get("/get-user-personalInfo", controller.getUserPersonalInfo);
personalInfoRouter.get("/get-personalInfo-by-id");

module.exports = personalInfoRouter;