(function(berghain2) {

    'use strict';

    var Config = function() {


        var constructor = function Config() {

            // toggle the debug settings
            this.debug = true;
            this.skipIntro = true;
           
        };




        return constructor;

    }();


    berghain2.Config = Config;

})(window.berghain2 = window.berghain2 || {});