(function(berghain2) {

    'use strict';

    berghain2.CreateBuildingsCommand = function(dispatcher, lo, config, game_model) {

        this.execute = function(event) {

                lo.g("COMMAND","Create Buildings Command");

                if(game_model.level == "NEUKOLLN"){
                	lo.g("VIEW", "Creating NEUKOLLN Buildings");
                }

        }

    };

})(window.berghain2 = window.berghain2 || {});