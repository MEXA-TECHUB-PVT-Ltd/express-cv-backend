const { pool } = require("../../config/db.config");

// ADD CONTACT US DETAILS
exports.add = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const message = req.body.message;
        if (!name || !email || !message) {
            return (
                res.json({
                    message: "Please provide name ,email and message",
                    status: false
                })
            )
        }


        const query = 'INSERT INTO contact_us (name , email , message ) VALUES ($1 , $2 , $3 ) RETURNING*'
        const result = await pool.query(query,
            [
                name ? name : null,
                email ? email : null,
                message ? message : null
            ]);


        if (result.rowCount > 0) {
            res.json({
                message: "Query Recieved",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not save",
                status: false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }


}

// UPDATE CONTACT US DETAILS
exports.update = async (req, res) => {
    try {
        const contact_us_id = req.body.contact_us_id;
        const name = req.body.name;
        const email = req.body.email;
        const message = req.body.message;
        if (!contact_us_id) {
            return (
                res.json({
                    message: "Please provide contact_us_id ",
                    status: false
                })
            )
        }


        let query = 'UPDATE contact_us SET ';
        let index = 2;
        let values = [contact_us_id];



        if (name) {
            query += `name = $${index} , `;
            values.push(name)
            index++
        }
        if (email) {
            query += `email = $${index} , `;
            values.push(email)
            index++
        }
        if (message) {
            query += `message = $${index} , `;
            values.push(message)
            index++
        }

        query += 'WHERE contact_us_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({
                message: "Updated",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not update . Record With this Id may not found or req.body may be empty",
                status: false,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }

}

// DELETE CONTACT US DETAILS
exports.delete = async (req, res) => {
    try {
        const contact_us_id = req.query.contact_us_id;
        if (!contact_us_id) {
            return (
                res.json({
                    message: "Please Provide contact_us_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM contact_us WHERE contact_us_id = $1 RETURNING *';
        const result = await pool.query(query, [contact_us_id]);

        if (result.rowCount > 0) {
            res.json({
                message: "Deletion successfull",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not delete . Record With this Id may not found or req.body may be empty",
                status: false,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }

}

// GET ALL CONTACT US DETAILS
exports.get = async (req, res) => {
    try {
        let limit = req.query.limit;
        let page = req.query.page

        let result;
        if (!page || !limit) {
            const query = 'SELECT * FROM contact_us'
            result = await pool.query(query);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = 'SELECT * FROM contact_us LIMIT $1 OFFSET $2'
            result = await pool.query(query, [limit, offset]);


        }

        if (result.rowCount < 0) {
            return res.json({
                message: "could not fetch",
                status: false
            })
        }
        res.json({
            message: "Fetched",
            status: true,
            count:result.rowCount,
            result: result.rows
        })

    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }


}

// GET SPECIFIC CONTACT US DETAILS
exports.getById = async (req, res) => {
    try {
        let contact_us_id = req.query.contact_us_id;

        let result;
        if (!contact_us_id) {
            return res.json({
                message: "contact_us_id is required",
                status: false
            })

        }

        const query = 'SELECT * FROM contact_us WHERE contact_us_id = $1'
        result = await pool.query(query, [contact_us_id]);




        if (result.rowCount < 0) {
            return res.json({
                message: "could not fetch",
                status: false
            })
        }
        res.json({
            message: "Fetched",
            status: true,
            count: result.rowCount,
            result: result.rows
        })

    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }


}

// UPDATE ACTIVE STATUS OF CONTACT US DETAILS
exports.updateStatus = async (req, res) => {
    try {
        const contact_us_id = req.body.contact_us_id;
        const status = req.body.status;
        if (!contact_us_id || !status) {
            return (
                res.json({
                    message: "Please provide contact_us_id and status",
                    status: false
                })
            )
        }
        if (status != 'pending' && status != 'partial' && status != 'completed') {
            return (
                res.json({
                    message: "Status can only be [pending, partial or completed]",
                    status: false
                })
            )
        }

        let query = `UPDATE contact_us SET status = $1 WHERE contact_us_id = $2 RETURNING*`

        const result = await pool.query(query, [status, contact_us_id]);

        if (result.rowCount > 0) {
            res.json({
                message: "Status Updated",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not update . Record With this Id may not found or req.body may be empty",
                status: false,
            })
        }

    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }

}
