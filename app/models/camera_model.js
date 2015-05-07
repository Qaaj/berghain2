(function(berghain2) {

    'use strict';

    var CameraModel = function(lo) {

        lo.g("MODEL","Camera Model Initiated");
        this.cameraTarget = undefined;
        this.cameraX = 0;
        this.cameraY = 0;
    };

    berghain2.CameraModel = CameraModel;

})(window.berghain2 = window.berghain2 || {});