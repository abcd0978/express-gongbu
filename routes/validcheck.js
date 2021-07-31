const express = require('express');
const path = require('path');
const passport = require('passport');
const router = express.Router();//라우터 받아옴

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
router.get('/check2',(req,res)=>//로그인여부
{
    if(req.isAuthenticated())
    {
        res.send(true);
    }
    else
    {
        res.send(false);
    }
});

module.exports = router;