(function(berghain2) {

    'use strict';

    berghain2.StartApplicationCommand = function(dispatcher, injector, lo, config) {

        this.execute = function(event) {


            lo.g("APPLICATION", "Application Starting");

            // Map the PHASER IO game object to the value 'game' so it's available everywhere we need it

            injector.mapValue("game", new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '', {
                preload: function() {                    
                    dispatcher.dispatch('preload_assets');
                },
                create: function() {
                    dispatcher.dispatch('game_object_created'); // The game object has been created, can now be injected in the game mediator, input interface etc > this triggers the game_object_created_command
                    
                    //dispatcher.dispatch('create_world');
                },
                update: function() {
                    dispatcher.dispatch('game_update');
                }
            }));
            if (config.debug == true) {
                lo.g("APPLICATION", "DEBUG MODE ON");
            }

        };

    };

})(window.berghain2 = window.berghain2 || {});