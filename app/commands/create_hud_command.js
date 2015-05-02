(function(berghain2) {

    'use strict';

    berghain2.CreateHudCommand = function(dispatcher, lo, config, game, mediators) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        this.execute = function(event) {

            lo.g("COMMAND", "Creating HUD");

            setScreenSettings();
            showIntroText();

            var healthBar = new berghain2.HealthBarView(game, mediators);
        }


        function setScreenSettings() {
            screenWidth = game.width;
            centerX = screenWidth / 2;

            screenHeight = game.height;
            centerY = screenHeight / 2;
        }

        function showIntroText() {
            var text = game.add.bitmapText(centerX, 50, "carrier_command", "GET INTO BERGHAIN", 34);



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