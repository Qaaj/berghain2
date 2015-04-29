(function(berghain2) {

    'use strict';

    berghain2.CreateHudCommand = function(dispatcher, lo, config, game) {

        this.execute = function(event) {

            lo.g("COMMAND", "Creating HUD");
            
            var text = game.add.bitmapText(10, 100, "carrier_command", "GET INTO BERGHAIN", 34);
        }

    };

})(window.berghain2 = window.berghain2 || {});