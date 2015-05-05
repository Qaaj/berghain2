(function(berghain2) {

    'use strict';

    berghain2.CreateBackdropCommand = function(game, dispatcher, lo, config, game_model, physics_model, rnd) {

        this.execute = function(event) {

            lo.g("COMMAND", "Create Backdrop Command");

            // Backdrop can consist of BUILDINGS / FENCE / PARK / GRASS + TREES

            

            if (game_model.level == "NEUKOLLN") {

                lo.g("VIEW", "Creating NEUKOLLN Buildings");

                var i = 0;

                var params = {
                    lastX: 0,
                    lastWidth: 0,
                    spacing: 0,
                    lastItem: "fence",
                    bringToTop : [],
                    lastHeight: 0
                }

                while (params.lastX < 5000) { // 5000 PX is level width right now

                    // BEGIN CREATION LOOP

                    var rand = rnd.getRandom();

                    switch (params.lastItem) {

                        case "fence": // Last tile was a fence

                            if (rand == 250) // 25% to change to a building
                            {
                                params = this.createBuilding(params);
                            } else {
                                params = this.createFence(params); // 75% chance to continue the fence
                            }

                            break;

                        case "building": // Last tile was a building

                            if (rand == 250) // 25% to chance to be shrubbery
                            {
                                params = this.createShrubbery(params);
                            } else if (rand == 200) // 20% chance to be a fence
                            {
                                params = this.createFence(params);
                            } else // 55% chance to continue buildings
                            {
                                params = this.createBuilding(params);
                            }

                            break;

                        case "shrubbery": // Last tile was a park/shrubbery

                            if (rand == 250) // 25% to change to  a building
                            {
                                params = this.createBuilding(params);
                            } else {
                                params = this.createShrubbery(params); // 75% chance to continue the shrubbery
                            }

                            break;
                    }

                   


                    
                    if (rnd.getRandom() == 50) {
                        var lamp = physics_model.environment.create(params.lastX - 100  - Math.random() * 100, window.innerHeight - 255, 'street_lamp', Math.floor(Math.random() * 4));
                        physics_model.makeImmovable(lamp)
                        
                        lamp.body.setSize(10, 10, 15, 20);
                    }

                    i++;


                    // END CREATION LOOP

                }

                // Bring the environment back to top

                game.world.bringToTop(physics_model.environment);

                // Bring the items like the shrubbery in front of the environment
                for (var i = 0; i < params.bringToTop.length; i++) {
         			var sprite = params.bringToTop[i];
         			game.world.bringToTop(sprite);
            	}

            }

        }

        this.createShrubbery = function(params) {

            params.lastItem = "shrubbery";

            var shrubbery = game.add.sprite(params.lastX + params.lastWidth, window.innerHeight - 64 - 134, 'shrubbery', Math.floor(Math.random() * 4));

            params.bringToTop.push(shrubbery);

            params.lastX = shrubbery.x;
            params.lastWidth = shrubbery.width;
            params.spacing = 1;
            return params;
        }

        this.createBuilding = function(params) {
            var props = {};
            props.w = 150 + Math.random() * 300;
            props.h = 150 + Math.random() * 500;

            props.x = params.spacing + params.lastX + params.lastWidth;
            props.y = game.height - physics_model.ground_height - props.h;

            params.lastX = props.x;
            params.lastWidth = props.w;
          
            

            var building = new berghain2.BuildingView(game, lo, props, rnd, params);
             	// spacing for the next building or not?
           	if(rnd.getRandom() == 250){
           		params.spacing = 100;
           	}else{
           		params.spacing = 0;
           	}
           	params.lastHeight = props.h;
            params.lastItem = "building";

            return params;
        }


        this.createFence = function(params) {
            params.lastItem = "fence";
            var fence = game.add.sprite(params.lastX + params.lastWidth, window.innerHeight - 64 - 126, 'fence');

            params.lastX = fence.x;
            params.lastWidth = fence.width;
            params.spacing = 1;
            return params;
        }

    };

})(window.berghain2 = window.berghain2 || {});