const passport = require('passport');
const local = require('./localStrategy');
const User = require('../models/user');

module.exports = () =>
{
    passport.serializeUser((user,done)=>
    {
        console.log('시리얼라이즈됨');
        done(null,user.user_id);
    });

    passport.deserializeUser((id,done)=>
    {
        console.log('디시얼라이즈됨');
        User.findOne({where:{user_id:id}})
        .then(user=>done(null,user))//req.user req.isAuthenticated === true user의 모든 정보를 저장한다.
        .catch(err=>done(err));
    });
    local();
};