(function (berghain2) {

    'use strict';

    berghain2.CreateBuildingCommand = function (dispatcher, injector, lo, config, game, input, physics_model, player_model, state_model, text_model) {
        var map;

        var backgroundLayer;
        var blockedLayer;
        var objectsLayer;

        this.execute = function (event) {
            lo.g("COMMAND", "Creating Building");

            changePlayerState();

            createBackground();
            createBuildingMap();
            createPlayer();
            createPickups();
            createWalls();

            game.physics.enable(map);

            showBuildingWelcomeText();
        }

        function changePlayerState() {
            /* dispatcher.dispatch("change_player_state", {
                       type: "PHYSICS",
                       state: state_model.PLAYER_INSIDE
                   });*/

            state_model.currentState = state_model.PLAYER_INSIDE;
        }

        function createBackground() {
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

        function createBuildingMap() {
            // Add the tilemap 'building' to the gme
            map = game.add.tilemap('building');

            //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
            map.addTilesetImage('building_inside_black', 'gameTiles');

            initMapLayers();
        }

        function initMapLayers() {
            // Create a layer from the JSON file
            backgroundLayer = map.createLayer('backgroundLayer');
            blockedLayer = map.createLayer('blockedLayer');
            objectsLayer = map.createLayer('objectsLayer');

            // Set the collision range. 1 is upper left of tiles in image
            map.setCollisionBetween(1, 10, true, 'blockedLayer');

            //resizes the game world to match the layer dimensions
            backgroundLayer.resizeWorld();
        }

        function createPickups() {
            var pickupsGroup = game.add.group();
            pickupsGroup.name = "group_pickups";
            pickupsGroup.enableBody = true;

            var pickups = findObjectsByType('pickup', map, 'objectsLayer');

            pickups.forEach(function (element) {
                var pickupSpriteData = createFromTiledObject(element, pickupsGroup);

                console.log("> Creating pickup:");
                console.log("> Pickup x = " + pickupSpriteData.x);
                console.log("> Pickup y = " + pickupSpriteData.y);
                console.log("> Pickup sprite name = " + pickupSpriteData.spriteName);

                pickupsGroup.create(pickupSpriteData.x, pickupSpriteData.y, pickupSpriteData.spriteName);
            });
            
            // DISABLE GRAVITY ON PICKUPSGROUP
            pickupsGroup.forEach(function (pickup) {
                console.log("> Disabling gravity in pickups group item");

                pickup.body.allowGravity = false;
            });
        }

        function findObjectsByType(type, map, layer) {
            //console.log("Map = " + map.objects[layer]);

            var result = new Array();
            map.objects[layer].forEach(function (element) {
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
            var spriteNameInTiled = element.properties['spriteName'];

            console.log("> Create sprite from Tiled object: " + spriteNameInTiled);

            var sprite = {};

            sprite.x = element.x;
            sprite.y = element.y;
            
            //copy all Tiled properties to the sprite
            Object.keys(element.properties).forEach(function (key) {
                console.log("> Adding property to sprite " + key + ": " + element.properties[key]);

                sprite[key] = element.properties[key];
            });

            return sprite;
        }

        function createWalls() {
            var wallsGroup = game.add.group();
            wallsGroup.enableBody = true;
            
            //var walls = findObjectsByType('wall', map, 'blockedLayer');
            //console.log("> Walls = " + walls);
        }

        function createPlayer() {
            // Find player in tilemap
            var playerStart = findObjectsByType('playerStart', map, 'objectsLayer');

            console.log("> Playerstart x = " + playerStart[0].x);
            console.log("> Playerstart y = " + playerStart[0].y);

            var x = playerStart[0].x;
            var y = playerStart[0].y;

            player_model.xPosition = x;
            player_model.yPosition = y;

            dispatcher.dispatch("create_player");
        }

        function showBuildingWelcomeText() {
            var pushtext = game.add.bitmapText(game.width / 2, game.height / 2, "carrier_command", text_model.localise("building.welcome.spati"), 12);
            pushtext.updateText();
            pushtext.x -= (pushtext.width / 2);
        }
    };

})(window.berghain2 = window.berghain2 || {});