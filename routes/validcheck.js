const express = require('express');
const path = require('path');
const passport = require('passport');
const router = express.Router();//라우터 받아옴
const User = require('../models/user');
const {loginCheck} = require('../middlewares/authMiddleware')

router.use(express.json()); 
router.use(express.urlencoded( {extended : true } ));
router.use(passport.initialize());
router.use(passport.session());

router.route('/check').post(async(req,res,next)=>//회원가입 유효성 체크
{
    var response;
    try{
        var IDEMIALFLAG = req.body.IDEMIALFLAG;
        if(IDEMIALFLAG)//여기는 email 중복검사
        {
            let userId = req.body.ID
            let resultEmail = User.findAll({
                attributes:['id'],
                where:{id:userId}
            });
            console.log(resultEmail);
        }
        else//여기는 id 중복검사
        {
            var userEmail = req.body.EMAIL;
            var resultId = User.findAll({
                attributes:['email'],
                where:{email:userEmail}
            });
            console.log(resultId);
        }
    }
    catch(err)
    {
        console.log(err);
    }
});
router.post('/logincheck',loginCheck, async(req,res)=>{
    if(req.body.loginCheck){
        let user = await User.findOne({attributes:['name']},{where:{user_id:req.session.passport.user}})
        res.send({result:true, name:user.name});
    }else{
        res.send({result:false});
    }
})
module.exports = router;