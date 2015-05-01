(function (berghain2) {

    'use strict';

    var constructor = berghain2.Input = function (game, dispatcher, lo) {

        //public variables
        constructor.goLeft = false;
        constructor.goRight = false;
        constructor.goUp = false;
        constructor.goDown = false;
        constructor.isAnyButtonPressed = false;

        // Cursor keys
        var inputs = game.input.keyboard.createCursorKeys();

        // Gamepad keys
        game.input.gamepad.start();
        var pad1 = game.input.gamepad.pad1;

        lo.g("USER", "game.input.gamepad.supported: " + game.input.gamepad.supported);
        lo.g("USER", "game.input.gamepad.active: " + game.input.gamepad.active);
        lo.g("USER", "pad1.connected: " + pad1.connected);

        game.input.keyboard.onDownCallback = function (e) {
                //for demonstration, next line prints the keyCode to console
                console.log(e.keyCode);

                //here comes your stuff, you might check for certain key, or just trigger a function
                constructor.isAnyButtonPressed = true;
        }
        
        game.input.keyboard.onUpCallback = function (e) {
                constructor.isAnyButtonPressed = false;
        }

        dispatcher.addEventListener('game_update', function (event) {
            // UP
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || inputs.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
                constructor.goUp = true;
            } else {
                constructor.goUp = false;
            }

            // DOWN
            if (inputs.down.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
                constructor.goDown = true;
            } else {
                constructor.goDown = false;
            }

            // LEFT
            if (inputs.left.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
                constructor.goLeft = true;
            } else {
                constructor.goLeft = false;
            }

            // RIGHT
            if (inputs.right.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
                constructor.goRight = true;
            } else {
                constructor.goRight = false;
            }
        });



        return constructor;

    };




})(window.berghain2 = window.berghain2 || {});