(function(berghain2) {
    'use strict';

    berghain2.CameraTargetCommand = function(game, player, camera_model,lo) {
        this.execute = function(event) {
            lo.g("COMMAND", "Camera Target set on: " + event.params.target.name);
            camera_model.cameraTarget = event.params.target;
            
            game.camera.follow(player);
        }
    };
})(window.berghain2 = window.berghain2 || {});

