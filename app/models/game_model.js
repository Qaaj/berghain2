(function(berghain2) {

	'use strict';

	var GameModel = function(dispatcher,input,lo,config,game) {
		
		lo.g("MODEL","Game Model Initiated");
		
		this.level = "NEUKOLLN";

	};
	
	berghain2.GameModel = GameModel;

})(window.berghain2 = window.berghain2 || {});