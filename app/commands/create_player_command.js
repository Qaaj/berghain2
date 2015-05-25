(function(berghain2) {
    'use strict';

    berghain2.CreatePlayerCommand = function(player_model, state_model, game_model, game, mediators, physics_model, lo) {
        this.execute = function(event) {

            lo.g("COMMAND", "Create Player Command executed", event.params);

            var player;

            console.log("> Currentstate = " + state_model.currentState.name);


            if (state_model.currentState.name == state_model.PLAYER_INSIDE.name) {

                lo.g("COMMAND", "Player created inside building, disabling gravity");

                player = game.add.sprite(player_model.xPosition, player_model.yPosition, 'punker_topdown');
                game.physics.enable(player, Phaser.Physics.ARCADE);

                // player.body.setSize(player.body.width - 60, player.body.height, 30, 1);
                player.animations.add('walk', [0, 1,2,3,4,5,6,7,8,9,10,11,12], 20, false);


                player.body.allowGravity = false;
                game.physics.arcade.gravity.y = 0;

                // player rotates around center in topdown view
                player.anchor.setTo(0.5, 0.5);

            } else {

                player = game.add.sprite(player_model.xPosition, player_model.yPosition, 'punker');

                game.physics.enable(player, Phaser.Physics.ARCADE);


                player.animations.add('left', [30, 31, 32, 33, 34, 35, 36, 37], 10, true);
                player.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17], 10, true);
                player.animations.add('walk_down', [40, 41, 42, 43, 44, 45, 46, 47], 10, false);
                player.animations.add('go_inside', [40, 41], 10, false);

                player.body.setSize(player.body.width - 60, player.body.height, 30, 1);

            }



            player.name = "Punker";

            // Change the dimensions of the body bounding box
            player.body.collideWorldBounds = true;

            physics_model.player = player;

            // Attach the mediator to the player
            mediators.create(berghain2.PlayerMediator, player);
        }
    };
})(window.berghain2 = window.berghain2 || {});