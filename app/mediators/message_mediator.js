(function (berghain2) {

    'use strict';

    berghain2.MessageMediator = function (target, game, dispatcher, mediators, lo, input, state_model,physics_model, config,player_model) {

        lo.g("MEDIATOR", "Message mediator instantiated", target);
 
        dispatcher.addEventListener('create', function (event) {

            /*if(event.params.type == "PHYSICS"){
                physics_state = event.params.state;
            }*/
            
            console.log("ttttesting");
            
        });
        
        dispatcher.addEventListener('game_update', function (event) {
            /*physics_state.update(target);
            
            player_model.xPosition = target.body.x;
            player_model.yPosition = target.body.y;
            
            if(target.body.y > game.height){
                player_model.health = 0;
            }*/
            
            target.updatePosition(player_model.xPosition, player_model.yPosition);
        });

        dispatcher.addEventListener('game_render', function (event) {
           
            //if(config.debug) game.debug.body(target);

        });

    };



})(window.berghain2 = window.berghain2 || {});