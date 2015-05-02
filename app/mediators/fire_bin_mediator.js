(function (berghain2) {

    'use strict';

    berghain2.FireBinMediator = function (target, game, dispatcher, mediators, lo, input, state_model) {

        lo.g("MEDIATOR", "FireBin mediator instantiated", target);


        target.animations.add('burn', [0,1,2], 10, true);
        
        target.animations.play('burn');

        dispatcher.addEventListener('game_update', function (event) {
            

        });
    };



})(window.berghain2 = window.berghain2 || {});