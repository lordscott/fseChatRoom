$(function() {
    var logined = false;
    
    var PANEL_COLORS = [
        'rgb(149,152,184)',
        'rgb(189,149,159)',
        'rgb(135,182,217)',
        'rgb(248,138,210)',
        'rgb(99,247,245)', 
        'rgb(255,255,255)',
        'rgb(162,230,91)'
    ];
    var MESSAGE_FADE_IN_TIME = 180;
    var LOGIN_VIEW_FADE_OUT_TIME = 230;
    
    var $loginInput = $('.login_input');
    var $message_field = $('.message_field');
    var $message_list = $('.message_list')
    var $message_input = $('.message_input');

    var $loginView = $('.login_view');
    var $messageView = $('.message_view');
    
    var myname = '';

    var socket = io.connect();
    
    function addUserMessage(message){
        var $sender = $('<span>').addClass('message_from').append().text(message.name);
        var $time = $('<span>').addClass('message_time').append().text(message.time);
        var $text = $('<p>').addClass('message_text').append().text(message.text);
        var $title = $('<p>').addClass('message_title').append($sender,$time);
        var $element;
        if(myname == message.name){
            $element = $('<li>').addClass('message_item self').append($title,$text);
        } else {
            $element = $('<li>').addClass('message_item others').append($title,$text);
        }
        $element.css('background', getUserColor(message.name));
        addMessageToField($element);
    }
    
    function addSystemMessage(message){
        var $element = $('<p>').addClass('message_system').text(message.text);
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
            myname = username;
            $loginInput.val('');
            $loginView.fadeOut(function(){
                socket.emit('login', { username: username });
                logined = true;
                $messageView.show();
                $message_input.focus();
            });
            
        }
    }
    
    function leave(){
        socket.emit('leave');
        logined = false;
        $messageView.fadeOut(function(){
            $message_list.empty();
            $loginView.show();
            $loginInput.focus();
        });
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
    
    function getUserColor(username){
        var hash = 392873767;  
        for(var i = 0; i < username.length; i++) {  
            hash ^= ((hash << 5) + username.charCodeAt(i) + (hash >> 2));  
        }  
        return PANEL_COLORS[Math.abs(hash % 7)];
    }
    
    socket.on('message', function (data) {
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
        $('.message_nav_back').click(function(){
            leave();
        });
    });
});