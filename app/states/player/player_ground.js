(function(berghain2) {

    'use strict';

    var Player_Ground = function(dispatcher, input, lo, config, state_model, game, physics_model) {

        this.name = "Player ground state";

        this.update = function(target) {

            var inFrontOfObject = false;
            var interaction_object = {};


            for (var i = 0; i < physics_model.interactable_background_objects.length; i++) {

                var obj = physics_model.interactable_background_objects[i];
                var xpos = target.x + target.body.width;

                if (xpos > obj.x + 5 && xpos < obj.x + obj.width - 5) {
                    inFrontOfObject = true;
                    interaction_object = obj;
                    if(interaction_object.type == "DOOR"){
                        lo.g("PHYSICS", "PLAYER IN FRONT OF DOOR");
                    }
                    if(interaction_object.type == "UBAHN"){
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


                if (inFrontOfObject) {
                    dispatcher.dispatch("player_interact_with_backdrop",{target:target,object:interaction_object});
                    
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