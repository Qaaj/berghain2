(function (berghain2) {

    'use strict';

    berghain2.ShowPlayerNotificationCommand = function (lo, config, game, player_model, message_type, mediators, player_notification_model, dispatcher) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        var font = "carrier_command";
        var fontSize = 34;

        var text;

        var currentTextTween;
        var currentMessage;

        this.execute = function (event) {
            lo.g("COMMAND", "Show player notification: ");

            if (event.params) {
                currentMessage = event.params;
                
                lo.g("COMMAND", "Current player notification: " + event.params.text);
                
                player_notification_model.addMessage(currentMessage);
            }

            if (!player_notification_model.isTweening) {                
                if ( player_notification_model.messages[0] != null ){
                    player_notification_model.isTweening = true;
                    
                    currentMessage = player_notification_model.messages[0];
                    showMessage(currentMessage);   
                }
            }
        }

        function showMessage() {         
            // Show locked on player message
            setScreenSettings();
            createMessageThatLocksOnPlayerPosition(currentMessage);
        }

        function createMessageThatLocksOnPlayerPosition(currentMessage) {
            lo.g("COMMAND", "MESSAGE === " + currentMessage);
            
            // LOCK ON PLAYER MESSAGE
            var text = new berghain2.MessageView(game, currentMessage, dispatcher, player_notification_model);
            mediators.create(berghain2.MessageMediator, text);
        }

        function setScreenSettings() {
            screenWidth = game.width;
            centerX = screenWidth / 2;

            screenHeight = game.height;
            centerY = screenHeight / 2;
        }

        function StartTween() {
            currentTextTween.start();
        }         
    };

})(window.berghain2 = window.berghain2 || {});