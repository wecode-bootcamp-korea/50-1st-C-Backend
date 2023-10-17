const {appDataSource } = require("/Users/choehyeonsu/50-1st-C-Backend/models/appdata/datasrc.js")

const getAllThreads = async (req, res) => {

    const allThreads = await appDataSource.query(
        `
        SELECT 
        users.id, 
        threads.id, 
        threads.user_id, 
        threads.content, 
        users.nickname, 
        threads.created_at 
        FROM threads 
        INNER JOIN users ON users.id = threads.user_id;
        `
    )
    console.log("TYPEORM DATA RETURNS EVERY DATA OF THREADS, LENGTH: ", allThreads.length)

    return res.status(200).json({"message": "All the Threads' been Loaded Successfully", "threads": allThreads})
}

module.exports = { getAllThreads }