$(function() {
    // if the user is logined
    var logined = false;
    
    // the available background colors for the user's messages
    var PANEL_COLORS = [
        'rgb(149,152,184)',
        'rgb(189,149,159)',
        'rgb(135,182,217)',
        'rgb(248,138,210)',
        'rgb(99,247,245)', 
        'rgb(255,255,255)',
        'rgb(162,230,91)'
    ];
    
    // the duration for the message to fade in
    var MESSAGE_FADE_IN_TIME = 180;
    
    // the input element of the login view
    var $loginInput = $('.login_input');
    // the element to contain the message list
    var $message_field = $('.message_field');
    // the list element to show message
    var $message_list = $('.message_list')
    // the input element ofthe message view
    var $message_input = $('.message_input');
    // the view of the login page
    var $loginView = $('.login_view');
    // the view of the message page
    var $messageView = $('.message_view');
    
    var myname = '';
    // the socket use to communicate with the server
    var socket = io.connect();
    
    // the controller of the logic of the chat room
    var chat = new Chat(socket);
    // specify the callback functions to call when receiving messages
    chat.setOnReceive(addUserMessage, addSystemMessage, addUserMessage);
    
    // add the users' message to the message list
    function addUserMessage(message){
        var $sender = $('<span>').addClass('message_from').append().text(message.name);
        var $time = $('<span>').addClass('message_time').append().text(message.time);
        var $text = $('<p>').addClass('message_text').append().text(message.text);
        var $title = $('<p>').addClass('message_title').append($sender,$time);
        var $element;
        // messages from the user himself will be shown on the right, messages from others will be shown on the left
        if(myname == message.name){
            $element = $('<li>').addClass('message_item self').append($title,$text);
        } else {
            $element = $('<li>').addClass('message_item others').append($title,$text);
        }
        $element.css('background', getUserColor(message.name));
        addMessageToField($element);
    }
    
    // add the system message to the message list
    function addSystemMessage(message){
        var $element = $('<p>').addClass('message_system').text(message.text);
        addMessageToField($element);
    }
    // add a message element to the message list
    function addMessageToField($element){
        $element.hide().fadeIn(MESSAGE_FADE_IN_TIME);
        $message_list.append($element);
        $message_list[0].scrollTop =  $message_list[0].scrollHeight;
    }
    // login
    function login(){
        var username = escape($loginInput.val().trim());
        if(username){
            myname = username;
            $loginInput.val('');
            $loginView.fadeOut(function(){
                chat.login(username);
                logined = true;
                $messageView.show();
                $message_input.focus();
            });
            
        }
    }
    // leave the room
    function leave(){
        chat.leave();
        logined = false;
        $messageView.fadeOut(function(){
            $message_list.empty();
            $loginView.show();
            $loginInput.focus();
        });
    }
    // send a message
    function sendMessage(){
        var message = escape($message_input.val().trim());
        if(message){
            $message_input.val('');
            chat.sendMessage(message);
        }
    }
    // make the text input clean, without html element
    function escape(text){
        return $('<div>').text(text).html();
    }
    // choose a color for the user as the background
    function getUserColor(username){
        var hash = 392873767;  
        for(var i = 0; i < username.length; i++) {  
            hash ^= ((hash << 5) + username.charCodeAt(i) + (hash >> 2));  
        }  
        return PANEL_COLORS[Math.abs(hash % 7)];
    }
    
    $(document).ready(function(){
        $(window).keydown(function (event) {
            // focus on the input field automatically when any key is pressed
            if(!event.ctrlKey && !event.metaKey && !event.altyKey){
                if(logined){
                    $message_input.focus();
                } else {
                    $loginInput.focus();
                }
            }
            // send the message or login automatically when "enter" is pressed
            if (event.which == 13) {
                if(logined)
                    sendMessage();
                else 
                    login();
            }
        });
        // leave the room when back is pressed
        $('.message_nav_back').click(function(){
            leave();
        });
    });
});