(function(berghain2) {

    'use strict';

    berghain2.PlayerDeathCommand = function(dispatcher, lo, config, game, input, player_model, physics_model, state_model) {

        this.execute = function(event) {

            if(player_model.isAlive){

            player_model.isAlive = false;   
            console.log("player is rekt");


            var player = physics_model.player;


            dispatcher.dispatch("change_player_state", {
                type: "PHYSICS",
                state: state_model.PLAYER_ZOMBIE
            });

            game.add.tween(player).to({
                alpha: 0,
            }, 250, Phaser.Easing.Linear.None, true).onComplete.add(function() {

                player.x = 0;
                player.y = 0;

                game.add.tween(player).to({
                    alpha: 1
                }, 500, Phaser.Easing.Linear.None, true, 250)

                // make health variable
                player_model.health = 100;
                player_model.isAlive = true;

            });

            }
        }

    };

})(window.berghain2 = window.berghain2 || {});