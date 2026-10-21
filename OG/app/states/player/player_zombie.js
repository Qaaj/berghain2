(function(berghain2) {

    'use strict';

    var Player_Zombie = function(dispatcher, input, lo, config, state_model, game, physics_model) {

        this.name = "Player zombie state - this is the state we give when we do not want the char to interact with user inputs";

        this.update = function(target) {

             game.physics.arcade.collide(target, physics_model.environment, function() {
                if (target.body.touching.down == true) {

                }
                return;
            });
           
        }

    };

    // ContentModel.prototype.clear = function() {
    // };

    berghain2.Player_Zombie = Player_Zombie;

})(window.berghain2 = window.berghain2 || {});