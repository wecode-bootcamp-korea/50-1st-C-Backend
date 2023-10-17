const {appDataSource } = require("/Users/choehyeonsu/50-1st-C-Backend/models/appdata/datasrc.js")

const createLike = async (req, res) => {

    // 좋아요 개수 표시 기능 구현을 하려면
    // /thread, /thread/user에서
    //  thread_id와 같은 thread_id를 가진 thread_likes의 데이터 개수를 get요청에 대한 res.json()에 같이 보내면 된다.
    // likes 개수 table cnt_likes을 만들어 보자.
    // express.patch로 해당 게시물의 좋아요에 관한 테이블의 데이터를 patch.
    // createLike의 thread_id와 일치하는 ex) cnt_like.thread_id를 가진 data의 num_likes column 값을 읽어서 += 1 / -= 1
    const threadId = req.body.threadId;
    const userId = req.body.userId;
    // const userId = req.session.id
    // userId => 좋아요 누른 사람의 id.  session에서 얻어온다.

    const threadLike = await appDataSource.query(
        `
    INSERT INTO thread_likes (
    thread_id, user_id
    )
    VALUES (
    '${threadId}'
    '${userId}'
    );
    `
    )
    console.log("TYPEORM DATA GOT QUERY LENGTH", threadLike.length)

    return res.status(201).json({"message": "Successfully ADDED Like!"})
}

module.exports = { createLike }