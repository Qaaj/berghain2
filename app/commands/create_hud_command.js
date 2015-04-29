(function(berghain2) {

    'use strict';

    berghain2.CreateHudCommand = function(dispatcher, lo, config, game) {

        this.execute = function(event) {

            lo.g("COMMAND", "Creating HUD");
 
            console.log("++++++++++++++++++++++++++++");
        }

    };

})(window.berghain2 = window.berghain2 || {});