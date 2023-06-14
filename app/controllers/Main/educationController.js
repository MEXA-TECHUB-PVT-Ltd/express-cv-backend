const {pool} = require("../../config/db.config");


exports.addeducations = async (req, res) => {
    const client = await pool.connect();
    try {
        const university_name = req.body.university_name;
        const degree = req.body.degree;
        const location = req.body.location ;
        const graduation_year = req.body.graduation_year ;
        const end_date = req.body.end_date;
        const description= req.body.description;
        const user_id = req.body.user_id ;




        
        const query = 'INSERT INTO educations (university_name , degree , location , graduation_year , end_date , description , user_id) VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7) RETURNING*'
        const result = await pool.query(query , 
            [
                university_name ? university_name : null,
                degree ? degree : null ,
                location ? location : null ,
                graduation_year ?graduation_year : null,
                end_date ? end_date : null,
                description ? description : null,
                user_id ? user_id : null
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "education saved in database",
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

exports.updateeducation = async (req, res) => {
    const client = await pool.connect();
    try {
        const education_id = req.body.education_id;
        const university_name = req.body.university_name;
        const degree = req.body.degree;
        const location = req.body.location ;
        const graduation_year = req.body.graduation_year ;
        const end_date = req.body.end_date;
        const description= req.body.description;



        if (!education_id) {
            return (
                res.json({
                    message: "Please provide education_id ",
                    status: false
                })
            )
        }


    
        let query = 'UPDATE educations SET ';
        let index = 2;
        let values =[education_id];

        
        if(university_name){
            query+= `university_name = $${index} , `;
            values.push(university_name)
            index ++
        }
        if(degree){
            query+= `degree = $${index} , `;
            values.push(degree)
            index ++
        }
        if(location){
            query+= `location = $${index} , `;
            values.push(location)
            index ++
        }

        if(graduation_year){
            query+= `graduation_year = $${index} , `;
            values.push(graduation_year)
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



        query += 'WHERE education_id = $1 RETURNING*'
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

exports.deleteeducation = async (req, res) => {
    const client = await pool.connect();
    try {
        const education_id = req.query.education_id;
        if (!education_id) {
            return (
                res.json({
                    message: "Please Provide education_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM educations WHERE education_id = $1 RETURNING *';
        const result = await pool.query(query , [education_id]);

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

exports.getAlleducations = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM educations'
            result = await pool.query(query);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM educations LIMIT $1 OFFSET $2'
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

exports.getAlleducationsOfUser = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        let limit = req.query.limit;
        let page = req.query.page;

        console.log(user_id)


        if(!user_id){
            return(
                res.json({
                    message: "Please Enter user_id",
                    status : false
                })
            )
        }
        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM educations WHERE user_id = $1'
            result = await pool.query(query , [user_id]);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM educations WHERE user_id = $3 LIMIT $1 OFFSET $2'
        result = await pool.query(query , [limit , offset , user_id]);

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

exports.geteducationById= async (req, res) => {
    const client = await pool.connect();
    try {
        const education_id = req.query.education_id;

        if (!education_id) {
            return (
                res.status(400).json({
                    message: "Please Provide education_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM educations WHERE education_id = $1'
        const result = await pool.query(query , [education_id]);

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