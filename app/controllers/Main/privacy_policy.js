const {pool} = require('../../config/db.config');

// ADD PRIVACY POLICY
exports.addPrivacyPolicy = async(req,res)=>{
    try{
        const text = req.body.text ;
        const query= 'INSERT INTO privacy_policy (text) Values ($1) RETURNING *'
        const result = await pool.query(query , [text]);

        if(result.rows[0]){
            res.json({
                message: "Created privacy_policy",
                status : true,
                result : result.rows[0]
            })
         }
         else{
            res.json({
                message: "Could not insert record",
                status : false
            })
         }
    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }

    
}

// GET ALL PRIVACY POLICY
exports.getAllPrivacyPlicies = async(req,res)=>{

    try{
        const query = 'SELECT * FROM privacy_policy';

        const result = await pool.query(query);

        if(result.rows){
            res.json({
                message: "All Fetched privacy policies",
                status : true,
                result : result.rows
            })
         }
         else{
            res.json({
                message: "Could not fetch record",
                status : false
            })
         }

    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }

}

// GET SPECIFIC PRIVACY POLICY
exports.viewPrivacyPolicy = async(req,res)=>{

    try{
        const privacy_policy_id = req.query.privacy_policy_id;
        const query = 'SELECT * FROM privacy_policy WHERE privacy_policy_id= $1';

        const result = await pool.query(query , [privacy_policy_id]);

        if(result.rows[0]){
            res.json({
                message: "privacy policy fetched",
                status : true,
                result : result.rows[0]
            })
         }
         else{
            res.json({
                message: "Could not fetch record",
                status : false
            })
         }

    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }

}

// GET ACTIVE PRIVACY POLICY
exports.viewActivePrivacyPolicy = async(req,res)=>{

    try{
        const query = 'SELECT * FROM privacy_policy WHERE status = $1';

        const result = await pool.query(query , ['active']);

        if(result.rows[0]){
            res.json({
                message: "Active privacy policy fetched",
                status : true,
                result : result.rows[0]
            })
         }
         else{
            res.json({
                message: "No privacy policy found",
                status : false
            })
         }

    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }

}

// UPDATE PRIVACY POLICY
exports.updatePrivacyPolicy= async(req,res)=>{

    
    try{
        const privacy_policy_id = req.body.privacy_policy_id;
        const text = req.body.text;

        const query = 'UPDATE privacy_policy SET text = $2 WHERE privacy_policy_id= $1 RETURNING*';

        const result = await pool.query(query , [privacy_policy_id , text]);

        if(result.rows[0]){
            res.json({
                message: "Text updated",
                status : true,
                result : result.rows[0]
            })
         }
         else{
            res.json({
                message: "Could not update record",
                status : false
            })
         }

    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }

}

// UPDATE ACTIVE STATUS PRIVACY POLICY
exports.updateStatus= async(req,res)=>{

    try{
        const privacy_policy_id = req.body.privacy_policy_id;
        const status = req.body.status ;
        let message2 =null;
        if(status == 'active'){
            let inactiveQuery = 'UPDATE privacy_policy SET status = $1 RETURNING*';
            const inactivated = await pool.query(inactiveQuery , ['inactive']);
            if(inactivated.rows){   
                message2 = 'As you want to change this status active , all others will are in activated'
            }   
        }
        
        const query = 'UPDATE privacy_policy SET status = $2 WHERE privacy_policy_id= $1 RETURNING*';

        const result = await pool.query(query , [privacy_policy_id , status]);

        if(result.rows[0]){
            res.json({
                message: "Status changed to active",
                status : true,
                message2 : message2,
                result : result.rows[0],
            })
         }
         else{
            res.json({
                message: "Could not update record",
                status : false
            })
         }

    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }

}