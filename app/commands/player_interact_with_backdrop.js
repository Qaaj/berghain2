(function (berghain2) {

    'use strict';

    berghain2.PlayerInteractWithBackdropCommand = function (dispatcher, lo, config, game, input, state_model, message_type, message_model) {

        this.execute = function (event) {

            dispatcher.dispatch("destroy_player_notification");

            var target = event.params.target;
            var type = event.params.object.type;

            if (type == "DOOR") {                
                target.animations.play('go_inside');
                target.alpha = 1;
                game.add.tween(target).to({
                    alpha: 0
                }, 500, Phaser.Easing.Linear.None, true, 250).onComplete.add(function () {

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
                }, 500, Phaser.Easing.Linear.None, true, 250).onComplete.add(function () {

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
            } else if (type == "NPC") {

                target.animations.stop();
                target.frame = 40

                showPlayerNotification("npc");
                
                dispatcher.dispatch("change_player_state", {
                    type: "PHYSICS",
                    state: state_model.PLAYER_ZOMBIE
                });
            }

            setTimeout(function () {

                var txt = "...";

                if (event.params.object.npc.target.name == "cop") {
                    txt = "Keep your distance";
                    console.log(event.params.object.npc);
                    event.params.object.npc.doAction("Keep your distance");
                }

                if (event.params.object.npc.target.name == "smoker") txt = "...";
                if (event.params.object.npc.target.name == "weirdo") txt = "burp";
            
                showPlayerNotification(event.params.object.npc.target.name);

                dispatcher.dispatch("change_player_state", {
                    type: "PHYSICS",
                    state: state_model.PLAYER_GROUND
                });
            }, 1000);
        }

         function showPlayerNotification(interactableTargetName) {
            
            var jsonTextKey = "interactable.npc." + interactableTargetName.toLowerCase() + ".greet";
            
            var message = { text: jsonTextKey, messageType: message_type.LOCK_ON_PLAYER };
            dispatcher.dispatch("show_player_notification", message);
        }
    };

})(window.berghain2 = window.berghain2 || {});