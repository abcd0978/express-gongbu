const express = require('express');
const path = require('path');
const session = require('express-session');
const User = require('../models/user');
const passport = require('passport');
const {isNotLoggedIn, isLoggedIn} = require('../middlewares/authMiddleware');
const router = express.Router();
const Crypto = require('crypto');
const bodyParser = require('body-parser');

router.use(express.json()); //bodyParser관련
router.use(express.urlencoded( {extended : true } ));//bodyParser관련
router.use(passport.initialize());
router.use(passport.session());

router.post('/join',isNotLoggedIn,async(req,res,next)=>//로그인 풀려있어야댐
{
    let object = //아이디 비번 이름 이메일 객체화
    {
        id: req.body.ID,
        pass: req.body.PASS1,
        name: req.body.NAME,
        email: req.body.EMAIL,
    };
    if(req.body.EMAIL==="")//email빈 문자열 일시에 email객체 null(email은 nullable함)
        object.email=null;

    try{
        const salt = Crypto.randomBytes(64).toString('base64');//salt생성
        const hash = Crypto.createHash('sha512').update(object.pass+salt).digest('hex');//hash생성
        console.log('만들어진 해쉬값: '+hash);
        object.salt = salt;
        object.pass = hash;
        await User.create(object);
        console.log(req.body.ID);
        return res.redirect('/');
        //res.send("아이디: "+req.body.ID+" 비번:"+req.body.PASS1+" 이름:"+req.body.NAME+" 이메일:"+object.email+" 으로 가입이 되었습니다.");
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
});

router.post('/submit',isNotLoggedIn,(req,res,next)=>//로그인 처리 passport사용해서 한다 로그인 풀려있어야댐
{
    passport.authenticate('local',(err,user,info)=>
    {
        if(err)//서버에러시에
        {
            return next(err);
        }
        if(!user)//로그인 실패시에
        {
            console.log('로그인 실패');
            return res.send(info);
        }
        return req.login(user,(loginErr)=>
        {
            if(loginErr)
            {
                console.error(loginErr);
                return next(loginErr);
            }
            return res.redirect('/');
        });
    })(req,res,next);//미들웨어 속의 미들웨어
});

router.get('/logout',isLoggedIn,(req,res)=>
{
    console.log('로그아웃');
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;