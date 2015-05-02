(function (berghain2) {

    'use strict';

    berghain2.PlayerMediator = function (target, game, dispatcher, mediators, lo, input, state_model,physics_model) {

        lo.g("MEDIATOR", "Player mediator instantiated", target);


        // Add the player variable to our physics model
        physics_model.player = target;

        // THIS HAS TO HAPPEN SOMEWHERE ELSE
        game.physics.arcade.gravity.y = 2500;
        game.physics.enable(target, Phaser.Physics.ARCADE);

        target.body.collideWorldBounds = true;


        target.animations.add('left', [30, 31, 32, 33, 34, 35, 36, 37], 10, true);
        target.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17], 10, true)
        
        var physics_state = state_model.PLAYER_GROUND;

        dispatcher.addEventListener('change_player_state', function (event) {

            if(event.params.type == "PHYSICS"){
                physics_state = event.params.state;
            }
            
        });
        
        dispatcher.addEventListener('game_update', function (event) {
            
            physics_state.update(target);

        });
    };



})(window.berghain2 = window.berghain2 || {});