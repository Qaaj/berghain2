(function(berghain2) {

    'use strict';

    var Player_Jump = function(dispatcher, input, lo, config, state_model, game, physics_model) {

        this.name = "Player jump state";

        var speed;

        this.update = function(target) {


            // 1. Collide with the world environment
            this.doCollisionWithEnvironmentAndCheckState(target);

            // 2. Update the players position according to key inputs
            this.updatePlayerPosition(target);


        }

        this.doCollisionWithEnvironmentAndCheckState = function(target) {
            game.physics.arcade.collide(target, physics_model.environment, function() {
                if (target.body.touching.down || target.body.onFloor() || target.body.blocked.down) {

                    lo.g("PHYSICS", "Change state to ground");

                    dispatcher.dispatch("change_player_state", {
                        type: "PHYSICS",
                        state: state_model.PLAYER_GROUND
                    });
                }

            });
        }
        
        this.updatePlayerPosition = function(target) {

            speed = 180;

            if (input.sprint) speed = 1000;

            if (input.goLeft) {
                target.frame = 27;
                target.body.velocity.x = -1 * speed;
            }
            if (input.goUp) {
                // target.body.velocity.y = -300;
            }
            if (input.goRight) {
                target.frame = 22;
                target.body.velocity.x = speed;
            }
            if (input.goDown) {}

            if (!input.goLeft && !input.goRight) {
                target.body.velocity.x = 0;
                target.animations.stop();
                target.frame = 23;
            }
        }

    };

    // ContentModel.prototype.clear = function() {
    // };

    berghain2.Player_Jump = Player_Jump;

})(window.berghain2 = window.berghain2 || {});