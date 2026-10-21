(function(berghain2) {

    'use strict';

    var StateModel = function(dispatcher, input, lo, config, game, physics_model, message_type) {

        this.PLAYER_JUMP = new berghain2.Player_Jump(dispatcher, input, lo, config, this, game, physics_model);
        this.PLAYER_GROUND = new berghain2.Player_Ground(dispatcher, input, lo, config, this, game, physics_model, message_type);
        this.PLAYER_ZOMBIE = new berghain2.Player_Zombie(dispatcher, input, lo, config, this, game, physics_model);
        this.PLAYER_INSIDE = new berghain2.Player_Inside(dispatcher, input, lo, config, this, game, physics_model, message_type);

        this.currentState = this.PLAYER_GROUND;
    	
		lo.g("MODEL" , "States created, current state = " + this.currentState.name);
    };

    Object.defineProperty(StateModel, 'currentState', {
        get: function() {
        	return StateModel.currentState;
        },

        set: function(newState) {
            StateModel.currentState = newState;
        }
    });

    berghain2.StateModel = StateModel;

})(window.berghain2 = window.berghain2 || {});