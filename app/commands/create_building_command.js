(function(berghain2) {

    'use strict';

    berghain2.CreateBuildingCommand = function(dispatcher, mediators, lo, config, game, input, physics_model, player_model, rnd, camera_model) {

        var interactableGroup;

        this.execute = function(event) {
            lo.g("COMMAND", "Creating Building");

            createWorld();
            createBackground();
            createFloor();
            createPlayer();


            // http://www.gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/
            game.map = game.add.tilemap('building');

            //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
            game.map.addTilesetImage('tiles', 'gameTiles');

            //create layer
            game.backgroundlayer = game.map.createLayer('backgroundLayer');
            game.blockedLayer = game.map.createLayer('blockedLayer');

            //collision on blockedLayer
            game.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

            //resizes the game world to match the layer dimensions
            game.backgroundlayer.resizeWorld();

        }

        function findObjectsByType(type, map, layer) {
            var result = new Array();
            map.objects[layer].forEach(function(element) {
                if (element.properties.type === type) {
                    //Phaser uses top left, Tiled bottom left so we have to adjust the y position
                    //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                    //so they might not be placed in the exact pixel position as in Tiled
                    element.y -= map.tileHeight;
                    result.push(element);
                }
            });
            return result;
        }

        function createFromTiledObject(element, group) {
            var sprite = group.create(element.x, element.y, element.properties.sprite);

            //copy all Tiled properties to the sprite
            Object.keys(element.properties).forEach(function(key) {
                sprite[key] = element.properties[key];
            });
        }

        function createWorld() {
            //game.world.setBounds(0, 0, game.width, 3000);
            //game.world.setBounds(0, 0, 5120, 3000);
        }

        function createBackground() {
            // Background
            game.stage.backgroundColor = 0x333333;

            var bmd = game.add.bitmapData(game.world.bounds.width, window.innerHeight);

            bmd.addToWorld();

            var y = 0;
            for (var i = 0; i < window.innerHeight; i++) {
                var c = Phaser.Color.interpolateColor(0x000000, 0xbd4c14, window.innerHeight, i);

                // console.log(Phaser.Color.getWebRGB(c));

                bmd.rect(0, y, game.world.bounds.width, y + 2, Phaser.Color.getWebRGB(c));

                y += 2;
            }
        }

        function createFloor() {
            // Floor
            /*var env = physics_model.environment;

            var numTiles = 40; //Math.round(window.innerWidth/128);

            for (var i = 0; i < numTiles; i++) {
                var block = env.create(i * 128, window.innerHeight - physics_model.ground_height, 'ground', Math.floor(Math.random() * 4));
                block.name = "Ground Block #" + i;

                physics_model.makeImmovable(block);
            }*/

            var bmd = game.add.bitmapData(game.world.bounds.width, window.innerHeight);

            bmd.addToWorld();
        }

        function createPlayer() {
            // Create the player 
            var player = game.add.sprite(player_model.xPosition, player_model.yPosition, 'punker');
            player.name = "Punker";

            // Attach the mediator to the player
            mediators.create(berghain2.PlayerMediator, player);
        }

    };

})(window.berghain2 = window.berghain2 || {});