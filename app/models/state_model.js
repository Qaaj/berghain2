(function(berghain2) {

	'use strict';

	var StateModel = function(dispatcher,input,lo,config,game) {

		this.PLAYER_JUMP 	= new berghain2.Player_Jump(	dispatcher,input,lo,config,this,game);
		this.PLAYER_GROUND 	= new berghain2.Player_Ground(	dispatcher,input,lo,config,this,game);

		lo.g("MODEL","States created")

		console.log("11 " + dispatcher);

		/*this.BOOT = new berghain2.Boot(game,input);
		this.PLAYING = new berghain2.Playing(dispatcher,input,lo,config,game);	*/
		
		console.log("12");
	};

	// ContentModel.prototype.clear = function() {
	// };

	berghain2.StateModel = StateModel;

})(window.berghain2 = window.berghain2 || {});