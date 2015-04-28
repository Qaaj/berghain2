(function(berghain2) {

    'use strict';

    var Config = function() {


        var constructor = function Config() {

            // toggle the debug settings
            this.debug = false;
           
        };




        return constructor;

    }();


    berghain2.Config = Config;

})(window.berghain2 = window.berghain2 || {});