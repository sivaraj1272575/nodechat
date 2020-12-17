var socket = io.connect();
socket.on('connect', ()=>{
    console.log(socket.id);
    console.log(socket);
    socket.emit('control',{user: $user, socket: socket.id});
});

socket.on('data',function(dt){
var d = document.getElementById('print');
var s = "<img src='"+dt.profile+"' style='width:30px; height:30px'></img>";
var title = document.getElementById('title');
d.innerHTML = s;
d.innerHTML += dt._id+ dt.name+ dt.password;
});
function openfrnd(t){
    console.log(t);
    var x = document.getElementById(t).childNodes;
    var y = document.getElementById('title').childNodes;
    y[0].src = x[0].href;
    y[1].innerText = x[1].innerText;
    document.getElementById('chat_window').style.visibility='visible';
    socket.emit('getdata',{from: $user,to:t});
}
function sendmsg(){
    var s = document.getElementById('msg').value;
    if(s==="" || s===undefined|| s==null){
        alert('Write Something');
    }
    else{
        var new_msg = {
            content: s,
            sender: $user,
            date: Date()
        };
        socket.emit('new_message',new_msg);
        addMsg(new_msg);
        document.getElementById('msg').value = "";
    }
}
var chatbox = document.getElementById('messages');
var cur_date;
var cur_month;


function getSenderMsg(msg){
    var st = String(msg.date);
    temp = "<span class='badge badge-success send' style='float: right'><p class='chat'>"+msg.content+"</p><p class='time'>"+st.slice(16,21)+"</p></span></br></br>";
    return temp;
}

function getRecvMsg(msg){
    var st = String(msg.date);
    temp = "<span class='badge badge-primary recv' style='float: left'><p class='chat'>"+msg.content+"</p><p class='time'>"+st.slice(16,21)+"</p></span></br></br>";
    return temp;
}

function addMsg(msg){
    var st = String(msg.date);
    var mon = st.slice(4,7);
    var dt = st.slice(8,10);
    if(cur_date===dt && cur_month===mon){}
    else{
        cur_month = mon;
        cur_date = dt;
        temp = "<div class='dt'><p>"+cur_date+" "+cur_month+"</p></div>";
        chatbox.innerHTML+=temp;
    }
    var t;
    if(msg.sender ===$user){
        t= getSenderMsg(msg);
    }
    else{
        t = getRecvMsg(msg);
    }
    chatbox.innerHTML +=t;
}


socket.on('old_message',(data)=>{
    cur_date=0;
    cur_month ='KLKS';
    console.log(data);
    var msgs = data.messages;
    for(i=0;i<msgs.length;i++){
        addMsg(msgs[i]);
    }
});

socket.on('message',(data)=>{
    addMsg(data);
});