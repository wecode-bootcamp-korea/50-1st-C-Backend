const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const connect = {
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: '1234',
    database: 'practice_database'
};

const writePost = async (req, res) => { // async 함수는 await과 짝꿍! 프라미스를 좀 더편하게 사용하기 위해 활용 한다. 
    console.log("마! 게시글 함 써보까!");
    try {
        const sql = " INSERT INTO threads (user_id, content) VALUES (?, ?) ";
        const conn = await mysql.createConnection(connect); // DB연결
        const postInfo = { // 재사용 가능성이 있기에 객체 생성
            "content": req.body.content,
            "user_id": req.body.user_id
        };
        await conn.execute(sql, [postInfo.content, postInfo.user_id]);
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
        const conn = await mysql.createConnection(connect); 
        // JOIN을 사용하여, 계정에 저장된 img파일을 매칭 시키고, id, content, profile을 호출 
        const sql = ` SELECT 
        threads.content, threads.user_id, threads.created_at, users.profile_image
        FROM threads
        JOIN users ON threads.user_id = users.id `; 
        const result = await conn.query(sql);
        conn.end();
        res.status(200).json({ message: result});
    } catch(error) {
        res.status(500).json({ message: "으악 또 에러야!!"});
    }
};

const comments = async (req, res) => {
    console.log("댓! 글! 댓! 글! 댓! 글! 댓! 글! 댓! 글! 좋! 아!");
    const sql = " INSERT INTO comments (id, comment, post_id) VALUES (?, ?, ?) ";
    try {
        const id = req.body.id;
        const comment = req.body.comment;
        const post_id = req.body.post_id;
        const result = await conn.query(sql, [id,comment,post_id]);
        conn.end();
        res.status(201).json({ message: "댓!글!좋!아!", result });
        // const conn = await mysql.createConnection(connect);  
    } catch(error) {
        res.status(500).json({ message: "에렄ㅋ"});
    }
};

const specificUser = async (req, res) => {
    console.log("특정 유저 게시글 확인");
    try {
        const conn = await mysql.createConnection(connect);
        const user_id = req.body.user_id;
        const sql = "SELECT users.name, posts.title, posts.content FROM posts JOIN users on users.id = posts.user_id WHERE users.id = ?";
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
        const post_id = req.body.post_id;
        const content = req.body.content;
        const sql = `UPDATE posts SET content = ? WHERE user_id = ? AND id = ?`;
        const checkPost_id_Query = ` SELECT posts.user_id FROM posts JOIN users ON users.id = posts.user_id WHERE posts.user_id = ? AND users.id = ? `;
        const checkPost_id = await conn.query(checkPost_id_Query, [user_id, post_id]);
        console.log("패 함 까보까!? : ", checkPost_id);
        console.log("CheckPost_id LENGTH!!!!!!!!!!!!!!!!!!!!!!!!",checkPost_id.length);
        if( checkPost_id === null) {
            res.status(404).json({ message: "유저 일치하지 않음" });
        } else {
            const result = await conn.query(sql, [content, user_id, post_id]);
            conn.end();
            console.log("RESULT VALUE : ", result[0]);
            if (result[0].affectedRows > 0) {
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
        const sql = " DELETE FROM posts WHERE user_id = ? AND id = ? ";
        const checkPost_id_Query = ` SELECT posts.user_id FROM posts JOIN users ON users.id = posts.user_id WHERE posts.user_id = ? `;
        const user_id = req.body.user_id;
        const id = req.body.id;



        conn.query(sql, [user_id, id]);
        conn.end();
        res.status(200).json({ message: "게시글 삭제 완료"});

    } catch (error) {
        res.status(500).json({ message: "에러 발생: " + error.message });
    }
}

const likePost = async (req, res) => {
    console.log("아우~ 좋아유~");
    const check_Like = false;
    try {
        const conn = await mysql.createConnection(connect);
        const sql = " INSERT INTO likes ( user_id, post_id ) VALUES ( ?, ? ) ";
        const user_id = req.body.user_id;
        const post_id = req.body.post_id;
        const result = conn.query(`
            SELECT like_post 
                FROM likes 
                    WHERE 
        `);
        const checkLike = " SELECT like_post FROM likes ";
        conn.query(sql, [user_id, post_id]);
         res.status(201).json({message:"likeCreated"});
    } catch (error) {
        res.status(500).json({ message: "에러 발생: " + error.message });
    }
};

module.exports={
    writePost, showPosts, specificUser, modifyContent, deletePosts, likePost
}