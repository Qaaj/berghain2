(function(berghain2) {

    'use strict';

    berghain2.InitPhysicsCommand = function(lo, config, game, player_model, physics_model) {

        var player;

        this.execute = function(event) {
            lo.g("COMMAND", "Init physics command");



            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.enable(event.params, Phaser.Physics.ARCADE);
            game.physics.arcade.gravity.y = 2500;
            
            //game.physics.arcade.enableBody(event.params);

            player = event.params;

            lo.g("COMMAND", " PLAYER = " + player);
            lo.g("COMMAND", " PLAYER BODY = " + player.body);

            // Change the dimensions of the body bounding box
            player.body.setSize(player.body.width - 60, player.body.height, 30, 1);
            player.body.collideWorldBounds = true;
           
            player = physics_model.player;

            player.animations.add('left', [30, 31, 32, 33, 34, 35, 36, 37], 10, true);
            player.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17], 10, true);
            player.animations.add('walk_down', [40, 41, 42, 43, 44, 45, 46, 47], 10, false);
            player.animations.add('go_inside', [40, 41], 10, false);
        }

    };

})(window.berghain2 = window.berghain2 || {});