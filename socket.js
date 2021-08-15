const SocketIO = require('socket.io');
const fs = require('fs');
const path = require('path');
const Room = require('./models/room');
const User = require('./models/user');
module.exports = (server,app,sessionMid)=>//파라미터로 익스프레스 서버를 받는다.
{
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);//미들웨어 wrapper
    const getDB = async(model)=>
    {           
        return await model.findAll({  attributes:['id','name','max','ispass','people'],  raw:true});
    }
    const io = SocketIO(server,{path:'/socket.io',maxHttpBufferSize: 1e7,pingInterval: 25000, pingTimeout: 60000,});
    app.set('io',io);
    const room =io.of('/room');
    const chat = io.of('/chat');

    chat.use(wrap(sessionMid));//chat이 세션 미들웨어 사용

    room.on('connection',async (socket)=>
    {
        const ip = socket.request.headers['x-forwarded-for']||socket.request.connection.remoteAddress;
        console.log('room에 새로운 클라이언트 접속 ',ip,' ',socket.id,' ',socket.request.ip);
        socket.emit('getRooms',await getDB(Room));//접속시 방정보 송신
        socket.on('create',async (room)=>
        {
            if(room.password==="")
                room.ispass="0";
            else
                room.ispass="1";
            room.owner = socket.id;
            room.people = 0;
            await Room.create(room);
            socket.emit('getRooms',await getDB(Room));//방 생성시 방정보 송신
        });

        socket.on('disconnect',()=>
        {
            console.log('접속해제',ip,socket.id);
        });
        socket.on('refresh',async ()=>
        {
            socket.emit('getRooms',await getDB(Room));
        })
    });

    chat.on('connection',async (socket)=>
    {
        const ip = socket.request.headers['x-forwarded-for']||socket.request.connection.remoteAddress;
        console.log('chat에 새로운 클라이언트 접속 ',ip,' ',socket.id,' ',socket.request.ip);
        if(socket.request.session.passport != null)//로그인 했다면
        {   
            let userName = await User.findOne({where:{user_id:socket.request.session.passport.user}, raw:true});
            socket.who = {user:userName.name, color:socket.request.session.color};
        }
        else//로그인 안했다면
        {
            let temp =socket.id;
            socket.who = {user:temp.substr(0,6), color: socket.request.session.color};
        }
        console.log("who am I: "+ JSON.stringify(socket.who));
        socket.on('joinRoom',async (roomId,pass)=>
        {
            console.log("들어간방과 들어가려는방"+socket.room+" "+roomId);
            let flag = true;
            if(socket.room)//들어가있던 방이 있다면
            {
                if(socket.room===roomId)//이미 들어갔던 방과 들어가려는 방이 일치한다면
                {
                    socket.emit('error',"이미 들어간 방입니다.");
                    return;//종료
                }
                let temp = await Room.findOne({where:{id:socket.room}, raw:true});//들어갔던 방의 정보를 불러옴
                socket.broadcast.to(socket.room).emit('announce',{userdata:socket.who, message:"님이 나가셨습니다"});//먼저 나간다는 메세지를 뿌림
                socket.leave(socket.room);//그리고 방을 나감
                if((temp.people-1)<=0)//나갔는데 아무도 없을때
                {
                    await Room.destroy({where:{id:temp.id}});
                    console.log('아무도 없어서 방이 없어짐');
                }
                else//1명이상있을때
                {
                    await Room.update({people:temp.people-1}, {where:{id:temp.id}});
                }
                socket.room=null;
            }
            let temp = await Room.findOne({where:{id:roomId}, raw:true});
            let max = temp.max;//방의 최대인원
            let people = temp.people;//방의 현재인원수
            console.log(max+" "+people);
            if(pass!=temp.password)
            {
                socket.emit('error',"패스워드가 틀렸습니다");
                flag=false;
            }
            if(max===people)
            {
                socket.emit('error',"방의 인원이 가득 찼습니다.")
                flag = false;
            }
            if(this.toString(temp.id)===this.toString(roomId)&&flag)//방을 잘 찾았다면
            {
                console.log(socket.who.user+'가 방'+roomId+"번에 들어감");
                socket.join(roomId);
                socket.room = roomId;
                socket.broadcast.to(socket.room).emit('announce',{userdata:socket.who, message:"님이 들어오셨습니다"});
                await Room.update({people:people+1}, {where:{id:roomId}});
                socket.emit('getRooms',await getDB(Room));//방에들어가면 채팅방을 업데이트함
                socket.emit('roomimin',roomId);//자기가 들어간 방번호를 리턴함: 같은방 다시 들어가는거 방지
            }
        })
        socket.on('chat',async (msg)=>
        {
            if(msg.img==="1")//이미지라면
            {
                console.log("이미지들어옴");
                const buffer = Buffer.from(msg.msg,'base64');//버퍼에 저장
                socket.emit('message',{userdata:socket.who, message:{msg:buffer.toString('base64'),img:"1"},ex:msg.ex});
                console.log('나한테보냄');
                socket.broadcast.to(socket.room).emit('message',{userdata:socket.who, message:{msg:buffer.toString('base64'),img:"1"},ex:msg.ex});
                console.log('브로드캐스트함');
            }
            else
            {
                let data = {userdata:socket.who , message:msg};
                socket.broadcast.to(socket.room).emit('message',data);
                data.me=1;
                socket.emit('message',data);
            }
        })
        socket.on('leaveRoom', async()=>
        {
            let temp = await Room.findOne({where:{id:socket.room}, raw:true});
            console.log(temp.id+"번방 나가짐"+" 현재 "+(temp.people-1)+"명 있음");
            console.log(socket.room);
            socket.broadcast.to(socket.room).emit('announce',{userdata:socket.who, message:"님이 나가셨습니다"});
            socket.leave(socket.room);
            if((temp.people-1)<=0)//나갔는데 아무도 없을때
            {
                await Room.destroy({where:{id:temp.id}});
                console.log('아무도 없어서 방이 없어짐');
            }
            else//1명이상있을때
            {
                await Room.update({people:temp.people-1}, {where:{id:temp.id}});
            }
            socket.room=null;
            socket.emit('getRooms',await getDB(Room));
        })
        socket.on('disconnect',async (reason)=>
        {
            console.log('접속해제',ip,socket.id+' reason: '+reason);
            if(socket.room)//어딘가에 들어가 있었다면
            {
                let temp = await Room.findOne({where:{id:socket.room}, raw:true});
                console.log(temp.id+"번방 나가짐"+" 현재 "+(temp.people-1)+"명 있음");
                console.log(socket.room);
                socket.broadcast.to(socket.room).emit('announce',{userdata:socket.who, message:"님이 나가셨습니다"});
                socket.leave(socket.room);
                if((temp.people-1)<=0)//나갔는데 아무도 없을때
                {
                    await Room.destroy({where:{id:temp.id}});
                    console.log('아무도 없어서 방이 없어짐');
                }
                else//1명이상있을때
                {
                    await Room.update({people:temp.people-1}, {where:{id:temp.id}});
                }
                socket.room=null;
            }
        });
    });
}
