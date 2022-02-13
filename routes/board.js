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

        let view = await Post.findAll({attributes:['title','post_id','ip','who','isimg','view','thmsup',//게시글 테이블에 표시되는 정보
        [sequelize.fn('date_format', sequelize.col('createdAt'),'%Y-%m-%d %H:%i:%S'), 'createdAt']],
        where:{wchboard:listQ},offset:pageO,
        limit:15, raw:true, include:[{
            model:User,
            attributes:['name']
        }]
    });
    for(let i=0;i<view.length;i++)
    {
        let num = await Comment.count({ where:{post_id: view[i].post_id} });
        view[i].numOfCom = num;
    }
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
    let postNumber = req.query.no;//게시글아이디
    let listQ = req.query.id;//게시판아이디
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
        title:realTitle,/*페이지 타이틀*/listquery:listQ,postquery:postNumber,//쿼리내용
        hrefTitle:"http://14.38.252.76/board/lists?id="+listQ,h2title:realTitle,//제목
        post:post,//본문내용(객체임)
        comment:comment, numOfCom:comment.length, //댓글정보와 댓글의 개수
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
    if(content===''||title===null||title==='')
    {
        res.status(404).send('잘못된접근입니다');
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
router.route('/modify').get(async (req,res,next)=>//수정 창에 들어감
{
    //로그인유저는 그냥 들여주고 익명유저는 비번창으로 렌더링한후에 modify로 post요청이 들어오면 그때 수정창 렌더링해줌
    let postId = req.query.no;//게시글 아이디
    let loged = req.session.passport;//세션 패스포트
    let listQ = req.query.id;//게시판 아이디
    let realTitle;
    realTitle = listQ==="comps"?realTitle="컴퓨터사이언스":realTitle=listQ;
    let isexsist = await Post.findOne({where:{post_id:postId},raw:true});
    if(isexsist===null)//글이 존재하는지 확인
    {
        res.status(404).send('잘못된 접근입니다.');
        return;
    }
    let isLogedPost = await Post.findOne({where:{post_id:postId},attributes:['user_id'],raw:true});//로그인한 유저가 쓴글인지 확인
    if(isLogedPost.user_id)
    {
        if(loged===undefined)
        {
            res.status(404).send('잘못된 접근입니다.');
            return;
        }
        let userId = loged.user;
        let isthere = await Post.findOne({where:{post_id:postId,user_id:userId},raw:true,attributes:['content','title']});//postId는 유일함 userId로 다시 검증
        if(isthere.content===null || isthere.title===null)
        {
            res.status(404).send('잘못된 접근입니다.');
            return;
        }
        let data = {
            h2title: realTitle, 
            hrefTitle:"http://14.38.252.76/board/lists?id="+listQ,
            islogged:true,//작성자 비번 보여주냐-->true면 안보여줌
            content:isthere.content,
            title:isthere.title,
            isLogedPost:true,//수정창 보여주냐,
            postId:postId,//게시글 아이디
        };
        res.render('modifing',data);
        return;
    }
    else//비밀번호 입력 창 렌더링
    {
        let data = {
            h2title: realTitle,
            hrefTitle:"http://14.38.252.76/board/lists?id="+listQ,
            isLogedPost:false,//수정창 보여주냐
            postId:postId,//게시글 아이디
        };
        res.render('modifing',data);
    }
});
router.route('/modify').post(async (req,res,next)=>//비밀번호 제출
{
    let password = req.body.pass;
    var postId = req.body.no;
    let listQ = req.body.list;
    let realTitle;
    realTitle = listQ==="comps"?realTitle="컴퓨터사이언스":realTitle=listQ;
    let isthere = await Post.findOne({where:{post_id:postId,password:password},attributes:['content','title','who','password'],raw:true});
    if(isthere===null)
    {
        res.send("<script>alert('비밀번호가 틀립니다.'); window.location.href = '/board/modify?id="+listQ+"&no="+no+"';</script>");
    }
    else
    {
        let data = {
            h2title: realTitle,
            hrefTitle:"http://14.38.252.76/board/lists?id="+listQ,
            islogged:false,//익명게시글이므로 비번란과 작성자란은 보여진다
            content:isthere.content,
            title:isthere.title,
            author:isthere.who,
            isLogedPost:true,//수정창 보여줌
            postId:postId,//게시글 아이디
        };
        res.render('modifing',data);
    }
});
router.route('/modify/modify_submit').post(async (req,res,next)=>//비
{
    let title = req.body.title;
    let isImage = req.body.isImage;
    let content = req.body.content;
    let no = req.body.no;
    if(content===''||content===null||title===null||title==='')
    {
        res.status(404).send('잘못된접근입니다');
    }
    await Post.update({title:title,isimg:isImage,content:content},{where:{post_id:no}})
    .then(fulfilled=>
    {
        res.send(true);
    }).then(err=>
    {
        res.send(false);
    })
});
router.route('/delete').post(async (req,res,next)=>//삭제 하기
{
    //let listQ = req.query.id;//게시판 아이디
    let postId = req.body.no;//게시글 아이디
    let loged = req.session.passport;//세션 패스포트
    let password = req.body.pass;//패스워드
    if(password===null)
    {
        if(loged===undefined)//로그인안했으면
        {
            res.send({result:false,msg:'잘못된접근입니다'});//삭제안함
            return;
        }
        let userId = loged.user;
        let isthere = await Post.findOne({where:{post_id:postId,user_id:userId}});//postId는 유일함 userId로 다시 검증
        if(isthere===null)//다른사람이 삭제요청 할때
        {
            res.send({result:false,msg:'잘못된접근입니다'});//그땐 삭제안함
            return;
        }
        await Post.destroy({where:{post_id:postId}});
        console.log(postId+"번 게시글 삭제됨");
        res.send(true);
        return;
    }
    else
    {
       let isthere = await Post.findOne({where:{post_id:postId,password:password}});
       console.log(isthere);
       if(isthere===null)
       {
           res.send({result:false,msg:'비밀번호가 틀렸습니다'});
           return;
       }
       await Post.destroy({where:{post_id:postId}});
        console.log(postId+"번 게시글 삭제됨");
        res.send({result:true});
        return;
    }
    
});
router.route('/check').post(async (req,res,next)=>
{
    let no = req.body.no;//게시글 아이디
    let temp = await Post.findOne({where:{post_id:no},attributes:['user_id'],raw:true});
    let isLogedAuthor = temp.user_id;
    if(isLogedAuthor===null)
    {
        res.send({result:'pass'});//익명의 게시글
    }
    else
    {
        if(req.session.passport===undefined)
        {
            res.send({result:false});//다른 사용자가 쓴 게시글
        }
        else
        {
            let userId = req.session.passport.user;
            res.send({result:isLogedAuthor===userId});
        }
    }
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

module.exports = router;