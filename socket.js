const SocketIO = require('socket.io');

module.exports = (server)=>//파라미터로 익스프레스 서버를 받는다.
{
    const io = SocketIO(server,{path:'/socket.io'});

    io.on('connection',(socket)=>
    {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for']||req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속',ip,socket.id,req.ip);
        socket.on('disconnect',()=>
        {
            console.log('접속해제',ip,socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error',(error)=>
        {
            console.log(error);
        });
        socket.on('reply',(data)=>
        {
            console.log(data);
        });
        socket.interval=setInterval(()=>
        {
            socket.emit('news',"hello world too");
        },3000);
    });
}
