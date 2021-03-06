(function(berghain2) {

    'use strict';

    var PlayerModel = function(dispatcher, input, lo, config, game) {
        
        lo.g("MODEL", "Player Model Initiated");

        this.dispatcher = dispatcher;
        this.isAlive = true;

        this.xPosition = 0;
        this.yPosition = 0;

        this.health = 100;
        this.mana = 5;
    };

    PlayerModel.prototype = {
        get health() {
            return this._health;
        },
        set health(val) {
        	if(val <= 0){
        		this.dispatcher.dispatch("player_death")
        	}
            this._health = val;
        }
    };

    berghain2.PlayerModel = PlayerModel;

})(window.berghain2 = window.berghain2 || {});