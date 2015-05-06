(function(berghain2) {

    'use strict';

    var Player_Ground = function(dispatcher, input, lo, config, state_model, game, physics_model) {

        this.name = "Player ground state";

        this.update = function(target) {

            var inFrontOfDoor = false;
            var inFrontOfUbahn = false;


            for (var i = 0; i < physics_model.interactable_background_objects.length; i++) {

                var object = physics_model.interactable_background_objects[i];
                var xpos = target.x + target.body.width;

                if (xpos > object.x + 5 && xpos < object.x + object.width - 5) {
                    if(object.type == "DOOR"){
                        inFrontOfDoor = true;
                        lo.g("PHYSICS", "PLAYER IN FRONT OF DOOR");
                    }
                    if(object.type == "UBAHN"){
                        inFrontOfUbahn = true;
                        lo.g("PHYSICS", "PLAYER IN FRONT OF UBAHN");
                    }      
                }

            }

            game.physics.arcade.collide(target, physics_model.environment, function() {
                if (target.body.touching.down == true) {

                }
                return;
            });


            if (!target.body.touching.down && !target.body.onFloor()) {

                lo.g("PHYSICS", "Change state to jump");

                dispatcher.dispatch("change_player_state", {
                    type: "PHYSICS",
                    state: state_model.PLAYER_JUMP
                });

            }

            var speed = 200;

            if (input.sprint) speed = 1000;

            if (input.goLeft) {
                target.animations.play('left');
                target.body.velocity.x = -1 * speed;
            }
            if (input.goUp) {
                if (physics_model.player_jump_allowed) target.body.velocity.y = -1000;
            }
            if (input.goRight) {
                target.animations.play('right');
                target.body.velocity.x = 1 * speed;
            }

            if (input.goDown) {}

            if (input.actionButton && !(input.goRight || input.goLeft)) {
                target.body.velocity.x = 0;


                if (inFrontOfDoor) {
                    dispatcher.dispatch("player_enter_building",{target:target});
                    
                } else {
                    target.frame = 40;

                }
            }

            if (!input.goLeft && !input.goRight && !input.actionButton) {
                target.body.velocity.x = 0;
                target.animations.stop();
                target.frame = 2;
            }
        }

    };

    // ContentModel.prototype.clear = function() {
    // };

    berghain2.Player_Ground = Player_Ground;

})(window.berghain2 = window.berghain2 || {});