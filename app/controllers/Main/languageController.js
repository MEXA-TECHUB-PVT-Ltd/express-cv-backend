const {pool} = require("../../config/db.config");


exports.addlanguage = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const language_name = req.body.language_name;

        if (!language_name || !user_id) {
            return (
                res.json({
                    message: "Please provide language_name and user_id for creating language",
                    status: false
                })
            )
        }

        const query = 'INSERT INTO languages (language_name , user_id) VALUES ($1 , $2) RETURNING*'
        const result = await pool.query(query , 
            [
                language_name ? language_name : null ,
                user_id ? user_id : null,
            ]);

            
        if (result.rows[0]) {
            res.status(201).json({
                message: "language saved in database",
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

exports.updatelanguage = async (req, res) => {
    const client = await pool.connect();
    try {
        const language_id = req.body.language_id;
        const language_name = req.body.language_name;


        if (!language_id) {
            return (
                res.json({
                    message: "Please provide language_id ",
                    status: false
                })
            )
        }

       
        let query = 'UPDATE languages SET ';
        let index = 2;
        let values =[language_id];



        if(language_name){
            query+= `language_name = $${index} , `;
            values.push(language_name)
            index ++
        }
        

        query += 'WHERE language_id = $1 RETURNING*'
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

exports.deletelanguage = async (req, res) => {
    const client = await pool.connect();
    try {
        const language_id = req.query.language_id;
        if (!language_id) {
            return (
                res.json({
                    message: "Please Provide language_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM languages WHERE language_id = $1 RETURNING *';
        const result = await pool.query(query , [language_id]);

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

exports.getAlllanguages = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        
        if (!page || !limit) {
            const query = 'SELECT * FROM languages'
            result = await pool.query(query);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM languages LIMIT $1 OFFSET $2'
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

exports.getlanguageById = async (req, res) => {
    const client = await pool.connect();
    try {
        const language_id = req.query.language_id;

        if (!language_id) {
            return (
                res.status(400).json({
                    message: "Please Provide language_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM languages WHERE language_id = $1'
        const result = await pool.query(query , [language_id]);

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

exports.getlanguagesByuser_id = async(req,res)=>{
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        if (!user_id) {
            return (
                res.status(400).json({
                    message: "Please Provide user_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM languages WHERE user_id = $1'
        const result = await pool.query(query , [user_id]);

        if (result.rowCount>0) {
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