(function(berghain2) {

    'use strict';

    berghain2.ShowMessageCommand = function(lo, config, game) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;
        
        var font = "carrier_command";
        var fontSize = 34;
    	
        var text = "";
        
        this.execute = function(event) {
            lo.g("COMMAND", "Show message: " + event.params.text 	);

            text = event.params.text;
            
            setScreenSettings();
            showText(text);
        }

        function setScreenSettings() {
            screenWidth = game.width;
            centerX = screenWidth / 2;

            screenHeight = game.height;
            centerY = screenHeight / 2;
        }

        function showText(text) {
            var text = game.add.bitmapText(centerX, 50, font, text, fontSize);
            
            // Setting text offset (to center) here text because I can 't do it in the add bitmapText constructor?
            // There's a function you need to re-calculate the text bounds after updating the text > .updateText() could work
            text.updateText();
            text.x -= (text.width / 2)

            game.add.tween(text).to({
                alpha: 0
            }, 2000, "Linear", true);
        }
    };

})(window.berghain2 = window.berghain2 || {});