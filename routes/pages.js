const express = require('express');
const path = require('path');

const router = express.Router();//라우터 받아옴
router.get('/',(req,res)=>//홈페이지
{
    res.sendFile(path.join(__dirname,'../views','index.html'));
})
router.get('/register',(req,res)=>//회원가입 페이지
{
    res.sendFile(path.join(__dirname,'../views','register.html'));
})
router.route('/login').get((req,res,next)=>//로그인 페이지
{
    res.sendFile(path.join(__dirname,'../views','login.html'));
})
router.route('/chatting').get((req,res,next)=>//채팅 페이지
{
    res.sendFile(path.join(__dirname,'../views','chatting.html'));
})
router.route('/mypage').get((req,res,next)=>//마이페이지 페이지
{
    res.sendFile(path.join(__dirname,'../views','mypage.html'));
});
module.exports = router;