const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/contact_detailsController")

router.post("/addContact_detail" , controller.addContact_details);
router.put("/updateContact_detail" , controller.updatecontact_detail);
router.delete("/deleteContact_detail" , controller.deletecontact_detail);
router.get("/getAllContact_details" , controller.getAllcontact_details);
router.get("/getContact_detailById" , controller.getcontact_detailById);


module.exports = router;