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
    try{
        const user = await User.create({
            id: req.body.ID,
            pass: req.body.PASS1,
            name: req.body.NAME,
        });
        console.log(req.body.ID);
        res.send("아이디: "+req.body.ID+" 비번:"+req.body.PASS1+" 이름:"+req.body.NAME+" 으로 가입이 되었습니다.");
    }
    catch(err)
    {
        console.log(err);
        next(err);
    }
})



module.exports = router;