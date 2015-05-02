(function (berghain2) {

    'use strict';

    var Boot = function (game, input) {

        this.name = "Application boot state";

        this.init = function (target) {
            console.log("> APP BOOT INIT");
        }

        this.preload = function (target) {

        }

        this.create = function (target) {            
            var text = game.add.bitmapText(100, 50, "carrier_command", "WELCOME TO BERGHAIN II", 34);
            game.add.bitmapText(100, 100, "carrier_command", "PUSH ANY KEY TO START", 34);
            game.add.sprite(100, 100, 'logo');
        }

        this.update = function (target) {
           if (input.isAnyButtonPressed) {                
                game.state.start('Playing'); 
            }
        }

        this.shutdown = function (target) {

        }

    };

    berghain2.Boot = Boot;

})(window.berghain2 = window.berghain2 || {});