(function (berghain2) {

    'use strict';

    var Player_Ground = function (dispatcher, input, lo, config, state_model, game, physics_model, message_type) {

        this.name = "Player ground state";
        this.isShowingPlayerNotification = false;

        this.update = function (target) {

            game.physics.arcade.collide(target, physics_model.environment, function () {
                if (target.body.touching.down == true) {

                }
                return;
            });

            game.physics.arcade.overlap(target, physics_model.interactable, function () {
                var message = { id: 1, text: "Too dark man", messageType: message_type.LOCK_ON_PLAYER };
                dispatcher.dispatch("show_player_notification", message);
                return;
            });

            if (!target.body.touching.down && !target.body.onFloor()) {
                dispatcher.dispatch("change_player_state", { type: "PHYSICS", state: state_model.PLAYER_JUMP });
            }

            if (input.goLeft) {
                target.animations.play('left');
                target.body.velocity.x = -200;
            }
            if (input.goUp) {
                if (physics_model.player_jump_allowed) target.body.velocity.y = -1000;
            }
            if (input.goRight) {
                target.animations.play('right');
                target.body.velocity.x = 200;
            }

            if (input.goDown) { }

            if (!input.goLeft && !input.goRight) {
                target.body.velocity.x = 0;
                target.animations.stop();
                target.frame = 2;
            }
        }

    };

    // ContentModel.prototype.clear = function() {
    // };

    berghain2.Player_Ground = Player_Ground;

})(window.berghain2 = window.berghain2 || {});