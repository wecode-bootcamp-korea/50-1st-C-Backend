const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const connect = {
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: '1234',
    database: 'practice_database'
};


const createUser = async (req, res) => {
    console.log("확인 한 번 해봤습니다~ ㅋ");
    try {
        let conn = await mysql.createConnection(connect);
        const sql = "INSERT INTO users (name, email, pw) VALUES (?, ?, ?)";
        const userInfo = {
            "name": req.body.name,
            "email": req.body.email,
            "pw": req.body.pw
        };
        await conn.execute(sql, [userInfo.name, userInfo.email, userInfo.pw]);
        conn.end();
        res.status(201).json({ message: "DataPool Created" });
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ message: "ERROR CREATE!" });
    }
}

module.exports ={
    createUser
};