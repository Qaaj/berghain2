(function (berghain2) {

    'use strict';

    berghain2.ShowMessageCommand = function (lo, config, game, player_model, message_model, message_type, mediators, player_notification_model) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        var font = "carrier_command";
        var fontSize = 34;

        var text;

        var currentTextTween;

        this.execute = function (event) {
            //lo.g("COMMAND", "Show message: " + event.params.messageType.fontSize);

            decideWhichMessageToShow(event.params);
        }

        function decideWhichMessageToShow(message) {
            message_model.addMessage(message);
                 
    	       // Show regular title message
            if (!message_model.isTweening) {
                showMessage();
            }
        }

        function showMessage() {
            message_model.isTweening = true;

            setScreenSettings();
            createTitleMessage();
        }

        function createTitleMessage() {
            var currentMessage = message_model.messages[0];

            text = game.add.bitmapText(centerX, 50, font, currentMessage.text, currentMessage.type.fontSize);
            text.updateText();
            text.x -= (text.width / 2);
            text.fixedToCamera = true;

            currentTextTween = game.add.tween(text).to({
                alpha: 0
            }, 500, "Linear",true,1000);

            currentTextTween.onComplete.add(onTextTweenCompleted, this);

            StartTween();
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
            message_model.isTweening = false;

            removeMessageAndEventListener();

            if (message_model.messages.length > 0) {
                showMessage();
            }
        }

        function removeMessageAndEventListener() {
            message_model.removeLastMessageFromQue();
            currentTextTween.onComplete.remove(onTextTweenCompleted);
        }
    };

})(window.berghain2 = window.berghain2 || {});