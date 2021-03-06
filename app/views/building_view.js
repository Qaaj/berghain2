(function(berghain2) {

    'use strict';

    var BuildingView = function(game, lo, props, rnd,params,dispatcher) {

        lo.g("VIEW", "CREATING BUILDING VIEW");

        var xPos = props.x;
        var yPos = props.y;

        var fillColor = 0x4f4531;

        var colors = [0x4f4531, 0x362f20, 0x3f3c35, 0x5b5340, 0x493f27];

        var fillColor = colors[Math.floor(Math.random() * 5)];

        var fillAlpha = 1;

        var strokeColor = 0;
        var strokeWidth = 0;
        var strokeAlpha = 1;

        var width = props.w;
        var height = props.h;

        var house = drawRectangleWithStroke(xPos, yPos, width, height, fillColor, strokeColor, strokeWidth, fillAlpha);
        var topshading = drawRectangleWithStroke(xPos, yPos, width, 10, 0x000000, strokeColor, strokeWidth, 0.1);

        if (params.spacing == 0) { // side shading. Check if it's next to a building
            if (params.lastHeight >= props.h) {
                // if it's lower, dont shade
            } else {
                // if it's higher, shade a part
                drawRectangleWithStroke(xPos, yPos + 10, 10, height - 10 - params.lastHeight, 0x000000, strokeColor, strokeWidth, 0.2);
            }

        } else {
            drawRectangleWithStroke(xPos, yPos + 10, 10, height - 10, 0x000000, strokeColor, strokeWidth, 0.2);
        }


        var r = Math.random(); // position the door
        var doorOpening = drawRectangleWithStroke(xPos + 20 + r * (width - 120), yPos + height - 80, 60, 80, 0x000000, strokeColor, strokeWidth, 0.6);

        // IS the door open ?
        if (rnd.getRandom() == 250) // YES
        {
            // Register with the game as an open door
            dispatcher.dispatch("register_interactable_background_object",{type:"object.door",x:xPos + 20 + r * (width - 120),width:52});
            // Draw the shading
            var doorshading = drawRectangleWithStroke(xPos + 4 + 20 + r * (width - 120), yPos + 4 + height - 80, 52, 76, 0x000000, strokeColor, strokeWidth, 0.5);
        } else // NO
        {
            var door = drawRectangleWithStroke(xPos + 4 + 20 + r * (width - 120), yPos + 4 + height - 80, 52, 76, 0x3a3232, strokeColor, strokeWidth, 1);
        }



        //TODO add code for random doors/windows

        function drawRectangleWithStroke(xPos, yPos, width, height, fillColor, strokeColor, strokeWidth, alpha) {


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

            return graphics;
        }

    };

    berghain2.BuildingView = BuildingView;

})(window.berghain2 = window.berghain2 || {});