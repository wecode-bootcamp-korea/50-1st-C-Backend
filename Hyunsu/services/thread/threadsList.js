const { DataSource } = require("typeorm")
const dotenv = require('dotenv')
dotenv.config()

const appDataSource = new DataSource(
    {
        type: "mysql",
        host: '127.0.0.1',
        port: '3306',
        username: "root",
        password: "1234",
        database: "WETHREAD_1ST"
    }
)

const getAllThreads = async (req, res) => {

    appDataSource.initialize().then(
        () => {
            console.log("Initialized! Your DB is initialized via typeorm DataSource")
    }
    )

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