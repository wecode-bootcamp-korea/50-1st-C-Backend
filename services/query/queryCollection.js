// 회원 가입
function createUser() {
    const sql = ` INSERT INTO 
                    users ( nickname, email, password, phone_number, birth_day, profile_image, updated_at ) 
                    VALUES (?, ?, ?, ?, ?, ?, ?) `;
    return sql;
}
// 이메일 중복 체크
function checkEmail() {
    const sql = ` SELECT email FROM users WHERE email = ? `;
    return sql;
}
// UserInfo 가져오기 
function getUserInformation() {
    const sql = ` SELECT email, password from users WHERE email = ? `;
    return sql;
}
// 로그인
function login() {
    const sql = ` SELECT email, password FROM users WHERE email = ? AND password = ? `;
    return sql;
}
// 게시글 작성
function writePost() {
    const sql = " INSERT INTO threads (content, user_id) VALUES (?, ?) ";
    return sql;
}
// 상세보기
function details() {
    const sql = ` SELECT 
    threads.id, users.nickname, users.profile_image, 
    threads.content, threads.created_at 
    FROM threads JOIN users ON users.id = threads.user_id WHERE threads.id = ? `;
    return sql;
}
// 전체 출력
function showPosts() {
    const sql = ` SELECT 
    threads.id, threads.content, users.nickname, threads.created_at, users.profile_image
    FROM threads
    JOIN users ON threads.user_id = users.id `;
    return sql;
}
// 댓글
function comments() {
    const sql = " INSERT INTO thread_comments (id, comment, post_id) VALUES (?, ?, ?) "; 
    return sql;
}
// 댓글 삭제
function deleteComment() {
    const sql = ` DELETE FROM thread_comments WHERE thread_id = ? AND user_id = ? `;
}
// 검색
function specificUser() {
    const sql = `SELECT 
    users.nickname, threads.content, users.profile_image
    FROM threads JOIN users on 
    users.id = threads.user_id WHERE users.id = ? `;
    return sql;
}
// 수정
function modifyContent() {
    const sql = ` UPDATE threads SET content = ? WHERE user_id = ? AND id = ? `; 
    return sql;
}
// 삭제 전 유저 체크
function checkPost_id_Query() {
    const checkPost_id_Query =  ` SELECT threads.user_id FROM
                                     threads JOIN users ON 
                                     users.id = threads.user_id WHERE 
                                     threads.user_id = ? AND users.id = ? `;
    return checkPost_id_Query;
}
// 삭제
function deletePosts() {
    const sql = " DELETE FROM threads WHERE user_id = ? AND id = ? ";
    return sql;
}
// 좋아요
function likePost() {
    const sql = " INSERT INTO thread_likes ( user_id, thread_id ) VALUES ( ?, ? ) ";
    return sql;
}
// 좋아요가 이미 눌러져있는지 확인
function checkLike() {
    const checkLike = ` SELECT thread_likes.thread_id 
                                FROM thread_likes  
                                JOIN users ON
                                users.id = thread_likes.user_id
                                WHERE users.id = ? `;
    return checkLike;
}
// 좋아요 취소
function hateThreadsQuery() {
    const hateThreadsQuery = ` DELETE FROM thread_likes 
                                    WHERE thread_id = ? `;
    return hateThreadsQuery;
}


module.exports = {
    createUser,
    checkEmail,
    login,
    writePost,
    showPosts,
    comments,
    specificUser,
    modifyContent,
    checkPost_id_Query,
    deletePosts,    
    likePost,
    checkLike,
    hateThreadsQuery,
    getUserInformation,
    details
};