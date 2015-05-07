(function(berghain2) {

    'use strict';

    berghain2.NPCMediator = function(target, game, dispatcher, mediators, lo, input, state_model, physics_model, config, player_model) {

        lo.g("MEDIATOR", "NPC mediator instantiated", target);

        dispatcher.dispatch("register_interactable_background_object",{type:"NPC",x:target.x - 50,width:target.width + 50});

        // target.animations.add('go_inside', [40, 41], 10, false);


        var handleGameUpdate = function(event){
            
        }

        var handleGameRender = function(event){
            // if (config.debug) game.debug.body(target);
        }

        dispatcher.addEventListener('game_update', handleGameUpdate);
        dispatcher.addEventListener('game_render', handleGameRender);

        var destroy = function() {
            console.log("NPC mediator is rekt");
            dispatcher.removeEventListener('game_update',handleGameUpdate);
            dispatcher.removeEventListener('game_render',handleGameRender);
        }

        target.events.onDestroy.add(destroy, this);
    };



})(window.berghain2 = window.berghain2 || {});