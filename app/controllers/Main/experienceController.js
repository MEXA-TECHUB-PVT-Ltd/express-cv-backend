const { pool } = require("../../config/db.config");

// ADD USER WORK EXPERIENCE
exports.addWorkExperience = async (req, res) => {

    try {
        // DESTRUCTURE FROM REQUEST BODY
        const { title, location, started_from, ended_at, description, user_id, company } = req.body;
        // CHECKING IF DATA IS NOT AVAILABLE RETURNING THE RESPONSE WITH STATUS FALSE
        if (!title || !location || !started_from || !ended_at || !description || !user_id) {
            return res.status(401).json({
                status: false,
                message: "Education can not be added. Both all title, location, started_from, ended_at, description, user_id are required"
            });
        }

        // SETTING UP QUERY TO ADD THE LANGUAGE
        const query = 'INSERT INTO workExperience (title, location, started_from, ended_at, description, user_id, company) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        // ADDING THE DATA USING QUERY ABOVE
        const savedEducation = await pool.query(query, [
            title ? title : '',
            location ? location : '',
            started_from ? started_from : '',
            ended_at ? ended_at : '',
            description ? description : '',
            user_id ? user_id : '',
            company ? company : ''
        ]);
        // CHECKING IF THE DATA WAS ADDED SUCESSFULLY
        if (!savedEducation.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "work Experience can not be added due to unknown reason while saving in db"
            });
        }
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

// UPDATE USER WORK EXPERIENCE
exports.editWorkExperience = async (req, res) => {
    try {
        // DESTRUCTURING DATA FROM BODY
        const { title, location, started_from, ended_at, description, experience_id, company } = req.body;

        // CHECKING IF THE DATA IS AVAILABLE
        if (!experience_id) {
            return res.json({
                status: false,
                message: "can not make changes, experience_id is required"
            });
        }

        // SETTING UP QUERY TO UPDATE DATA IN DB IF FLUENCY IS NOT GIVEN
        let query = 'UPDATE workExperience SET ';
        let index = 2
        let values = [experience_id]
        let combinedquery;
        // CHECKING IF FLUENCY IS NOT AVAILABLE THEN UPDATING ONLY LANGUAGE
        if (title) {
            // SETTING UP TITLE IN QUERY
            query += `title = $${index} , `;
            values.push(title)
            index++
        }
        if (company) {
            // SETTING UP TITLE IN QUERY
            query += `company = $${index} , `;
            values.push(company)
            index++
        }
        if (location) {
            // SETTING UP TITLE IN QUERY
            query += `location = $${index} , `;
            values.push(location)
            index++

        }
        if (started_from) {
            // SETTING UP TITLE IN QUERY
            query += `started_from = $${index} , `;
            values.push(started_from)
            index++
        }
        if (ended_at) {
            // SETTING UP TITLE IN QUERY
            query += `ended_at = $${index} , `;
            values.push(ended_at)
            index++
        }
        if (description) {
            // SETTING UP TITLE IN QUERY
            query += `description = $${index} , `;
            values.push(description)
            index++
        }
        // FINALIZING QUERY
        query += 'WHERE work_experience_id = $1 RETURNING *'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        // UPDATING DATA IN DB USING QUERY ABOVE
        const educationUpdated = await pool.query(query, values);

        // CHECKING IF THE DATA WAS NOT UPDATED SUCESSFULLY THEN SENDING RESPONSE WITH STATUS FALSE
        if (!educationUpdated.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "Experience could not be updated because Education with this id does not exsists"
            });
        }

        res.status(200).json({
            status: true,
            message: "Experience updated sucessfully",
            results: educationUpdated.rows[0]
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}

// DELETE USER WORK EXPERIENCE
exports.deleteWorkExperience = async (req, res) => {
    const { experience_id } = req.query;
    
    try {
        if (!experience_id) {
            return res.json({
                status: false,
                message: "experience_id is required"
            })
        }
        
        const result = await pool.query('DELETE FROM workExperience WHERE work_experience_id = $1', [experience_id])
        
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: "experience_id not found"
            })
        }
        res.json({
            status: true,
            message: "Deleted",
            result: result.rows[0]
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}

// GET ALL WORK EXPERIENCE
exports.getAllWorkExperience = async (req, res) => {
    
    try {
        const result = await pool.query('SELECT * FROM workExperience')
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: "experience_id not found"
            })
        }
        res.json({
            status: false,
            message: "Fetched",
            result: result.rows
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}

// GET USER WORK EXPERIENCE
exports.getUserWorkExperience = async (req, res) => {
    
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
        const workExperience = await pool.query(query, [user_id]);

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

// GET SPEICIFC WORK EXPERIENCE
exports.getWorkExperienceById = async (req, res) => {
    const { experience_id } = req.query
    try {
        const result = await pool.query('SELECT * FROM workExperience WHERE work_experience_id = $1', [experience_id])
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: "experience_id not found"
            })
        }
        res.json({
            status: false,
            message: "Fetched",
            result: result.rows
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}

// ADD USER WORK EXPERIENCE IN PROFILE
exports.addUserExperience = async (req, res) => {
    // 
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

// REMOVE USER WORK EXPERIENCE FROM PROFILE
exports.removeUserExperience = async (req, res) => {
    // 
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

        const query = 'UPDATE users SET experience = array_remove(experience, $1) WHERE user_id = $2 RETURNING *'
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

// ADD MULTIPLE USER WORK EXPERIENCE
exports.addMultipleExperience = async (req, res) => {
    const { experiences, user_id, resume_id } = req.body
    try {
        if (!experiences || !user_id) {
            return res.json({
                status: false,
                message: 'experiences and user_id are required'
            })
        }
        if (experiences.length < 1) {
            return res.json({
                status: false,
                message: 'Empty experiences array'
            })
        }
        let error = false;
        let result = [];
        let result1 = [];
        await Promise.all(experiences.map(async (item, index) => {
            if (item.work_experience_id) {
                const deletePrevious = `DELETE FROM workExperience WHERE work_experience_id = $1 RETURNING*`
                await pool.query(deletePrevious, [item.work_experience_id])
                const query = 'INSERT INTO workExperience (title, location, started_from, ended_at, description, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
                // ADDING THE DATA USING QUERY ABOVE
                const savedEducation = await pool.query(query, [
                    item.title ? item.title : '',
                    item.location ? item.location : '',
                    item.started_from ? item.started_from : '',
                    item.ended_at ? item.ended_at : '',
                    item.description ? item.description : '',
                    user_id ? user_id : ''
                ]);
                if (savedEducation.rowCount < 1) {
                    error = true
                }
                else {
                    result.push(savedEducation.rows[0].work_experience_id)
                    result1.push(savedEducation.rows[0])
                }
            }
            else {
                const query = 'INSERT INTO workExperience (title, location, started_from, ended_at, description, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
                // ADDING THE DATA USING QUERY ABOVE
                const savedEducation = await pool.query(query, [
                    item.title ? item.title : '',
                    item.location ? item.location : '',
                    item.started_from ? item.started_from : '',
                    item.ended_at ? item.ended_at : '',
                    item.description ? item.description : '',
                    user_id ? user_id : ''
                ]);
                if (savedEducation.rowCount < 1) {
                    error = true

                }
                else {
                    result.push(savedEducation.rows[0].work_experience_id)
                    result1.push(savedEducation.rows[0])
                }
            }
        }))
        if (error) {
            return res.json({
                status: false,
                message: 'could not add'
            })
        }
        const addInResume = `UPDATE resumes SET work_experience = $1 WHERE resumes_id = $2 RETURNING*`
        const addedResume = await pool.query(addInResume, [result, resume_id]);
        if (addedResume.rowCount < 1) {
            return res.json({
                status: false,
                message: 'could not add'
            })
        }
        res.json({
            status: true,
            message: 'Added',
            result: result1
        })
    } catch (err) {
        return res.json({
            status: false,
            message: err.message
        });
    }
}