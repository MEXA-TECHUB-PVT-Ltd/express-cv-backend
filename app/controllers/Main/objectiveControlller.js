const {pool} = require("../../config/db.config");


exports.addObjective = async (req, res) => {
    const client = await pool.connect();
    try {
        const description = req.body.description;

        if (!description) {
            return (
                res.json({
                    message: "Please provide description for creating Objective",
                    status: false
                })
            )
        }

        
        const query = 'INSERT INTO objectives (description) VALUES ($1) RETURNING*'
        const result = await pool.query(query , 
            [
                description ? description : null,
            ]);

            
        if (result.rows[0]) {
            res.status(201).json({
                message: "objective saved in database",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.status(400).json({
                message: "Could not save",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            status: false,
            error: err.messagefalse
        })
    }
    finally {
        client.release();
      }

}

exports.updateObjective = async (req, res) => {
    const client = await pool.connect();
    try {
        const objective_id = req.body.objective_id;
        const description = req.body.description;


        if (!objective_id) {
            return (
                res.json({
                    message: "Please provide objective_id ",
                    status: false
                })
            )
        }

       
        let query = 'UPDATE objectives SET ';
        let index = 2;
        let values =[objective_id];

        
        if(description){
            query+= `description = $${index} , `;
            values.push(description)
            index ++
        }


        query += 'WHERE objective_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);

       const result = await pool.query(query , values);

        if (result.rows[0]) {
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
    finally {
        client.release();
      }
}

exports.deleteObjective = async (req, res) => {
    const client = await pool.connect();
    try {
        const objective_id = req.query.objective_id;
        if (!objective_id) {
            return (
                res.json({
                    message: "Please Provide objective_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM objectives WHERE objective_id = $1 RETURNING *';
        const result = await pool.query(query , [objective_id]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else{
            res.status(404).json({
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
    finally {
        client.release();
      }
}

exports.getAllObjectives = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM objectives'
            result = await pool.query(query);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM objectives LIMIT $1 OFFSET $2'
        result = await pool.query(query , [limit , offset]);

      
        }
       


       


        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                result: result.rows
            })
        }
        else {
            res.json({
                message: "could not fetch",
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
    finally {
        client.release();
      }

}

exports.getObjectiveById= async (req, res) => {
    const client = await pool.connect();
    try {
        const objective_id = req.query.objective_id;

        if (!objective_id) {
            return (
                res.status(400).json({
                    message: "Please Provide objective_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM objectives WHERE objective_id = $1'
        const result = await pool.query(query , [objective_id]);

        if (result.rowCount>0) {
            res.json({
                message: "Fetched",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "could not fetch",
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
    finally {
        client.release();
      }

}