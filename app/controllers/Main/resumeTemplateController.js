const {pool} = require("../../config/db.config");
const fs= require("fs")


exports.addTemplate = async (req, res) => {
    const client = await pool.connect();
    try {
   
        const title_name = req.body.title_name;
        const title_image = req.body.title_image;



        const query = 'INSERT INTO resume_templates (title_name , title_image) VALUES ($1 , $2) RETURNING*'
        const result= await pool.query(query , 
            [
                title_name ? title_name : null ,
                title_image ?title_image : null,
            ]);

            
        if (result.rows[0]) {
            res.status(201).json({
                message: "reference saved in database",
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

exports.updateTemplate= async (req, res) => {
    const client = await pool.connect();
    try {
        const template_id = req.body.template_id;
        const title_name = req.body.title_name;
        const title_image = req.body.title_image;


        if (!template_id) {
            return (
                res.json({
                    message: "Please provide template_id ",
                    status: false
                })
            )
        }

        if(title_image){
            const foundResultQuery = 'SELECT * FROM resume_templates Where template_id = $1';
            const foundResult = await pool.query(foundResultQuery, [template_id]);
            if(foundResult.rows){
                if(foundResult.rows[0]){
                    if(foundResult.rows[0].title_image){
                        if(fs.existsSync(foundResult.rows[0].title_image)){
                            fs.unlink(foundResult.rows[0].title_image , (err)=>{
                                if(!err){
                                    console.log("Previous Image Deleted")
                                }else{
                                    console.log("Error Occurred in image Deleting")
                                }
                            })
                        }
                    }
                }
            }
        }

       
        let query = 'UPDATE resume_templates SET ';
        let index = 2;
        let values =[template_id];



        if(title_name){
            query+= `title_name = $${index} , `;
            values.push(title_name)
            index ++
        }

        if(title_image){
            query+= `title_image = $${index} , `;
            values.push(title_image)
            index ++
        }
        

        

        query += 'WHERE template_id = $1 RETURNING*'
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

exports.deleteTemplate = async (req, res) => {
    const client = await pool.connect();
    try {
        const template_id = req.query.template_id;
        if (!template_id) {
            return (
                res.json({
                    message: "Please Provide template_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM resume_templates WHERE template_id = $1 RETURNING *';
        const result = await pool.query(query , [template_id]);

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

exports.getAllTemplates = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        
        if (!page || !limit) {
            const query = 'SELECT * FROM resume_templates'
            result = await pool.query(query);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM resume_templates LIMIT $1 OFFSET $2'
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

exports.getTemplateById = async (req, res) => {
    const client = await pool.connect();
    try {
        const template_id = req.query.template_id;

        if (!template_id) {
            return (
                res.status(400).json({
                    message: "Please Provide template_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM resume_templates WHERE template_id = $1'
        const result = await pool.query(query , [template_id]);

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

