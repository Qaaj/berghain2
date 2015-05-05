(function(berghain2) {

    'use strict';

    berghain2.CreateBackdropCommand = function(game, dispatcher, lo, config, game_model, physics_model, rnd) {

        this.execute = function(event) {

            lo.g("COMMAND", "Create Backdrop Command");

            var lastWidth = 0;
            var lastX = 0;
            var spacing = 0;

            // Backdrop can consist of BUILDINGS / FENCE / PARK / GRASS + TREES

            if (game_model.level == "NEUKOLLN") {

                lo.g("VIEW", "Creating NEUKOLLN Buildings");

                // 5000 PX is level width right now
                var lastItem = "shrubbery";

                var i = 0;

                while (lastX < 5000) {

                    var rand = rnd.getRandom();

                    var r = rnd.getRandom();

                   


                    if (lastItem == "fence") { // When the last item was a fence, there's a bigger chance that the next item will be a fence
                        
                        if (rand == 250) { // 25% chance to STOP the fence
                            var props = {};
                            props.w = 150 + Math.random() * 300;
                            props.h = 300 + Math.random() * 300;
                            props.x = spacing + lastX + lastWidth;
                            props.y = game.height - physics_model.ground_height - props.h;

                            lastX = props.x;
                            lastWidth = props.w;
                            spacing = 200;

                            var building = new berghain2.BuildingView(game, lo, props);
                            lastItem = "building";
                        } else { // 75% chance to continue the fence
                        	lastItem = "fence";
                            var fence = game.add.sprite(lastX + lastWidth, window.innerHeight - 64 - 126, 'fence');

                            lastX = fence.x;
                            lastWidth = fence.width;
                            spacing = 0;
                        }
                    }else if (lastItem == "building") { // When the last item was a building, there's a small chance that the next item will be a fence
                        if (rand == 200) { // 20% chance to make a fence
                           lastItem = "fence";
                            var fence = game.add.sprite(lastX + lastWidth, window.innerHeight - 64 - 126, 'fence');

                            lastX = fence.x;
                            lastWidth = fence.width;
                            spacing = 0;
                        } else if(rand == 250){ // 25% chance of shrubbery
                        	lastItem = "shrubbery";
                            var shrubbery = game.add.sprite(lastX + lastWidth, window.innerHeight - 64 - 134, 'shrubbery',Math.floor(Math.random() * 4));

                            lastX = shrubbery.x;
                            lastWidth = shrubbery.width;
                            spacing = 0;
                        }else{ // 80% chance of another building
                        	
                        	var rand2 = rnd.getRandom();
                        	var props = {};
                            props.w = 150 + Math.random() * 300;
                            props.h = 300 + Math.random() * 300;
                            props.x = spacing + lastX + lastWidth;
                            props.y = game.height - physics_model.ground_height - props.h;

                            lastX = props.x;
                            lastWidth = props.w;

                            // Are the buildings spaced from eachother?

                            if(rand2 == 200){
                            	spacing = 0; // 20% chance buildings are next to each other
                            }else{
                            	spacing = 100 + Math.random() * 200;
                            }

                            var building = new berghain2.BuildingView(game, lo, props);
                            lastItem = "building";

                        }
                    } else if (lastItem == "shrubbery"){

                    	if (rand == 250) { // 25% chance to STOP the shrubbery
                            var props = {};
                            props.w = 150 + Math.random() * 300;
                            props.h = 300 + Math.random() * 300;
                            props.x = spacing + lastX + lastWidth;
                            props.y = game.height - physics_model.ground_height - props.h;

                            lastX = props.x;
                            lastWidth = props.w;
                            spacing = 200;

                            var building = new berghain2.BuildingView(game, lo, props);
                            lastItem = "building";
                        } else { // 75% chance to continue the shrubbery
                        	lastItem = "shrubbery";

                            var shrubbery = game.add.sprite(lastX + lastWidth, window.innerHeight - 64 - 134, 'shrubbery',Math.floor(Math.random() * 4));

                            lastX = shrubbery.x;
                            lastWidth = shrubbery.width;
                            spacing = 0;
                        }

                    }

                     if(r == 100){
                    	 var lamp = physics_model.environment.create(lastX + Math.random() *100, window.innerHeight - 255, 'street_lamp', Math.floor(Math.random() * 4));
            			physics_model.makeImmovable(lamp)
            			lamp.body.setSize(10, 10, 15, 20);
                    }




                    i++;

                }





            }

        }

    };

})(window.berghain2 = window.berghain2 || {});