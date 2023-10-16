const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const connect = {
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: '1234',
    database: 'practice_database'
};


const createUser = async (req, res) => {
    console.log("확인 한 번 해봤습니다~ ㅋ"); // ㅋㅋ 확인했슴둥
    // checkEmail 일반적으로 이메일 체크할 때 자주 사용하는 정규식
    const checkEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    try {
        let conn = await mysql.createConnection(connect); // DB 연결 할 수 있는 Connection 변수 생성,
        const sql = ` INSERT INTO 
                        users ( nicname, email, password, phone_number, birth_day, profile_image, update_at ) 
                        VALUES (?, ?, ?, ?, ?, ?, ?) `; // SQL 인젝션 공격을 방지하기 위한 방식
        const tempEmail = req.body.firstEmail.trim() + "@" + req.body.secondEmail; // Front에서 받아온 Email 합치기 및 유저가 작성한 Email 공백 제거
        if(checkEmail.text(tempEmail)) { // 유효한 이메일인지 체크
            const userInfo = { // 혹시나 나중에 재사용 가능성을 고려해 객체에 데이터 저장.
                "nickname" : req.body.nickname,
                "email" : tempEmail,
                "password" : req.body.password,
                "phone_number" : req.body.phone_number,
                "birth_day" : req.body.birth_day,
                "profile_image" : req.body.profile_image,
                "update_at" : req.body.update_at
            };
            // 데이터 전송. execute로도 전송 할 수 있다길래... 한번 시도 해봤다.
            await conn.execute(sql, [userInfo.nicknamename, userInfo.email, userInfo.password, userInfo.phone_number, userInfo.birth_day, userInfo.profile_image, userInfo.update_at]);
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

module.exports ={
    createUser
};