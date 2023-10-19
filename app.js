const express = require('express');
const mysql = require('mysql2/promise'); // mysql2/promise 모듈 사용
const app = express();
const PORT = 8000;
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const {createUser, login, findUser} = require('./services/userService');
const {writePost, showPosts, specificUser, modifyContent, deletePosts, likePost, detailsView} = require('./services/postService');
app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
    console.log(`${PORT}번 port에 연결 되었습니다.`);
});

app.get('/', (req,res) => {
    res.status(200).json({ messge: "Power PONG!!!!!!!!!!!!"});
});

app.post('/user/signup', createUser); 
app.post('/writePost', writePost); 
app.get('/showPosts', showPosts);
app.get('/specificUser', specificUser);
app.post('/modifyContent', modifyContent);
app.get('/deletePosts', deletePosts);
app.get('/likePost', likePost);
app.post('/login', login);
app.post('/detailsView', detailsView);
