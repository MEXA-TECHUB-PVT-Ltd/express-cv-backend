// IMPORTS OF DEPENDENCIES
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/user", require("./app/routes/Users/userRoute"))
app.use("/education", require("./app/routes/Main/educationRoute"))
app.use("/languages", require("./app/routes/Main/languageRoute"))
app.use("/objectives", require("./app/routes/Main/objectiveRoute"))
app.use("/peronsalInfo", require("./app/routes/Main/contact_detailRoute"))
app.use("/resumes", require("./app/routes/Main/resumeRoute"))
app.use("/skills", require("./app/routes/Main/skillRoute"))
app.use("/workExperience", require("./app/routes/Main/experienceRoute"))
app.use("/resumeTemplate", require("./app/routes/Main/resumeTemplateRoute"))

app.listen(process.env.PORT, async () => {
    console.log(`
    ################################################
           Server listening on port: ${process.env.PORT}
    ################################################
`);
})