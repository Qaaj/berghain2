(function(berghain2) {

    'use strict';

    berghain2.StartApplicationCommand = function(dispatcher, injector, lo, config, rnd) {

        this.execute = function(event) {

            var seed = this.setupSeedGenerator(event);

            lo.g("APPLICATION", "Application Starting with seed: " + seed);

            injector.mapValue("game", new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '', {
                preload: function() {
                    dispatcher.dispatch('preload_assets');
                },
                create: function() {
                    dispatcher.dispatch('game_object_created'); // The game object has been created, can now be injected in the game mediator, input interface etc > this triggers the game_object_created_command
                },
                update: function() {
                    //console.log("game update disptaching");
                    //dispatcher.dispatch('game_update');
                }
            }));

            if (config.debug == true) {
                lo.g("APPLICATION", "DEBUG MODE ON");
            }

        };

        this.setupSeedGenerator = function(event) {
            // create seed generator
            var generator = event.params.generator;
            // choose the seed we will use
            var seed = Math.floor(Math.random() * 1000000);
            if (!config.useRandomSeed) {
                seed = config.seed;
            }
           
            // set the seed generator in our random class
            rnd.setSeed(seed,generator);

            return seed;

        }

    };

})(window.berghain2 = window.berghain2 || {});