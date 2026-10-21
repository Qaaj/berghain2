(function (berghain2) {

    'use strict';

    berghain2.InputNormal = function (game, dispatcher, lo) {
        //public variables
        this.goLeft = false;
        this.goRight = false;
        this.goUp = false;
        this.goDown = false;
        this.sprint = false;
        this.actionButton = false;

        // Cursor keys
        var inputs = game.input.keyboard.createCursorKeys();

        // Gamepad keys
        game.input.gamepad.start();
        var pad1 = game.input.gamepad.pad1;

        /*lo.g("USER", "game.input.gamepad.supported: " + game.input.gamepad.supported);
        lo.g("USER", "game.input.gamepad.active: " + game.input.gamepad.active);
        lo.g("USER", "pad1.connected: " + pad1.connected);*/

        this.update = function () {                        
            // ACTIVATE ITEM
            if (inputs.up.isDown) {
                this.actionButton = true;
            } else {
                this.actionButton = false;
            }

            // UP
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
                this.goUp = true;
            } else {
                this.goUp = false;
            }

            // DOWN
            if (inputs.down.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
                this.goDown = true;
            } else {
                this.goDown = false;
            }
            
            // SPRINT
            if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {                
                this.sprint = true;
            } else {
                this.sprint = false;
            }

            // LEFT
            if (inputs.left.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
                this.goLeft = true;
            } else {
                this.goLeft = false;
            }

            // RIGHT
            if (inputs.right.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
                this.goRight = true;
            } else {
                this.goRight = false;
            }
        }
    };

})(window.berghain2 = window.berghain2 || {});