(function (berghain2) {

    'use strict';

    var MessageView = function () {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        var text;
        var currentTextTween;

        this.create = function(game, message) {
            text = game.add.bitmapText(0, 0, "carrier_command", message.text, message.type.fontSize);
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
                text.y = y - 15;
            }
        }
    };

    berghain2.MessageView = MessageView;

})(window.berghain2 = window.berghain2 || {});