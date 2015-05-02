(function(berghain2) {

	'use strict';

	var StateModel = function(dispatcher,input,lo,config,game,physics_model) {

		this.PLAYER_JUMP 	= new berghain2.Player_Jump(	dispatcher,input,lo,config,this,game,physics_model);
		this.PLAYER_GROUND 	= new berghain2.Player_Ground(	dispatcher,input,lo,config,this,game,physics_model);

		lo.g("MODEL","States created");
	};

	// ContentModel.prototype.clear = function() {
	// };

	berghain2.StateModel = StateModel;

})(window.berghain2 = window.berghain2 || {});