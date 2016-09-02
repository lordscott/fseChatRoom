$(function() {
    var logined = false;
    
    var MESSAGE_FADE_IN_TIME = 180;
    var LOGIN_VIEW_FADE_OUT_TIME = 230;
    
    var $loginInput = $('.login_input');
    var $message_field = $('.message_field');
    var $message_list = $('.message_list')
    var $message_input = $('.message_input');

    var $loginView = $('.login_view');
    var $messageView = $('.message_view');

    var socket = io.connect();
    
    function addUserMessage(message){
        var $sender = $('<span>').addClass('message_from').append().text(message.name);
        var $time = $('<span>').addClass('message_time').append().text(message.time);
        var $text = $('<p>').addClass('message_text').append().text(message.text);
        var $title = $('<p>').addClass('message_title').append($sender,$time);
        var $element = $('<li>').addClass('message_item').append($title,$text);
        addMessageToField($element);
    }
    
    function addSystemMessage(message){
        var $element = $('<li>').addClass('message_system').text(message.text);
        addMessageToField($element);
    }
    
    function addMessageToField($element){
        $element.hide().fadeIn(MESSAGE_FADE_IN_TIME);
        $message_list.append($element);
        $message_list[0].scrollTop =  $message_list[0].scrollHeight;
    }
    
    function login(){
        var username = escape($loginInput.val().trim());
        if(username){
            $loginInput.val('');
            socket.emit('login', { username: username });
            $message_input.focus();
            logined = true;
            $loginView.fadeOut();
            $messageView.show();
        }
    }
    function sendMessage(){
        var message = escape($message_input.val().trim());
        if(message){
            $message_input.val('');
            socket.emit('message', {text: message});
        }
    }
    
    function escape(text){
        return $('<div>').text(text).html();
    }
    
    socket.on('message', function (data) {
        console.log(data);
        switch(data.type){
            case 'message_user':
                addUserMessage(data.content);
                break;
            case 'message_system':
                addSystemMessage(data.content);//.text
                break;
            case 'message_user_multi':
                $.each(data.content, function(index,message){
                   addUserMessage(message);
                });
                break;
        }
    });
    
    
    $(document).ready(function(){
        $(window).keydown(function (event) {
            if(!event.ctrlKey && !event.metaKey && !event.altyKey){
                if(logined){
                    $message_input.focus();
                } else {
                    $loginInput.focus();
                }
            }
            
            if (event.which == 13) {
                if(logined)
                    sendMessage();
                else 
                    login();
            }
        });
    });
});