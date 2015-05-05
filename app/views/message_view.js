(function (berghain2) {

    'use strict';

    var MessageView = function (game, message, dispatcher, player_notification_model) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        var text;
        var currentTextTween;

        create();

        function create() {
            text = game.add.bitmapText(0, 0, "carrier_command", "" + message.text, message.type.fontSize);
            //text.anchor.x = 0.5;
            text.updateText();

            currentTextTween = game.add.tween(text).to({
                alpha: 0,
            }, 4000, "Linear");
    	       
            currentTextTween.onComplete.add(onTextTweenCompleted, this);
            
            currentTextTween.start();
        }

        this.updatePosition = function (x, y) {
            text.x = x;
            text.y = y - 15;
        }
        
        function onTextTweenCompleted(tween){
            player_notification_model.isTweening = false;
            
            player_notification_model.removeLastMessageFromQue();
            
            currentTextTween.onComplete.remove(onTextTweenCompleted, this);

            dispatcher.dispatch("player_notification_tween_completed");          
        }
    };

    berghain2.MessageView = MessageView;

})(window.berghain2 = window.berghain2 || {});