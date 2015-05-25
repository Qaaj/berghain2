(function(berghain2) {

    'use strict';

    var Player_Inside = function(dispatcher, input, lo, config, state_model, game, physics_model, message_type) {

        this.name = "Player inside state";

        var inFrontOfObject;
        var isPlayerNotificationShown = true;

        var interaction_object;
        var speed;

    
        game.camera.follow(this.target);
    
        this.update = function(target) {
            // 1. Check if the player can interact with any object at his current position
            this.checkForInteractionWithBackdropObject(target);

            // 2. Collide with the world environment
            this.doCollisionWithEnvironment(target);

            // 3. See if the player should change his state (e.g. Jump etc)
            this.checkIfPlayerNeedsStateChange(target);

            // 4. Update the players position according to key inputs
            this.updatePlayerPosition(target);
            
            game.camera.x = target.x;
            game.camera.y = target.y;
            
            
        }

        this.doCollisionWithEnvironment = function(target) {
            game.physics.arcade.collide(target, physics_model.environment);
        }

        this.checkForInteractionWithBackdropObject = function(target) {

            /* interaction_object = {};
            inFrontOfObject = false;

            for (var i = 0; i < physics_model.interactable_background_objects.length; i++) {

                var obj = physics_model.interactable_background_objects[i];
                var xpos = target.x + target.body.width;

                if (xpos > obj.x + 5 && xpos < obj.x + obj.width - 5) {
                    inFrontOfObject = true;
                    interaction_object = obj;

                    lo.g("PHYSICS", "PLAYER IN FRONT OF " + interaction_object.type);

                    var message = { text: "interactable." + interaction_object.type, messageType: message_type.LOCK_ON_PLAYER };
                    dispatcher.dispatch("show_player_notification", message);
                    
                    isPlayerNotificationShown = true;
                }
            }
            
           DestroyPlayerNotificationWhenPlayerIsNotInFrontOfObject();   */
        }

        function DestroyPlayerNotificationWhenPlayerIsNotInFrontOfObject() {
            if (!inFrontOfObject && isPlayerNotificationShown) {
                isPlayerNotificationShown = false;
                dispatcher.dispatch("destroy_player_notification");
            }
        }

        this.checkIfPlayerNeedsStateChange = function(target) {
            /*if (!target.body.touching.down && !target.body.onFloor()) {

                lo.g("PHYSICS", "Change state to jump");

                dispatcher.dispatch("change_player_state", {
                    type: "PHYSICS",
                    state: state_model.PLAYER_JUMP
                });

            }*/
        }

        this.updatePlayerPosition = function(target) {
            speed = 200;

            if (input.sprint) {
                speed = 500;
            }

            if (input.goLeft) {
                target.body.velocity.y = 0;
                target.animations.play('walk');
                target.body.velocity.x = -1 * speed;
                target.angle = 270;

            } else if (input.goRight) {
                target.body.velocity.y = 0;
                target.animations.play('walk');
                target.body.velocity.x = 1 * speed;
                target.angle = 90;
            }

            if (input.goUp) {
                target.body.velocity.x = 0;
                target.body.velocity.y = -1 * speed;
                target.animations.play('walk');
                target.angle = 0;
            } else if (input.goDown) {
                target.body.velocity.x = 0;
                target.animations.play('walk');
                target.body.velocity.y = 1 * speed;
                target.angle = 180;     
            }

            if (input.actionButton && !(input.goRight || input.goLeft)) {
                target.body.velocity.x = 0;

                if (inFrontOfObject) {
                    dispatcher.dispatch("player_interact_with_backdrop", {
                        target: target,
                        object: interaction_object
                    });

                } else {
                    target.frame = 40;
                }
            }

            if (!input.isAnyButtonPressed) {
                target.body.velocity.y = 0;
                target.body.velocity.x = 0;
                target.animations.stop();
                target.frame = 0;
            }
        }
    };

    berghain2.Player_Inside = Player_Inside;

})(window.berghain2 = window.berghain2 || {});