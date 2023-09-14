const { pool } = require("../../config/db.config");


exports.addBlog = async (req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const cover_image = req.file.path;
        if (!title) {
            return (
                res.json({
                    message: "Please provide title atleast for creating blog",
                    status: false
                })
            )
        }


        const query = 'INSERT INTO blogs (title , description , cover_image, sub_headings) VALUES ($1 , $2 , $3 , $4) RETURNING*'
        const result = await pool.query(query,
            [
                title ? title : null,
                description ? description : null,
                cover_image ? cover_image : null,
                []
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
        res.json({
            message: "Error",
            status: false,
            error: err.messagefalse
        })
    }


}

exports.updateBlog = async (req, res) => {
    try {
        const blog_id = req.body.blog_id;
        const title = req.body.title;
        const description = req.body.description;
        const cover_image = req.body.cover_image;
        const sub_headings = req.body.sub_headings;
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
        let values = [blog_id];



        if (title) {
            query += `title = $${index} , `;
            values.push(title)
            index++
        }
        if (sub_headings) {
            query += `sub_headings = $${index} , `;
            values.push(sub_headings)
            index++
        }
        if (description) {
            query += `description = $${index} , `;
            values.push(description)
            index++
        }

        if (cover_image) {
            query += `cover_image = $${index} , `;
            values.push(cover_image)
            index++
        }


        query += 'WHERE blog_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");

        const result = await pool.query(query, values);

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

}

exports.deleteBlog = async (req, res) => {
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
        const result = await pool.query(query, [blog_id]);

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else {
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

}

exports.getAllBlogs = async (req, res) => {
    try {
        let limit = req.query.limit;
        let page = req.query.page

        let result;
        if (!page || !limit) {
            const query = 'SELECT * FROM blogs'
            result = await pool.query(query);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = 'SELECT * FROM blogs LIMIT $1 OFFSET $2'
            result = await pool.query(query, [limit, offset]);


        }

        if (result.rowCount < 0) {
            res.json({
                message: "could not fetch",
                status: false
            })
        }
        await Promise.all(
            result.rows.map(async (results, index) => {
                if (results.sub_headings !== null) {
                    if (results.sub_headings.length > 0) {

                        const sub_headingsQuery = 'SELECT * FROM sub_headings WHERE sub_headings_id IN (SELECT UNNEST($1::int[]))'
                        const sub_headingsResults = await pool.query(sub_headingsQuery, [results.sub_headings])
                        if (sub_headingsResults.rowCount > 0) {
                            result.rows[index].sub_headings = sub_headingsResults.rows;
                        }
                    }
                }
            })
        )
        res.json({
            message: "Fetched",
            status: true,
            count: result.rowCount,
            result: result.rows
        })

    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }


}

exports.getBlogById = async (req, res) => {
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
        const result = await pool.query(query, [blog_id]);

        if (result.rowCount > 0) {
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
            status: false,
            message: err.message
        })
    }


}
exports.addSubHeadings = async (req, res) => {
    const { subHeadings, blog_id } = req.body;
    try {
        let ids = [];
        if (!subHeadings || !blog_id) {
            return res.json({
                status: false,
                message: "subHeadings and blog_id are required"
            })
        }
        let result = [];
        await Promise.all(subHeadings.map(async (item, index) => {
            if (item) {
                const query = 'INSERT INTO sub_headings (heading,ddetails) VALUES ($1, $2) RETURNING *';
                const postSUbHeading = await pool.query(query, [item.heading ? item.heading : '', item.details ? item.details : '']);
                if (postSUbHeading.rowCount > 0) {
                    ids.push(postSUbHeading.rows[0].sub_headings_id)
                    result.push(postSUbHeading.rows[0])
                }
            }
        }))
        let error = false
        await Promise.all(
            ids.map(async (item) => {
            const insertInBlogQuery = 'UPDATE blogs SET sub_headings = array_append(sub_headings, $1) WHERE blog_id = $2 RETURNING *;';
            const insertInBlog = await pool.query(insertInBlogQuery, [item, blog_id]);
            if (insertInBlog.rowCount < 1) {
                error = true
            }
        }))

        if (error) {
            return res.json({
                status: false,
                message: "Sub Heading was added but id was not inserted in blog sucessfully"
            })
        }
        res.json({
            status: true,
            message: "Sub Heading was added sucessfully",
            result: result
        })
    } catch (error) {
        res.json({
            status: false,
            message: error.message
        })
    }
}
exports.updateSubHeading = async (req, res) => {
    try {
        const sub_headings_id = req.body.sub_headings_id;
        const heading = req.body.heading;
        const ddetails = req.body.details;
        if (!sub_headings_id) {
            return (
                res.json({
                    message: "Please provide sub_headings_id ",
                    status: false
                })
            )
        }


        let query = 'UPDATE sub_headings SET ';
        let index = 2;
        let values = [sub_headings_id];



        if (heading) {
            query += `heading = $${index} , `;
            values.push(heading)
            index++
        }
        if (ddetails) {
            query += `ddetails = $${index} , `;
            values.push(ddetails)
            index++
        }

        query += 'WHERE sub_headings_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");

        const result = await pool.query(query, values);

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

}
exports.deleteSubHeading = async (req, res) => {
    try {
        const sub_headings_id = req.query.sub_headings_id;
        if (!sub_headings_id) {
            return (
                res.json({
                    message: "Please Provide sub_headings_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM sub_headings WHERE sub_headings_id = $1 RETURNING *';
        const result = await pool.query(query, [sub_headings_id]);

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else {
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

}
exports.getBlogSubHeadings = async (req, res) => {
    const blog_id = req.query.blog_id;
    try {
        let limit = req.query.limit;
        let page = req.query.page
        if (!blog_id) {
            return res.json({
                status: false,
                message: 'blog_id is required'
            })
        }
        let result;
        if (!page || !limit) {
            const query = 'SELECT * FROM blogs where blog_id = $1'
            result = await pool.query(query, [blog_id]);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = 'SELECT * FROM blogs WHERE blog_id = $1 LIMIT $2 OFFSET $3'
            result = await pool.query(query, [blog_id, limit, offset]);


        }
        console.log(result.rowCount)
        if (result.rowCount < 1) {
            res.json({
                message: "Blog not found",
                status: false
            })
        }
        await Promise.all(
            result.rows.map(async (results, index) => {
                if (results.sub_headings !== null) {
                    if (results.sub_headings.length > 0) {

                        const sub_headingsQuery = 'SELECT * FROM sub_headings WHERE sub_headings_id IN (SELECT UNNEST($1::int[]))'
                        const sub_headingsResults = await pool.query(sub_headingsQuery, [results.sub_headings])
                        if (sub_headingsResults.rowCount > 0) {
                            result.rows[index].sub_headings = sub_headingsResults.rows;
                        }
                    }
                }
            })
        )
        res.json({
            message: "Fetched",
            status: true,
            count: result.rows[0].sub_headings.length,
            result: result.rows[0].sub_headings
        })

    }
    catch (err) {
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }


}
exports.getByDate = async (req, res) => {
    const { date } = req.query;
    try {
        const query = `SELECT * FROM blogs WHERE created_at::DATE = $1`;
        const result = await pool.query(query, [date])
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: 'No results Fetched'

            })
        }
        await Promise.all(
            result.rows.map(async (results, index) => {
                if (results.sub_headings !== null) {
                    if (results.sub_headings.length > 0) {

                        const sub_headingsQuery = 'SELECT * FROM sub_headings WHERE sub_headings_id IN (SELECT UNNEST($1::int[]))'
                        const sub_headingsResults = await pool.query(sub_headingsQuery, [results.sub_headings])
                        if (sub_headingsResults.rowCount > 0) {
                            result.rows[index].sub_headings = sub_headingsResults.rows;
                        }
                    }
                }
            })
        )
        return res.json({
            status: true,
            message: 'Fetched',
            totalCoutn: result.rowCount,
            result: result.rows

        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}
exports.getByWeek = async (req, res) => {
    const date = req.query.Fromdate;
    try {

        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        const query = `SELECT * FROM blogs WHERE created_at::DATE >= $1 AND created_at::DATE <= $2`;;
        const result = await pool.query(query, [startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)])
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: 'No results Fetched'

            })
        }
        await Promise.all(
            result.rows.map(async (results, index) => {
                if (results.sub_headings !== null) {
                    if (results.sub_headings.length > 0) {

                        const sub_headingsQuery = 'SELECT * FROM sub_headings WHERE sub_headings_id IN (SELECT UNNEST($1::int[]))'
                        const sub_headingsResults = await pool.query(sub_headingsQuery, [results.sub_headings])
                        if (sub_headingsResults.rowCount > 0) {
                            result.rows[index].sub_headings = sub_headingsResults.rows;
                        }
                    }
                }
            })
        )
        return res.json({
            status: true,
            message: 'Fetched',
            totalCoutn: result.rowCount,
            result: result.rows

        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}
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

        const query = `SELECT * FROM blogs WHERE created_at::DATE >= $1 AND created_at::DATE <= $2`;;
        const result = await pool.query(query, [startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)])
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: 'No results Fetched'

            })
        }
        await Promise.all(
            result.rows.map(async (results, index) => {
                if (results.sub_headings !== null) {
                    if (results.sub_headings.length > 0) {

                        const sub_headingsQuery = 'SELECT * FROM sub_headings WHERE sub_headings_id IN (SELECT UNNEST($1::int[]))'
                        const sub_headingsResults = await pool.query(sub_headingsQuery, [results.sub_headings])
                        if (sub_headingsResults.rowCount > 0) {
                            result.rows[index].sub_headings = sub_headingsResults.rows;
                        }
                    }
                }
            })
        )
        return res.json({
            status: true,
            message: 'Fetched',
            totalCoutn: result.rowCount,
            result: result.rows

        })
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message
        });
    }
}
exports.getByYear = async (req, res) => {
    const userProvidedYear = req.query.year;
    try {
        const startDate = new Date(userProvidedYear, 0, 1); // January 1st of the provided year
        const endDate = new Date(userProvidedYear, 11, 31);

        const query = `
        SELECT * FROM blogs
        WHERE created_at::DATE >= $1 AND created_at::DATE <= $2
        ORDER BY EXTRACT(MONTH FROM created_at), created_at`;
        const result = await pool.query(query, [startDate.toISOString().slice(0, 10), endDate.toISOString().slice(0, 10)])
        if (result.rowCount < 1) {
            return res.json({
                status: false,
                message: 'No results Fetched'

            })
        }
        await Promise.all(
            result.rows.map(async (results, index) => {
                if (results.sub_headings !== null) {
                    if (results.sub_headings.length > 0) {

                        const sub_headingsQuery = 'SELECT * FROM sub_headings WHERE sub_headings_id IN (SELECT UNNEST($1::int[]))'
                        const sub_headingsResults = await pool.query(sub_headingsQuery, [results.sub_headings])
                        if (sub_headingsResults.rowCount > 0) {
                            result.rows[index].sub_headings = sub_headingsResults.rows;
                        }
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

        result.rows.forEach(row => {
            const month = new Date(row.created_at).getMonth();
            const monthName = monthNames[month];
            organizedResults[monthName].push(row);
        });

        return res.json({
            status: true,
            message: 'Fetched',
            totalCoutn: result.rowCount,
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