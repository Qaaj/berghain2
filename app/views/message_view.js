(function (berghain2) {

    'use strict';

    var MessageView = function () {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        var text;
        var currentTextTween;

        var yOffset = 15;
        
        this.create = function(game, message, x, y) {
            text = game.add.bitmapText(x, y - yOffset, "carrier_command", message.text, message.type.fontSize);
            //text.anchor.x = 0.5;
            text.updateText();
        }

        this.destroy = function () {
            if (text) {                
                text.destroy();
                text = null;
            }
        }

        this.updatePosition = function (x, y) {
            if (text) {
                text.x = x;
                text.y = y - yOffset;
            }
        }
    };

    berghain2.MessageView = MessageView;

})(window.berghain2 = window.berghain2 || {});