(function (berghain2) {

    'use strict';

    var MessageView = function (game, message, dispatcher) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;
 
        var text;
 
        create();
 
        function create() {            
            text = game.add.bitmapText(message.x, message.y, "carrier_command", "" + message.text, message.type.fontSize);
            //text.anchor.x = 0.5;
            text.updateText();
            
            var currentTextTween = game.add.tween(text).to({
                    alpha: 0
                }, 2000, "Linear");
                
            currentTextTween.start();
        }
 
       this.updatePosition = function (x, y) {
            text.x = x - (text.width/2);
            text.y = y - 15;
        }
    };

    berghain2.MessageView = MessageView;

})(window.berghain2 = window.berghain2 || {});