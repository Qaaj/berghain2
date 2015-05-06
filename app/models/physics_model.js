(function(berghain2) {

	'use strict';

	var PhysicsModel = function(dispatcher,input,lo,config,game) {

		lo.g("MODEL","Physics Model Initiated");

		// Variables
		this.environment = {};
		this.player = {};
		this.interactable = {};
		
		// Player physics
		this.player_jump_allowed = true;

		// Helper variables
		this.ground_height = 0;
		this.openDoors = [];

		// Helper functions
		var that = this;

		this.makeImmovable = function(target){
			// lo.g("PHYSICS","Making object immovable: " + target.name)
			game.physics.enable(target, Phaser.Physics.ARCADE);
			target.body.immovable = true;
            target.body.allowGravity = false;
            target.body.collideWorldBounds = false;
		}
 

		dispatcher.addEventListener('register_open_door', function (event) {
            that.openDoors.push(event.params);
        });
	};
	
	berghain2.PhysicsModel = PhysicsModel;

})(window.berghain2 = window.berghain2 || {});