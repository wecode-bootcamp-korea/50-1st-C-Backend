const express = require('express');
const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const app = express();
app.use(express.json());
const PORT = 8000;
const http = require('http');
const {createUser} = require('./services/userService');
const {writePost, showPosts, specificUser, modifyContent, deletePosts, likePost} = require('./services/postService');
console.log("마 시작했따!")
const connect = {
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: '1234',
    database: 'practice_database'
};

app.listen(PORT, () => {
    console.log(`${PORT}번 port에 연결 되었습니다.`);
});

app.post('/insertUserInfo', createUser);
app.post('/writePost', writePost);
app.get('/showPosts', showPosts);
app.get('/specificUser', specificUser);
app.post('/modifyContent', modifyContent);
app.get('/deletePosts', deletePosts);
app.get('/likePost', likePost);