var new_comer = sessionStorage.setItem('status','new')
var new_comer = sessionStorage.getItem('status')
user_name = Cookies.get('nn')
var join_time = parseInt(Date.now()/1000,10)
var this_time = join_time*1000
var last_time = null
var pst
console.log(join_time)
var enter = document.getElementById('txt');
enter.addEventListener('keyup',function(event){
    if(event.keyCode===13){
        event.preventDefault();
        document.getElementById('btn').click();
    }
});
function uuid2(len, radix) {
    var chars, i, j, k, r, ref, ref1, uuid;
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    uuid = [];
    i = null;
    radix = radix || chars.length;
    if (len) {
      for (i = j = 0, ref = len; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        uuid[i] = chars[0 | Math.random() * radix];
      }
    } else {
      r = null;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = k = 0; k <= 36; i = ++k) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(ref1 = i === 19) != null ? ref1 : (r & 0x3) | {
            0x8: r
          }];
        }
      }
    }
    return uuid.join('');
};

var ws = new WebSocket(WEBSOCKET_URL);

ws.onopen=function(evt){
    heart_check()
}
ws.onmessage = function(evt){
    // console.log(evt.data)
    if (evt.data=='PONG'){
        heart_check()
    }else{
        recieve(name,evt.data)
        
    }
}

function heart_check(){
    message = "PING"
    if (ws!=null){
        setTimeout(function(){
            ws.send(message)
        },59000)
    }
}
if(ICON_ID==null){
    my_icon_id = 0
}
var my_icon_id = ICON_ID;

var last_recieve_time

function recieve(name,text){
    
    msg_list = JSON.parse(text)
    if(msg_list[3]==USER_ID){
        class_self = "self"
        box_align = 'align="right"'
    }else{
        class_self=''
        box_align=''
    }
    text_0=msg_list[0]

    if(text_0.indexOf("QINIUIMAGE//")>=0){
        // text_dom=document.createElement("img")
        text_dom_src="http://qiniu-test.ryankiu.tech/"+text_0.split("QINIUIMAGE//")[1]
        text_dom = "<img style=\"width:100%; max-width:300px; height:auto; max-height:300px;\" src=\""+text_dom_src+"\">"
    }else{
        text_dom = text_0
    }
    if(last_recieve_time==null){
        console.log('new timer')
        last_recieve_time = msg_send_time - 1200000
    }
    console.log('send time '+msg_list[6])
    console.log('last recieve time '+last_recieve_time)
    console.log(last_recieve_time-msg_list[6])

    if (msg_list[6] - last_recieve_time >=  1200000){
        console.log('trigger!')
        last_recieve_time = msg_list[6]
        var timer_data = parseInt(msg_list[6],10)
        var timer = new Date(timer_data)
        var hour = timer.getHours();
        var minute = timer.getMinutes();
        if (minute <10){
            minute = '0'+minute;
        }
        msg_list[6] = hour+':'+minute
        
    }else{
        msg_list[6] = ''
    } 
    $(".box[data-uuid="+msg_list[1]+"]").remove()
    var chat= '<div class="box" '+box_align+' data-uuid='+msg_list[1]+'>'+
"<div> <span class = 'time'>"+msg_list[6]+"</span></div>"+
"<div class='icon"+class_self+"'>" +
    '<img src="/static/img/icon/'+msg_list[4]+'.jpg">'+
'</div>' +
"<div class='info"+class_self+"'>" +
    '<span class="username'+class_self+'">'+msg_list[2]+'</span>' +
'</div>'+
"<div class='txt"+class_self+"'><p>"+text_dom+"</p></div>"+
     '<div class=seperator>'+
'</div>'+
"</div>"
    console.log('recieve')
    $('#msg').append(chat)
    $('#msg').scrollTop($('.box[data-uuid='+msg_list[1]+']')[0].offsetTop)
    
    

$(".loader[data-uuid="+msg_list[1]+"]").remove()

}

function sender(name,text,uuid_str){

    if(text.indexOf("QINIUIMAGE//")>=0){
        // text_dom=document.createElement("img")
        text_dom_src="http://qiniu-test.ryankiu.tech/"+text.split("QINIUIMAGE//")[1]
        text_dom = "<img src=\""+text_dom_src+"\">"
    }else{
        text_dom = text
    }
    var chat= '<div class="box" align="right" data-uuid="'+uuid_str+'">'+
"<div> <span class = 'time'>"+time+"</span></div>"+
"<div class='iconself'>" +
    '<img src="/static/img/icon/'+my_icon_id+'.jpg">'+
'</div>' +
"<div class='infoself'>" +
    '<span class="usernameself">'+name+'</span>' +
'</div>'+
"<div class='txtself'><p>"+text_dom+"</p><img class = 'loader' data-uuid ='"+uuid_str+"' src='/static/img/gear.png'></div>"+
     '<div class=seperator>'+
'</div>'+
"</div>"
console.log('sent')
$('#msg').append(chat)
}

var msg_send_time = Date.now()

var rtClock = new Date(msg_send_time)
var hour = rtClock.getHours();
var minute = rtClock.getMinutes();
if (minute <10){
    minute = '0'+minute;
}
var time = hour+':'+minute


function append_chat_history(text){
    
    msg_list = text
    if(msg_list[1]==USER_ID){
        class_self = "self"
        box_align = 'align="right"'
    }else{
        class_self=''
        box_align=''
    }
    text_0=msg_list[0]

    if(text_0.indexOf("QINIUIMAGE//")>=0){
        // text_dom=document.createElement("img")
        text_dom_src="http://qiniu-test.ryankiu.tech/"+text_0.split("QINIUIMAGE//")[1]
        text_dom = "<img style=\"width:100%; max-width:150px; height:auto; max-height:200px;\" src=\""+text_dom_src+"\">"
    }else{
        text_dom = text_0
    }
    var chat= '<div class="box" '+box_align+'>'+
"<div> <span class = 'time'>"+msg_list[3]+"</span></div>"+
"<div class='icon"+class_self+"'>" +
    '<img src="/static/img/icon/'+msg_list[4]+'.jpg">'+
'</div>' +
"<div class='info"+class_self+"'>" +
    '<span class="username'+class_self+'">'+msg_list[2]+'</span>' +
'</div>'+
"<div class='txt"+class_self+"'><p>"+text_dom+"</p></div>"+
     '<div class=seperator>'+
'</div>'+
"</div>"
    console.log('append chat history')
    $('#msg').prepend(chat)
    
}


$('body').on('click',"#btn",function(){
    msg_send_time = Date.now()
    console.log('time updatge!')
    console.log(msg_send_time)

    var text = $(".inputbox").val()
    uuid_str = uuid2(8,null)
    sender(name,text,uuid_str)
    $.ajax({
        type:'GET',
        url:'http://10.20.30.7:8888/api/test',
        data:{
            message: text,
            uuid:uuid_str,
            icon_id:my_icon_id,
            msg_send_time:msg_send_time
        },
        dataType:'json',
        success:function(data){
            
        },
        error:function(){
            alert('invalid url')
        }
    })
    $("#msg").scrollTop($('#msg').height())
    $('.inputbox').val('')
})


function refresh(evt) {
    var ref = document.querySelector('#ref')
    var touch = event.targetTouches(0)
    var y = touch.pageY;
    console(y)
    
}




