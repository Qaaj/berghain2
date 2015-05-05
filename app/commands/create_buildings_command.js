(function(berghain2) {

    'use strict';

    berghain2.CreateBuildingsCommand = function(game, dispatcher, lo, config, game_model, physics_model) {

        this.execute = function(event) {

            lo.g("COMMAND", "Create Buildings Command");

            var lastWidth = 0;
            var lastX = 0;
            var spacing;

            if (game_model.level == "NEUKOLLN") {

                lo.g("VIEW", "Creating NEUKOLLN Buildings");

                for (var i = 0; i < 20; i++) {

                	 spacing = Math.random() * 100;

                	 var props = {};
                	 props.w = 150 + Math.random()* 300;
                	 props.h = 300 + Math.random() * 300;
                	 props.x = spacing + lastX + lastWidth;
                	 props.y = game.height - physics_model.ground_height - props.h;
                	 
                	 lastX = props.x ;
                	 lastWidth = props.w;

                	 var building = new berghain2.BuildingView(game, lo, props);

                }



               

            }

        }

    };

})(window.berghain2 = window.berghain2 || {});