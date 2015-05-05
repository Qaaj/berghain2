(function (berghain2) {
    'use strict';

    berghain2.CameraMediator = function (target,  camera_model, lo, dispatcher, game) {
        var self = this;
        lo.g("MEDIATOR", "Camera mediator instantiated", target);

        this.tween = game.add.tween(game.camera).to( { x:0, y:0}, 1000, "Sine.easeInOut", false, -1, false);

        dispatcher.addEventListener('game_update', function (event) {
            if(typeof(camera_model.cameraTarget != 'undefined'))
            {
                var bufferWidth = game.width/6.0;
                var leftBorder = game.camera.x  + bufferWidth;
                var rightBorder = game.camera.x  + (game.width-bufferWidth);
                var xOffset = 0;
                if(camera_model.cameraTarget.x > rightBorder)
                {
                    xOffset = (camera_model.cameraTarget.x - rightBorder);
                }

                if(camera_model.cameraTarget.x < leftBorder && camera_model.cameraTarget.x > bufferWidth)
                {
                    xOffset = (camera_model.cameraTarget.x - leftBorder);
                }

                if(xOffset != game.camera.x)
                {
                    var speedMul = 10.0;
                    //smooth offset
                    var elapsedTime = Math.min(game.time.elapsedMS/1000.0*speedMul,1);
                    var diffX = xOffset*elapsedTime;
                    game.camera.x += diffX;
                }
            }
        });
    };


})(window.berghain2 = window.berghain2 || {});