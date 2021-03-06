var trcolor;
var chatForm = document.getElementById('chatform');
var fileinput = document.getElementById('file');
function make_room_table(rooms)//room정보를 받아서 테이블을 만듬
{
    let roomtable = document.getElementById("roomtable");
    if(roomtable.childElementCount>1)
    {
        let i = roomtable.childElementCount-1;
        while(i)
        {
            roomtable.deleteRow(1);
            i--;
        }
    }
    for(i=0;i<rooms.length;i++)
    {
        let temp_tr = document.createElement('tr');
        temp_tr.addEventListener('click',function()
        {
            get_into_room(temp_tr);
            trcolor = this;
        });
        let roomId = document.createElement('td');//방번호
        let roomName = document.createElement('td');//방이름
        let roomMax = document.createElement('td');//최대인원
        let roomPass = document.createElement('td');//비밀방 여부
        roomId.setAttribute("id","roomId");
        roomName.setAttribute("id","roomName");
        roomMax.setAttribute("id","roomMax");
        roomPass.setAttribute("id","roomPass");
        roomId.innerHTML=rooms[i].id;
        roomName.innerHTML=rooms[i].name;
        roomMax.innerHTML=rooms[i].people+"/"+rooms[i].max;
        roomPass.innerHTML= (rooms[i].ispass===1?"yes":"no");
        temp_tr.appendChild(roomId);
        temp_tr.appendChild(roomName);
        temp_tr.appendChild(roomMax);
        temp_tr.appendChild(roomPass);
        roomtable.appendChild(temp_tr);
    }
}

const roomSocket = io.connect("http://14.38.252.76:80/room",//80번포트->내 라즈베리파이로 포트포워딩 되어있음
{
    path:'/socket.io',
    transports:['websocket'],
});

const chatSocket = io.connect("http://14.38.252.76:80/chat",//80번포트->내 라즈베리파이로 포트포워딩 되어있음
{
    path:'/socket.io',
    transports:['websocket'],
});
function sendMessage(msg)//채팅을 보낼때
{
    chatSocket.emit('chat',msg);
}
function leaveRoom()
{
    chatSocket.emit('leaveRoom');
}
roomSocket.on('getRooms',(data)=>//방 정보를 받는다
{
    make_room_table(data);
});
chatSocket.on('message',(data)=>//채팅을 받을때
{
    if(data.message.img==="1")
    {
        console.log('이미지임');
        let senderName = data.userdata.user;//보낸 사람의 이름
        let senderColor = data.userdata.color;//보낸 사람의 색
        let msg = data.message.msg;//보낸 텍스트
        let chatBox = document.getElementsByClassName('chatbox')[0];
        let chatdiv = document.createElement('div');//채팅글 가장 바깥 div
        let namediv = document.createElement('div');
        let imgtag = document.createElement('img');
        imgtag.setAttribute('id','imgtag');
        chatdiv.setAttribute('id','chatdiv');
        namediv.innerHTML = senderName;
        namediv.style.color = senderColor;
        imgtag.src ='data:image/'+data.ex+';base64,'+data.message.msg;

        chatdiv.appendChild(namediv);
        chatdiv.appendChild(imgtag);
        chatBox.appendChild(chatdiv);
    }
    else//텍스트면
    {
        let senderName = data.userdata.user;//보낸 사람의 이름
        let senderColor = data.userdata.color;//보낸 사람의 색
        let msg = data.message.msg;//보낸 텍스트
        let chatBox = document.getElementsByClassName('chatbox')[0];
        let chatdiv = document.createElement('div');//채팅글 가장 바깥 div
        let namediv = document.createElement('div');
        let textdiv = document.createElement('div');

        chatdiv.setAttribute('id','chatdiv');
        namediv.innerHTML = senderName;
        namediv.style.color = senderColor;
        textdiv.innerHTML=msg;

        chatdiv.appendChild(namediv);
        chatdiv.appendChild(textdiv);
        chatBox.appendChild(chatdiv);
    }
})
chatSocket.on('error',(data)=>
{
    alert(data);
})
chatSocket.on('getRooms',(data)=>
{
    make_room_table(data);
})
chatSocket.on('roomimin',(data)=>//방에 성공적으로 들어가면 이것이 불림
{
    console.log(trcolor.childNodes[0].innerHTML+" "+ data);
    if(trcolor.childNodes[0].innerHTML === data)
    {
        trcolor.style.color="#a41ade";
    }
})
chatSocket.on('announce',(data)=>
{
    let senderName = data.userdata.user;//보낸 사람의 이름
    let senderColor = data.userdata.color;//보낸 사람의 색
    let msg = data.message;//보낸 텍스트

    let chatBox = document.getElementsByClassName('chatbox')[0];
    let nameSpan = document.createElement('span');
    let announcediv = document.createElement('div');

    nameSpan.innerHTML = senderName;
    nameSpan.style.color = senderColor;
    announcediv.innerHTML = msg;

    announcediv.insertBefore(nameSpan,announcediv.firstChild);
    announcediv.setAttribute('id','announcediv');
    chatBox.appendChild(announcediv);
});
function get_into_room(param)
{
    let roomId = param.childNodes[0].innerHTML;
    let isPass = param.childNodes[3].innerHTML==="yes" ? true : false;
    var passinserted = "";
    if(isPass)
    {
        passinserted = prompt('암호를 입력해주세요');
    }
    chatSocket.emit('joinRoom',roomId,passinserted);
}
function showform()
{
    let room_wrap = document.getElementsByClassName("rooms")[0];
    let create_room_button = document.getElementById('create_button');
    create_room_button.style.display = "none";
    
    let bre = document.createElement("br");

    let form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/createroom");
    form.setAttribute("id","create_room_form")

    let roomname = document.createElement("input");//방이름
    roomname.setAttribute("id", "roomname");
    roomname.setAttribute("type", "text");
    roomname.setAttribute("name", "roomname");
    roomname.setAttribute("placeholder", "방이름");

    let max_people = document.createElement("select");//최대 수용인원
    max_people.setAttribute("id", "max_people");
    max_people.setAttribute("type", "text");
    max_people.setAttribute("name", "max_people");
    max_people.setAttribute("value", 2);
    let opt2 = document.createElement("option");
    let opt3 = document.createElement("option");
    let opt4 = document.createElement("option");
    let opt5 = document.createElement("option");
    let opt6 = document.createElement("option");
    let opt7 = document.createElement("option");
    let opt8 = document.createElement("option");
    opt2.value=2;opt3.value=3;opt4.value=4;opt5.value=5;opt6.value=6;opt7.value=7;opt8.value=8;
    opt2.text="2명";opt3.text="3명";opt4.text="4명";opt5.text="5명";opt6.text="6명";opt7.text="7명";opt8.text="8명";
    max_people.add(opt2);
    max_people.add(opt3);
    max_people.add(opt4);
    max_people.add(opt5);
    max_people.add(opt6);
    max_people.add(opt7);
    max_people.add(opt8);

    let pass = document.createElement("input");//패스워드
    pass.setAttribute("id", "pass");
    pass.setAttribute("type", "text");
    pass.setAttribute("name", "pass");
    pass.setAttribute("placeholder", "비밀번호");

    let submit_button = document.createElement("button");//제출
    //submit_button.setAttribute("type", "submit");
    submit_button.setAttribute("type", "button");
    submit_button.setAttribute("name", "button_submit");
    submit_button.setAttribute("onclick","createRoom()");
    submit_button.innerHTML = "방만들기";

    let hide_form= document.createElement("button");//닫기
    hide_form.setAttribute("type", "button");
    hide_form.setAttribute("name", "hide_form");
    hide_form.setAttribute("onclick","hideform()");
    hide_form.innerHTML="닫기";
    
    form.appendChild(roomname);
    form.appendChild(bre.cloneNode());
    form.appendChild(max_people);
    form.appendChild(bre.cloneNode());
    form.appendChild(pass);
    form.appendChild(bre.cloneNode());
    form.appendChild(submit_button);
    form.appendChild(bre.cloneNode());
    form.appendChild(hide_form);
    room_wrap.insertBefore(form,room_wrap.childNodes[2]);
}
function hideform()
{
    let room_wrap = document.getElementsByClassName("rooms")[0];
    room_wrap.removeChild(document.getElementById('create_room_form'));
    document.getElementById('create_button').style.display = "";
}
function createRoom()//채팅 방 생성
{
    let roomname = document.getElementById("roomname").value;
    let max_people = document.getElementById("max_people").value;
    let pass = document.getElementById("pass").value;
    let room = {name: roomname, max: max_people, password: pass};//보안이슈 생길수도 있음
    if(roomname==="")
    {
        alert("방이름을 설정해주세요");
        return;
    }
    roomSocket.emit("create",room);
}
function refresh()
{
    roomSocket.emit('refresh');
}
chatForm.addEventListener('submit',(e)=>//전송 버튼을 눌렀을때
{
    e.preventDefault();
    let text = e.target.elements.text.value;//텍스트
    if(text!="")//무언가 쓰여져있다면
    {
        chatSocket.emit('chat',{msg:text,img:"0"});
        e.target.elements.text.value="";
    }
})
fileinput.addEventListener('change',(evt)=>//파일을 전송할때
{
    var fileName = fileinput.value;
    console.log(fileName);
    var fileLength = fileName.length;
    var lastDot = fileName.lastIndexOf('.');
    var fileEx = fileName.substring(lastDot+1,fileLength);
    console.log(fileEx);
    var file = fileinput.files[0];
    var reader = new FileReader();
    reader.onload = function()
    {
        
        const base64 = this.result.replace(/.*base64,/, '');
        //console.log(base64);
        chatSocket.emit('chat',{msg:base64,img:"1",ex:fileEx});
        fileinput.value="";
        console.log('보냄')
    }
    reader.readAsDataURL(file);
});