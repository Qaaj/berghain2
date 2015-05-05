(function (berghain2) {

    'use strict';

    berghain2.CreateWorldCommand = function (dispatcher, mediators, lo, config, game, input, physics_model, player_model) {

        var interactableGroup;
        
        this.execute = function (event) {

            lo.g("COMMAND", "Creating World");

             physics_model.ground_height = 64;
             
            initGamePhysics();

            createWorld();

            createBackground();

            // CREATE BACKGROUND COLISSION GROUP
            createBackdrop();

            var env = game.add.group();
            env.enableBody = true;
            physics_model.environment = env;

            // CREATE INTERACTABLE GROUP
            interactableGroup = game.add.group();
            interactableGroup.enableBody = true;
            //physics_model.makeImmovable(interactableGroup);
            physics_model.interactable = interactableGroup;            
           
            
            createCamera();

            createFloor();
            createSky();
            createNPCs();

            createPlaces();

            createPlayer();

            createEnemies();
            
            dispatcher.dispatch('create_hud');
        }

        function createWorld()
        {
            //game.world.setBounds(0, 0, game.width, 3000);
            game.world.setBounds(0, 0, 5120, 3000);
        }

        function createCamera() {
            // Define world bounds
            mediators.create(berghain2.CameraMediator, game.camera);
        }

        function initGamePhysics() {
            //  We're going to be using physics, so enable the Arcade Physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);
        }

        function createBackdrop(){
            dispatcher.dispatch("create_backdrop");
        }

        function createNPCs() {
            var npc = game.add.sprite(window.innerWidth - 370, window.innerHeight - 64 - 96, 'npc');
            npc.name = "NPC"
        }

        function createPlaces() {
            var ubahn = interactableGroup.create(800, window.innerHeight - 64 - 192, 'ubahn');
            ubahn.name = "ubahn";            
            ubahn.body.immovable = true;
            ubahn.body.allowGravity = false;
        }

        function createEnemies() {
            var bin = game.add.sprite(200, window.innerHeight - 64 - 48, 'fire_bin');
            bin.name = "Fire Bin 1";
            mediators.create(berghain2.FireBinMediator, bin);
          

            var bin2 = game.add.sprite(window.innerWidth - 400, window.innerHeight - physics_model.ground_height - 48, 'fire_bin');
            bin2.name = "Fire Bin 2"
            mediators.create(berghain2.FireBinMediator, bin2);
        }

        function createBackground() {
            // Background
            game.stage.backgroundColor = 0x333333;


            var bmd = game.add.bitmapData(game.world.bounds.width, window.innerHeight);

            bmd.addToWorld();


            var y = 0;
            for (var i = 0; i < window.innerHeight; i++) {
                var c = Phaser.Color.interpolateColor(0x000000, 0x555555, window.innerHeight, i);

                // console.log(Phaser.Color.getWebRGB(c));

                bmd.rect(0, y, game.world.bounds.width, y + 2, Phaser.Color.getWebRGB(c));

                y += 2;
            }
        }

        function createFloor() {

            // Floor

            var env = physics_model.environment;

            var numTiles = 40; //Math.round(window.innerWidth/128);



            for (var i = 0; i < numTiles; i++) {

               
                    var block = env.create(i * 128, window.innerHeight - physics_model.ground_height, 'ground', Math.floor(Math.random() * 4));
                    block.name = "Ground Block #" + i;

                    physics_model.makeImmovable(block);



            }

            var lamp = env.create(330, window.innerHeight - 255, 'street_lamp', Math.floor(Math.random() * 4));
            physics_model.makeImmovable(lamp)
            lamp.body.setSize(10, 10, 15, 20);



        }

        function createSky() {
            // Add moon 

            game.add.sprite(window.innerWidth - 200, 50, 'moon');

            // Add cloud
            // game.add.sprite(0, 0, "cloud");
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