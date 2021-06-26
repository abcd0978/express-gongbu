const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const User = require('../models/user');
const Comment = require('../models/comment');

router.use(express.json()); 
router.use(express.urlencoded( {extended : true } ));

router.route('/').post(async(req,res,next)=>
{
    var object = 
    {
        id: req.body.ID,
        pass: req.body.PASS1,
        name: req.body.NAME,
        email: req.body.EMAIL1+req.body.EMAIL2,
    };
    if(req.body.EMAIL1==="")
        object.email=null;
    try{
        await User.create(object);
        console.log(req.body.ID);
        res.send("아이디: "+req.body.ID+" 비번:"+req.body.PASS1+" 이름:"+req.body.NAME+" 이메일:"+object.email+" 으로 가입이 되었습니다.");
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})



module.exports = router;