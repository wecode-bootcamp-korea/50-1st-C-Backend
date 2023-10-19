const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const bcrypt = require('bcrypt');
const query = require('./query/queryCollection');
const requestSource = require('./requestData/requestSource');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotentv = require('dotenv').config();
const cors = require('cors');
const { findUser } = require('./userService')
const connect = {
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: '1234',
    database: 'wethread'
};

const writePost = async (req, res) => { // async 함수는 await과 짝꿍! 프라미스를 좀 더편하게 사용하기 위해 활용 한다. 
    console.log("게시글 작성");
    try {
        const conn = await mysql.createConnection(connect); // DB연결
        const token = req.headers.authorization; // Headers에서 토큰 받아옴.
        const secretKey = process.env.SECRETKEY; // SecretKey 받음.
        console.log(token);
        if (!token) { // 토큰이 없으면 return 하는 조건문.
            res.status(401).json({ message: "인증되지 않았습니다." });
            return;
        }
        const decoded = jwt.verify(token, secretKey); // 토큰, 비밀키 받아서 복호화.
        const userEmail = decoded.email; // 복호화된 Email을 받아옴. 
        console.log("CHECK!!");
        const foundUser = await findUser(userEmail); // UserEmail을 넘겨 쿼리문 실행.
        if (foundUser[0][0] === undefined) { // 받아온 Row가 2차원 배열이기 때문에 [0][0]번째 값 조건문 확인
            res.status(404).json({ message: "USER_NOT_FOUND" });
            return;
        }
        console.log(foundUser[0][0]);
        const postInfo = requestSource.writeThread(req); // Requset로 받은 데이터 전송
        console.log(postInfo); // 전송 후 받아온 값 확인.
        const sql = query.writePost(); // 쿼리 받아옴.
        await conn.execute(sql, [postInfo.content, postInfo.user_id]); //쿼리 실행
        conn.end(); // DB종료
        res.status(201).json({ message: "Create Post SUCCESS!!!" });
    } catch (error) { // try catch문을 사용 하였고 예외를 처리한다.
        console.error("Error ", error); // 에러 발생시 console창에 Error내용 출력
        res.status(500).json({ message: "ERROR", error }); // 돔황챠!
    }
};

const showPosts = async (req, res) => {
    console.log("게시글 전체 확인");
    try {
        const sql = query.showPosts();
        // JOIN을 사용하여, 계정에 저장된 img파일을 매칭 시키고, id, content, profile을 호출 
        const conn = await mysql.createConnection(connect); // DB연결 
        // 내용, 작성자, 작성일, 이미지만 보여준다. Join으로 users와 threads 테이블을 연결 id에 저장된 profile 매칭
        const result = await conn.query(sql); // 쿼리 날림
        conn.end(); // DB종료
        let temp = result[0]; 
        console.log(typeof temp);
        res.status(200).json({ message: result[0] });
    } catch (error) {
        res.status(500).json({ message: "ERROR :", error });
    }
};

const comments = async (req, res) => {
    console.log("댓글 작성");
    try {
        const conn = await mysql.createConnection(connect); // DB연결
        const token = req.headers.authorization; // Headers에서 토큰 받아옴.
        const secretKey = process.env.SECRETKEY; // SecretKey 받음.
        console.log(token);
        if (!token) { // 토큰이 없으면 return 하는 조건문.
            res.status(401).json({ message: "인증되지 않았습니다." });
            return;
        }
        const decoded = jwt.verify(token, secretKey); // 토큰, 비밀키 받아서 복호화.
        const userEmail = decoded.email; // 복호화된 Email을 받아옴. 
        const foundUser = await findUser(userEmail); // UserEmail을 넘겨 쿼리문 실행.
        if (foundUser[0][0] === undefined) { // 받아온 Row가 2차원 배열이기 때문에 [0][0]번째 값 조건문 확인
            res.status(404).json({ message: "USER_NOT_FOUND" });
            return;
        }
        console.log("댓글 작성하는 User Email : ",foundUser[0][0]);
        const comment = requestSource.comment(req);
        const sql = query.comments();
        const result = await conn.query(sql, [comment.id, comment.contents, comment.thread_id]);
        conn.end(); // DB종료
        res.status(201).json({ message: "댓!글!좋!아!", result });
        // const conn = await mysql.createConnection(connect);  
    } catch (error) {
        res.status(500).json({ message: "ERROR : ", error });
    }
};

const specificUser = async (req, res) => {
    console.log("특정 유저 게시글 확인");
    try {
        const conn = await mysql.createConnection(connect);
        const user_id = req.body.user_id;
        const sql = query.specificUser();
        const result = await conn.query(sql, [user_id]);
        conn.end();
        res.status(201).json({ message: result });
    } catch (error) {
        res.status(500).json({ message: "돔항챠 얘들아!! 에러 투성이야!!" });
    }
};

const modifyContent = async (req, res) => {
    console.log("게시글 수정 페이지");
    try {
        
        const conn = await mysql.createConnection(connect); // DB연결
        const token = req.headers.authorization; // Headers에서 토큰 받아옴.
        const secretKey = process.env.SECRETKEY; // SecretKey 받음.
        console.log(token);
        if (!token) { // 토큰이 없으면 return 하는 조건문.
            res.status(401).json({ message: "인증되지 않았습니다." });
            return;
        }
        const decoded = jwt.verify(token, secretKey); // 토큰, 비밀키 받아서 복호화.
        const userEmail = decoded.email; // 복호화된 Email을 받아옴. 
        console.log("CHECK!!");
        const foundUser = await findUser(userEmail); // UserEmail을 넘겨 쿼리문 실행.
        if (foundUser[0][0] === undefined) { // 받아온 Row가 2차원 배열이기 때문에 [0][0]번째 값 조건문 확인
            res.status(404).json({ message: "USER_NOT_FOUND" });
            return;
        }
        console.log(foundUser[0][0]);

        const contentModify = requestSource.modify(req);
        const sql = query.modifyContent();
        const checkPost_id_Query = query.checkPost_id_Query();
        // 쿼리를 보내, 일치하는 데이터가 없으면, 빈 배열을 반환한다.
        const checkPost_id = await conn.query(checkPost_id_Query, [contentModify.user_id, contentModify.id]);
        // 배열 내부를 확인하는 Console 
        // 만약 빈 배열을 반환 받았으면 length는 0일 것이다. 그 뜻은 일치하는 아이디가 아니라는 뜻.
        if (checkPost_id.length === 0) { // 빈 배열일 경우 들어가는 조건문
            res.status(404).json({ message: "유저 일치하지 않음" });
            return;
        } else { // 배열 내부에 값이 있을 경우 미리 작성한 쿼리를 보내준다.
            const result = await conn.query(sql, [contentModify.content, contentModify.user_id, contentModify.id]);
            conn.end(); // DB종료
            if (result[0].affectedRows > 0) { // 게시글이 수정 될 경우 0보다 큰 수가 리턴되며, SUCCESS 조건문에 들어간다.
                res.status(200).json({ message: "게시글 수정 성공" });
                return;
            } else {
                res.status(404).json({ message: "게시글 수정 실패" });
                return;
            }
        }
    } catch (error) {
        res.status(500).json({ message: "에러 발생: " + error.message });
        return;
    }
};

const deletePosts = async (req, res) => {
    console.log("삭제 페이지");
    try {
        const conn = await mysql.createConnection(connect); // DB연결
        const token = req.headers.authorization; // Headers에서 토큰 받아옴.
        const secretKey = process.env.SECRETKEY; // SecretKey 받음.
        console.log(token);
        if (!token) { // 토큰이 없으면 return 하는 조건문.
            res.status(401).json({ message: "인증되지 않았습니다." });
            return;
        }
        const decoded = jwt.verify(token, secretKey); // 토큰, 비밀키 받아서 복호화.
        const userEmail = decoded.email; // 복호화된 Email을 받아옴. 
        console.log("CHECK!!");
        const foundUser = await findUser(userEmail); // UserEmail을 넘겨 쿼리문 실행.
        if (foundUser[0][0] === undefined) { // 받아온 Row가 2차원 배열이기 때문에 [0][0]번째 값 조건문 확인
            res.status(404).json({ message: "USER_NOT_FOUND" });
            return;
        }
        console.log(foundUser[0][0]);
        const contentDelete = requestSource.deleteThread(req);
        
        const sql = query.deletePosts();
        const checkPost_id_Query = query.checkPost_id_Query();
        const checkPost_id = await conn.query(checkPost_id_Query, [contentDelete.user_id, contentDelete.id]);
        if (checkPost_id.length === 0) {
            res.status(404).json({ message: "유저 일치하지 않음" });
        } else {
            conn.query(sql, [contentDelete.user_id, contentDelete.id]);
            conn.end();
            res.status(200).json({ message: "게시글 삭제 완료" });
        }
    } catch (error) {
        res.status(500).json({ message: "에러 발생: " + error.message });
    }
}

const likePost = async (req, res) => {
    console.log("좋아요");
    const check_Like = false;
    try {
        const conn = await mysql.createConnection(connect); // DB연결
        const token = req.headers.authorization; // Headers에서 토큰 받아옴.
        const secretKey = process.env.SECRETKEY; // SecretKey 받음.
        console.log(token);
        if (!token) { // 토큰이 없으면 return 하는 조건문.
            res.status(401).json({ message: "인증되지 않았습니다." });
            return;
        }
        const decoded = jwt.verify(token, secretKey); // 토큰, 비밀키 받아서 복호화.
        const userEmail = decoded.email; // 복호화된 Email을 받아옴. 
        console.log("CHECK!!");
        const foundUser = await findUser(userEmail); // UserEmail을 넘겨 쿼리문 실행.
        if (foundUser[0][0] === undefined) { // 받아온 Row가 2차원 배열이기 때문에 [0][0]번째 값 조건문 확인
            res.status(404).json({ message: "USER_NOT_FOUND" });
            return;
        }
        console.log(foundUser[0][0]);
        const likeContent = requestSource.likeThread(req);
        
        
        const sql = query.likePost();
        const checkLike = query.checkLike();
        const hateThreadsQuery = query.hateThreadsQuery();
        const result = await conn.query(checkLike, [likeContent.user_id, likeContent.thread_id]);

        if (result === req.body.thread_id) {
            conn.query(hateThreadsQuery, [likeContent.thread_id]);
        } else {
            conn.query(sql, [likeContent.user_id, likeContent.thread_id]);
            res.status(201).json({ message: "likeCreated" });
        }

    } catch (error) {
        res.status(500).json({ message: "에러 발생: " + error.message });
    }
};

const detailsView = async (req, res) => {
    console.log("상세보기");
    try {
        const conn = await mysql.createConnection(connect);
        const sql = query.details();
        const threadInfo = req.body.id;
        const result = await conn.query(sql, [threadInfo]);
        console.log(result[0]);
        res.status(201).json({ message: result[0] });
    } catch (error) {
        res.status(500).json({ message: "에러 발생: " + error.message });
    }
}

module.exports = {
    writePost, showPosts, specificUser, modifyContent,
    deletePosts, likePost, detailsView
}