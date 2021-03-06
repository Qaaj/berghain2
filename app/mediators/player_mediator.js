(function(berghain2) {

    'use strict';

    berghain2.PlayerMediator = function(target, game, dispatcher, mediators, lo, input, state_model, physics_model, config, player_model) {
        
        target.name = "Player";

        var currentState = state_model.currentState;

        dispatcher.dispatch('camera_target', {
            'target': target
        });

        var handleChangePlayerState = function(event) {
            if (event.params.type == "PHYSICS") {
                currentState = event.params.state;
            }
        }

        var handleGameUpdate = function(event) {
            currentState.update(target);

            player_model.xPosition = target.body.x;
            player_model.yPosition = target.body.y;

            if (target.body.y > game.height) {
                player_model.health = 0;
            }
        }

        var handleGameRender = function(event) {
            if (config.debug) game.debug.body(target);
        }

        dispatcher.addEventListener('change_player_state', handleChangePlayerState);
        dispatcher.addEventListener('game_update', handleGameUpdate);
        dispatcher.addEventListener('game_render', handleGameRender);

        var destroy = function() {
            lo.g("MEDIATOR", "player mediator is rekt");
            dispatcher.removeEventListener('change_player_state', handleChangePlayerState);
            dispatcher.removeEventListener('game_update', handleGameUpdate);
            dispatcher.removeEventListener('game_render', handleGameRender);
        }

        target.events.onDestroy.add(destroy, this);
    };



})(window.berghain2 = window.berghain2 || {});