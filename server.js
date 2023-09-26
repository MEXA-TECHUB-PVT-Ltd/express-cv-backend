// IMPORTS OF DEPENDENCIES
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

// USING CORS TO MAKE API REQUEST IN SAME IP
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// USING EXPRESS JSON TO SEND AND RECIEVE JSON DATA
app.use(express.json());


// ALL ROUTES
app.use("/uploads", express.static("uploads"));
app.use("/user", require("./app/routes/Users/userRoute"))
app.use("/admin", require("./app/routes/Users/adminRoute"))
app.use("/education", require("./app/routes/Main/educationRoute"))
app.use("/languages", require("./app/routes/Main/languageRoute"))
app.use("/objectives", require("./app/routes/Main/objectiveRoute"))
app.use("/peronsalInfo", require("./app/routes/Main/contact_detailRoute"))
app.use("/resumes", require("./app/routes/Main/resumeRoute"))
app.use("/skills", require("./app/routes/Main/skillRoute"))
app.use("/workExperience", require("./app/routes/Main/experienceRoute"))
app.use("/resumeTemplate", require("./app/routes/Main/resumeTemplateRoute"))
app.use("/blogs", require("./app/routes/Main/blogRoute"))
app.use("/privacyPolicy", require("./app/routes/Main/privacy_policyRoute"))
app.use("/terms", require("./app/routes/Main/terms_and_conditionsRoute"))
app.use("/imageUpload", require("./app/routes/ImageUpload/imageUploadRoute"))
app.use("/about_us", require("./app/routes/Main/about_usRoute"))
app.use("/faq", require("./app/routes/Main/faqRoute"))
app.use("/contactUs", require("./app/routes/Main/contactusRoute"))
app.use("/emailVerification", require("./app/routes/EmailVerification/EmailVerificationRoute"))



// SERVER LISTENING FOR API REQUESTS
app.listen(process.env.PORT, async () => {
    console.log(`
    ################################################
           Server listening on port: ${process.env.PORT}
    ################################################
`);
})