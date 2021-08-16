const express = require('express');
const path = require('path');
const multer = require('multer');
const User = require('../models/user');//유저 스키마
const File = require('../models/file');//파일 스키마
const Post = require('../models/post');//게시글 스키마
const Comment = require('../models/comment');//댓글 스키마
const sequelize = require('sequelize');
const router = express.Router();

router.use(express.json()); //bodyParser관련(익스프레스 내장모듈)
router.use(express.urlencoded( {extended : true } ));//bodyParser관련
let lists = ['comps','sfw','nsfw'];//존재하는 게시판들

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
    let post =  await Post.findOne({where:{post_id:postNumber,wchboard:listQ},attributes:['title','content','ip','who','numOfCom','view','thmsup','thmsdwn','user_id',//게시글열람시 필요한 정보
    [sequelize.fn('date_format', sequelize.col('Post.createdAt'),'%Y-%m-%d %H:%i:%S'), 'createdAt']], raw:true, 
        include:[
        {
            model:User,
            attributes:['name']
        },
        ]
    });
    let comment = await Comment.findAll({where:{post_id:postNumber}, attributes:['id','comment','password','user_id','post_id','ip',
    'who',[sequelize.fn('date_format', sequelize.col('Comment.createdAt'),'%Y-%m-%d %H:%i:%S'), 'createdAt']], include:[{model:User,attributes:['name']}], raw:true});
    var realTitle = listQ==="comps"?realTitle="컴퓨터사이언스":realTitle=listQ;

    

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
            data.update = false;
            data.loginedName = null;
        }
        else//로그인을 했다면
        {
            viewer = req.session.passport.user;
            let viewerName = await User.findOne({where:{user_id:viewer},raw:true});
            data.loginedName = viewerName.name; //사용자가 로그인 했다면 그 이름: 여기 중요하다///////////////////////////////////
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
        }
        else//로그인을 했다면
        {
            viewer = req.session.passport.user;
            let viewerName = await User.findOne({where:{user_id:viewer},raw:true});
            data.loginedName = viewerName.name; //사용자가 로그인 했다면 그 이름: 여기 중요하다///////////////////////////////////
        }
    }


    res.render('posting',data);

});

router.route('/write').get((req,res,next)=>//글쓰기창에 들어감
{
    console.log(req.query.id);
    res.send('hello this is write');
})
router.route('/write').post((req,res,next)=>//글쓰기 요청
{
    console.log(req.query.id);
    res.send('hello this is write');
})

module.exports = router;