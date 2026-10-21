(function(berghain2) {

        'use strict';

        berghain2.PlayerInteractWithBackdropCommand = function(dispatcher, lo, config, game, input, state_model, message_type, message_model, text_model) {

            var interactedWithObject;

            this.execute = function(event) {

                dispatcher.dispatch("destroy_player_notification");

                var target = event.params.target;
                var type = event.params.object.type;
                interactedWithObject = event.params.object;

                if (type == "object.door") {

                    target.animations.play('go_inside');
                    target.alpha = 1;
                    game.add.tween(target).to({
                        alpha: 0
                    }, 500, Phaser.Easing.Linear.None, true, 250).onComplete.add(function() {

                        lo.g("APPLICATION", "Switch to INSIDE BUILDING - state");
                        game.state.start('InBuilding');
                        dispatcher.dispatch("change_player_state", {
                            type: "PHYSICS",
                            state: state_model.PLAYER_INSIDE
                        });

                        game.add.tween(target).to({
                            alpha: 1
                        }, 500, Phaser.Easing.Linear.None, true, 250)

                    });
                    dispatcher.dispatch("change_player_state", {
                        type: "PHYSICS",
                        state: state_model.PLAYER_ZOMBIE
                    });

                } else if (type == "object.ubahn") {
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
                } else if (type == "NPC") {

                    target.animations.stop();
                    target.frame = 40

                    showPlayerNotification("npc");

                    dispatcher.dispatch("change_player_state", {
                        type: "PHYSICS",
                        state: state_model.PLAYER_ZOMBIE
                    });


                    showResponse();
                }
            }

            function showResponse() {
                setTimeout(function() {

                    var txt = "...";

                    if (interactedWithObject.npc.target.name == "cop") {
                        txt = "Keep your distance";
                        console.log(event.params.object.npc);
                        event.params.object.npc.doAction("Keep your distance");
                    }

                    if (event.params.object.type == "npc.cop" == "npc.smoker") txt = "...";
                    if (event.params.object.type == "npc.cop" == "npc.weirdo") txt = "burp";

                    var message = {
                        text: txt,
                        messageType: message_type.MEDIUM
                    };

                    dispatcher.dispatch("show_message", message);

                    var interactableTargetName = event.params.object.npc.target.name;

                    var jsonTextKey = "interactable.npc." + interactableTargetName.toLowerCase() + ".greet1";

                    var message = {
                        text: jsonTextKey,
                        messageType: message_type.LOCK_ON_PLAYER
                    };

                    dispatcher.dispatch("show_player_notification", message);


                    dispatcher.dispatch("change_player_state", {
                        type: "PHYSICS",
                        state: state_model.PLAYER_GROUND
                    });
                }, 1000);

            }


        }


    

})(window.berghain2 = window.berghain2 || {});