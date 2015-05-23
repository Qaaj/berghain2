(function(berghain2) {

    'use strict';

    berghain2.InitPhysicsCommand = function(lo, config, game, player_model, physics_model) {

        var player;

        this.execute = function(event) {
            lo.g("COMMAND", "Init physics command");

            player = physics_model.player;

            //console.log("> init player sprite physics: " + player.name);

            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.gravity.y = 2500;
     

        }

    };

})(window.berghain2 = window.berghain2 || {});