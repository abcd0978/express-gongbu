const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');


const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const newRouter = require('./routes/new_person');
const LoginRouter = require('./routes/login');
const { sequelize } = require('./models');

const router = express.Router();//라우터 받아옴

const app = express();
sequelize.sync({force: false})
    .then(()=>
    {
        console.log('db연결 성공');
    })
    .catch((err)=>
    {
        console.log(err);
    });
app.set('port',process.env.PORT || 80);// 80
app.use(morgan('dev'));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret: "fuckyou",
    cookie:{
        httpOnly:true,
    },
    //name:'connet.sid' 이걸로 초기화 되어있음
}))

app.use(express.static(__dirname+'/views'));

/* 이거쓰면 static파일을 세션을 받은사람만 볼수 있게 할수 있다.
app.use('/',(req,res,next)=>{
    if(req.session.id)
    {
        app.use(express.static(__dirname+'/views'))(req,res,next)
    }
    else{
        next()
    }
})
*/
//app.use(express.static(__dirname+'/public'));

app.use('/',indexRouter);
app.use('/register',registerRouter);
app.use('/new',newRouter);
app.use('/login',LoginRouter);
app.use((req,res,next)=>
{
    res.status(404).send('하 안된다! 404');
});

app.listen(app.get('port'),()=>
{
    console.log(app.get('port')+'번 포트에서 대기중');
});