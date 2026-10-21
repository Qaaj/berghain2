(function(berghain2) {

    'use strict';

    berghain2.InitPhysicsCommand = function(lo, config, game, state_model, physics_model) {

        var player;

        this.execute = function(event) {
            lo.g("COMMAND", "Init physics command");

            player = physics_model.player;

            game.physics.startSystem(Phaser.Physics.ARCADE);
            
             if ( state_model.currentState.name == berghain2.StateModel.PLAYER_INSIDE){
                  game.physics.arcade.gravity.y = 0;
            } else{                
                  game.physics.arcade.gravity.y = 2500;
            }           
        }
    };

})(window.berghain2 = window.berghain2 || {});