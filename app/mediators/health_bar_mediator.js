(function(berghain2) {

    'use strict';

    berghain2.HealthBarMediator = function(target, game, dispatcher, mediators, lo, input, player_model) {

        lo.g("MEDIATOR", "Health Bar mediator instantiated @ " + player_model.health + " HP", target);

        dispatcher.addEventListener('game_update', function(event) {

            if (player_model.health <= 0) {
                dispatcher.dispatch("player_death");
                lo.g("EVENT", "Player is dead");
                target.width = 0;
                return;
            }
            target.width = 250 * (player_model.health / 100);

        });


    };



})(window.berghain2 = window.berghain2 || {});