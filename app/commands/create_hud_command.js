(function (berghain2) {

    'use strict';

    berghain2.CreateHudCommand = function (dispatcher, lo, config, game) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        this.execute = function (event) {

            lo.g("COMMAND", "Creating HUD");

            setScreenSettings();
            showIntroText();
            drawHealthBar();
        }
        
        function setScreenSettings(){
            screenWidth = game.width;
            centerX = screenWidth / 2;

            screenHeight = game.height;
            centerY = screenHeight / 2;
        }

        function showIntroText() {
            var text = game.add.bitmapText(centerX, 50, "carrier_command", "GET INTO BERGHAIN", 34);
                        
            // Setting text offset (to center) here text because I can 't do it in the add bitmapText constructor?
            text.x -= (text.width / 2)
        }

        function drawHealthBar() {
            var strokeColor = 0x332c3d;
            var strokeWidth = 2;

            var healthBarWidth = 250;
            var healthBarHeight = 15;

            var graphics = game.add.graphics(250, 20);

            graphics.lineStyle(strokeWidth, strokeColor, strokeWidth);
            graphics.moveTo(0, 0);
            graphics.lineTo(healthBarWidth, 0);

            graphics.lineStyle(strokeWidth, strokeColor, strokeWidth);
            graphics.moveTo(healthBarWidth, 0);
            graphics.lineTo(healthBarWidth, healthBarHeight);

            graphics.lineStyle(strokeWidth, strokeColor, strokeWidth);
            graphics.moveTo(healthBarWidth, healthBarHeight);
            graphics.lineTo(0, healthBarHeight);

            graphics.lineStyle(strokeWidth, strokeColor, strokeWidth);
            graphics.moveTo(0, healthBarHeight);
            graphics.lineTo(0, 0);

            graphics.x = centerX - (graphics.width / 2);
            graphics.y = screenHeight - 50;
        }
    };

})(window.berghain2 = window.berghain2 || {});