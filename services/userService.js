const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const query = require('./query/queryCollection');
const requestSource = require('./requestData/requestSource');
const crypto = require('crypto');
const { userInfo } = require('os');
const dotentv = require('dotenv').config();

const connect = {
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: '1234',
    database: 'wethread'
};

const createUser = async (req, res) => {
    try {
        console.log("회원 가입");
        const conn = await mysql.createConnection(connect); // DB연결
        const saltRounds = 10; // 몇번 돌릴건지, 
        const salt = bcrypt.genSaltSync(saltRounds); 
        const hash = bcrypt.hashSync(req.body.password, salt);
        const checkEmailQuery = query.checkEmail(); // 이메일 체크 
        const sql = query.createUser(); // 유효성 검사 하고 체크
        const temp = req.body.email; // 유저 이메일 받고~
        const checkEmail = await conn.query(checkEmailQuery, [temp]); // 체크에 넣어 확인~
        console.log(req.body.email); 
        console.log(checkEmail[0]);
        const temp2 = checkEmail[0];
        if(checkEmail[0][0] === undefined) {
            const userInfo = requestSource.userInfo(req, hash); // 
            await conn.query(sql, [userInfo.nickname, userInfo.email, userInfo.password, userInfo.phone_number, userInfo.birth_day, userInfo.profile_image, userInfo.update_at]);
            conn.end();
            res.status(201).json({ message: "SIGNUP SUCCESS" });
            return;
        } else {
            res.status(404).json({ message: "이미 계정이 있습니다." });
            return;
        }
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ message: "ERROR CREATE ID!" });
        return;
    }
}

const login = async (req, res) => {
    try {
        console.log("로그인");
        const conn = await mysql.createConnection(connect);
        const userInfo = requestSource.checkUserInfo(req);

        const sql = query.login();
        const getpw = query.getUserInformation();
        const getUserInfo = await conn.query(getpw, [userInfo.email]);
        if(getUserInfo[0][0] == undefined) {
            res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
            return;
        }
        const findedUserPassword = getUserInfo[0][0].password;
        const findedUserID = getUserInfo[0][0].email;

        if (findedUserID.length === 0 && findedUserPassword.length === 0) {
            console.log(error.message);
            res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
            return;
        }

        const passwordMatch = bcrypt.compareSync(userInfo.password, findedUserPassword);
        if(passwordMatch) {
            const secretKey = process.env.SECRETKEY;
            const payLoad = { "email" : userInfo.email };
            const jwtToken = jwt.sign(payLoad, secretKey);
            console.log(typeof jwtToken);
            const nickname = getpw.nickname;
            console.log(nickname);
            res.status(201).json({ message: "LOGIN SUCCESS",nickname ,jwtToken });
            return;
        } else {
            res.status(404).json({ message: "비밀번호 입력 오류." });
            return;
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "ERROR CREATE ID!", error });
        return;
    }
}

const findUser = async (userEmail) => {
    const conn = await mysql.createConnection(connect); // DB 연결
    const sql = query.checkEmail(); // 작성된 쿼리 연결
    console.log("????",userEmail); 
    const rows = await conn.query(sql, [userEmail]); // 쿼리에 데이터 전송
    console.log("rows : ", rows[0][0]); // 희안하게 내 rows는 [0][0]번째 2차원 배열로 확인 
    conn.end(); // DB 닫음
    return rows; // 받아온 데이터 리턴 
}

module.exports = {
    createUser,
    login,
    findUser
};