(function(anatomy) {

	'use strict';

	var Player_Ground = function(input,lo,config) {

		this.name = "Player ground state";
		
		this.update = function(target){
			
			if (input.goLeft) {
                target.animations.play('left');
                target.position.x -= 2;
            }
            if (input.goUp) {
                target.body.velocity.y = -300;
            }
            if (input.goRight) {
                target.animations.play('right');
                target.position.x += 2;
            }
            if (input.goDown) {}

            if (!input.goLeft && !input.goRight) {
                target.animations.stop();
                target.frame = 2;
            }
		}
		
	};

	// ContentModel.prototype.clear = function() {
	// };

	berghain2.Player_Ground = Player_Ground;

})(window.berghain2 = window.berghain2 || {});