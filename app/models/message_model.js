(function(berghain2) {

	'use strict';

	var MessageModel = function(dispatcher,input,lo,config,game) {
		lo.g("MODEL","Message Model Initiated");
		 
		 this.currentMessage = 100;
		 this.mana = 5;

	};
	
	berghain2.MessageModel = MessageModel;

})(window.berghain2 = window.berghain2 || {});