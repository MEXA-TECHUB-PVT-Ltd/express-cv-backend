const { pool } = require("../../config/db.config");
const fs = require("fs")
const moment = require('moment')


exports.addCreateResume = async (req, res) => {
    const client = await pool.connect();
    try {

        const user_id = req.body.user_id;
        const resume_title = req.body.resume_title;
        const resume_objective = req.body.resume_objective;
        const contact_detail = req.body.contact_detail;
        const education = req.body.education;
        const experience = req.body.experience;
        const interest = req.body.interest;
        const skill = req.body.skill;
        const language = req.body.language;
        const reference = req.body.reference;


        if (!user_id) {
            return (
                res.json({
                    message: "User_id could must be provided",
                    status: false
                })
            )
        }


        const query = `INSERT INTO resume_table (user_id , resume_title , resume_objective , contact_detail
            , education , experience , interest , skill , language , reference
            ) VALUES ($1 , $2 , $3 , $4 , $5 , $6 ,$7 , $8 , $9  ,$10) RETURNING*`
        const result = await pool.query(query,
            [
                user_id ? user_id : null,
                resume_title ? resume_title : null,
                resume_objective ? resume_objective : null,
                contact_detail ? contact_detail : null,
                education ? education : null,
                experience ? experience : null,
                interest ? interest : null,
                skill ? skill : null,
                language ? language : null,
                reference ? reference : null
            ]);


        if (result.rows[0]) {
            res.status(201).json({
                message: "Resume saved in database",
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
            error: err.message
        })
    }
    finally {
        client.release();
    }

}

exports.getResumesByUser_id = async (req, res) => {
    const client = await pool.connect();
    try {

        const user_id = req.query.user_id;
        if (!user_id) {
            return (
                res.json({
                    message: "User_id must be provided",
                    status: false
                })
            )
        }

        const query = `SELECT r.resume_id, r.user_id, r.resume_title,
        json_agg(DISTINCT o.*) AS resume_objective,
        json_agg(DISTINCT cd.*) AS contact_details,
        json_agg(DISTINCT e.*) AS education,
        json_agg(DISTINCT ex.*) AS experience,
        json_agg(DISTINCT i.*) AS interest,
        json_agg(DISTINCT s.*) AS skill,
        json_agg(DISTINCT l.*) AS language,
        json_agg(DISTINCT rt.*) AS reference
        FROM resume_table r
        LEFT JOIN objectives o ON r.resume_objective && ARRAY[o.objective_id]
           LEFT JOIN contact_details cd ON r.contact_detail && ARRAY[cd.contact_detail_id]
        LEFT JOIN educations e ON r.education && ARRAY[e.education_id]
        LEFT JOIN experiences ex ON r.experience && ARRAY[ex.experience_id]
        LEFT JOIN interests i ON r.interest && ARRAY[i.interest_id]
        LEFT JOIN skills s ON r.skill && ARRAY[s.skill_id]
        LEFT JOIN languages l ON r.language && ARRAY[l.language_id]
        LEFT JOIN references_table rt ON r.reference && ARRAY[rt.refrence_id]
        WHERE r.user_id = $1
        GROUP BY r.resume_id, r.user_id, r.resume_title;
 `

 
 

        let result = await pool.query(query , [user_id]);
        result= result.rows;

          console.log(result);
        if (result) {
            res.status(201).json({
                message: "Fetched",
                status: true,
                result: result
            })
        }
        else {
            res.status(400).json({
                message: "Could not fetch",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
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

exports.resumeById = async (req, res) => {
    const client = await pool.connect();
    try {

        const resume_id = req.query.resume_id;
        if (!resume_id) {
            return (
                res.json({
                    message: "resume_id must be provided",
                    status: false
                })
            )
        }

        const query = `SELECT r.resume_id, r.user_id, r.resume_title,
        json_agg(DISTINCT o.*) AS resume_objective,
        json_agg(DISTINCT cd.*) AS contact_details,
        json_agg(DISTINCT e.*) AS education,
        json_agg(DISTINCT ex.*) AS experience,
        json_agg(DISTINCT i.*) AS interest,
        json_agg(DISTINCT s.*) AS skill,
        json_agg(DISTINCT l.*) AS language,
        json_agg(DISTINCT rt.*) AS reference
        FROM resume_table r
        LEFT JOIN objectives o ON r.resume_objective && ARRAY[o.objective_id]
           LEFT JOIN contact_details cd ON r.contact_detail && ARRAY[cd.contact_detail_id]
        LEFT JOIN educations e ON r.education && ARRAY[e.education_id]
        LEFT JOIN experiences ex ON r.experience && ARRAY[ex.experience_id]
        LEFT JOIN interests i ON r.interest && ARRAY[i.interest_id]
        LEFT JOIN skills s ON r.skill && ARRAY[s.skill_id]
        LEFT JOIN languages l ON r.language && ARRAY[l.language_id]
        LEFT JOIN references_table rt ON r.reference && ARRAY[rt.refrence_id]
        WHERE r.resume_id = $1
        GROUP BY r.resume_id, r.user_id, r.resume_title;
 `

 

        let result = await pool.query(query , [resume_id]);

          console.log(result);
        if (result.rows[0]) {
            res.status(201).json({
                message: "Fetched",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.status(400).json({
                message: "Could not fetch",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
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

exports.EditResume = async (req, res) => {
    const client = await pool.connect();
    try {

        const resume_id = req.body.resume_id;
        const resume_title = req.body.resume_title;
        const resume_objective = req.body.resume_objective;
        const contact_detail = req.body.contact_detail;
        const education = req.body.education;
        const experience = req.body.experience;
        const interest = req.body.interest;
        const skill = req.body.skill;
        const language = req.body.language;
        const reference = req.body.reference;


        if (!resume_id) {
            return (
                res.json({
                    message: "resume_id must be provided",
                    status: false
                })
            )
        }

        let query = 'UPDATE resume_table SET ';
        let index = 2;
        let values =[resume_id];

        
        if(resume_title){
            query+= `resume_title = $${index} , `;
            values.push(resume_title)
            index ++
        }
        if(resume_objective){
            query+= `resume_objective = $${index} , `;
            values.push(resume_objective)
            index ++
        }
        if(contact_detail){
            query+= `contact_detail = $${index} , `;
            values.push(contact_detail)
            index ++
        }

        if(experience){
            query+= `experience = $${index} , `;
            values.push(experience)
            index ++
        }

        if(education){
            query+= `education = $${index} , `;
            values.push(education)
            index ++
        }

        if(interest){
            query+= `interest = $${index} , `;
            values.push(interest)
            index ++
        }


        if(skill){
            query+= `skill = $${index} , `;
            values.push(skill)
            index ++
        }

        if(language){
            query+= `language = $${index} , `;
            values.push(language)
            index ++
        }

        if(reference){
            query+= `reference = $${index} , `;
            values.push(reference)
            index ++
        }


        query += 'WHERE resume_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);


        const result = await pool.query(query , values )



        if (result.rows[0]) {
            res.status(201).json({
                message: "Update",
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
            error: err.message
        })
    }
    finally {
        client.release();
    }

}

exports.deleteResume = async (req, res) => {
    const client = await pool.connect();
    try {
        const resume_id= req.query.resume_id;
        if (!resume_id) {
            return (
                res.json({
                    message: "resume_id must be provided",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM resume_table WHERE resume_id = $1 RETURNING *';
        const result = await pool.query(query , [resume_id]);

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

exports.downloadResume = async (req, res) => {
    const client = await pool.connect();
    try {

        const user_id = req.body.user_id;
        const resume_id = req.body.resume_id;

        if (!user_id  || !resume_id) {
            return (
                res.json({
                    message: "User_id and resume_id must be provided",
                    status: false
                })
            )
        }

        const query = `INSERT INTO resume_downloads (user_id , resume_id
            ) VALUES ($1 , $2) RETURNING*`


        const result = await pool.query(query,
            [
                user_id ? user_id : null,
                resume_id? resume_id : null,
               
            ]);


        if (result.rows[0]) {
            res.status(201).json({
                message: "Downloads saved in database",
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
            error: err.message
        })
    }
    finally {
        client.release();
    }

}

exports.downloadsByYear = async (req, res) => {
    const client = await pool.connect();
    let year = req.query.year;
    if(!year){
        return(
            res.json({
                message: "year must be provided",
                status :false
            })
        )
    }
    year = parseInt(year)
    try {
        const query = {
            text: `SELECT *,
                  to_char(downloaded_at,'MM') AS month
                  FROM resume_downloads
                  WHERE date_part('year', downloaded_at) = $1;`,
            values: [year],
          };

        const result = await pool.query(query);

        const output = {};
        result.rows.forEach(row => {
          const month = row.month;
          if (!output[month]) {
            output[month] = [];
          }
          output[month].push(row);
        });


        if (output) {
            res.status(201).json({
                message: "Fetch all records",
                status: true,
                result: output
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
            error: err.message
        })
    }
    finally {
        client.release();
    }

}

exports.downloadsByMonth = async (req, res) => {
    const client = await pool.connect();
    let year = req.query.year;
    const month = req.query.month;

    if(!year || !month){
        return(
            res.json({
                message: "year and month must be provided",
                status :false
            })
        )
    }
    year = parseInt(year)


    try {
        const query = {
            text: `SELECT *,
                  to_char(downloaded_at,'MM') AS month
                  FROM resume_downloads
                  WHERE date_part('year', downloaded_at) = $1 AND date_part('month', downloaded_at) = $2;`,
            values: [year , month],
          };

        const result = await pool.query(query);

        if (result.rows) {
            res.status(201).json({
                message: "Fetched",
                status: true,
                result: result.rows
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
            error: err.message
        })
    }
    finally {
        client.release();
    }

}

exports.downloadsByWeek = async (req, res) => {
    const client = await pool.connect();
    let year = req.query.year;
    let month = req.query.month;
    let week = req.query.week;

    if(!year ||  !week){
        return(
            res.json({
                message: "year, week must be provided",
                status :false
            })
        )
    }
    year = parseInt(year);
    month = parseInt(month);
    week = parseInt(week)


    try {

  // Construct the SQL query to fetch the records for the given week
  const query = `SELECT * FROM resume_downloads
  WHERE extract(week from date_trunc('week', downloaded_at)) = $1 AND extract(year from date_trunc('year', downloaded_at)) = $2;`;


        const result = await pool.query(query , [week , year]);

        if (result.rows) {
            res.status(201).json({
                message: "Fetched",
                status: true,
                result: result.rows
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
            error: err.message
        })
    }
    finally {
        client.release();
    }

}


exports.byRegisteredUsers = async (req,res)=>{
    const client = await pool.connect();
    try {

  // Construct the SQL query to fetch the records for the given week
  const query = `SELECT user_id, array_agg(row_to_json(resume_downloads)) AS resume_downloads
  FROM (
    SELECT resume_id, downloaded_at, user_id, download_id
    FROM resume_downloads
  ) resume_downloads
  GROUP BY user_id;`;


  const result = await pool.query(query);

        if (result.rows) {
            res.status(201).json({
                message: "Fetched",
                status: true,
                result: result.rows
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
            error: err.message
        })
    }
    finally {
        client.release();
    }

}

exports.by_days = async (req,res)=>{
    const client = await pool.connect();
    try {

        const date = req.query.date;

        if(!date){
            return(
                res.json({
                    message: "date must be provided",
                    status :false
                })
            )
        }
  // Construct the SQL query to fetch the records for the given week
  const query = `SELECT user_id, array_agg(row_to_json(resume_downloads)) AS resume_downloads
  FROM (
    SELECT resume_id, downloaded_at, user_id, download_id
    FROM resume_downloads
    WHERE downloaded_at::date = $1::date
  ) resume_downloads
 
  GROUP BY user_id;`;


  const result = await pool.query(query , [date]);

        if (result.rows) {
            res.status(201).json({
                message: "Fetched",
                status: true,
                result: result.rows
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
            error: err.message
        })
    }
    finally {
        client.release();
    }

}