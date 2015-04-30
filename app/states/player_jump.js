(function(anatomy) {

	'use strict';

	var Player_Jump = function(dispatcher,input,lo,config,state_model) {

		this.name = "Player jump state";
		
		this.update = function(target){
			


			if(target.body.touching.down || target.body.onFloor()){

				lo.g("PHYSICS","Change state to ground");

                dispatcher.dispatch("change_player_state", {data:state_model.PLAYER_GROUND});
			}

			if (input.goLeft) {
                target.frame = 27;
                target.position.x -= 2;
            }
            if (input.goUp) {
                // target.body.velocity.y = -300;
            }
            if (input.goRight) {
                target.frame = 22;
                target.position.x += 2;
            }
            if (input.goDown) {}

            if (!input.goLeft && !input.goRight) {
                target.animations.stop();
                target.frame = 23;
            }
		}
		
	};

	// ContentModel.prototype.clear = function() {
	// };

	berghain2.Player_Jump = Player_Jump;

})(window.berghain2 = window.berghain2 || {});