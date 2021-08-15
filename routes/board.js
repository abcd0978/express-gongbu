const express = require('express');
const path = require('path');
const multer = require('multer');
const User = require('../models/user');//유저 스키마
const File = require('../models/file');//파일 스키마
const Post = require('../models/post');//게시글 스키마
const Comment = require('../models/comment');//댓글 스키마
const {isNotLoggedIn, isLoggedIn} = require('./middlewares');//로그인여부 확인
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

router.route('/view').get((req,res,next)=>//글열람
{
    let postNumber = req.query.no;
    
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