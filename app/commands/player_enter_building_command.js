(function(berghain2) {

    'use strict';

    berghain2.PlayerEnterBuildingCommand = function(dispatcher, lo, config, game, input,state_model) {

        this.execute = function(event) {

            var target = event.params.target;
            target.animations.play('go_inside');
            target.alpha = 1;
            game.add.tween(target).to({
                alpha: 0
            }, 500, Phaser.Easing.Linear.None, true, 250).onComplete.add(function() {
                lo.g("APPLICATION","Switch to INSIDE BUILDING - state");
            });
            dispatcher.dispatch("change_player_state", {
                type: "PHYSICS",
                state: state_model.PLAYER_ZOMBIE
            });

        }

    };

})(window.berghain2 = window.berghain2 || {});