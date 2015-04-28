(function(berghain2) {

    'use strict';

    berghain2.CreateWorldCommand = function(dispatcher, lo, config, game) {

        this.execute = function(event) {

            lo.g("COMMAND", "Creating World");
        
        
            //  We're going to be using physics, so enable the Arcade Physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.stage.smoothed = false;
            game.physics.setBoundsToWorld();

            game.stage.backgroundColor = 0x333333;

            var env = game.add.group();

            for (var i = 0; i < 20; i++) {
                 env.create(i*128,window.innerHeight-64, 'ground',Math.floor(Math.random()*4));
            };

            var player = game.add.sprite(50, game.world.height - 64 - 96, 'punker')
           
    
    
            
        }

    };

})(window.berghain2 = window.berghain2 || {});