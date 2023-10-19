//회원가입
const userInfo = (req, hash) => {
    const user = { 
        "nickname": req.body.nickname,
        "email": req.body.email,
        "password": hash,
        "phone_number": req.body.phone_number,
        "birth_day": req.body.birth_day,
        "profile_image": req.body.profile_image,
        "update_at": req.body.update_at
    };
    return user;
};

// 로그인 
const checkUserInfo = (req) => {
    const secretUserInfo = {
        "email" : req.body.email,
        "password" : req.body.password
    };
    return secretUserInfo;
}
// 작성
const writeThread = (req) => {
    const thread = { 
        "id" : req.body.id,
        "user_id": req.body.user_id,
        // "user_id": 28,
        // "content": req.body.content
    };
    return thread;
};
// 댓글
const comment = (req) => {
    const comment = {
        "id" : req.body.id,
        "thread_id" : req.body.thread_id,
        "user_id" : req.body.user_id,
        "contents" : req.body.content,
        "created_at" : req.body.created_at
    };
    
    return comment;
};
// 검색
const searchThread = (req) => {
    const specificUser = {
        "id" : req.body.user_id
    };
};
// 수정
const modify = (req) => {
    const threadModify = {
        "id" : req.body.id,
        "user_id" : req.body.user_id,
        "content" : req.body.content
    };
    
    return threadModify;
};
// 삭제
const deleteThread = (req) => {
    const deleteContents = {
        "id" : req.body.id,
        "user_id" : req.body.user_id,
    };
    return deleteContents;
};
// 좋아요
const likeThread = (req) => {
    const likes = {
        "user_id" : req.body.user_id,
        "thread_id" : req.bodt
    }

    return likes;
};

module.exports = {
    userInfo,
    writeThread,
    comment,
    searchThread,
    modify,
    deleteThread,
    likeThread,
    checkUserInfo
};