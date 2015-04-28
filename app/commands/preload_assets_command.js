(function(berghain2) {

    'use strict';

    berghain2.PreloadAssetsCommand = function(dispatcher, lo, config, game) {

        this.execute = function(event) {

            lo.g("COMMAND", "Loading Assets");

            game.load.spritesheet('ground', 'assets/ground.png', 128,64);
            game.load.image('hain', 'assets/hain.png');
            game.load.spritesheet('punker', 'assets/punker.png', 96,96);
            game.load.image('moon', 'assets/moon.png');
            game.load.image('logo', 'assets/logo.png');

            
        }

    };

})(window.berghain2 = window.berghain2 || {});