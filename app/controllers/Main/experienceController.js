const {pool} = require("../../config/db.config");


exports.addexperiences = async (req, res) => {
    const client = await pool.connect();
    try {
        const position = req.body.position;
        const user_id = req.body.user_id;
        const company = req.body.company ;
        const start_date = req.body.start_date ;
        const end_date = req.body.end_date;
        const description= req.body.description;



        if(!user_id){
            return(
                res.json({
                    message: "Please provide user_id" ,
                    status : false
                })
            )
        }

        
        const query = 'INSERT INTO experiences (user_id , position , company , start_date , end_date , description) VALUES ($1 , $2 , $3 , $4 , $5 , $6) RETURNING*'
        const result = await pool.query(query , 
            [
                user_id ? user_id : null,
                position ? position : null ,
                company ? company : null ,
                start_date ?start_date : null,
                end_date ? end_date : null,
                description ? description : null
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "experience saved in database",
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

exports.updateexperience = async (req, res) => {
    const client = await pool.connect();
    try {
        const experience_id = req.body.experience_id;
        const position = req.body.position;
        const company = req.body.company ;
        const start_date = req.body.start_date ;
        const end_date = req.body.end_date;
        const description= req.body.description;
        const location = req.body.location;



        if (!experience_id) {
            return (
                res.json({
                    message: "Please provide experience_id ",
                    status: false
                })
            )
        }


    
        let query = 'UPDATE experiences SET ';
        let index = 2;
        let values =[experience_id];

        
        if(position){
            query+= `position = $${index} , `;
            values.push(position)
            index ++
        }
        if(company){
            query+= `company = $${index} , `;
            values.push(company)
            index ++
        }
        if(start_date){
            query+= `start_date = $${index} , `;
            values.push(start_date)
            index ++
        }

        if(end_date){
            query+= `end_date = $${index} , `;
            values.push(end_date)
            index ++
        }

        if(description){
            query+= `description = $${index} , `;
            values.push(description)
            index ++
        }

        if(location){
            query+= `location = $${index} , `;
            values.push(location)
            index ++
        }


        query += 'WHERE experience_id = $1 RETURNING*'
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

exports.deleteexperience = async (req, res) => {
    const client = await pool.connect();
    try {
        const experience_id = req.query.experience_id;
        if (!experience_id) {
            return (
                res.json({
                    message: "Please Provide experience_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM experiences WHERE experience_id = $1 RETURNING *';
        const result = await pool.query(query , [experience_id]);

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

exports.getAllexperiences = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM experiences'
            result = await pool.query(query);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM experiences LIMIT $1 OFFSET $2'
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

exports.getexperienceById= async (req, res) => {
    const client = await pool.connect();
    try {
        const experience_id = req.query.experience_id;

        if (!experience_id) {
            return (
                res.status(400).json({
                    message: "Please Provide experience_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM experiences WHERE experience_id = $1'
        const result = await pool.query(query , [experience_id]);

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

exports.getExperiencesByuser_id = async(req,res)=>{
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
        const query = 'SELECT * FROM experiences WHERE user_id = $1'
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