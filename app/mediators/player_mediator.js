(function (berghain2) {

    'use strict';

    berghain2.PlayerMediator = function (target, game, dispatcher, mediators, lo, input, state_model) {

        lo.g("MEDIATOR", "Player mediator instantiated", target);

        target.facingRight = true;

        // THIS HAS TO HAPPEN SOMEWHERE ELSE
        game.physics.arcade.gravity.y = 2500;
        game.physics.enable(target, Phaser.Physics.ARCADE);

        target.body.collideWorldBounds = true;


        target.animations.add('left', [30, 31, 32, 33, 34, 35, 36, 37], 10, true);
        target.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17], 10, true)

        // TODO add collisions with floor
        //window.env.enableBodyDebug = true;
        //console.log( window.env);
        
        var state = state_model.PLAYER_GROUND;

        dispatcher.addEventListener('change_player_state', function (event) {

            state = event.params.data;
            
        });
        
        dispatcher.addEventListener('game_update', function (event) {
            
            state.update(target);

        });
    };



})(window.berghain2 = window.berghain2 || {});