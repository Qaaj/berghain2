(function (berghain2) {
    'use strict';

    berghain2.CameraMediator = function (target,  camera_model, lo, dispatcher, game) {
        lo.g("MEDIATOR", "Camera mediator instantiated", target);

        dispatcher.addEventListener('game_update', function (event) {
            if(typeof(camera_model.cameraTarget != 'undefined'))
            {
                lo.g("USER", "PLAYER POS ", camera_model.cameraTarget.xPosition);
                game.camera.x = camera_model.cameraTarget.xPosition - (game.width / 2.0);
            }
        });
    };


})(window.berghain2 = window.berghain2 || {});