(function (berghain2) {

    'use strict';

    berghain2.MessageMediator = function (target, game, dispatcher, mediators, lo, player_notification_model, player_model) {

        lo.g("MEDIATOR", "Message mediator instantiated", target);
    	
        var message = player_notification_model.currentMessage;
        
        target.create(game, message, player_model.xPosition, player_model.yPosition);        
        
        dispatcher.addEventListener('game_update', function (event) {
            if ( target ){
                target.updatePosition(player_model.xPosition, player_model.yPosition);
            }
        });
        
        dispatcher.addEventListener('destroy_player_notification', destroyPlayerNotification);  
        
        function destroyPlayerNotification(){                         
             if (target){                 
                 destroy();
            }    
        }      
        
       function destroy() {    	
            target.destroy();
             
            player_notification_model.isShowingNotification = false;
            
            dispatcher.removeEventListener('game_update');
            dispatcher.removeEventListener('destroy_player_notification', destroyPlayerNotification);
            
            player_notification_model.removeMessage(message);
            player_notification_model.currentMessage = null;
            
            target = null;
        }
    };



})(window.berghain2 = window.berghain2 || {});