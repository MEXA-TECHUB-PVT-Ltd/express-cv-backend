const {pool}  = require("../../config/db.config");

const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


exports.registerUser = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const email = req.body.email;
        const password = req.body.password;
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return (
                res.status(400).json({
                    message: "Error occurred",
                    error: error.details[0].message,
                    status: false
                })
            )
        }
        

        const found_email_query = 'SELECT * FROM users WHERE email = $1'
        const emailExists = await pool.query(found_email_query , [email])
        


        if (emailExists.rowCount>0) {
            return (
                res.status(400).json({
                    message: "user with this email already exists",
                    status: false
                })
            )
        }


        const query = 'INSERT INTO users (email , password ) VALUES ($1 , $2 ) RETURNING*'
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);


        const result = await pool.query(query , [email , hashPassword ]);
        console.log(result.rows[0])

        if(result.rows[0]){
            res.json({
                message: "User Has been registered successfully",
                status : true,
                result:result.rows[0]
            })
        }
        else{
            res.json({
                message: "Could not Register user",
                status :false,
            })
        }

    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }finally {
        client.release();
      }

}

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        let password = req.body.password;

  
        if (!email || !password) {
            return (
                res.status(400).json({
                    message: "email and password must be provided",
                    status: false
                })
            )
        }

        const query = 'SELECT * FROM users WHERE email = $1';
        const foundResult = await pool.query(query  , [email]);

        console.log(foundResult)


        if (foundResult.rowCount == 0) {
            return (
                res.status(400).json({
                    message: "Wrong email or password",
                    status: false
                })
            )
        }

        const vaildPass = await bcrypt.compare(password, foundResult.rows[0].password);

        if (!vaildPass) {
            return (
                res.status(401).json({
                    message: "Wrong email or password",
                    status: false
                })
            )
        }

        const token = jwt.sign({ id: foundResult.rows[0].user_id }, process.env.TOKEN, { expiresIn: '30d' });
        res.json({
            message: "Logged in Successfully",
            status: true,
            result: foundResult.rows[0],
            jwt_token: token
        });

    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}


exports.updateProfile= async (req,res)=>{
    try{
        const user_id = req.body.user_id;

         if(!user_id){
            return(res.json({message : "Please provide user_id" , status : false}))
         }

        const user_name= req.body.user_name;
        const image = req.body.image ;
        const educations = req.body.educations ;
        const skills = req.body.skills ;
        const interests = req.body.interests;
        const experiences = req.body.experiences;
        const contact_details= req.body.contact_details;
        const languages = req.body.languages;




        let query = 'UPDATE users SET ';
        let index = 2;
        let values =[user_id];


        if(user_name){
            query+= `user_name = $${index} , `;
            values.push(user_name)
            index ++
        }
        if(image){
            query+= `image = $${index} , `;
            values.push(image)
            index ++
        }

        if(educations){
            query+= `educations = $${index} , `;
            values.push(educations)
            index ++
        }

        if(skills){
            query+= `skills = $${index} , `;
            values.push(skills)
            index ++
        }

        if(interests){
            query+= `interests = $${index} , `;
            values.push(interests)
            index ++
        }

        if(experiences){
            query+= `experiences = $${index} , `;
            values.push(experiences)
            index ++
        }

        if(contact_details){
            query+= `contact_details = $${index} , `;
            values.push(contact_details)
            index ++
        }

        if(languages){
            query+= `languages = $${index} , `;
            values.push(languages)
            index ++
        }


        query += 'WHERE user_id = $1 RETURNING*'

        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);


      const result = await pool.query(query , values);

      if(result.rows[0]){
        res.json({
            message: "Profile Updated successfully",
            status : true ,
            result : result.rows[0]
        })
      }
      else{
        res.json({
            message: "Profile could not be updated successfully",
            status : false,
        })
      }
      
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}

exports.updatePassword = async(req,res)=>{
    try{
        const email = req.body.email ;
        const password = req.body.password;

        const query = 'UPDATE users SET password = $1 WHERE email = $2 RETURNING*';
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(query , [hashPassword , email]);

        if(result.rows[0]){
            res.json({message: "Update successfully" , status :true , result : result.rows[0]})
        }
        else{
            res.json({message: "Could not Update" , status : false })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}

exports.viewProfile = async(req,res)=>{
    try{
        const user_id = req.query.user_id;
        if(!user_id){
            return(res.json({message : "Please provide user_id" , status : false}))
         }

         const query = `SELECT
         json_build_object(
           'user_id', u.user_id,
           'user_name', u.user_name,
           'email', u.email,
           'image', u.image,
           'skills', (
            SELECT json_agg(json_build_object('skill_id', s.skill_id, 'skill_name', s.skill_name, 'skill_level', s.skill_level))
            FROM skills s
            WHERE s.skill_id = ANY(u.skills)
          ),
          'educations', (
            SELECT json_agg(json_build_object('education_id', e.education_id, 'university_name', e.university_name, 'degree', e.degree, 'location', e.location, 'graduation_year', e.graduation_year, 'end_date', e.end_date, 'description', e.description))
            FROM educations e
            WHERE e.education_id = ANY(u.educations)
          ),
          'interests', (
            SELECT json_agg(json_build_object('interest_id', i.interest_id, 'user_id', i.user_id, 'text', i.text))
            FROM interests i
            WHERE i.interest_id = ANY(u.interests)
          ),
          'experiences', (
            SELECT json_agg(json_build_object('experience_id', x.experience_id, 'user_id', x.user_id, 'position', x.position, 'company', x.company, 'location', x.location, 'start_date', x.start_date, 'end_date', x.end_date, 'description', x.description))
            FROM experiences x
            WHERE x.experience_id = ANY(u.experiences)
          ),
          'contact_details', (
            SELECT json_agg(json_build_object('contact_detail_id', cd.contact_detail_id, 'user_id', cd.user_id, 'surname', cd.surname, 'first_name', cd.first_name, 'phone', cd.phone, 'email', cd.email, 'address', cd.address, 'driving_license_number', cd.driving_license_number))
            FROM contact_details cd
            WHERE cd.contact_detail_id = ANY(u.contact_details)
          ),
          'languages', (
             SELECT json_agg(json_build_object('language_id', li.language_id, 'user_id', li.user_id, 'language_name', li.language_name))
             FROM languages li
             WHERE li.language_id = ANY(u.languages)
           ),
           'All_user_added_Data',
           json_build_object(
             'skills', (
               SELECT json_agg(json_build_object('skill_id', s.skill_id, 'skill_name', s.skill_name, 'skill_level', s.skill_level))
               FROM skills s
               WHERE s.user_id = u.user_id
             ),
             'educations', (
               SELECT json_agg(json_build_object('education_id', e.education_id, 'university_name', e.university_name, 'degree', e.degree, 'location', e.location, 'graduation_year', e.graduation_year, 'end_date', e.end_date, 'description', e.description))
               FROM educations e
               WHERE e.user_id = u.user_id
             ),
             'interests', (
               SELECT json_agg(json_build_object('interest_id', i.interest_id, 'user_id', i.user_id, 'text', i.text))
               FROM interests i
               WHERE i.user_id = u.user_id
             ),
             'experiences', (
               SELECT json_agg(json_build_object('experience_id', x.experience_id, 'user_id', x.user_id, 'position', x.position, 'company', x.company, 'location', x.location, 'start_date', x.start_date, 'end_date', x.end_date, 'description', x.description))
               FROM experiences x
               WHERE x.user_id = u.user_id
             ),
             'contact_details', (
               SELECT json_agg(json_build_object('contact_detail_id', cd.contact_detail_id, 'user_id', cd.user_id, 'surname', cd.surname, 'first_name', cd.first_name, 'phone', cd.phone, 'email', cd.email, 'address', cd.address, 'driving_license_number', cd.driving_license_number))
               FROM contact_details cd
               WHERE cd.user_id = u.user_id
             ),
             'languages', (
                SELECT json_agg(json_build_object('language_id', li.language_id, 'user_id', li.user_id, 'language_name', li.language_name))
                FROM languages li
                WHERE li.user_id = u.user_id
              )
           )
         ) AS user_data
       FROM users u
       WHERE u.user_id = $1;`;
       
         const result = await pool.query(query , [user_id]);


         if(result.rowCount>0){
            res.json({
                message: "User profile fetched",
                status : true,
                result : result.rows[0]
            })
         }
         else{
            res.json({
                message: "Could not Fetch profile , may be the user_id is wrong",
                status : false
            })
         }
        
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}

exports.getAllUsers = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM users'
           result = await pool.query(query);
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit;

            const query = 'SELECT * FROM users LIMIT $1 OFFSET $2'
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


exports.deleteUser= async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        if (!user_id) {
            return (
                res.json({
                    message: "Please Provide user_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM users WHERE user_id = $1 RETURNING *';
        const result = await pool.query(query , [user_id]);

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
exports.updateBlockStatus = async(req,res)=>{
    try{
        const user_id = req.query.user_id ;
        const block_status = req.query.block_status;


        if(!user_id && !block_status){
            return(
                res.json({
                    message: "User Id and block status must be provided",
                    status :false
                })
            )
        }


        const query = 'UPDATE users SET block = $1 WHERE user_id = $2 RETURNING*';

        const result = await pool.query(query , [block_status , user_id]);

        if(result.rows[0]){
            res.json({message: "Update successfully" , status :true , result : result.rows[0]})
        }
        else{
            res.json({message: "Could not Update" , status : false })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}



const registerSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),

});

