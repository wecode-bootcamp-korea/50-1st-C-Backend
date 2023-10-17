const {appDataSource } = require("/Users/choehyeonsu/50-1st-C-Backend/models/appdata/datasrc.js")

const onlyUserThread = async (req, res) => {

    const requestId = req.header.id;

    const validUser = await appDataSource.query(
        `
        SELECT id FROM users 
        WHERE '${requestId}' = id
        `
    )
    if (!validUser.legnth) {
        res.status(404).json({"message": "NOT FOUND"})
    }

    const userThread = await appDataSource.query(
        `
        SELECT 
        users.id, 
        threads.id, 
        threads.user_id, 
        threads.content, 
        users.nickname, 
        threads.created_at 
        FROM threads 
        INNER JOIN users ON users.id = threads.user_id WHERE users.user_id = '${requestId}';        `
    )

    console.log("TYPEORM DATA RETURNS EVERY DATA OF THREADS, LENGTH: ", userThread.length)


    // 그냥 app.js에서 error 설정하도록 하자.
    // catch (err) {
    //     console.error(err)
    // }


    return res.status(200).json({"message": "Your Threads' been Loaded Successfully", "threads": userThread} )
}

module.exports = { onlyUserThread }