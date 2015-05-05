(function (berghain2) {
    'use strict';

    berghain2.CameraMediator = function (target,  camera_model, lo, dispatcher, game) {
        lo.g("MEDIATOR", "Camera mediator instantiated", target);
        var self = this;
        this.tween = game.add.tween(game.camera).to( { x:0, y:0}, 1000, "Sine.easeInOut", false, -1, false);
        this.bufferWidth = game.width/6.0;

        dispatcher.addEventListener('game_update', function (event) {
            if(typeof(camera_model.cameraTarget != 'undefined'))
            {
                var leftBorder = game.camera.x  + self.bufferWidth;
                var rightBorder = game.camera.x  + (game.width-self.bufferWidth);
                var xOffset = 0;
                if(camera_model.cameraTarget.x > rightBorder)
                {
                    xOffset = (camera_model.cameraTarget.x - rightBorder);
                }

                if(camera_model.cameraTarget.x < leftBorder && game.camera.x > 0)
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