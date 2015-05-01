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

        function drawManaBar() {
            var xPos = 0;
            var yPos = 0;
            
            var fillColor = 0x88d367;
            var fillAlpha = 100;
            
            var strokeColor = 0x332c3d;
            var strokeWidth = 2;
            var strokeAlpha = 1;

            var manaBarWidth = 250;
            var manaBarHeight = 5;

            drawRectangleWithStroke(xPos, yPos, manaBarWidth, manaBarHeight, fillColor, strokeColor, strokeWidth, strokeAlpha);
        }
        
        function drawHealthBar() {
            var xPos = 0;
            var yPos = 0;
            
            var fillColor = 0x88d367;
            var fillAlpha = 100;
            
            var strokeColor = 0x332c3d;
            var strokeWidth = 2;
            var strokeAlpha = 1;

            var healthBarWidth = 250;
            var healthBarHeight = 15;

            drawRectangleWithStroke(xPos, yPos, healthBarWidth, healthBarHeight, fillColor, strokeColor, strokeWidth, strokeAlpha);
        }
        
        function drawRectangleWithStroke(xPos, yPos, width, height, fillColor, strokeColor, strokeWidth, alpha){
            var graphics = game.add.graphics(xPos, yPos);

            graphics.lineStyle(strokeWidth, strokeColor, alpha);
            graphics.beginFill(fillColor, alpha);
            
            graphics.moveTo(0, 0);
            graphics.lineTo(width, 0);

            graphics.moveTo(width, 0);
            graphics.lineTo(width, height);

            graphics.moveTo(width, height);
            graphics.lineTo(0, height);

            graphics.moveTo(0, height);
            graphics.lineTo(0, 0);
            
            graphics.drawRect(0, 0, width, height);
            
            graphics.endFill();
            
            /*graphics.x = centerX - (graphics.width / 2);
            graphics.y = screenHeight - 50;*/
        }
    };

})(window.berghain2 = window.berghain2 || {});