const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const bcrypt = require('bcrypt');
const query = require('./query/queryCollection');
const connect = {
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: '1234',
    database: 'wethread'
};

const writePost = async (req, res) => { // async 함수는 await과 짝꿍! 프라미스를 좀 더편하게 사용하기 위해 활용 한다. 
    console.log("마! 게시글 함 써보까!");
    try {
        const sql = query.writePost();
        const conn = await mysql.createConnection(connect); // DB연결
        const postInfo = { // 재사용 가능성이 있기에 객체 내부에 변수 설정
            "content": req.body.content,
            "user_id": req.body.user_id
        };
        await conn.execute(sql, [postInfo.content, postInfo.user_id]); //DB실행
        conn.end(); // DB종료
        res.status(201).json({ message: "Create Post SUCCESS!!!"});
    } catch(error) { // try catch문을 사용 하였고 예외를 처리한다.
        console.error("Error ", error); // 에러 발생시 console창에 Error내용 출력
        res.status(500).json({message: "으악 에러야! 돔황챠!!!"}); // 돔황챠!
    }
};

const showPosts = async (req, res) => { 
    console.log("게시글 전체 확인"); 
    try{
        const sql = query.showPosts();
        // JOIN을 사용하여, 계정에 저장된 img파일을 매칭 시키고, id, content, profile을 호출 
        const conn = await mysql.createConnection(connect); // DB연결 
        // 내용, 작성자, 작성일, 이미지만 보여준다. Join으로 users와 threads 테이블을 연결 id에 저장된 profile 매칭
        const result = await conn.query(sql); // 쿼리 날림
        conn.end(); // DB종료
        res.status(200).json({ message: result}); 
    } catch(error) {
        res.status(500).json({ message: "으악 또 에러야!!"});
    }
};

const comments = async (req, res) => {
    console.log("댓! 글! 댓! 글! 댓! 글! 댓! 글! 댓! 글! 좋! 아!");
    // 많이 어색해 보이는 쿼리인데, 수정 해야할 듯.
    try {
        const sql = query.comments();
        const id = req.body.id;
        const comment = req.body.comment;
        const post_id = req.body.post_id;
        const result = await conn.query(sql, [id,comment,post_id]);
        conn.end(); // DB종료
        res.status(201).json({ message: "댓!글!좋!아!", result });
        // const conn = await mysql.createConnection(connect);  
    } catch(error) {
        res.status(500).json({ message: "에렄"});
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
        res.status(201).json({message: result});
    } catch(error) {
        res.status(500).json({ message: "돔항챠 얘들아!! 에러 투성이야!!"});
    }
};

const modifyContent = async (req, res) => {
    console.log("게시글 수정 페이지");
    try {
        const conn = await mysql.createConnection(connect);
        const user_id = req.body.user_id;
        const id = req.body.id;
        const content = req.body.content;
        const sql = query.modifyContent();
        const checkPost_id_Query = query.checkPost_id_Query();
        // 쿼리를 보내, 일치하는 데이터가 없으면, 빈 배열을 반환한다.
        const checkPost_id = await conn.query(checkPost_id_Query, [user_id, id]); 
        // 배열 내부를 확인하는 Console 
        // 만약 빈 배열을 반환 받았으면 length는 0일 것이다. 그 뜻은 일치하는 아이디가 아니라는 뜻.
        if( checkPost_id.length === 0) { // 빈 배열일 경우 들어가는 조건문
            res.status(404).json({ message: "유저 일치하지 않음" });
        } else { // 배열 내부에 값이 있을 경우 미리 작성한 쿼리를 보내준다.
            const result = await conn.query(sql, [content, user_id, id]);
            conn.end(); // DB종료
            if (result[0].affectedRows > 0) { // 게시글이 수정 될 경우 0보다 큰 수가 리턴되며, SUCCESS 조건문에 들어간다.
                res.status(200).json({ message: "게시글 수정 성공" });
            } else {
                res.status(404).json({ message: "게시글 수정 실패" });
            }
        }
    } catch(error) {
        res.status(500).json({ message: "에러 발생: " + error.message });
    }
};

const deletePosts = async (req, res) => {
    console.log("삭제 페이지");
    try {
        const conn = await mysql.createConnection(connect);
        const user_id = req.body.user_id;
        const id = req.body.id;
        const sql =query.deletePosts();
        const checkPost_id_Query = query.checkPost_id_Query();
        const checkPost_id = await conn.query(checkPost_id_Query, [user_id, id]);
        if(checkPost_id.length === 0) {
            res.status(404).json({ message: "유저 일치하지 않음" });
        } else {
            conn.query(sql, [user_id, id]);
            conn.end();
            res.status(200).json({ message: "게시글 삭제 완료"});
        }
    } catch (error) {
        res.status(500).json({ message: "에러 발생: " + error.message });
    }
}

const likePost = async (req, res) => {
    console.log("아우~ 좋아유~");
    const check_Like = false;
    try {
        const conn = await mysql.createConnection(connect);
        // 좋아요 추가 쿼리문
        const sql = query.likePost();
        const user_id = req.body.user_id;
        const thread_id = req.body.thread_id;
        // 좋아요가 눌렸는지 확인하는 쿼리문
        // like테이블 id와 users id 확인 그 아이디와 일치하는 값의 thread_id를 추가
        // 즉 좋아요 누르면 이 펑션이 실행, 이미 있는 threads_id라고 한다면, 해당 데이터 delete해야함. 
        const checkLike = query.checkLike();
        const hateThreadsQuery = query.hateThreadsQuery();
        const result = await conn.query(checkLike, [user_id, thread_id]);

        if(result === req.body.thread_id) {
            conn.query(hateThreadsQuery, [thread_id]);
        } else {
            conn.query(sql, [user_id, thread_id]);
             res.status(201).json({message:"likeCreated"});
        }

    } catch (error) {
        res.status(500).json({ message: "에러 발생: " + error.message });
    }
};

module.exports={
    writePost, showPosts, specificUser, modifyContent, deletePosts, likePost
}