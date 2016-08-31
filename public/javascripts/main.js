$(function(){
    var MESSAGE_FADE_IN_TIME = 100;
    var LOGIN_VIEW_FADE_OUT_TIME = 230;
    
    
    var socket = io.connect();
    socket.on('message', function (data) {
        console.log(data);
        $('#messages').append(data.content.name + ' ' + data.content.time + ' ' + data.content.text  +'<br/>');
    });
    socket.on('leave_room',function(data) {
        alert('leave_room');
        alert(data.text);
    });
    $(document).ready(function(){
        $('#login_button').click(function(){
            socket.emit('login', {username: $('#login_username').val(), password: $('#login_password').val()});
        });
        $('#send_button').click(function(){
            alert($('#message_input').val());
            socket.emit('message', {text: $('#message_input').val()});
            //$('#messages').append($('#send-message').val() +'<br/>');
        });
    }); 
});