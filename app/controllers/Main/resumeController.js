const { query } = require("express");
const { pool } = require("../../config/db.config");

// ADD USER RESUME
exports.addResumes = async (req, res) => {
    try {
        const { resume_template_id, user_id, title } = req.body;
        if (!user_id || !resume_template_id) {
            return res.status(401).json({
                status: false,
                message: "user_id and resume_template_id are required"
            });
        }
        const query = 'INSERT INTO resumes (resume_template_id, user_id, title) VALUES ($1, $2, $3) RETURNING *'
        const savedResumes = await pool.query(query, [resume_template_id, user_id, title ? title :null]);
        if (!savedResumes.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "Resume not added due to issue while saving in db"
            });
        }
        return res.status(200).json({
            status: true,
            message: "resume added",
            results: savedResumes.rows[0]
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

// GET ALL RESUME
exports.getAll = async (req, res) => {
    try {
        const query = `SELECT * FROM resumes`
        const resume = await pool.query(query)
        if (resume.rowCount < 1) {
            return res.json({
                status: false,
                message: 'No results Fetched'

            })
        }
        await Promise.all(resume.rows.map(async (resumes, index) => {
            if (resumes.resume_template_id) {
                const resumeQuery = 'SELECT * FROM templates WHERE template_id = $1'
                const resumeData = await pool.query(resumeQuery, [resumes.resume_template_id]);
                if (resumeData.rows[0]) {
                    resume.rows[index].resume_template_id = resumeData.rows[0];
                }
            }
            if (resumes.user_id) {
                const resumeQuery = 'SELECT * FROM users WHERE user_id = $1'
                const resumeData = await pool.query(resumeQuery, [resumes.user_id]);
                if (resumeData.rows[0]) {
                    if (resumeData.rows[0].education) {
                        if (resumeData.rows[0].education.length > 0) {
                            console.log()
                            const userEducation = `SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))`
                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].education])
                            if (userEducationResult.rowCount > 0) {
                                resumeData.rows[0].education = userEducationResult.rows
                            }
                            else {
                                resumeData.rows[0].education = []
                            }
                        }
                    }
                    if (resumeData.rows[0].experience) {
                        if (resumeData.rows[0].experience.length > 0) {
                            const userEducation = `SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))`
                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].experience])
                            if (userEducationResult.rowCount > 0) {
                                resumeData.rows[0].experience = userEducationResult.rows
                            }
                            else {
                                resumeData.rows[0].experience = []
                            }
                        }
                    }
                    resume.rows[index].user_id = resumeData.rows[0];
                }
            }
            if (resumes.skills) {
                if (resumes.skills.length > 0) {
                    const skillsQuery = 'SELECT * FROM skills WHERE skill_id IN (SELECT UNNEST($1::int[]))'
                    const skillsData = await pool.query(skillsQuery, [resumes.skills]);
                    if (skillsData.rows[0]) {
                        resume.rows[index].skills = skillsData.rows;
                    }
                }
            }
            // CHECKING IF RESUME HAS languages ARRAY THEN FETECHING DATA FOR EACH languages ID
            if (resumes.languages) {
                if (resumes.languages.length > 0) {
                    const languagesQuery = 'SELECT * FROM languages WHERE language_id IN (SELECT UNNEST($1::int[]))'
                    const languagesData = await pool.query(languagesQuery, [resumes.languages]);

                    if (languagesData.rows[0]) {
                        resume.rows[index].languages = languagesData.rows;
                    }
                }
            }

            // CHECKING IF RESUME HAS work_experience ARRAY THEN FETECHING DATA FOR EACH work_experience ID
            if (resumes.work_experience) {
                if (resumes.work_experience.length > 0) {
                    const work_experienceQuery = 'SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))'
                    const work_experienceData = await pool.query(work_experienceQuery, [resumes.work_experience]);

                    if (work_experienceData.rows[0]) {
                        resume.rows[index].work_experience = work_experienceData.rows;
                    }
                }
            }
            // CHECKING IF RESUME HAS educations ARRAY THEN FETECHING DATA FOR EACH educations ID
            if (resumes.educations) {
                if (resumes.educations.length > 0) {
                    const educationsQuery = 'SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))'
                    const educationsData = await pool.query(educationsQuery, [resumes.educations]);

                    if (educationsData.rows[0]) {
                        resume.rows[index].educations = educationsData.rows;
                    }
                }
            }

            // CHECKING IF RESUME HAS objective THEN FETECHING DATA FOR OBJECTIVE ID
            if (resumes.objective) {
                if (resumes.objective !== null) {
                    const objectiveQuery = 'SELECT * FROM objectives WHERE objective_id = $1'
                    const objectiveData = await pool.query(objectiveQuery, [resumes.objective]);

                    if (objectiveData.rows[0]) {
                        resume.rows[index].objective = objectiveData.rows[0];
                    }
                }
            }
            // CHECKING IF RESUME HAS personal_info THEN FETECHING DATA FOR personal_info ID
            if (resumes.personal_info) {
                if (resumes.personal_info !== null) {
                    const personal_infoQuery = 'SELECT * FROM personal_info WHERE personal_info_id = $1'
                    const personal_infoData = await pool.query(personal_infoQuery, [resumes.personal_info]);

                    if (personal_infoData.rows[0]) {
                        resume.rows[index].personal_info = personal_infoData.rows[0];
                    }

                }
            }
        }))
        return res.json({
            status: true,
            message: 'Fetched',
            result: resume.rows

        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

// UPDATE USER RESUMES
exports.updateResumes = async (req, res) => {
    try {
        const { resume_id, skills, objective, personal_info, languages, work_experience, educations, interests,title } = req.body;
        if (!resume_id) {
            return res.status(401).json({
                status: false,
                message: "resume_id is required"
            });
        }
        if (skills || objective || personal_info || languages || work_experience || educations || interests || title) {

        }
        else {
            return res.status(401).json({
                status: false,
                message: "atleast 1 of them should be provided skills, objective, personal_info, languages, work_experience, educations"
            });
        }
        // SETTING UP QUERY TO UPDATE DATA IN DB IF FLUENCY IS NOT GIVEN
        let query = 'UPDATE resumes SET ';
        let index = 2
        let values = [resume_id]

        // CHECKING IF FLUENCY IS NOT AVAILABLE THEN UPDATING ONLY LANGUAGE
        if (skills) {
            // SETTING UP TITLE IN QUERY
            query += `skills = array_append(skills, $${index}) , `;
            values.push(skills)
            index++
        }
        if (title) {
            // SETTING UP TITLE IN QUERY
            query += `title =$${index} , `;
            values.push(title)
            index++
        }
        if (objective) {
            // SETTING UP TITLE IN QUERY
            query += `objective = $${index} , `;
            values.push(objective)
            index++

        }
        if (personal_info) {
            // SETTING UP TITLE IN QUERY
            query += `personal_info = $${index} , `;
            values.push(personal_info)
            index++
        }
        if (languages) {
            // SETTING UP TITLE IN QUERY
            query += `languages = array_append(languages, $${index}) , `;
            values.push(languages)
            index++
        }
        if (work_experience) {
            // SETTING UP TITLE IN QUERY
            query += `work_experience = array_append(work_experience, $${index}) , `;
            values.push(work_experience)
            index++
        }
        if (interests) {
            // SETTING UP TITLE IN QUERY
            query += `interests = array_append(interests, $${index}) , `;
            values.push(interests)
            index++
        }
        if (educations) {
            // SETTING UP TITLE IN QUERY
            query += `educations = array_append(educations, $${index}) , `;
            values.push(educations)
            index++
        }
        // FINALIZING QUERY
        query += 'WHERE resumes_id = $1 RETURNING *'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        const educationUpdated = await pool.query(query, values);
        if (!educationUpdated.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "Resume not updated sucessfully",
            });
        }
        let date = new Date();
        console.log(date)

        const updateTime = `UPDATE resumes SET updated_at = $1 WHERE resumes_id = $2 RETURNING*`
        const update = await pool.query(updateTime, [date, resume_id]);
        if(update.rowCount<1){
            console.log('in uodate');
            return res.status(200).json({
                status: true,
                message: "Data Updated",
                results: educationUpdated.rows[0]
            });
        }
        res.status(200).json({
            status: true,
            message: "Data Updated",
            results: update.rows[0]
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

// GET USER RESUMES
exports.getUserResumes = async (req, res) => {
    try {
        // DESTRUCTURING DATA FROM REQUEST QUERY
        const { user_id } = req.query;
        // CHECKING IF THE DATA IS RECIEVED
        if (!user_id) {
            return res.status(404).json({
                status: false,
                message: "User id must be provided"
            });
        }

        // SETTING UP QUERY TO GET THE REQUIRED RESUME
        const query = 'SELECT * FROM resumes WHERE user_id = $1';

        // FETCHING RESUME FROM DB
        const resume = await pool.query(query, [user_id]);
        // CHECKING IF THE RESUME IS NOT FETECHED THEN SENDING RESPONSE WITH STATUS FALSE
        if (!resume.rows[0]) {
            return res.status(404).json({
                status: false,
                message: "Resume with this id does not exsists"
            });
        }
        // CHECKING IF RESUME HAS SKILLS ARRAY THEN FETECHING DATA FOR EACH SKILL ID
        await Promise.all(resume.rows.map(async (resumes, index) => {
            if (resumes.resume_template_id) {
                const resumeQuery = 'SELECT * FROM templates WHERE template_id = $1'
                const resumeData = await pool.query(resumeQuery, [resumes.resume_template_id]);
                if (resumeData.rows[0]) {
                    resume.rows[index].resume_template_id = resumeData.rows[0];
                }
            }
            if (resumes.user_id) {
                const resumeQuery = 'SELECT * FROM users WHERE user_id = $1'
                const resumeData = await pool.query(resumeQuery, [resumes.user_id]);
                if (resumeData.rows[0]) {
                    if (resumeData.rows[0].education) {
                        if (resumeData.rows[0].education.length > 0) {
                            console.log()
                            const userEducation = `SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))`
                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].education])
                            if (userEducationResult.rowCount > 0) {
                                resumeData.rows[0].education = userEducationResult.rows
                            }
                            else {
                                resumeData.rows[0].education = []
                            }
                        }
                    }
                    if (resumeData.rows[0].experience) {
                        if (resumeData.rows[0].experience.length > 0) {
                            const userEducation = `SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))`
                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].experience])
                            if (userEducationResult.rowCount > 0) {
                                resumeData.rows[0].experience = userEducationResult.rows
                            }
                            else {
                                resumeData.rows[0].experience = []
                            }
                        }
                    }
                    resume.rows[index].user_id = resumeData.rows[0];
                }
            }
            if (resumes.skills) {
                if (resumes.skills.length > 0) {
                    const skillsQuery = 'SELECT * FROM skills WHERE skill_id IN (SELECT UNNEST($1::int[]))'
                    const skillsData = await pool.query(skillsQuery, [resumes.skills]);
                    if (skillsData.rows[0]) {
                        resume.rows[index].skills = skillsData.rows;
                    }
                }
            }
            // CHECKING IF RESUME HAS languages ARRAY THEN FETECHING DATA FOR EACH languages ID
            if (resumes.languages) {
                if (resumes.languages.length > 0) {
                    const languagesQuery = 'SELECT * FROM languages WHERE language_id IN (SELECT UNNEST($1::int[]))'
                    const languagesData = await pool.query(languagesQuery, [resumes.languages]);

                    if (languagesData.rows[0]) {
                        resume.rows[index].languages = languagesData.rows;
                    }
                }
            }

            // CHECKING IF RESUME HAS work_experience ARRAY THEN FETECHING DATA FOR EACH work_experience ID
            if (resumes.work_experience) {
                if (resumes.work_experience.length > 0) {
                    const work_experienceQuery = 'SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))'
                    const work_experienceData = await pool.query(work_experienceQuery, [resumes.work_experience]);

                    if (work_experienceData.rows[0]) {
                        resume.rows[index].work_experience = work_experienceData.rows;
                    }
                }
            }
            // CHECKING IF RESUME HAS educations ARRAY THEN FETECHING DATA FOR EACH educations ID
            if (resumes.educations) {
                if (resumes.educations.length > 0) {
                    const educationsQuery = 'SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))'
                    const educationsData = await pool.query(educationsQuery, [resumes.educations]);

                    if (educationsData.rows[0]) {
                        resume.rows[index].educations = educationsData.rows;
                    }
                }
            }

            // CHECKING IF RESUME HAS objective THEN FETECHING DATA FOR OBJECTIVE ID
            if (resumes.objective) {
                if (resumes.objective !== null) {
                    const objectiveQuery = 'SELECT * FROM objectives WHERE objective_id = $1'
                    const objectiveData = await pool.query(objectiveQuery, [resumes.objective]);

                    if (objectiveData.rows[0]) {
                        resume.rows[index].objective = objectiveData.rows[0];
                    }
                }
            }
            // CHECKING IF RESUME HAS personal_info THEN FETECHING DATA FOR personal_info ID
            if (resumes.personal_info) {
                if (resumes.personal_info !== null) {
                    const personal_infoQuery = 'SELECT * FROM personal_info WHERE personal_info_id = $1'
                    const personal_infoData = await pool.query(personal_infoQuery, [resumes.personal_info]);

                    if (personal_infoData.rows[0]) {
                        resume.rows[index].personal_info = personal_infoData.rows[0];
                    }

                }
            }
        }))
        res.status(200).json({
            status: true,
            message: "Resume found",
            results: resume.rows
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

// GET SPECIFIC RESUME
exports.getResumesById = async (req, res) => {
    // CONNECTING TO DB
    
    try {

        // DESTRUCTURING DATA FROM REQUEST QUERY
        const { resume_id } = req.query;

        // CHECKING IF THE DATA IS RECIEVED
        if (!resume_id) {
            return res.status(404).json({
                status: false,
                message: "Resume id must be provided"
            });
        }

        // SETTING UP QUERY TO GET THE REQUIRED RESUME
        const query = 'SELECT * FROM resumes WHERE resumes_id = $1';

        // FETCHING RESUME FROM DB
        const resume = await pool.query(query, [resume_id]);

        // CHECKING IF THE RESUME IS NOT FETECHED THEN SENDING RESPONSE WITH STATUS FALSE
        if (!resume.rows[0]) {
            return res.status(404).json({
                status: false,
                message: "Resume with this id does not exsists"
            });
        }

        // CHECKING IF RESUME HAS SKILLS ARRAY THEN FETECHING DATA FOR EACH SKILL ID
        await Promise.all(resume.rows.map(async (resumes, index) => {
            if (resumes.resume_template_id) {
                const resumeQuery = 'SELECT * FROM templates WHERE template_id = $1'
                const resumeData = await pool.query(resumeQuery, [resumes.resume_template_id]);
                if (resumeData.rows[0]) {
                    resume.rows[index].resume_template_id = resumeData.rows[0];
                }
            }
            if (resumes.user_id) {
                const resumeQuery = 'SELECT * FROM users WHERE user_id = $1'
                const resumeData = await pool.query(resumeQuery, [resumes.user_id]);
                if (resumeData.rows[0]) {
                    if (resumeData.rows[0].education) {
                        if (resumeData.rows[0].education.length > 0) {
                            console.log()
                            const userEducation = `SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))`
                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].education])
                            if (userEducationResult.rowCount > 0) {
                                resumeData.rows[0].education = userEducationResult.rows
                            }
                            else {
                                resumeData.rows[0].education = []
                            }
                        }
                    }
                    if (resumeData.rows[0].experience) {
                        if (resumeData.rows[0].experience.length > 0) {
                            const userEducation = `SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))`
                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].experience])
                            if (userEducationResult.rowCount > 0) {
                                resumeData.rows[0].experience = userEducationResult.rows
                            }
                            else {
                                resumeData.rows[0].experience = []
                            }
                        }
                    }
                    resume.rows[index].user_id = resumeData.rows[0];
                }
            }
            if (resumes.skills) {
                if (resumes.skills.length > 0) {
                    const skillsQuery = 'SELECT * FROM skills WHERE skill_id IN (SELECT UNNEST($1::int[]))'
                    const skillsData = await pool.query(skillsQuery, [resumes.skills]);
                    if (skillsData.rows[0]) {
                        resume.rows[index].skills = skillsData.rows;
                    }
                }
            }
            // CHECKING IF RESUME HAS languages ARRAY THEN FETECHING DATA FOR EACH languages ID
            if (resumes.languages) {
                if (resumes.languages.length > 0) {
                    const languagesQuery = 'SELECT * FROM languages WHERE language_id IN (SELECT UNNEST($1::int[]))'
                    const languagesData = await pool.query(languagesQuery, [resumes.languages]);

                    if (languagesData.rows[0]) {
                        resume.rows[index].languages = languagesData.rows;
                    }
                }
            }

            // CHECKING IF RESUME HAS work_experience ARRAY THEN FETECHING DATA FOR EACH work_experience ID
            if (resumes.work_experience) {
                if (resumes.work_experience.length > 0) {
                    const work_experienceQuery = 'SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))'
                    const work_experienceData = await pool.query(work_experienceQuery, [resumes.work_experience]);

                    if (work_experienceData.rows[0]) {
                        resume.rows[index].work_experience = work_experienceData.rows;
                    }
                }
            }
            // CHECKING IF RESUME HAS educations ARRAY THEN FETECHING DATA FOR EACH educations ID
            if (resumes.educations) {
                if (resumes.educations.length > 0) {
                    const educationsQuery = 'SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))'
                    const educationsData = await pool.query(educationsQuery, [resumes.educations]);

                    if (educationsData.rows[0]) {
                        resume.rows[index].educations = educationsData.rows;
                    }
                }
            }

            // CHECKING IF RESUME HAS objective THEN FETECHING DATA FOR OBJECTIVE ID
            if (resumes.objective) {
                if (resumes.objective !== null) {
                    const objectiveQuery = 'SELECT * FROM objectives WHERE objective_id = $1'
                    const objectiveData = await pool.query(objectiveQuery, [resumes.objective]);

                    if (objectiveData.rows[0]) {
                        resume.rows[index].objective = objectiveData.rows[0];
                    }
                }
            }
            // CHECKING IF RESUME HAS personal_info THEN FETECHING DATA FOR personal_info ID
            if (resumes.personal_info) {
                if (resumes.personal_info !== null) {
                    const personal_infoQuery = 'SELECT * FROM personal_info WHERE personal_info_id = $1'
                    const personal_infoData = await pool.query(personal_infoQuery, [resumes.personal_info]);

                    if (personal_infoData.rows[0]) {
                        resume.rows[index].personal_info = personal_infoData.rows[0];
                    }

                }
            }
        }))
        res.status(200).json({
            status: false,
            message: "Resume found",
            results: resume.rows[0]
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

// DELETE RESUME
exports.deleteResume = async (req, res) => {
    const { resume_id } = req.query;
    try {
        if (!resume_id) {
            return res.json({
                status: false,
                message: 'Resume_id is required'
            })
        }
        const query = 'DELETE FROM resumes WHERE resumes_id = $1'
        const deleteResume = await pool.query(query, [resume_id]);
        if (deleteResume.rowCount < 1) {
            return res.json({
                status: false,
                message: 'Resume_id is incorrect'
            })
        }
        res.json({
            status: true,
            message: 'CV Deleted Sucessfully',
        })
    } catch (error) {
        return res.json({
            status: false,
            message: error.message
        })
    }
}

// DELETE EDUCATION FROM RESUME
exports.removeResumeEducation = async (req, res) => {
    // 
    try {
        // DESTRUCTURING DATA FROM BODY
        const { education_id, resume_id } = req.body;
        console.log(education_id, resume_id)
        // CHECKING IF THE DATA IS AVAILABLE
        if (!education_id || !resume_id) {
            return res.status(401).json({
                status: false,
                message: "can not make changes, education_id and resume_id is required"
            });
        }

        const query = 'UPDATE resumes SET educations = array_remove(educations, $1) WHERE resumes_id = $2 RETURNING *'
        const educationUpdated = await pool.query(query, [education_id, resume_id]);

        // CHECKING IF THE DATA WAS NOT UPDATED SUCESSFULLY THEN SENDING RESPONSE WITH STATUS FALSE
        if (!educationUpdated.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "Education was not added in users because user does not exsist"
            });
        }

        res.status(200).json({
            status: true,
            message: "Education Added sucessfully",
            results: educationUpdated.rows[0]
        })

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

// DELETE EXPERIENCE FROM RESUME
exports.removeResumeExperience = async (req, res) => {
    // 
    try {
        // DESTRUCTURING DATA FROM BODY
        const { experience_id, resume_id } = req.body;
        console.log(experience_id, resume_id)
        // CHECKING IF THE DATA IS AVAILABLE
        if (!experience_id || !resume_id) {
            return res.status(401).json({
                status: false,
                message: "can not make changes, experience_id and resume_id is required"
            });
        }

        const query = 'UPDATE resumes SET work_experience = array_remove(work_experience, $1) WHERE resumes_id = $2 RETURNING *'
        const educationUpdated = await pool.query(query, [experience_id, resume_id]);

        // CHECKING IF THE DATA WAS NOT UPDATED SUCESSFULLY THEN SENDING RESPONSE WITH STATUS FALSE
        if (!educationUpdated.rows[0]) {
            return res.status(401).json({
                status: false,
                message: "Experience was not added in users because user does not exsist"
            });
        }

        res.status(200).json({
            status: true,
            message: "Experience Added sucessfully",
            results: educationUpdated.rows[0]
        })

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

// ADD RESUME DOWNLOAD COUNT
exports.addDownloaded = async (req, res) => {
    const { user_id, resume_id } = req.query;
    try {
        if (!user_id || !resume_id) {
            return res.json({
                status: false,
                message: 'user_id  and resume_id are required'
            });
        }
        const query = `INSERT INTO resume_downloads (resume_id, user_id) VALUES ($1,$2) RETURNING*`
        const result = await pool.query(query, [resume_id, user_id]);
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: 'could not save entry'
            })
        }
        res.json({
            status: true,
            message: 'entry saved',
            result: result.rows[0]
        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message,
        });
    }
}

// GET RESUME BY SPEICIFC DATE 
exports.getByDate = async (req, res) => {
    const { date } = req.query;
    try {
        const query = `SELECT * FROM resume_downloads WHERE created_at::DATE = $1`;
        const resumeRecords = await pool.query(query, [date])
        if (resumeRecords.rowCount < 1) {
            return res.json({
                status: false,
                message: 'No results Fetched'

            })
        }
        await Promise.all(
            resumeRecords.rows.map(async (itemm, indexx) => {
                if (itemm.resume_id) {
                    const getResumeData = `SELECT * FROM resumes WHERE resumes_id = $1`;
                    const resume = await pool.query(getResumeData, [itemm.resume_id])
                    if (resume.rowCount > 0) {
                        await Promise.all(resume.rows.map(async (resumes, index) => {
                            if (resumes.resume_template_id) {
                                const resumeQuery = 'SELECT * FROM templates WHERE template_id = $1'
                                const resumeData = await pool.query(resumeQuery, [resumes.resume_template_id]);
                                if (resumeData.rows[0]) {
                                    resume.rows[index].resume_template_id = resumeData.rows[0];
                                }
                            }
                            if (resumes.user_id) {
                                const resumeQuery = 'SELECT * FROM users WHERE user_id = $1'
                                const resumeData = await pool.query(resumeQuery, [resumes.user_id]);
                                if (resumeData.rows[0]) {
                                    if (resumeData.rows[0].education) {
                                        if (resumeData.rows[0].education.length > 0) {
                                            console.log()
                                            const userEducation = `SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))`
                                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].education])
                                            if (userEducationResult.rowCount > 0) {
                                                resumeData.rows[0].education = userEducationResult.rows
                                            }
                                            else {
                                                resumeData.rows[0].education = []
                                            }
                                        }
                                    }
                                    if (resumeData.rows[0].experience) {
                                        if (resumeData.rows[0].experience.length > 0) {
                                            const userEducation = `SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))`
                                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].experience])
                                            if (userEducationResult.rowCount > 0) {
                                                resumeData.rows[0].experience = userEducationResult.rows
                                            }
                                            else {
                                                resumeData.rows[0].experience = []
                                            }
                                        }
                                    }
                                    resume.rows[index].user_id = resumeData.rows[0];
                                }
                            }
                            if (resumes.skills) {
                                if (resumes.skills.length > 0) {
                                    const skillsQuery = 'SELECT * FROM skills WHERE skill_id IN (SELECT UNNEST($1::int[]))'
                                    const skillsData = await pool.query(skillsQuery, [resumes.skills]);
                                    if (skillsData.rows[0]) {
                                        resume.rows[index].skills = skillsData.rows;
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS languages ARRAY THEN FETECHING DATA FOR EACH languages ID
                            if (resumes.languages) {
                                if (resumes.languages.length > 0) {
                                    const languagesQuery = 'SELECT * FROM languages WHERE language_id IN (SELECT UNNEST($1::int[]))'
                                    const languagesData = await pool.query(languagesQuery, [resumes.languages]);

                                    if (languagesData.rows[0]) {
                                        resume.rows[index].languages = languagesData.rows;
                                    }
                                }
                            }

                            // CHECKING IF RESUME HAS work_experience ARRAY THEN FETECHING DATA FOR EACH work_experience ID
                            if (resumes.work_experience) {
                                if (resumes.work_experience.length > 0) {
                                    const work_experienceQuery = 'SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))'
                                    const work_experienceData = await pool.query(work_experienceQuery, [resumes.work_experience]);

                                    if (work_experienceData.rows[0]) {
                                        resume.rows[index].work_experience = work_experienceData.rows;
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS educations ARRAY THEN FETECHING DATA FOR EACH educations ID
                            if (resumes.educations) {
                                if (resumes.educations.length > 0) {
                                    const educationsQuery = 'SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))'
                                    const educationsData = await pool.query(educationsQuery, [resumes.educations]);

                                    if (educationsData.rows[0]) {
                                        resume.rows[index].educations = educationsData.rows;
                                    }
                                }
                            }

                            // CHECKING IF RESUME HAS objective THEN FETECHING DATA FOR OBJECTIVE ID
                            if (resumes.objective) {
                                if (resumes.objective !== null) {
                                    const objectiveQuery = 'SELECT * FROM objectives WHERE objective_id = $1'
                                    const objectiveData = await pool.query(objectiveQuery, [resumes.objective]);

                                    if (objectiveData.rows[0]) {
                                        resume.rows[index].objective = objectiveData.rows[0];
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS personal_info THEN FETECHING DATA FOR personal_info ID
                            if (resumes.personal_info) {
                                if (resumes.personal_info !== null) {
                                    const personal_infoQuery = 'SELECT * FROM personal_info WHERE personal_info_id = $1'
                                    const personal_infoData = await pool.query(personal_infoQuery, [resumes.personal_info]);

                                    if (personal_infoData.rows[0]) {
                                        resume.rows[index].personal_info = personal_infoData.rows[0];
                                    }

                                }
                            }
                        }))
                        resumeRecords.rows[indexx].resume = resume.rows[0]
                    }
                }
            })
        )
        return res.json({
            status: true,
            message: 'Fetched',
            totalCoutn: resumeRecords.rowCount,
            result: resumeRecords.rows

        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

// GET RESUME BY WEEK
exports.getByWeek = async (req, res) => {
    const date = req.query.Fromdate;
    try {

        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        const query = `SELECT * FROM resume_downloads WHERE created_at::DATE >= $1 AND created_at::DATE <= $2`;;
        const resumeRecords = await pool.query(query, [startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)])
        if (resumeRecords.rowCount < 1) {
            return res.json({
                status: false,
                message: 'No results Fetched'

            })
        }
        await Promise.all(
            resumeRecords.rows.map(async (itemm, indexx) => {
                if (itemm.resume_id) {
                    const getResumeData = `SELECT * FROM resumes WHERE resumes_id = $1`;
                    const resume = await pool.query(getResumeData, [itemm.resume_id])
                    if (resume.rowCount > 0) {
                        await Promise.all(resume.rows.map(async (resumes, index) => {
                            if (resumes.resume_template_id) {
                                const resumeQuery = 'SELECT * FROM templates WHERE template_id = $1'
                                const resumeData = await pool.query(resumeQuery, [resumes.resume_template_id]);
                                if (resumeData.rows[0]) {
                                    resume.rows[index].resume_template_id = resumeData.rows[0];
                                }
                            }
                            if (resumes.user_id) {
                                const resumeQuery = 'SELECT * FROM users WHERE user_id = $1'
                                const resumeData = await pool.query(resumeQuery, [resumes.user_id]);
                                if (resumeData.rows[0]) {
                                    if (resumeData.rows[0].education) {
                                        if (resumeData.rows[0].education.length > 0) {
                                            console.log()
                                            const userEducation = `SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))`
                                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].education])
                                            if (userEducationResult.rowCount > 0) {
                                                resumeData.rows[0].education = userEducationResult.rows
                                            }
                                            else {
                                                resumeData.rows[0].education = []
                                            }
                                        }
                                    }
                                    if (resumeData.rows[0].experience) {
                                        if (resumeData.rows[0].experience.length > 0) {
                                            const userEducation = `SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))`
                                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].experience])
                                            if (userEducationResult.rowCount > 0) {
                                                resumeData.rows[0].experience = userEducationResult.rows
                                            }
                                            else {
                                                resumeData.rows[0].experience = []
                                            }
                                        }
                                    }
                                    resume.rows[index].user_id = resumeData.rows[0];
                                }
                            }
                            if (resumes.skills) {
                                if (resumes.skills.length > 0) {
                                    const skillsQuery = 'SELECT * FROM skills WHERE skill_id IN (SELECT UNNEST($1::int[]))'
                                    const skillsData = await pool.query(skillsQuery, [resumes.skills]);
                                    if (skillsData.rows[0]) {
                                        resume.rows[index].skills = skillsData.rows;
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS languages ARRAY THEN FETECHING DATA FOR EACH languages ID
                            if (resumes.languages) {
                                if (resumes.languages.length > 0) {
                                    const languagesQuery = 'SELECT * FROM languages WHERE language_id IN (SELECT UNNEST($1::int[]))'
                                    const languagesData = await pool.query(languagesQuery, [resumes.languages]);

                                    if (languagesData.rows[0]) {
                                        resume.rows[index].languages = languagesData.rows;
                                    }
                                }
                            }

                            // CHECKING IF RESUME HAS work_experience ARRAY THEN FETECHING DATA FOR EACH work_experience ID
                            if (resumes.work_experience) {
                                if (resumes.work_experience.length > 0) {
                                    const work_experienceQuery = 'SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))'
                                    const work_experienceData = await pool.query(work_experienceQuery, [resumes.work_experience]);

                                    if (work_experienceData.rows[0]) {
                                        resume.rows[index].work_experience = work_experienceData.rows;
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS educations ARRAY THEN FETECHING DATA FOR EACH educations ID
                            if (resumes.educations) {
                                if (resumes.educations.length > 0) {
                                    const educationsQuery = 'SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))'
                                    const educationsData = await pool.query(educationsQuery, [resumes.educations]);

                                    if (educationsData.rows[0]) {
                                        resume.rows[index].educations = educationsData.rows;
                                    }
                                }
                            }

                            // CHECKING IF RESUME HAS objective THEN FETECHING DATA FOR OBJECTIVE ID
                            if (resumes.objective) {
                                if (resumes.objective !== null) {
                                    const objectiveQuery = 'SELECT * FROM objectives WHERE objective_id = $1'
                                    const objectiveData = await pool.query(objectiveQuery, [resumes.objective]);

                                    if (objectiveData.rows[0]) {
                                        resume.rows[index].objective = objectiveData.rows[0];
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS personal_info THEN FETECHING DATA FOR personal_info ID
                            if (resumes.personal_info) {
                                if (resumes.personal_info !== null) {
                                    const personal_infoQuery = 'SELECT * FROM personal_info WHERE personal_info_id = $1'
                                    const personal_infoData = await pool.query(personal_infoQuery, [resumes.personal_info]);

                                    if (personal_infoData.rows[0]) {
                                        resume.rows[index].personal_info = personal_infoData.rows[0];
                                    }

                                }
                            }
                        }))
                        resumeRecords.rows[indexx].resume = resume.rows[0]
                    }
                }
            })
        )
        return res.json({
            status: true,
            message: 'Fetched',
            totalCoutn: resumeRecords.rowCount,
            result: resumeRecords.rows

        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

// GET RESUME BY MONTH
exports.getByMonth = async (req, res) => {
    const userProvidedMonth = req.query.month;
    try {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthIndex = monthNames.findIndex(month => month.toLowerCase() === userProvidedMonth.toLowerCase());
        if (monthIndex === -1) {
            return res.json({
                status: false,
                message: 'Invalid month name'
            });
        }
        const startDate = new Date(new Date().getFullYear(), monthIndex, 1);
        const endDate = new Date(new Date().getFullYear(), monthIndex + 1, 0);

        const query = `SELECT * FROM resume_downloads WHERE created_at::DATE >= $1 AND created_at::DATE <= $2`;;
        const resumeRecords = await pool.query(query, [startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)])
        if (resumeRecords.rowCount < 1) {
            return res.json({
                status: false,
                message: 'No results Fetched'

            })
        }
        await Promise.all(
            resumeRecords.rows.map(async (itemm, indexx) => {
                if (itemm.resume_id) {
                    const getResumeData = `SELECT * FROM resumes WHERE resumes_id = $1`;
                    const resume = await pool.query(getResumeData, [itemm.resume_id])
                    if (resume.rowCount > 0) {
                        await Promise.all(resume.rows.map(async (resumes, index) => {
                            if (resumes.resume_template_id) {
                                const resumeQuery = 'SELECT * FROM templates WHERE template_id = $1'
                                const resumeData = await pool.query(resumeQuery, [resumes.resume_template_id]);
                                if (resumeData.rows[0]) {
                                    resume.rows[index].resume_template_id = resumeData.rows[0];
                                }
                            }
                            if (resumes.user_id) {
                                const resumeQuery = 'SELECT * FROM users WHERE user_id = $1'
                                const resumeData = await pool.query(resumeQuery, [resumes.user_id]);
                                if (resumeData.rows[0]) {
                                    if (resumeData.rows[0].education) {
                                        if (resumeData.rows[0].education.length > 0) {
                                            console.log()
                                            const userEducation = `SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))`
                                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].education])
                                            if (userEducationResult.rowCount > 0) {
                                                resumeData.rows[0].education = userEducationResult.rows
                                            }
                                            else {
                                                resumeData.rows[0].education = []
                                            }
                                        }
                                    }
                                    if (resumeData.rows[0].experience) {
                                        if (resumeData.rows[0].experience.length > 0) {
                                            const userEducation = `SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))`
                                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].experience])
                                            if (userEducationResult.rowCount > 0) {
                                                resumeData.rows[0].experience = userEducationResult.rows
                                            }
                                            else {
                                                resumeData.rows[0].experience = []
                                            }
                                        }
                                    }
                                    resume.rows[index].user_id = resumeData.rows[0];
                                }
                            }
                            if (resumes.skills) {
                                if (resumes.skills.length > 0) {
                                    const skillsQuery = 'SELECT * FROM skills WHERE skill_id IN (SELECT UNNEST($1::int[]))'
                                    const skillsData = await pool.query(skillsQuery, [resumes.skills]);
                                    if (skillsData.rows[0]) {
                                        resume.rows[index].skills = skillsData.rows;
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS languages ARRAY THEN FETECHING DATA FOR EACH languages ID
                            if (resumes.languages) {
                                if (resumes.languages.length > 0) {
                                    const languagesQuery = 'SELECT * FROM languages WHERE language_id IN (SELECT UNNEST($1::int[]))'
                                    const languagesData = await pool.query(languagesQuery, [resumes.languages]);

                                    if (languagesData.rows[0]) {
                                        resume.rows[index].languages = languagesData.rows;
                                    }
                                }
                            }

                            // CHECKING IF RESUME HAS work_experience ARRAY THEN FETECHING DATA FOR EACH work_experience ID
                            if (resumes.work_experience) {
                                if (resumes.work_experience.length > 0) {
                                    const work_experienceQuery = 'SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))'
                                    const work_experienceData = await pool.query(work_experienceQuery, [resumes.work_experience]);

                                    if (work_experienceData.rows[0]) {
                                        resume.rows[index].work_experience = work_experienceData.rows;
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS educations ARRAY THEN FETECHING DATA FOR EACH educations ID
                            if (resumes.educations) {
                                if (resumes.educations.length > 0) {
                                    const educationsQuery = 'SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))'
                                    const educationsData = await pool.query(educationsQuery, [resumes.educations]);

                                    if (educationsData.rows[0]) {
                                        resume.rows[index].educations = educationsData.rows;
                                    }
                                }
                            }

                            // CHECKING IF RESUME HAS objective THEN FETECHING DATA FOR OBJECTIVE ID
                            if (resumes.objective) {
                                if (resumes.objective !== null) {
                                    const objectiveQuery = 'SELECT * FROM objectives WHERE objective_id = $1'
                                    const objectiveData = await pool.query(objectiveQuery, [resumes.objective]);

                                    if (objectiveData.rows[0]) {
                                        resume.rows[index].objective = objectiveData.rows[0];
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS personal_info THEN FETECHING DATA FOR personal_info ID
                            if (resumes.personal_info) {
                                if (resumes.personal_info !== null) {
                                    const personal_infoQuery = 'SELECT * FROM personal_info WHERE personal_info_id = $1'
                                    const personal_infoData = await pool.query(personal_infoQuery, [resumes.personal_info]);

                                    if (personal_infoData.rows[0]) {
                                        resume.rows[index].personal_info = personal_infoData.rows[0];
                                    }

                                }
                            }
                        }))
                        resumeRecords.rows[indexx].resume = resume.rows[0]
                    }
                }
            })
        )
        return res.json({
            status: true,
            message: 'Fetched',
            totalCoutn: resumeRecords.rowCount,
            result: resumeRecords.rows

        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}

// GET RESUME BY YEAR
exports.getByYear = async (req, res) => {
    const userProvidedYear = req.query.year;
    try {
        const startDate = new Date(userProvidedYear, 0, 1); // January 1st of the provided year
        const endDate = new Date(userProvidedYear, 11, 31);

        const query = `
        SELECT * FROM resume_downloads
        WHERE created_at::DATE >= $1 AND created_at::DATE <= $2
        ORDER BY EXTRACT(MONTH FROM created_at), created_at`;
        const resumeRecords = await pool.query(query, [startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)])
        if (resumeRecords.rowCount < 1) {
            return res.json({
                status: false,
                message: 'No results Fetched'

            })
        }
        await Promise.all(
            resumeRecords.rows.map(async (itemm, indexx) => {
                if (itemm.resume_id) {
                    const getResumeData = `SELECT * FROM resumes WHERE resumes_id = $1`;
                    const resume = await pool.query(getResumeData, [itemm.resume_id])
                    if (resume.rowCount > 0) {
                        await Promise.all(resume.rows.map(async (resumes, index) => {
                            if (resumes.resume_template_id) {
                                const resumeQuery = 'SELECT * FROM templates WHERE template_id = $1'
                                const resumeData = await pool.query(resumeQuery, [resumes.resume_template_id]);
                                if (resumeData.rows[0]) {
                                    resume.rows[index].resume_template_id = resumeData.rows[0];
                                }
                            }
                            if (resumes.user_id) {
                                const resumeQuery = 'SELECT * FROM users WHERE user_id = $1'
                                const resumeData = await pool.query(resumeQuery, [resumes.user_id]);
                                if (resumeData.rows[0]) {
                                    if (resumeData.rows[0].education) {
                                        if (resumeData.rows[0].education.length > 0) {
                                            console.log()
                                            const userEducation = `SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))`
                                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].education])
                                            if (userEducationResult.rowCount > 0) {
                                                resumeData.rows[0].education = userEducationResult.rows
                                            }
                                            else {
                                                resumeData.rows[0].education = []
                                            }
                                        }
                                    }
                                    if (resumeData.rows[0].experience) {
                                        if (resumeData.rows[0].experience.length > 0) {
                                            const userEducation = `SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))`
                                            const userEducationResult = await pool.query(userEducation, [resumeData.rows[0].experience])
                                            if (userEducationResult.rowCount > 0) {
                                                resumeData.rows[0].experience = userEducationResult.rows
                                            }
                                            else {
                                                resumeData.rows[0].experience = []
                                            }
                                        }
                                    }
                                    resume.rows[index].user_id = resumeData.rows[0];
                                }
                            }
                            if (resumes.skills) {
                                if (resumes.skills.length > 0) {
                                    const skillsQuery = 'SELECT * FROM skills WHERE skill_id IN (SELECT UNNEST($1::int[]))'
                                    const skillsData = await pool.query(skillsQuery, [resumes.skills]);
                                    if (skillsData.rows[0]) {
                                        resume.rows[index].skills = skillsData.rows;
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS languages ARRAY THEN FETECHING DATA FOR EACH languages ID
                            if (resumes.languages) {
                                if (resumes.languages.length > 0) {
                                    const languagesQuery = 'SELECT * FROM languages WHERE language_id IN (SELECT UNNEST($1::int[]))'
                                    const languagesData = await pool.query(languagesQuery, [resumes.languages]);

                                    if (languagesData.rows[0]) {
                                        resume.rows[index].languages = languagesData.rows;
                                    }
                                }
                            }

                            // CHECKING IF RESUME HAS work_experience ARRAY THEN FETECHING DATA FOR EACH work_experience ID
                            if (resumes.work_experience) {
                                if (resumes.work_experience.length > 0) {
                                    const work_experienceQuery = 'SELECT * FROM workExperience WHERE work_experience_id IN (SELECT UNNEST($1::int[]))'
                                    const work_experienceData = await pool.query(work_experienceQuery, [resumes.work_experience]);

                                    if (work_experienceData.rows[0]) {
                                        resume.rows[index].work_experience = work_experienceData.rows;
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS educations ARRAY THEN FETECHING DATA FOR EACH educations ID
                            if (resumes.educations) {
                                if (resumes.educations.length > 0) {
                                    const educationsQuery = 'SELECT * FROM educations WHERE education_id IN (SELECT UNNEST($1::int[]))'
                                    const educationsData = await pool.query(educationsQuery, [resumes.educations]);

                                    if (educationsData.rows[0]) {
                                        resume.rows[index].educations = educationsData.rows;
                                    }
                                }
                            }

                            // CHECKING IF RESUME HAS objective THEN FETECHING DATA FOR OBJECTIVE ID
                            if (resumes.objective) {
                                if (resumes.objective !== null) {
                                    const objectiveQuery = 'SELECT * FROM objectives WHERE objective_id = $1'
                                    const objectiveData = await pool.query(objectiveQuery, [resumes.objective]);

                                    if (objectiveData.rows[0]) {
                                        resume.rows[index].objective = objectiveData.rows[0];
                                    }
                                }
                            }
                            // CHECKING IF RESUME HAS personal_info THEN FETECHING DATA FOR personal_info ID
                            if (resumes.personal_info) {
                                if (resumes.personal_info !== null) {
                                    const personal_infoQuery = 'SELECT * FROM personal_info WHERE personal_info_id = $1'
                                    const personal_infoData = await pool.query(personal_infoQuery, [resumes.personal_info]);

                                    if (personal_infoData.rows[0]) {
                                        resume.rows[index].personal_info = personal_infoData.rows[0];
                                    }

                                }
                            }
                        }))
                        resumeRecords.rows[indexx].resume = resume.rows[0]
                    }
                }
            })
        )
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const organizedResults = {};
        for (const month of monthNames) {
            organizedResults[month] = [];
        }
        
        resumeRecords.rows.forEach(row => {
            const month = new Date(row.created_at).getMonth();
            const monthName = monthNames[month];
            organizedResults[monthName].push(row);
        });

        return res.json({
            status: true,
            message: 'Fetched',
            totalCoutn: resumeRecords.rowCount,
            result: organizedResults

        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}