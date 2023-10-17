const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const query = require('./query/queryCollection');
const crypto = require('crypto');
const connect = {
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: '1234',
    database: 'wethread'
};

const createUser = async (req, res) => {
    console.log("확인 한 번 해봤습니다~ ㅋ"); // ㅋㅋ 확인했슴둥
    // checkEmail 일반적으로 이메일 체크할 때 자주 사용하는 정규식
    const checkEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    try {
        const pw = req.body.password;
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(pw, salt);

        const conn = await mysql.createConnection(connect); // DB 연결 할 수 있는 Connection 변수 생성,
        

        const sql = query.createUser(); // SQL 인젝션 공격을 방지하기 위한 방식
        console.log("sql:::" ,sql);
        if (1 > 0) { // 유효한 이메일인지 체크
            const userInfo = { // 혹시나 나중에 재사용 가능성을 고려해 객체에 데이터 저장.
                "nickname": req.body.nickname,
                "email": req.body.email,
                "password": hash,
                "phone_number": req.body.phone_number,
                "birth_day": req.body.birth_day,
                "profile_image": req.body.profile_image,
                "update_at": req.body.update_at
            };
            // 데이터 전송. execute로도 전송 할 수 있다길래... 한번 시도 해봤다.
            await conn.query(sql, [userInfo.nickname, userInfo.email, userInfo.password, userInfo.phone_number, userInfo.birth_day, userInfo.profile_image, userInfo.updated_at]);
            conn.end(); // DB와 연결 해제
            res.status(201).json({ message: "Successe Create ID" });
        } else {
            console.log("이메일에 이상한거 끼워 넣음");
            res.status(500).json({ message: "이메일 입력 오류" });
        }
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
        
        const passwordMatch = bcrypt.compareSync(userInfo.password, checkID[0][0].password);
        if(passwordMatch) {
            const payLoad = { email: userInfo.email };
            const secretKey = crypto.randomBytes(32).toString('hex');
            const jwtToken = jwt.sign(payLoad, secretKey);
            console.log("payLoad :", payLoad);
            console.log("secretKey : ", secretKey);
            console.log("jwtToken : ", jwtToken);
            res.status(201).json({ message: "로그인 완료!" });
        } else {
            res.status(404).json({ message: "비밀번호를 다시 입력해주오" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "ERROR CREATE ID!", error });
    }
}


module.exports = {
    createUser,
    login
};