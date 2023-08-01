const { pool } = require("../../config/db.config");
exports.addWorkExperience = async (req, res) => {
    console.log("Enter addWorkExperience")

    try {
        // DESTRUCTURE FROM REQUEST BODY
        const { title, location, started_from, ended_at, description, user_id } = req.body;
        // CHECKING IF DATA IS NOT AVAILABLE RETURNING THE RESPONSE WITH STATUS FALSE
        if (!title || !location || !started_from || !ended_at || !description || !user_id) {
            return res.status(401).json({
                status: false,
                message: "Education can not be added. Both all title, location, started_from, ended_at, description, user_id are required"
            });
        }

        // SETTING UP QUERY TO ADD THE LANGUAGE
        const query = 'INSERT INTO workExperience (title, location, started_from, ended_at, description, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        // ADDING THE DATA USING QUERY ABOVE
        const savedEducation = await pool.query(query, [
            title ? title : '',
            location ? location : '',
            started_from ? started_from : '',
            ended_at ? ended_at : '',
            description ? description : '',
            user_id ? user_id : ''
        ]);
        // CHECKING IF THE DATA WAS ADDED SUCESSFULLY
        if (!savedEducation.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "work Experience can not be added due to unknown reason while saving in db"
            });
        }
        console.log("Exit addWorkExperience")
        // SEDNING RESPONSE IF THE DATA WAS ADDED SUCESSFULLY
        res.status(200).json({
            status: true,
            message: "Experience added sucessfully",
            results: savedEducation.rows[0]
        });



    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}
exports.editWorkExperience = async (req, res) => {
    const db = await pool.connect();
    try {

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.deleteWorkExperience = async (req, res) => {
    const db = await pool.connect();
    try {

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.getAllWorkExperience = async (req, res) => {
    const db = await pool.connect();
    try {

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.getUserWorkExperience = async (req, res) => {
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
        const query = 'SELECT * FROM workExperience WHERE user_id = $1';

        // FETCHING DATA FROM DB USING QUERY ABOVE
        const workExperience = await db.query(query, [user_id]);

        // CHECKING IF THE DATA WAS NOT FETCHED SENDING RESPONSE WITH STATUS FALSE
        if (!workExperience.rows[0]) {
            return res.status(404).json({
                status: false,
                message: "No Data was fetched"
            });
        }

        // CHECKING IF THE DATA WAS FETCHED SUCESSFULLY SENDING RESPONSE WITH STATUS TRUE
        res.status(200).json({
            status: true,
            message: "workExperience Found sucessfully",
            results: workExperience.rows
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.getWorkExperienceById = async (req, res) => {
    const db = await pool.connect();
    try {

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}
exports.addUserExperience = async (req, res) => {
    // const db = await pool.connect();
    try {
        // DESTRUCTURING DATA FROM BODY
        const { experience_id, user_id } = req.body;

        // CHECKING IF THE DATA IS AVAILABLE
        if (!experience_id || !user_id) {
            return res.status(401).json({
                status: false,
                message: "can not make changes, experience_id and user_id is required"
            });
        }

        const query = 'UPDATE users SET experience = array_append(experience, $1) WHERE user_id = $2 RETURNING *'
        const experienceUpdated = await pool.query(query, [experience_id, user_id]);

        // CHECKING IF THE DATA WAS NOT UPDATED SUCESSFULLY THEN SENDING RESPONSE WITH STATUS FALSE
        if (!experienceUpdated.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "Experience was not added in users"
            });
        }

        res.status(200).json({
            status: true,
            message: "Experience Added sucessfully",
            results: experienceUpdated.rows[0]
        })

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}