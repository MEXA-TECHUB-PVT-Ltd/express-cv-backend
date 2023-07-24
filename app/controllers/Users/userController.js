const { pool } = require('../../config/db.config')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createUser = async (req, res) => {
    // connect to database
    const db = await pool.connect();
    try {
        // destructure from request body

        const { user_name, email, password } = req.body;

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
        const query = 'INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3)';

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

        // if data is saved response sent with status true
        if (addUser.rows) {
            res.status(200).json({
                status: true,
                findUsers: addUser.rows[0]
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
