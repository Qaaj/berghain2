(function(berghain2) {

    'use strict';

    var Config = function() {


        var constructor = function Config() {

            // toggle the debug settings
            this.debug = false;
            this.skipIntro = true;
            this.seed = "SEEDS ARE BADASS"; //Math.floor(Math.random() * 1000000);
           
        };




        return constructor;

    }();


    berghain2.Config = Config;

})(window.berghain2 = window.berghain2 || {});