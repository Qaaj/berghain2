(function(berghain2) {

	'use strict';

	var PlayerModel = function(dispatcher,input,lo,config,game) {
		lo.g("MODEL","Player Model Initiated");
		 
		 this.health = 100;
		 this.mana = 5;

	};
	
	berghain2.PlayerModel = PlayerModel;

})(window.berghain2 = window.berghain2 || {});