(function (berghain2) {

    'use strict';

    berghain2.FireBinMediator = function (target, game, dispatcher, mediators,player, lo, input, state_model, physics_model) {

        lo.g("MEDIATOR", "FireBin mediator instantiated");


        target.animations.add('burn', [0,1,2], 10, true);
        
        target.animations.play('burn');

        physics_model.makeImmovable(target);


        dispatcher.addEventListener('game_update', function (event) {

            game.physics.arcade.collide(target, physics_model.player, function(){
                   lo.g("PHYSICS","Player touching fire")
            });

        });
    };



})(window.berghain2 = window.berghain2 || {});