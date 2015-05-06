(function(berghain2) {

	'use strict';

	var Player_Jump = function(dispatcher,input,lo,config,state_model,game,physics_model) {

		this.name = "Player jump state";
		
		this.update = function(target){
			
			game.physics.arcade.collide(target, physics_model.environment, function(){
                if(target.body.touching.down == true){
                    dispatcher.dispatch("change_player_state", {data:state_model.PLAYER_GROUND});
                }
                return;
            });

			if(target.body.touching.down || target.body.onFloor() || target.body.blocked.down){

				lo.g("PHYSICS","Change state to ground");

                dispatcher.dispatch("change_player_state", {type:"PHYSICS",state:state_model.PLAYER_GROUND});
			}

            var speed = 180;

            if(input.sprint) speed = 1000;

			if (input.goLeft) {
                target.frame = 27;
                target.body.velocity.x = -1 * speed;
            }
            if (input.goUp) {
                // target.body.velocity.y = -300;
            }
            if (input.goRight) {
                target.frame = 22;
                target.body.velocity.x = speed;
            }
            if (input.goDown) {}

            if (!input.goLeft && !input.goRight) {
                target.body.velocity.x = 0;
                target.animations.stop();
                target.frame = 23;
            }
		}
		
	};

	// ContentModel.prototype.clear = function() {
	// };

	berghain2.Player_Jump = Player_Jump;

})(window.berghain2 = window.berghain2 || {});