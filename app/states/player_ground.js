(function(anatomy) {

    'use strict';

    var Player_Ground = function(dispatcher, input, lo, config, state_model, game) {

        this.name = "Player ground state";

        this.update = function(target) {

        	game.physics.arcade.collide(target, window.env, function(){
                if(target.body.touching.down == true){
                   
                }
                return;
            });


            if (!target.body.touching.down && !target.body.onFloor()) {

                lo.g("PHYSICS", "Change state to jump");

                dispatcher.dispatch("change_player_state", {data:state_model.PLAYER_JUMP});

            }

            if (input.goLeft) {
                target.animations.play('left');
                target.position.x -= 2;
            }
            if (input.goUp) {
                target.body.velocity.y = -1000;
            }
            if (input.goRight) {
                target.animations.play('right');
                target.position.x += 2;
            }
            if (input.goDown) {}

            if (!input.goLeft && !input.goRight) {
                target.animations.stop();
                target.frame = 2;
            }
        }

    };

    // ContentModel.prototype.clear = function() {
    // };

    berghain2.Player_Ground = Player_Ground;

})(window.berghain2 = window.berghain2 || {});