(function(anatomy) {

	'use strict';

	var StateModel = function(input,lo,config) {

		this.PLAYER_JUMP 	= new berghain2.Player_Jump(	input,lo,config);
		this.PLAYER_GROUND 	= new berghain2.Player_Ground(	input,lo,config);
		
	};

	// ContentModel.prototype.clear = function() {
	// };

	berghain2.StateModel = StateModel;

})(window.berghain2 = window.berghain2 || {});