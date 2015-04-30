(function(berghain2) {

    'use strict';

    berghain2.CreateWorldCommand = function(dispatcher, mediators, lo, config, game, input) {

        this.execute = function(event) {

            lo.g("COMMAND", "Creating World");
             initGamePhysics();
            createBackground();
            createFloor();
            createSky();
            createPlayer();

             dispatcher.dispatch('create_hud');

            

        }

        function initGamePhysics() {
            //  We're going to be using physics, so enable the Arcade Physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.setBoundsToWorld();
        }

        function createBackground() {
            // Background
            game.stage.backgroundColor = 0x333333;

            var bmd = game.add.bitmapData(window.innerWidth, window.innerHeight);

            bmd.addToWorld();

            var y = 0;
            for (var i = 0; i < window.innerHeight; i++) {
                var c = Phaser.Color.interpolateColor(0x000000, 0x444444, window.innerHeight, i);

                // console.log(Phaser.Color.getWebRGB(c));

                bmd.rect(0, y, window.innerWidth, y + 2, Phaser.Color.getWebRGB(c));

                y += 2;
            }
        }

        function createFloor() {
            // Floor

            var env = game.add.group();
            env.enableBody = true;

            for (var i = 0; i < 20; i++) {
               var block =  env.create(i * 128, window.innerHeight - 64, 'ground', Math.floor(Math.random() * 4));
               block.body.immovable = true;
               block.body.allowGravity = false;
            };


            



         

            window.env = env;

        }

        function createSky() {
            // Add moon and logo
            game.add.sprite(100, 100, 'logo')
            game.add.sprite(window.innerWidth - 200, 50, 'moon')

            // Add cloud
            game.add.sprite(0, 0, "cloud");
        }

        function createPlayer() {
            // Create the player 
            var player = game.add.sprite(50, 50 , 'punker')

            // Attach the mediator to the player
            mediators.create(berghain2.PlayerMediator, player);
        }

    };

})(window.berghain2 = window.berghain2 || {});