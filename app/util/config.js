(function(berghain2) {

    'use strict';

    var Config = function() {


        var constructor = function Config() {

            // toggle the debug settings
            this.debug = false;
            this.skipIntro = false;

            this.useRandomSeed = false;
            this.seed = 451182; 
            
            this.locale = "en";           
        };

        return constructor;

    }();


    berghain2.Config = Config;

})(window.berghain2 = window.berghain2 || {});