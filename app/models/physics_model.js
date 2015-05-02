(function(berghain2) {

	'use strict';

	var PhysicsModel = function(dispatcher,input,lo,config,game) {

		lo.g("MODEL","Physics Model Initiated");

		this.environment = {};

	};
	
	berghain2.PhysicsModel = PhysicsModel;

})(window.berghain2 = window.berghain2 || {});