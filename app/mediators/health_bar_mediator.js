(function (berghain2) {

    'use strict';

    berghain2.HealthBarMediator = function (target, game, dispatcher, mediators, lo, input, player_model) {

        lo.g("MEDIATOR", "Health Bar mediator instantiated @ " + player_model.health + " HP", target);     
        
        dispatcher.addEventListener('game_update', function (event) {
            
            if (input.goLeft) {
                 lo.g("MEDIATOR", "Going left", target);       
                 
                           
            }
                        
        });        
    };



})(window.berghain2 = window.berghain2 || {});