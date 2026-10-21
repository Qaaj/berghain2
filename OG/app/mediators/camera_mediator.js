(function (berghain2) {
    'use strict';

    berghain2.CameraMediator = function (target, camera_model, lo, dispatcher, game, state_model) {

        lo.g("MEDIATOR", "Camera mediator instantiated", target);

        var self = this;

        this.bufferWidth = game.width / 3.0;
        this.bufferHeight = game.height / 3.0;

        this.smoothCamera = 7.0; //the lower, the smoother

        game.camera.x = camera_model.cameraX;
        game.camera.y = camera_model.cameraY;

        var cameraTarget = camera_model.cameraTarget;
        var currentState = state_model.currentState;

        var update = function (event) {
            cameraTarget = camera_model.cameraTarget;
            currentState = state_model.currentState;

            if (typeof (camera_model.cameraTarget != 'undefined')) {

                var leftBorder;
                var rightBorder;

                var xOffset = 0;

                if (currentState.name != state_model.PLAYER_INSIDE.name) {
                    leftBorder = game.camera.x + self.bufferWidth;
                    rightBorder = game.camera.x + (game.width - self.bufferWidth);

                    xOffset = 0;

                    if (cameraTarget.x > rightBorder) {
                        xOffset = (cameraTarget.x - rightBorder);
                    }

                    if (cameraTarget.x < leftBorder && game.camera.x > 0) {
                        xOffset = (cameraTarget.x - leftBorder);
                    }

                    if (xOffset != game.camera.x) {
                        //smooth offset
                        var elapsedTime = Math.min(game.time.elapsedMS / 1000.0 * self.smoothCamera, 1);
                        var diffX = xOffset * elapsedTime;
                        game.camera.x += diffX;
                    }

                } else if (currentState.name == state_model.PLAYER_INSIDE.name) {
                    
                    
                    this.bufferWidth = game.width / 2.0;
                    this.bufferHeight = game.height / 2.0;
                    
                      leftBorder = game.camera.x + self.bufferWidth;
                    rightBorder = game.camera.x + (game.width - self.bufferWidth);
                    

                    /*leftBorder = 0;
                    rightBorder = 0;*/
                    xOffset = 0;

                    var topBorder = game.camera.y + self.bufferHeight;
                    var bottomBorder = game.camera.y + (game.height - self.bufferHeight);

                    var yOffset = 0;

                    if (cameraTarget.y > rightBorder) {
                        xOffset = (cameraTarget.x - rightBorder);
                    }

                    if (cameraTarget.x < leftBorder && game.camera.x > 0) {
                        xOffset = (cameraTarget.x - leftBorder);
                    }

                    if (cameraTarget.y > bottomBorder) {
                        yOffset = (cameraTarget.y - bottomBorder);
                    }

                    if (cameraTarget.y < topBorder && game.camera.y > 0) {
                        yOffset = (cameraTarget.y - topBorder);
                    }

                    var elapsedTime = Math.min(game.time.elapsedMS / 1000.0 * self.smoothCamera, 1);

                    if (xOffset != game.camera.x) {
                        //smooth offset
                        
                        var diffX = xOffset * elapsedTime;
                        game.camera.x += diffX;
                    }

                    if (yOffset != game.camera.y) {
                        //smooth offset
                        
                        var diffY = yOffset * elapsedTime;
                        game.camera.y += diffY;
                    }
                    
                    game.camera.x = cameraTarget.x;
                    game.camera.y = cameraTarget.y;
                }


            }

            camera_model.cameraX = game.camera.x;
            camera_model.cameraY = game.camera.y;
        }

        dispatcher.addEventListener('game_update', update);
    };


})(window.berghain2 = window.berghain2 || {});