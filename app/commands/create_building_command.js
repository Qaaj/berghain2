(function (berghain2) {

    'use strict';

    berghain2.CreateBuildingCommand = function (dispatcher, injector, lo, config, game, input, physics_model, player_model, state_model, text_model) {
        var map;

        var backgroundLayer;
        var collisionsLayer;
        var objectsLayer;

        this.execute = function (event) {
            lo.g("COMMAND", "Creating Building");

            changePlayerState();

            createBackground();
            createBuildingMap();
            createPlayer();
            createPickups();
            
            showBuildingWelcomeText();
            
            //resizes the game world to match the layer dimensions
            backgroundLayer.resizeWorld();
        }

        function changePlayerState() {
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

            createMapLayersFromTiledLayers();
            
            map.setCollisionByExclusion([]);
        }

        function createMapLayersFromTiledLayers() {
            backgroundLayer = map.createLayer('backgroundLayer');

            createCollisionsLayer();

            objectsLayer = map.createLayer('objectsLayer');
        }

        function createCollisionsLayer() {
            collisionsLayer = map.createLayer('collisionsLayer');

            var collisionGroup = game.add.group();
            collisionGroup.name = "group_collisions";
            collisionGroup.enableBody = true;

            var collisions = findObjectsByType("collision", map, 'collisionsLayer');

            collisions.forEach(function (element) {
                var collisionData = createFromTiledObject(element, collisionGroup);

                console.log("> Creating collision: " + collisionData.name);

                /*console.log("> Collision  x = " + collisionData.x);
                console.log("> Collision y = " + collisionData.y);

                console.log("> Collision width = " + collisionData.width);
                console.log("> Collision height = " + collisionData.height);

                console.log("> Collision type = " + collisionData.type);

                console.log("> Collision body = " + collisionData.body);
                console.log("> Collision spritename = " + collisionData.spriteName);*/

                var collisionSprite = collisionGroup.create(collisionData.x, collisionData.y, collisionData.spriteName);
                collisionSprite.width = collisionData.width;
                collisionSprite.height = collisionData.height;

                game.physics.enable(collisionSprite, Phaser.Physics.ARCADE);

                collisionSprite.body.collideWorldBounds = true;
                collisionSprite.body.immovable = true;
                collisionSprite.body.allowGravity = false;

                if ( config.debug ){
                    collisionSprite.renderable = true;   
                }else{
                    collisionSprite.renderable = false;
                }

                collisionGroup.add(collisionSprite);
            });

            physics_model.environment = collisionGroup;
        }

        function createPickups() {
            var pickupsGroup = game.add.group();
            pickupsGroup.name = "group_pickups";
            pickupsGroup.enableBody = true;

            var pickups = findObjectsByType('pickup', map, 'objectsLayer');

            pickups.forEach(function (element) {
                var pickupSpriteData = createFromTiledObject(element, pickupsGroup);

                /*console.log("> Creating pickup:");
                console.log("> Pickup x = " + pickupSpriteData.x);
                console.log("> Pickup y = " + pickupSpriteData.y);
                console.log("> Pickup sprite name = " + pickupSpriteData.spriteName);*/

                pickupsGroup.create(pickupSpriteData.x, pickupSpriteData.y, pickupSpriteData.spriteName);
            });
            
            // DISABLE GRAVITY ON PICKUPSGROUP
            pickupsGroup.forEach(function (pickup) {
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
                    
                    //element.y -= map.tileHeight;
                    
                    result.push(element);
                }
            });
            return result;
        }

        function createFromTiledObject(element, group) {
            var spriteNameInTiled = element.properties['spriteName'];

            console.log("> Create sprite from Tiled object: " + spriteNameInTiled);

            var sprite = {};

            sprite.name = element.name;
            sprite.x = element.x;
            sprite.y = element.y;
            sprite.width = element.width;
            sprite.height = element.height;
            
            //copy all Tiled properties to the sprite
            Object.keys(element.properties).forEach(function (key) {
                console.log("> Adding property to sprite " + key + ": " + element.properties[key]);

                sprite[key] = element.properties[key];
            });

            return sprite;
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