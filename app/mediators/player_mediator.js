(function(berghain2) {

    'use strict';

    berghain2.PlayerMediator = function(target, game, dispatcher, mediators, lo, input) {

        lo.g("MEDIATOR", "Player mediator instantiated", target);


        // THIS HAS TO HAPPEN SOMEWHERE ELSE
         game.physics.arcade.gravity.y = 2500;
		game.physics.enable(target, Phaser.Physics.ARCADE);     

		target.body.collideWorldBounds = true;   

        target.animations.add('left', [30, 31, 32, 33, 34, 35, 36, 37], 10, true);
        target.animations.add('right', [10, 11, 12, 13, 14, 15, 16, 17], 10, true)

        // TODO add collisions with floor


        dispatcher.addEventListener('game_update', function(event) {

            if (input.goLeft) {
                target.animations.play('left');
                target.position.x -= 2;
            }
            if (input.goUp) {
                target.body.velocity.y = -300;
            }
            if (input.goRight) {
                target.animations.play('right');
                target.position.x += 2;
            }
            if (input.goDown) {}

            if (!input.goLeft && !input.goRight) {
                target.animations.stop();
                target.frame = 2;
            }
        });

    };



})(window.berghain2 = window.berghain2 || {});