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
app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/public'));

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