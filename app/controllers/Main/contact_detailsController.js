const { pool } = require("../../config/db.config");
exports.addPersonalInfo = async (req, res) => {

    try {
        // DESTRUCTURE FROM REQUEST BODY
        const { email, address, phone, name } = req.body;
        let user_id = 20021
        // CHECKING IF DATA IS NOT AVAILABLE RETURNING THE RESPONSE WITH STATUS FALSE
        if (!email || !address || !phone || !name || !user_id) {
            return res.status(401).json({
                status: false,
                message: "Personal Info can not be added. Both all email, address, phone, name, user_id are required"
            });
        }

        // SETTING UP QUERY TO ADD THE LANGUAGE
        const query = 'INSERT INTO personal_info (email, address, phone, name, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        // ADDING THE DATA USING QUERY ABOVE
        const savedPersonalInfo = await pool.query(query, [
            email ? email : '',
            address ? address : '',
            phone ? phone : '',
            name ? name : '',
            user_id ? user_id : ''
        ]);

        // CHECKING IF THE DATA WAS ADDED SUCESSFULLY
        if (!savedPersonalInfo.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "Personal Info can not be added due to unknown reason while saving in db"
            });
        }
        // SEDNING RESPONSE IF THE DATA WAS ADDED SUCESSFULLY
        res.status(200).json({
            status: true,
            message: "personal info added sucessfully",
            results: savedPersonalInfo.rows[0]
        });

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.editPersonalInfo = async (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.deletePersonalInfo = async (req, res) => {
    const db = await pool.connect();
    try {

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.getAllPersonalInfo = async (req, res) => {
    const db = await pool.connect();
    try {

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.getUserPersonalInfo = async (req, res) => {
    const db = await pool.connect();
    try {
        // DESTRUCTURE DATA FROM REQUEST QUERY
        const { user_id } = req.query;

        // CHECKING IF THE DATA IS AVAILABLE
        if (!user_id) {
            return res.status(404).json({
                status: false,
                message: "No Data was fetched, because user_id is required"
            });
        }

        // SETTING UP QUERY TO FETCH USER OBJECTIVE FROM DB
        const query = 'SELECT * FROM personal_info WHERE user_id = $1';

        // FETCHING DATA FROM DB USING QUERY ABOVE
        const personalInfo = await db.query(query, [user_id]);

        // CHECKING IF THE DATA WAS NOT FETCHED SENDING RESPONSE WITH STATUS FALSE
        if (!personalInfo.rows[0]) {
            return res.status(404).json({
                status: false,
                message: "No Data was fetched"
            });
        }

        // CHECKING IF THE DATA WAS FETCHED SUCESSFULLY SENDING RESPONSE WITH STATUS TRUE
        res.status(200).json({
            status: true,
            message: "language Found sucessfully",
            results: personalInfo.rows
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.getPersonalInfoById = async (req, res) => {
    const db = await pool.connect();
    try {

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}