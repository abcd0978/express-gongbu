const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');
const MySqlStore = require('express-mysql-session')(session);

const passportConfig = require('./passport');
const pagesRouter = require('./routes/pages');
const authRouter = require('./routes/auth');
const validCheckRouter = require('./routes/validcheck');
const { sequelize } = require('./models');
dotenv.config();


const app = express();
passportConfig();

sequelize.sync({force: false})//true로하면 모델 수정 가능, 단 데이터 전부 지워짐.
    .then(()=>
    {
        console.log('db연결 성공');
    })
    .catch((err)=>
    {
        console.log(err);
    });
app.set('port',process.env.PORT||80);
app.use(morgan('dev'));//모건 개발자 버전으로 로그남기기
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret: process.env.SECRET,
    cookie:{
        httpOnly:true,
        maxAge: 1000*60*30,//30분
    },
    store: new MySqlStore({
        host: 'localhost',
        port: process.env.MYSQLPORT,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: 'dcinside'
    }),
    //name:"connect.sid",//이걸로 초기화 되어있음
}))
app.use(passport.initialize());
app.use(passport.session());

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

app.use('/',pagesRouter);
app.use('/auth',authRouter);
app.use('/validcheck',validCheckRouter);

app.use((req,res,next)=>
{
    res.status(404).send('하 안된다! 404');
});

app.listen(app.get('port'),()=>
{
    console.log(app.get('port')+'번 포트에서 대기중');
});