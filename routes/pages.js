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
router.route('/login').get((req,res,next)=>
{
    res.sendFile(path.join(__dirname,'../views','login.html'));
})

module.exports = router;