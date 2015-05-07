(function (berghain2) {
    'use strict';

    berghain2.CameraMediator = function (target,  camera_model, lo, dispatcher, game) {

        lo.g("MEDIATOR", "Camera mediator instantiated", target);
        var self = this;
        this.bufferWidth = game.width/3.0;
        this.smoothCamera = 7.0; //the lower, the smoother

        game.camera.x = camera_model.cameraX;
        game.camera.y = camera_model.cameraY;

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
                    //smooth offset
                    var elapsedTime = Math.min(game.time.elapsedMS/1000.0*self.smoothCamera,1);
                    var diffX = xOffset*elapsedTime;
                    game.camera.x += diffX;
                }
            }

            camera_model.cameraX = game.camera.x;
            camera_model.cameraY = game.camera.y;
        });

    };


})(window.berghain2 = window.berghain2 || {});