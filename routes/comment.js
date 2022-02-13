const express = require('express');
const User = require('../models/user');//유저 스키마
const Post = require('../models/post');//게시글 스키마
const Comment = require('../models/comment');//댓글 스키마
const sequelize = require('sequelize');
const router = express.Router();
const {loginCheck} = require('../middlewares/authMiddleware');

router.use(express.json()); //bodyParser관련(익스프레스 내장모듈)
router.use(express.urlencoded( {extended : true } ));//bodyParser관련

function cutIp(ip)
{
    let pos = 0;
    let first = ip.indexOf('.',pos);
    let second = ip.indexOf('.',first+1);
    return ip.substring(0,second);
}


router.post('/saveComment',loginCheck,async (req,res)=>//댓글
{
    let islogged = req.session.passport===undefined ? false : true;
    let loginFlag = req.body.loginCheck;

    let no = req.body.post_id;//게시글의 post_id
    let cmt = req.body.comment;//댓글 문자열

    let data = {
        post_id:no,
        comment:cmt,
    }

    if(loginFlag)
    {
        if(!islogged)//loginflag는 있는데 passport를 부여받지 않은경우
        {
            console.log('passport문제')
            res.send(false);
        }
        //passport도 부여받고 loginFlag도 true인 경우
        data.user_id = req.session.passport.user;
        const isthere = await User.findOne({where: {user_id: data.user_id} })
        console.log(isthere);
        await Comment.create(data);
        await Post.increment({numOfCom: 1}, { where: { post_id:no } });
        res.status(200).json({success:true});
    }
    else//로그인 하지 않은경우
    {
        let namedata = req.body.who;
        let passworddata = req.body.password;
        data.who = namedata;//이름
        data.password = passworddata;//비밀번호
        if(namedata===''||namedata===null||passworddata===''||passworddata===null)
        {
            res.status(400).json({success:false,err:'이름또는 패스워드를 입력해주세요'});
            return false;
        }
        let lastcolon = req.socket.remoteAddress.lastIndexOf(":");
        let ip = req.socket.remoteAddress.substring(lastcolon+1,req.socket.remoteAddress.length);//ipv6->ipv4
        let cuttedIp = cutIp(ip);//디시식으로 앞에 두자리만 
        data.ip = cuttedIp;
        await Comment.create(data);
        await Post.increment({numOfCom: 1}, { where: { post_id:no } });
        res.status(200).json({success:true});
    }
});
router.route('/deleteComment').post(async (req,res,next)=>//댓글삭제
{
    let commentId = req.body.comno;
    let commentPassword = req.body.pass;
    let no = req.body.post_id;
    const response = await Comment.destroy({where:{id:commentId,password:commentPassword}});
    await Post.update({ numOfCom: sequelize.literal('numOfCom - 1') }, { where: { post_id: no } });
    if(response)
    {
        res.send(true);
    }
    else
    {
        res.send(false);
    }
});
module.exports = router;