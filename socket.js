const SocketIO = require('socket.io');

module.exports = (server,app)=>//파라미터로 익스프레스 서버를 받는다.
{
    const io = SocketIO(server,{path:'/socket.io'});
    app.set('io',io);

    const room =io.of('/room');
    const chat = io.of('/chat');

    room.on('connection',(socket)=>
    {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for']||req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속',ip,socket.id,req.ip);

        socket.on('disconnect',()=>
        {
            console.log('접속해제',ip,socket.id);
            clearInterval(socket.interval);
        });
    });

    chat.on('connection',(socket)=>
    {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for']||req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속',ip,socket.id,req.ip);

        socket.on('disconnect',()=>
        {
            console.log('접속해제',ip,socket.id);
            clearInterval(socket.interval);
        });
    });
}
