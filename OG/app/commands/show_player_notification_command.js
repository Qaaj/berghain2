(function (berghain2) {

    'use strict';

    berghain2.ShowPlayerNotificationCommand = function (lo, config, game, player_model, text_model, mediators, player_notification_model, dispatcher) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        var font = "carrier_command";
        var fontSize = 34;

        var dispatchedMessage;
        var currentMessage;
    
        this.execute = function (event) {
            dispatchedMessage = event.params;
            var id = dispatchedMessage.text.toLowerCase();

            if (player_notification_model.currentMessage) {
                if (player_notification_model.currentMessage.id != id) {                    
                    dispatcher.dispatch("destroy_player_notification");
                    
                    createMessage();
                }
            }else{
                createMessage();
            }           
        }

        function createMessage() {
            var id = dispatchedMessage.text.toLowerCase();
            var text = text_model.localise("" + dispatchedMessage.text);
            var messageType = dispatchedMessage.messageType;
            
            currentMessage = new berghain2.MessageVO(id, text, messageType);

            player_notification_model.currentMessage = currentMessage;
            player_notification_model.addMessage(currentMessage);
            
            player_notification_model.isShowingNotification = true;
            
            showMessage();
        }

        function showMessage() {
            setScreenSettings();
            createMessageThatLocksOnPlayerPosition();
        }

        function setScreenSettings() {
            screenWidth = game.width;
            centerX = screenWidth / 2;

            screenHeight = game.height;
            centerY = screenHeight / 2;
        }

        function createMessageThatLocksOnPlayerPosition() {
            var text = new berghain2.MessageView();
            mediators.create(berghain2.MessageMediator, text);
        }
    };

})(window.berghain2 = window.berghain2 || {});