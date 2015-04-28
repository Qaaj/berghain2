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
                    dispatcher.dispatch('create_world');
                },
                update: function() {
                    dispatcher.dispatch('update');
                }
            }));



            if (config.debug == true) {
                lo.g("APPLICATION", "DEBUG MODE ON");
            }

        };

    };

})(window.berghain2 = window.berghain2 || {});