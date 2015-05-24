(function(berghain2) {

    'use strict';

    berghain2.PreloadAssetsCommand = function(dispatcher, lo, config, game) {

        this.execute = function(event) {

            lo.g("COMMAND", "Loading Assets");

            // LOCALISATION
            game.load.json("text", "/assets/localisation/data.json");
            
            // TILEMAPS JSON
            game.load.tilemap('building', 'assets/tilemaps/building.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image('gameTiles', 'assets/building/inside/tiles.png');
            
            // PICKUPS
            game.load.image('pickup_bottle', 'assets/pickups/pickup_bottle.png');

            //HUD
            game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
            
            //GAME
            game.load.spritesheet('ground', 'assets/ground.png', 128,64);
            game.load.image('hain', 'assets/hain.png');
            game.load.spritesheet('punker', 'assets/punker.png', 96,96);
            game.load.spritesheet('npc', 'assets/npc.png', 96,96);
            game.load.spritesheet('fire_bin', 'assets/fire_bin.png', 24,48);
            game.load.image('moon', 'assets/moon.png');
            game.load.image('logo', 'assets/logo.png');
            game.load.image('cloud', 'assets/cloud.png');


            game.load.image('street_lamp', 'assets/street_lamp.png');
            game.load.image('ubahn', 'assets/ubahn.png');
            game.load.image('fence', 'assets/fence.png');

            game.load.spritesheet('shrubbery', 'assets/shrubbery.png', 144,144);
        }

    };

})(window.berghain2 = window.berghain2 || {});