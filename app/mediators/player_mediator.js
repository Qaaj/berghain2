(function(berghain2) {

    'use strict';

    berghain2.PlayerMediator = function(target, dispatcher, mediators, lo, input) {

        lo.g("MEDIATOR", "Player mediator instantiated", target);

        dispatcher.addEventListener('game_update', function(event) {
            if (input.goLeft) {
                lo.g("USER", "LEFT");
            }
            if (input.goUp) {
                lo.g("USER", "UP ");
            }
            if (input.goRight) {
                lo.g("USER", "RIGHT ");
            }
            if (input.goDown) {
                lo.g("USER", "DOWN ");
            }
        });

    };



})(window.berghain2 = window.berghain2 || {});