const {pool} = require("../../config/db.config");


exports.addskills = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const skill_name = req.body.skill_name ;
        const skill_level = req.body.skill_level ;
  

        if(!user_id){
            return(
                res.json({
                    message: "Please provide user_id" ,
                    status : false
                })
            )
        }


        if(skill_level){
            if(skill_level == 'beginner' || skill_level == 'intermediate' || skill_level == 'advance' || skill_level == 'expert' || skill_level == 'fluent' || skill_level == 'native'){}else{ return(res.json({message : "skill level can be : expert , intermediate ,advance , beginner" , status : false}))}
        }
        
        const query = 'INSERT INTO skills (user_id  , skill_name , skill_level) VALUES ($1 , $2 , $3) RETURNING*'
        const result = await pool.query(query ,
            [
                user_id ? user_id : null,
                skill_name ? skill_name : null ,
                skill_level ? skill_level : null ,
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "skill saved in database",
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

exports.updateskill = async (req, res) => {
    const client = await pool.connect();
    try {
        const skill_id = req.body.skill_id;
        const skill_name = req.body.skill_name ;
        const skill_level = req.body.skill_level ;


        if (!skill_id) {
            return (
                res.json({
                    message: "Please provide skill_id ",
                    status: false
                })
            )
        }

        if(skill_level){
            if(skill_level == 'beginner' || skill_level == 'intermediate' || skill_level == 'advance' || skill_level == 'expert' || skill_level == 'fluent' || skill_level == 'native'){}else{ return(res.json({message : "skill level can be : expert , intermediate ,advance , beginner" , status : false}))}
        }
        

    
        let query = 'UPDATE skills SET ';
        let index = 2;
        let values =[skill_id];

        
        if(skill_name){
            query+= `skill_name = $${index} , `;
            values.push(skill_name)
            index ++
        }
        if(skill_level){
            query+= `skill_level = $${index} , `;
            values.push(skill_level)
            index ++
        }
      


        query += 'WHERE skill_id = $1 RETURNING*'
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

exports.deleteskill = async (req, res) => {
    const client = await pool.connect();
    try {
        const skill_id = req.query.skill_id;
        if (!skill_id) {
            return (
                res.json({
                    message: "Please Provide skill_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM skills WHERE skill_id = $1 RETURNING *';
        const result = await pool.query(query , [skill_id]);

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

exports.getAllskills = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM skills'
            result = await pool.query(query);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM skills LIMIT $1 OFFSET $2'
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

exports.getskillById= async (req, res) => {
    const client = await pool.connect();
    try {
        const skill_id = req.query.skill_id;

        if (!skill_id) {
            return (
                res.status(400).json({
                    message: "Please Provide skill_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM skills WHERE skill_id = $1'
        const result = await pool.query(query , [skill_id]);

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

exports.getskillsByuser_id = async(req,res)=>{
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
        const query = 'SELECT * FROM skills WHERE user_id = $1'
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