const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const User = require('../models/user');
//로그인 로직은 여기서 구현된다.
module.exports = () =>
{
    passport.use(new LocalStrategy({
        usernameField: 'ID',//req.body.ID html바디안에 있는 input태그의 name과 같게 한다. usernameField라고 쓰는거 중요함 맘대로 바꾸면 안됨
        passwordField: 'PASS',//req.body.PASS passwordField라고 써야됨 맘대로 바꾸면 안됨
    }, async(ID,PASS,done)=>{
        try
        {
            console.log('아이디: '+ID+' 비번: '+PASS);
            const DoesUserexist = await User.findOne({where:{ID}});//아이디로 존재하는지 확인
            if(DoesUserexist)
            {
                const salt = DoesUserexist.salt;//유저의 솔트값 확인
                console.log('솔트: '+salt);
                const result = await crypto.createHash('sha512').update(PASS+salt).digest('hex');//입력된 비번을 해쉬함.
                if(result===DoesUserexist.pass)//해쉬한 비번이 저장된 비번과 일치하는지 확인
                {
                    console.log('성공');
                    done(null,DoesUserexist);//로그인이 성공시 유저객체 리턴
                }
                else//로그인이 실패시에 false와 실패 메세지 리턴
                {
                    console.log('불일치');
                    done(null,false,{message:'비번 불일치 또는 미가입자'});
                }
            }
            else//아이디가 보이지 않을 경우에 위와 같이 처리
            {
                console.log('미가입자');
                done(null,false,{message:'비번 불일치 또는 미가입자'});
            }
        }
        catch(err)
        {
            console.log(err);
            done(err);
        }
    }));
}