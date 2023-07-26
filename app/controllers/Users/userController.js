const { pool } = require('../../config/db.config')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require("nodemailer");;
const emailOTPBody = require("../../utils/emailOTPBody")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },

});
exports.createUser = async (req, res) => {
    // connect to database
    const db = await pool.connect();
    try {
        // destructure from request body

        const { user_name, email, password } = req.body;
        console.log(user_name, email, password)
        // setting up query to insert new user in db
        if (!user_name || !email || !password) {
            return res.status(401).json({
                status: false,
                message: "User registeration failed because user_name, email and password are required"
            });
        }

        // checking if the user with this email already exsists
        const query1 = 'SELECT * FROM users WHERE email = $1'
        const checkUser = await db.query(query1, [
            email,
        ]);
        if (checkUser.rows.length > 0) {
            return res.status(401).json({
                status: false,
                message: "User registeration failed because email already exsists"
            });
        }
        const query = 'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *';

        // generating salt to hash the password
        const salt = await bcrypt.genSalt(10);

        // password hashing
        const hashPassword = await bcrypt.hash(password, salt);

        // saving data in db
        const addUser = await db.query(query, [
            user_name,
            email,
            hashPassword
        ]);
        console.log(addUser)
        // if data is saved response sent with status true
        if (addUser.rows) {
            const token = jwt.sign({ id: addUser.rows[0].user_id }, process.env.TOKEN);
            console.log(token)
            res.status(200).json({
                status: true,
                findUsers: addUser.rows[0],
                jwt_token: token
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.signInUser = async (req, res) => {
    // Connecting to db
    const db = await pool.connect();
    try {
        // destructure from request body
        const { email, password } = req.body;

        // check if the data is recieved
        if (!email || !password) {
            return res.status(401).json({
                status: false,
                message: "User registeration failed because email and password are required"
            });
        }

        // setting up query to find if data with this email exsists
        const query = 'SELECT * FROM users WHERE email = $1'

        // feteching data from db using query above
        const checkUser = await db.query(query, [
            email,
        ]);

        // checking if the user does not exsists then sending response with status false
        if (!checkUser.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "User does not exsists"
            });
        }

        // compare password using bycrpt
        const comparePassword = await bcrypt.compare(password, checkUser.rows[0].password)

        // checking if the password did not match then sending response with status false
        if (!comparePassword) {
            return res.status(401).json({
                status: false,
                message: "Email or password incorrect"
            });
        }

        // generating jwt token for authentication
        const token = jwt.sign({ id: checkUser.rows[0].user_id }, process.env.TOKEN);

        // sending response with status true
        res.status(200).json({
            status: true,
            message: "User Logged in",
            user: checkUser.rows[0],
            jwt_token: token
        });

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.getUserData = async (req, res) => {
    const { current_user_id } = req.query;
    try {
        if (!current_user_id) {
            return res.status(401).json({
                status: false,
                message: "User_id is required"
            });
        }
        const query = 'SELECT * FROM users WHERE user_id = $1';
        const userData = await pool.query(query, [current_user_id]);
        console.log(userData)
        if (!userData.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "User Does not exsists"
            });
        }
        res.json({
            status: true,
            message: "Data Fetched sucessfully",
            results: userData.rows[0]
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(401).json({
                status: false,
                message: "Email is required"
            });
        }

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const query = 'SELECT * FROM otpStored WHERE email = $1';
        const checkEmail = pool.query(query, [email]);
        if (checkEmail.rowCount > 0) {
            let query = 'UPDATE otpStored SET otp = $1  WHERE email = $2 RETURNING*'
            let values = [
                otp ? otp : null,
                email ? email : null
            ]
            const result = await pool.query(query, values);
            if (result.rowCount > 0) {
                let sendEmailResponse = await transporter.sendMail({
                    from: process.env.EMAIL_USERNAME,
                    to: email,
                    subject: 'Forget Password',
                    html: emailOTPBody(otp, "Express-Cv", "#0492C2")

                });
                if (!sendEmailResponse) {
                    return res.json({
                        status: false,
                        message: "otp not sent",
                    })
                }
                return res.json({
                    status: true,
                    message: "otp updated",
                    results: result.rows[0]
                })
            }
        }
        const query1 = 'INSERT INTO otpStored (email , otp) VALUES ($1 , $2) RETURNING*'
        const result = await pool.query(query1, [email, otp])
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: "otp was not added",
            })
        }
        let sendEmailResponse = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Forget Password',
            html: emailOTPBody(otp, "Express-Cv", "#0492C2")

        });
        if (!sendEmailResponse) {
            return res.json({
                status: false,
                message: "otp not sent",
            })
        }
        res.json({
            status: true,
            message: "otp added",
            results: result.rows[0]
        })

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}
