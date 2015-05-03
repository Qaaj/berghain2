(function (berghain2) {

    'use strict';

    berghain2.MessageMediator = function (target, game, dispatcher, mediators, lo, input, state_model,physics_model, config,player_model) {

        lo.g("MEDIATOR", "Message mediator instantiated", target);
    	
        dispatcher.addEventListener('game_update', function (event) {
            target.updatePosition(player_model.xPosition, player_model.yPosition);
        });
    };



})(window.berghain2 = window.berghain2 || {});