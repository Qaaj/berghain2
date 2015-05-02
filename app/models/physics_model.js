(function(berghain2) {

	'use strict';

	var PhysicsModel = function(dispatcher,input,lo,config,game) {

		lo.g("MODEL","Physics Model Initiated");

		// Variables
		this.environment = {};
		this.player = {};

		// Player physics
		this.player_jump_allowed = true;

		// Helper functions

		this.makeImmovable = function(target){
			lo.g("PHYSICS","Making object immovable: " + target.name)
			game.physics.enable(target, Phaser.Physics.ARCADE);
			target.body.immovable = true;
            target.body.allowGravity = false;
            target.body.collideWorldBounds = false;

		}



	};
	
	berghain2.PhysicsModel = PhysicsModel;

})(window.berghain2 = window.berghain2 || {});