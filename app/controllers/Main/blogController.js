const {pool} = require("../../config/db.config");


exports.addBlog = async (req, res) => {
    const client = await pool.connect();
    try {
        const title = req.body.title;
        const description = req.body.description;

        if (!title) {
            return (
                res.json({
                    message: "Please provide title atleast for creating blog",
                    status: false
                })
            )
        }

        
        const query = 'INSERT INTO blogs (title , description) VALUES ($1 , $2 ) RETURNING*'
        const result = await pool.query(query , 
            [
                title ? title : null ,
                description ? description : null,
            ]);

            
        if (result.rows[0]) {
            res.status(201).json({
                message: "blog saved in database",
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

exports.updateBlog = async (req, res) => {
    const client = await pool.connect();
    try {
        const blog_id = req.body.blog_id;
        const title = req.body.title;
        const description = req.body.description;


        if (!blog_id) {
            return (
                res.json({
                    message: "Please provide blog_id ",
                    status: false
                })
            )
        }

       
        let query = 'UPDATE blogs SET ';
        let index = 2;
        let values =[blog_id];



        if(title){
            query+= `title = $${index} , `;
            values.push(title)
            index ++
        }
        
        if(description){
            query+= `description = $${index} , `;
            values.push(description)
            index ++
        }


        query += 'WHERE blog_id = $1 RETURNING*'
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

exports.deleteBlog = async (req, res) => {
    const client = await pool.connect();
    try {
        const blog_id = req.query.blog_id;
        if (!blog_id) {
            return (
                res.json({
                    message: "Please Provide blog_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM blogs WHERE blog_id = $1 RETURNING *';
        const result = await pool.query(query , [blog_id]);

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

exports.getAllBlogs = async (req, res) => {
    const client = await pool.connect();
    try {


        let limit = req.query.limit;
        let page = req.query.page

        

        if (!page || !limit) {
            return (
                res.json({
                    message: "page , limit, must be provided , it seems one or both of them are missing",
                    status: false,
                })
            )
        }
        limit = parseInt(limit);
        let offset= (parseInt(page)-1)* limit


        const query = 'SELECT * FROM blogs LIMIT $1 OFFSET $2'
        const result = await pool.query(query , [limit , offset]);
       


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

exports.getBlogById = async (req, res) => {
    const client = await pool.connect();
    try {
        const blog_id = req.query.blog_id;

        if (!blog_id) {
            return (
                res.status(400).json({
                    message: "Please Provide blog_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM blogs WHERE blog_id = $1'
        const result = await pool.query(query , [blog_id]);

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