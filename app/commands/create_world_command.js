(function (berghain2) {

    'use strict';

    berghain2.CreateWorldCommand = function (dispatcher, mediators, lo, config, game, input, physics_model, player_model, rnd, camera_model) {

        this.execute = function (event) {

            rnd.resetSeedGenerator();

            lo.g("COMMAND", "Creating World");

             physics_model.ground_height = 64;
             
            initGamePhysics();

            createWorld();
        
            createBackground();

            var env = game.add.group();
            env.enableBody = true;
            physics_model.environment = env;

            createFloor();

            createBackdrop();
  
            createCamera();
           
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
            mediators.create(berghain2.NPCMediator, npc);
            npc.name = "NPC"
            npc.frame = Math.floor(Math.random()*4);
        }

        function createPlaces() {
            var ubahn = game.add.sprite(window.innerWidth - 200, window.innerHeight - 64 - 192, 'ubahn');
            dispatcher.dispatch("register_interactable_background_object",{type:"UBAHN",x:ubahn.x + 20,width:ubahn.width - 100});
            ubahn.name = "ubahn"
        }

        function createEnemies() {
           

            var bin2 = game.add.sprite(window.innerWidth - 500, window.innerHeight - physics_model.ground_height - 48, 'fire_bin');
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
                var c = Phaser.Color.interpolateColor(0x000000, 0xbd4c14, window.innerHeight, i);

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