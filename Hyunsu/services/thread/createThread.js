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


const createThread = async (req, res) => {

    appDataSource.initialize().then(
        () => {
            console.log("Data Source has been initialized!");
        })

    const threadContent = req.body.content;
    const userId = req.body.user_id


    // Post Creating BuildUp (POST 전까지 미실행)
    const userThread = await appDataSource.query(
        `
        INSERT INTO threads (
        content, user_id
        )
        VALUES (
        '${threadContent}'
        '${userId}'
        );
        `
    )
    console.log("TYPEORM DATA RETURNS LENGTH: ", userThread.length)

    return res.status(201).json({"message": "threadCreated!"})


}

module.exports = { createThread }