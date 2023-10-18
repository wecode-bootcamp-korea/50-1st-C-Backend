const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const query = require('./query/queryCollection');
const requestSource = require('./requestData/requestSource');
const crypto = require('crypto');
const connect = {
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: '1234',
    database: 'wethread'
};

const createUser = async (req, res) => {
    try {
        console.log(1)
        const conn = await mysql.createConnection(connect);

        const pw = req.body.password;
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(pw, salt);
        const checkEmailQuery = query.checkEmail();
        const sql = query.createUser();
        // const temp = req.body.email;
        // const checkEmail = conn.query(checkEmailQuery, [temp]);
        // console.log(req.body.email);
        // console.log("TGIGIGIGIGI",checkEmail);
        const userInfo = requestSource.userInfo(req, hash);
        await conn.query(sql, [userInfo.nickname, userInfo.email, userInfo.password, userInfo.phone_number, userInfo.birth_day, userInfo.profile_image, userInfo.updated_at]);
        conn.end();
        res.status(201).json({ message: "Successe Create ID" });
        console.log("이메일에 이상한거 끼워 넣음");
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ message: "ERROR CREATE ID!" });
    }
}

const login = async (req, res) => {
    try {
        const conn = await mysql.createConnection(connect);
        const sql = query.login();
        const userInfo = {
            "email": req.body.email,
            "password": req.body.password
        };
        const checkID = await conn.query(sql, [userInfo.email, userInfo.password]);
        if (checkID.length === 0) {
            res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
            return;
        }

        // const passwordMatch = bcrypt.compareSync(userInfo.password, checkID[0][0].password);
        const payLoad = { email: userInfo.email };
        const secretKey = crypto.randomBytes(32).toString('hex');
        const jwtToken = jwt.sign(payLoad, secretKey);
        console.log("payLoad :", payLoad);
        console.log("secretKey : ", secretKey);
        console.log("jwtToken : ", jwtToken);
        res.status(201).json({ message: "로그인 완료!", jwtToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "ERROR CREATE ID!", error });
    }
}


module.exports = {
    createUser,
    login
};