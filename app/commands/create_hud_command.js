(function(berghain2) {

    'use strict';

    berghain2.CreateHudCommand = function(dispatcher, lo, config, game) {

        this.execute = function(event) {

            lo.g("COMMAND", "Creating HUD");

            showIntroText();
        }

        function showIntroText() {
            var screenWidth = game.width;
            var centerX = screenWidth / 2;

            var screenHeight = game.height;
            var centerY = screenHeight / 2;

            var text = game.add.bitmapText(centerX, 50, "carrier_command", "GET INTO BERGHAIN", 34);
 
            
            // Setting text offset (to center) here text because I can 't do it in the add bitmapText constructor?
            text.x -= (text.width / 2)
        }

    };

})(window.berghain2 = window.berghain2 || {});