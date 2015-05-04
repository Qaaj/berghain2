(function(berghain2) {
    'use strict';

    berghain2.CameraTargetCommand = function(camera_model,lo) {
        this.execute = function(event) {
            lo.g("COMMAND", "Camera Target Initted", event.params);
            camera_model.cameraTarget = event.params.target;
        }
    };
})(window.berghain2 = window.berghain2 || {});

