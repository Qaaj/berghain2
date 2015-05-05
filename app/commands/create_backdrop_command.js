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
                var lastItem = "fence";

                var i = 0;

                while (lastX < 5000) {

                    var rand = rnd.getRandom();


                    if (lastItem == "fence") { // When the last item was a fence, there's a bigger chance that the next item will be a fence
                        if (rand == 100) { // STOP the fence
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
                        } else { // continue the fence
                        	lastItem = "fence";
                            var fence = game.add.sprite(lastX + lastWidth, window.innerHeight - 64 - 126, 'fence');

                            lastX = fence.x;
                            lastWidth = fence.width;
                            spacing = 0;
                        }
                    }else

                     if (lastItem == "building") { // When the last item was a building, there's a small chance that the next item will be a fence
                        if (rand == 100) { // make a fence
                           lastItem = "fence";
                            var fence = game.add.sprite(lastX + lastWidth, window.innerHeight - 64 - 126, 'fence');

                            lastX = fence.x;
                            lastWidth = fence.width;
                            spacing = 0;
                        } else { // continue the fence
                        	
                        	var props = {};
                            props.w = 150 + Math.random() * 300;
                            props.h = 300 + Math.random() * 300;
                            props.x = spacing + lastX + lastWidth;
                            props.y = game.height - physics_model.ground_height - props.h;

                            lastX = props.x;
                            lastWidth = props.w;
                            spacing = 100 + Math.random() * 200;

                            var building = new berghain2.BuildingView(game, lo, props);

                        }
                    }






                    i++;

                }





            }

        }

    };

})(window.berghain2 = window.berghain2 || {});