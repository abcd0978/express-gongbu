const express = require('express');
const path = require('path');

const router = express.Router();//라우터 받아옴
app = express();

app.use(express.json()); 
app.use(express.urlencoded( {extended : true } ));
router.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'../views','register.html'));
})


module.exports = router;