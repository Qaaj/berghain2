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
            var fillColor = 0x88d367;
            var fillAlpha = 100;
            
            var strokeColor = 0x332c3d;
            var strokeWidth = 2;
            var strokeAlpha = 1;

            var healthBarWidth = 250;
            var healthBarHeight = 15;

            var graphics = game.add.graphics(healthBarWidth, healthBarHeight);

            graphics.lineStyle(strokeWidth, strokeColor, strokeAlpha);
            graphics.beginFill(fillColor, fillAlpha);
            
            graphics.moveTo(0, 0);
            graphics.lineTo(healthBarWidth, 0);

            graphics.moveTo(healthBarWidth, 0);
            graphics.lineTo(healthBarWidth, healthBarHeight);

            graphics.moveTo(healthBarWidth, healthBarHeight);
            graphics.lineTo(0, healthBarHeight);

            graphics.moveTo(0, healthBarHeight);
            graphics.lineTo(0, 0);
            
            graphics.drawRect(0, 0, healthBarWidth, healthBarHeight);
            
            graphics.endFill();
            
            graphics.x = centerX - (graphics.width / 2);
            graphics.y = screenHeight - 50;
        }
    };

})(window.berghain2 = window.berghain2 || {});