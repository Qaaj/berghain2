(function (berghain2) {

    'use strict';

    berghain2.ShowPlayerNotificationCommand = function (lo, config, game, player_model, message_type, mediators, player_notification_model) {

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
            lo.g("COMMAND", "Show message: " + event.params);

            if (event.params) {
                currentMessage = event.params;
                
                lo.g("COMMAND", "Show message: " + event.params.fontSize);
                
                player_notification_model.addMessage(currentMessage);
            }

            if (!player_notification_model.isTweening) {
                player_notification_model.isTweening = true;
                
                currentMessage = player_notification_model.messages[0];

                showMessage();
            }
        }

        function showMessage() {         
            // Show locked on player message
            setScreenSettings();
            createMessageThatLocksOnPlayerPosition();
        }

        function createMessageThatLocksOnPlayerPosition(message) {
            lo.g("COMMAND", "MESSAGE === " + message);
            
            // LOCK ON PLAYER MESSAGE
            var text = new berghain2.MessageView(game, message);
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

        function onTextTweenCompleted(tween) {
            player_notification_model.isTweening = false;

            removeMessageAndEventListener();

            if (player_notification_model.messages.length > 0) {
                showMessage();
            }
        }

        function removeMessageAndEventListener() {
            player_notification_model.removeLastMessageFromQue();
            currentTextTween.onComplete.remove(onTextTweenCompleted);
        }
         
    };

})(window.berghain2 = window.berghain2 || {});