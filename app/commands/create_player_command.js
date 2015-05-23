(function(berghain2) {
    'use strict';

    berghain2.CreatePlayerCommand = function(player_model, state_model, game_model, game, mediators, physics_model, lo) {
        this.execute = function(event) {
            lo.g("COMMAND", "Create Player Command executed", event.params);

            var player = game.add.sprite(player_model.xPosition, player_model.yPosition, 'punker');
            player.name = "Punker";
            game.physics.enable(player, Phaser.Physics.ARCADE);

             // Change the dimensions of the body bounding box
        	player.body.setSize(player.body.width - 60, player.body.height, 30, 1);
        	player.body.collideWorldBounds = true;

            player.animations.add('left', [30, 31, 32, 33, 34, 35, 36, 37], 10, true);
            player.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17], 10, true);
            player.animations.add('walk_down', [40, 41, 42, 43, 44, 45, 46, 47], 10, false);
            player.animations.add('go_inside', [40, 41], 10, false);

            physics_model.player = player;

            // Attach the mediator to the player
            mediators.create(berghain2.PlayerMediator, player);
        }
    };
})(window.berghain2 = window.berghain2 || {});