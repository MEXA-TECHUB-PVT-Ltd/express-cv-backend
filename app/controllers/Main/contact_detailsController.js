const {pool} = require("../../config/db.config");


exports.addContact_details = async (req, res) => {
    const client = await pool.connect();
    try {
        const surname = req.body.surname;
        const first_name = req.body.first_name;
        const phone = req.body.phone ;
        const email = req.body.email ;
        const address = req.body.address;
        const driving_license_number= req.body.driving_license_number;




        
        const query = 'INSERT INTO contact_details (surname , first_name , phone , email , address , driving_license_number) VALUES ($1 , $2 , $3 , $4 , $5 , $6) RETURNING*'
        const result = await pool.query(query , 
            [
                surname ? surname : null,
                first_name ? first_name : null ,
                phone ? phone : null ,
                email ?email : null,
                address ? address : null,
                driving_license_number ? driving_license_number : null
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "contact_detail saved in database",
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

exports.updatecontact_detail = async (req, res) => {
    const client = await pool.connect();
    try {
        const contact_detail_id = req.body.contact_detail_id;
         const surname = req.body.surname;
        const first_name = req.body.first_name;
        const phone = req.body.phone ;
        const email = req.body.email ;
        const address = req.body.address;
        const driving_license_number= req.body.driving_license_number;



        if (!contact_detail_id) {
            return (
                res.json({
                    message: "Please provide contact_detail_id ",
                    status: false
                })
            )
        }


    
        let query = 'UPDATE contact_details SET ';
        let index = 2;
        let values =[contact_detail_id];

        
        if(surname){
            query+= `surname = $${index} , `;
            values.push(surname)
            index ++
        }
        if(first_name){
            query+= `first_name = $${index} , `;
            values.push(first_name)
            index ++
        }
        if(phone){
            query+= `phone = $${index} , `;
            values.push(phone)
            index ++
        }

        if(email){
            query+= `email = $${index} , `;
            values.push(email)
            index ++
        }

        if(address){
            query+= `address = $${index} , `;
            values.push(address)
            index ++
        }
        if(driving_license_number){
            query+= `driving_license_number = $${index} , `;
            values.push(driving_license_number)
            index ++
        }



        query += 'WHERE contact_detail_id = $1 RETURNING*'
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

exports.deletecontact_detail = async (req, res) => {
    const client = await pool.connect();
    try {
        const contact_detail_id = req.query.contact_detail_id;
        if (!contact_detail_id) {
            return (
                res.json({
                    message: "Please Provide contact_detail_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM contact_details WHERE contact_detail_id = $1 RETURNING *';
        const result = await pool.query(query , [contact_detail_id]);

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

exports.getAllcontact_details = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM contact_details'
            result = await pool.query(query);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM contact_details LIMIT $1 OFFSET $2'
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

exports.getcontact_detailById= async (req, res) => {
    const client = await pool.connect();
    try {
        const contact_detail_id = req.query.contact_detail_id;

        if (!contact_detail_id) {
            return (
                res.status(400).json({
                    message: "Please Provide contact_detail_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM contact_details WHERE contact_detail_id = $1'
        const result = await pool.query(query , [contact_detail_id]);

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