(function(anatomy) {

	'use strict';

	var StateModel = function(dispatcher,input,lo,config) {

		this.PLAYER_JUMP 	= new berghain2.Player_Jump(	dispatcher,input,lo,config,this);
		this.PLAYER_GROUND 	= new berghain2.Player_Ground(	dispatcher,input,lo,config,this);

		lo.g("MODEL","States created")
		
	};

	// ContentModel.prototype.clear = function() {
	// };

	berghain2.StateModel = StateModel;

})(window.berghain2 = window.berghain2 || {});