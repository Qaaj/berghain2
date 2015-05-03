(function (berghain2) {

    'use strict';

    berghain2.ShowMessageCommand = function (lo, config, game, player_model, message_model, message_type, mediators) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        var font = "carrier_command";
        var fontSize = 34;

        var currentMessage;
        var currentTextTween;

        this.execute = function (event) {
            lo.g("COMMAND", "Show message: " + event.params.type);

            message_model.addMessage(event.params);

            if (!message_model.isTweening) {
                showMessage();
            }
        }

        function showMessage() {
            message_model.isTweening = true;

            setCurrentMessage();
            createMessageTween();
            
        }

        function setCurrentMessage() {
            currentMessage = message_model.messages[0];
        }

        function createMessageTween() {
            setScreenSettings();

            lo.g("COMMAND", "CREATE TWEEN AT FONT SIZE " + currentMessage.type.fontSize);

            var text;

            if (currentMessage.type != message_type.LOCK_ON_PLAYER) {
                text = game.add.bitmapText(centerX, 50, font, currentMessage.text, currentMessage.type.fontSize);
                text.updateText();
                text.x -= (text.width / 2);

                currentTextTween = game.add.tween(text).to({
                    alpha: 0
                }, 2000, "Linear");
                
                currentTextTween.onComplete.add(onTextTweenCompleted, this);
                
                StartTween();
            } else {
                // LOCK ON PLAYER MESSAGE
                var text = new berghain2.MessageView(game, currentMessage);
                mediators.create(berghain2.MessageMediator, text);
            }
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