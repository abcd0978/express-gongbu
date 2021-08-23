const express = require('express');
const path = require('path');
const multer = require('multer');
const User = require('../models/user');//유저 스키마
const File = require('../models/file');//파일 스키마
const Post = require('../models/post');//게시글 스키마
const Comment = require('../models/comment');//댓글 스키마
const fs = require('fs');
const sequelize = require('sequelize');
const router = express.Router();

router.use(express.json()); //bodyParser관련(익스프레스 내장모듈)
router.use(express.urlencoded( {extended : true } ));//bodyParser관련
let lists = ['comps','sfw','nsfw'];//존재하는 게시판들

const imageUpload = multer({
    storage:multer.diskStorage({
        destination(req,file,done)
        {
            done(null,'postImages/');
        },
        filename(req,file,done)
        {
            const ext = path.extname(file.originalname);
            done(null,path.basename(file.originalname,ext)+Date.now()+ext);
        }
    }),
    limits:{fileSize:1024*1024*5}
});
function cutIp(ip)
{
    let pos = 0;
    let first = ip.indexOf('.',pos);
    let second = ip.indexOf('.',first+1);
    return ip.substring(0,second);
}

router.route('/lists').get(async (req,res,next)=>//게시판 페이지 확인
{
    let listQ = req.query.id;//현재 게시판 확인
    let pageQ = req.query.page;//현재 페이지 확인
    if(pageQ===undefined)//undefined면 1로 돌린다.
    {
        pageQ=1;
    }
    let pageO=1;
    pageO = (pageQ-1)*15;//현재 페이지수
    if(lists.indexOf(listQ)===-1)//comps,sfw,nsfw이외의 게시판에 들어간다면
    {
        res.status(404).send('잘못된 접근입니다.');
    }
    else
    {
        var realTitle = listQ==="comps"?realTitle="컴퓨터사이언스":realTitle=listQ;

        let view = await Post.findAll({attributes:['title','post_id','ip','who','numOfCom','isimg','view','thmsup',//게시글 테이블에 표시되는 정보
    [sequelize.fn('date_format', sequelize.col('createdAt'),'%Y-%m-%d %H:%i:%S'), 'createdAt']
],
        where:{wchboard:listQ},offset:pageO,
        limit:15, raw:true, include:[{
            model:User,
            attributes:['name']
        }]
    });

    let wholecount = await Post.count({where:{wchboard:listQ}});//전체 게시글의 수
        const data={
            title:realTitle,/*페이지 타이틀*/listquery:listQ,curpage:pageQ,//쿼리내용
            hrefTitle:"http://14.38.252.76/board/lists?id="+listQ,h2title:realTitle,//제목
            limit:view.length/*한페이지 게시글 수*/,tabledata:view,//실제 데이터
            limitStatic:15,//한페이지 최대 게시글 수
            wholepage:wholecount//모든 게시물의 수
        }
        res.render('board.ejs',data);
    }
});

router.route('/view').get(async (req,res,next)=>//글열람
{
    let postNumber = req.query.no;
    let listQ = req.query.id;
    let data = {};

    let post =  await Post.findOne({where:{post_id:postNumber},attributes:['title','content','ip','who','numOfCom','view','thmsup','thmsdwn','user_id',//게시글열람시 필요한 정보
    [sequelize.fn('date_format', sequelize.col('Post.createdAt'),'%Y-%m-%d %H:%i:%S'), 'createdAt']], raw:true, 
        include:[
        {
            model:User,
            attributes:['name']
        },
        ]
    });

    await Post.increment({view: 1}, { where: { post_id:postNumber } })
    //조회수++
    let comment = await Comment.findAll({where:{post_id:postNumber}, attributes:['id','comment','password','user_id','post_id','ip',
    'who',[sequelize.fn('date_format', sequelize.col('Comment.createdAt'),'%Y-%m-%d %H:%i:%S'), 'createdAt']], include:[{model:User,attributes:['name']}], raw:true});
    //댓글 가져오기
    var realTitle = listQ==="comps"?realTitle="컴퓨터사이언스":realTitle=listQ;
    //타이틀
    data = {
        title:realTitle,/*페이지 타이틀*/listquery:listQ,//쿼리내용
        hrefTitle:"http://14.38.252.76/board/lists?id="+listQ,h2title:realTitle,//제목
        post:post,//본문내용
        comment:comment, numOfCo:comment.length, //댓글정보와 댓글의 개수
    }

    if(post.user_id)//로그인한 사람이 쓴글이라면
    {
        let viewer;
        if(req.session.passport===undefined)//사용자가 로그인을 안했으면 수정을 못함
        {
            data.update = false;//업데이트 가능여부
            data.loginedName = null;//사용자의 닉네임
            data.user_id = null;//사용자의 유저아이디
        }
        else//사용자가 로그인을 했다면
        {
            viewer = req.session.passport.user;
            let viewerName = await User.findOne({where:{user_id:viewer},raw:true});
            data.loginedName = viewerName.name; //사용자가 로그인 했다면 그 이름: 여기 중요하다///////////////////////////////////
            data.user_id = viewer;
            if(viewer === post.user_id)//맞는 유저면 
            {
                console.log('여기');
                data.update = true;
            }
            else
            {
                data.update = false;
            }
        }
    }
    else//로그인 안 한 사람이 쓴 글이라면
    {
        data.update = "password";
        let viewer;
        if(req.session.passport===undefined)//사용자가 로그인을 안했으면 수정을 못함
        {
            data.loginedName = null;
            data.user_id = null;
        }
        else//사용자가 로그인을 했다면
        {
            viewer = req.session.passport.user;
            let viewerName = await User.findOne({where:{user_id:viewer},raw:true});
            data.loginedName = viewerName.name; //사용자가 로그인 했다면 그 이름: 여기 중요하다///////////////////////////////////
            data.user_id = viewer;
        }
    }


    res.render('posting',data);

});

router.route('/write').get((req,res,next)=>//글쓰기창에 들어감
{
    let listQ = req.query.id;//리스트 
    let realTitle;
    realTitle = listQ==="comps"?realTitle="컴퓨터사이언스":realTitle=listQ;

    let isloggedin;
    isloggedin = req.session.passport===undefined ? isloggedin = false : isloggedin = req.session.passport.user;
    let data = {h2title: realTitle , hrefTitle:"http://14.38.252.76/board/lists?id="+listQ ,islogged:isloggedin}
    res.render('writing',data);
});
router.route('/write').post(async(req,res,next)=>//글쓰기 요청
{
    let title = req.body.title;//글제목
    let who = req.body.author;//작성자
    let password = req.body.password;//비밀번호
    let isimg = req.body.isImage;//이미지 존재여부
    let wchboard = req.body.wchboard;//어느 게시판에 속하는지
    let content = req.body.content;//게시글
    let lastcolon = req.socket.remoteAddress.lastIndexOf(":");
    let ip = req.socket.remoteAddress.substring(lastcolon+1,req.socket.remoteAddress.length);//ipv6->ipv4
    let cuttedIp = cutIp(ip);//ipv6->ipv4 디씨식으로 앞에 두자리만 보임
    let userId;
    if(req.session.passport)
    {
        userId = req.session.passport.user;
    }
    else//로그인 안했는데 비번이랑 닉네임 둘중하나 안적혀있으면
    {
        userId = null;
        if(password===null || who===null)
        {
            res.send("잘못된 접근입니다.");
        }
    }
    let data = {
        title:title,
        who:who,
        password: password,
        isimg:isimg,
        wchboard:wchboard,
        content:content,
        ip:cuttedIp,
        user_id:userId
    }
    await Post.create(data);
    res.send(true);
});
router.route('/uploads').post(imageUpload.single('upload'),(req,res,next)=>//사진 업로드
{
    let tempImage = req.file.path;
    let extlength = tempImage.lastIndexOf('.');
    let ext = tempImage.substring(extlength+1,tempImage.length);
    console.log("확장자: "+ext);
    let picexts =['jpg','jpeg','png','gif','svg','jfif','webp'];
    console.log(picexts.indexOf(ext));
    if(picexts.indexOf(ext)>-1)//사진이면 ok사인 보냄
    {
        res.status(200).json({
            uploaded:true,
            url:`../${tempImage}`
        });
    }
    else
    {
        console.log('안댔음');
        res.status(400).json({
            uploaded:false,
        });
        console.log(__dirname);
        fs.unlink(path.join(__dirname,`../${tempImage}`),(err)=>{//이미지 삭제
            console.log(err);
        })
    }
});
/* router.route('/uploads/Image2').post(upload.single('upload'),(req,res,next)=>//에디터에서 사진 지울시 사진 삭제
{
    let imageName = req.body.imageName;
    fs.unlink(path.join(__dirname,`../postImages/${imageName}`),(err)=>{
        console.log(err);
    })
}); */

router.route('/comment').post(async (req,res,next)=>//댓글
{
    let islogged = req.session.passport===undefined ? false : true;
    let loginFlag = req.body.Flag;

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
            res.send(false);
        }
        //passport도 부여받고 loginFlag도 true인 경우
        data.user_id = req.session.passport.id
        await Comment.create(data);
        await Post.increment({numOfCom: 1}, { where: { post_id:no } });
        res.send(true);
    }
    else//로그인 하지 않은경우
    {
        let namedata = req.body.who;
        let passworddata = req.body.password;
        data.who = namedata;//이름
        data.password = passworddata;//비밀번호
        if(namedata===''||namedata===null||passworddata===''||passworddata===null)
        {
            res.send(false);
        }
        let lastcolon = req.socket.remoteAddress.lastIndexOf(":");
        let ip = req.socket.remoteAddress.substring(lastcolon+1,req.socket.remoteAddress.length);//ipv6->ipv4
        let cuttedIp = cutIp(ip);//디시식으로 앞에 두자리만 
        data.ip = cuttedIp;
        await Comment.create(data);
        await Post.increment({numOfCom: 1}, { where: { post_id:no } });
        res.send(true);
    }
});
router.route('/comment/delete_submit').post(async (req,res,next)=>//댓글삭제
{
    let commentId = req.body.comno;
    let commentPassword = req.body.pass;
    const response = await Comment.destroy({where:{id:commentId,password:commentPassword}});
    if(response)
    {
        res.send(true);
    }
    else
    {
        res.send(false);
    }
});
router.route('/gaechubichu').post(async (req,res,next)=>//추천,비추
{

});
module.exports = router;