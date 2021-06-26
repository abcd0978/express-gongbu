const express = require('express');
const path = require('path');
const session = require('express-session');
const router = express.Router();

router.use(express.json()); 
router.use(express.urlencoded( {extended : true } ));

router.route('/')
.get((req,res,next)=>
{
    res.sendFile(path.join(__dirname,'../views','login.html'));
})

router.route('/submit').post(async(req,res)=>
{
    var response;
    try{
        console.log("아이디: "+req.body.ID);
        console.log("비번: "+req.body.PASS);
    }
    catch(err)
    {
        console.log(err);
    }
})

module.exports = router;