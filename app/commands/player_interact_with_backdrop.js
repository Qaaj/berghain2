(function(berghain2) {

    'use strict';

    berghain2.PlayerInteractWithBackdropCommand = function(dispatcher, lo, config, game, input, state_model) {

        this.execute = function(event) {


            var target = event.params.target;
            var type = event.params.object.type;

            if (type == "DOOR") {
                
                target.animations.play('go_inside');
                target.alpha = 1;
                game.add.tween(target).to({
                    alpha: 0
                }, 500, Phaser.Easing.Linear.None, true, 250).onComplete.add(function() {

                    lo.g("APPLICATION", "Switch to INSIDE BUILDING - state");
                    game.state.start('InBuilding');
                    dispatcher.dispatch("change_player_state", {
                        type: "PHYSICS",
                        state: state_model.PLAYER_GROUND
                    });

                    game.add.tween(target).to({
                        alpha: 1
                    }, 500, Phaser.Easing.Linear.None, true, 250)

                });
                dispatcher.dispatch("change_player_state", {
                    type: "PHYSICS",
                    state: state_model.PLAYER_ZOMBIE
                });

            } else if (type == "UBAHN") {
                target.animations.play('walk_down');
                target.alpha = 1;
                game.add.tween(target).to({
                    alpha: 0,
                    x: target.x + 20
                }, 500, Phaser.Easing.Linear.None, true, 250).onComplete.add(function() {

                    lo.g("APPLICATION", "Switch to INSIDE BUILDING - state");
                    game.state.start('InUbahn');
                    dispatcher.dispatch("change_player_state", {
                        type: "PHYSICS",
                        state: state_model.PLAYER_GROUND
                    });

                    game.add.tween(target).to({
                        alpha: 1
                    }, 500, Phaser.Easing.Linear.None, true, 250)

                });
                dispatcher.dispatch("change_player_state", {
                    type: "PHYSICS",
                    state: state_model.PLAYER_ZOMBIE
                });
            }



        }

    };

})(window.berghain2 = window.berghain2 || {});