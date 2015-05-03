(function(berghain2) {

    'use strict';

    berghain2.ShowMessageCommand = function(lo, config, game, message_model) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;
        
        var font = "carrier_command";
        var fontSize = 34;
    	
        var currentMessage;
        var currentTextTween;
        
        this.execute = function(event) {
            lo.g("COMMAND", "Show message: " + event.params.text 	);

            currentMessage = event.params;
            
            message_model.addMessage(currentMessage);

            if (!message_model.isTweening){
                createMessageTween();
                StartTween();
            }
        }
        
        function createMessageTween(){
            setScreenSettings();
            
            var text = game.add.bitmapText(centerX, 50, font, currentMessage.text, fontSize);
            
            // Setting text offset (to center) here text because I can 't do it in the add bitmapText constructor?
            // There's a function you need to re-calculate the text bounds after updating the text > .updateText() could work
            text.updateText();
            text.x -= (text.width / 2)

            currentTextTween = game.add.tween(text).to({
                alpha: 0
            }, 2000, "Linear");
            
            currentTextTween.onComplete.add(onTextTweenCompleted, this);
        }

        function setScreenSettings() {
            screenWidth = game.width;
            centerX = screenWidth / 2;

            screenHeight = game.height;
            centerY = screenHeight / 2;
        }

        function StartTween() {
            message_model.isTweening = true;
            currentTextTween.start();
        }
        
        function onTextTweenCompleted(tween){
            lo.g("COMMAND", "Show message tween completed");
            
           message_model.isTweening = false;
            
            message_model.removeLastMessageFromQue();
            currentTextTween.onComplete.remove(onTextTweenCompleted);
            
            
            if(message_model.messages.length > 0){
                currentMessage = message_model.messages[0];
                createMessageTween();
                StartTween();
            }
        }
    };

})(window.berghain2 = window.berghain2 || {});