(function(berghain2) {

    'use strict';

    berghain2.PlayerMediator = function(target, game, dispatcher, mediators, lo, input, state_model, physics_model, config, player_model) {

        lo.g("MEDIATOR", "Player mediator instantiated", target);

        // Add the player variable to our physics model
        physics_model.player = target;

        // THIS HAS TO HAPPEN SOMEWHERE ELSE
        game.physics.arcade.gravity.y = 2500;
        game.physics.enable(target, Phaser.Physics.ARCADE);

        target.body.collideWorldBounds = true;

        // Change the dimensions of the body bounding box
        target.body.setSize(target.body.width - 60, target.body.height, 30, 1);

        target.animations.add('left', [30, 31, 32, 33, 34, 35, 36, 37], 10, true);
        target.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17], 10, true)

        var physics_state = state_model.PLAYER_GROUND;


        dispatcher.dispatch('camera_target', {'target':player_model});

        dispatcher.addEventListener('change_player_state', function (event) {
            if(event.params.type == "PHYSICS"){
                physics_state = event.params.state;
            }
        });

        dispatcher.addEventListener('game_update', function(event) {
            physics_state.update(target);

            player_model.xPosition = target.body.x;
            player_model.yPosition = target.body.y;

            if (target.body.y > game.height) {
                player_model.health = 0;
            }
        });

        dispatcher.addEventListener('game_render', function(event) {

            if (config.debug) game.debug.body(target);

        });
    };



})(window.berghain2 = window.berghain2 || {});