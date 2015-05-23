(function(berghain2) {

    'use strict';

    berghain2.CreateBuildingCommand = function(dispatcher, mediators, lo, config, game, input, physics_model, player_model, rnd, camera_model) {


        var map;

        var backgroundLayer;
        var blockedLayer;
        var objectsLayer;

        this.execute = function(event) {
            lo.g("COMMAND", "Creating Building");

            createBackground();
           
            // http://www.gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/

            // Add the tilemap 'building' to the gme
            map = game.add.tilemap('building');

            //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
            map.addTilesetImage('tiles', 'gameTiles');

            // Create a layer from the JSON file
            backgroundLayer = map.createLayer('backgroundLayer');
            blockedLayer = map.createLayer('blockedLayer');
            objectsLayer = map.createLayer('objectsLayer');

            // Set the collision range. 1 is upper left of tiles in image
            map.setCollisionBetween(1, 10, true, 'blockedLayer');

            //resizes the game world to match the layer dimensions
            backgroundLayer.resizeWorld();

            game.physics.enable(map);


            var playerStart = findObjectsByType('playerStart', map, 'objectsLayer');

            console.log("> Playerstart x = " + playerStart[0].x);
            console.log("> Playerstart y = " + playerStart[0].y);

            var pickupsGroup = game.add.group();
            pickupsGroup.enableBody = true;

            var pickups = findObjectsByType('pickup', map, 'objectsLayer');

            pickups.forEach(function(element){
                console.log("> Creating pickup");

                console.log("> Pickup x = " + element.x);
                console.log("> Pickup y = " + element.y);
            });

            var wallsGroup = game.add.group();
            wallsGroup.enableBody = true;
        }

        function findObjectsByType(type, map, layer) {
            console.log("Map = " + map.objects[layer]);

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

        function createPlayer() {
            // Create the player 
            var player = game.add.sprite(player_model.xPosition, player_model.yPosition, 'punker');
            player.name = "Punker";

            // Attach the mediator to the player
            mediators.create(berghain2.PlayerMediator, player);
        }

    };

})(window.berghain2 = window.berghain2 || {});