// 회원 가입
function createUser() {
    const sql = ` INSERT INTO 
                    users ( nickname, email, password, phone_number, birth_day, profile_image, updated_at ) 
                    VALUES (?, ?, ?, ?, ?, ?, ?) `;
    return sql;
}

function login() {
    const sql = ` SELECT password FROM users WHERE email = ? `;
    return sql;
}

function writePost() {
    const sql = " INSERT INTO threads (user_id, content) VALUES (?, ?) ";
    return sql;
}

function showPosts() {
    const sql = ` SELECT 
    threads.content, threads.user_id, threads.created_at, users.profile_image
    FROM threads
    JOIN users ON threads.user_id = users.id `;
    return sql;
}

function comments() {
    const sql = " INSERT INTO comments (id, comment, post_id) VALUES (?, ?, ?) "; 
    return sql;
}

function specificUser() {
    const sql = `SELECT 
    users.nickname, threads.content, users.profile_image
    FROM threads JOIN users on 
    users.id = threads.user_id WHERE users.id = ? `;
    return sql;
}

function modifyContent() {
    // 수정을 담당 쿼리
    const sql = ` UPDATE threads SET content = ? WHERE user_id = ? AND id = ? `; 
        
        
        return sql;
}

function checkPost_id_Query() {
    // 작성자와 수정 하는 수정하려는 USER의 id가 일치하는지 체크 
    const checkPost_id_Query =  ` SELECT threads.user_id FROM
                                     threads JOIN users ON 
                                     users.id = threads.user_id WHERE 
                                     threads.user_id = ? AND users.id = ? `;
    return checkPost_id_Query;
}

function deletePosts() {
    const sql = " DELETE FROM threads WHERE user_id = ? AND id = ? ";
    return sql;
}

function likePost() {
    const sql = " INSERT INTO thread_likes ( user_id, thread_id ) VALUES ( ?, ? ) ";
    return sql;
}

function checkLike() {
    const checkLike = ` SELECT thread_likes.thread_id 
                                FROM thread_likes  
                                JOIN users ON
                                users.id = thread_likes.user_id
                                WHERE users.id = ? `;
    return checkLike;
}

function hateThreadsQuery() {
    const hateThreadsQuery = ` DELETE FROM thread_likes 
                                    WHERE thread_id = ? `;
    return hateThreadsQuery;
}

module.exports = {
    createUser,
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
    hateThreadsQuery
};