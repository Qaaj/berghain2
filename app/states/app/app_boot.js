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
            var welcome_text = game.add.bitmapText(game.width/2, 50, "carrier_command", "WELCOME TO", 34);
            welcome_text.updateText();
            welcome_text.x -= (welcome_text.width / 2)

           
            var logo = game.add.sprite(game.width/2, welcome_text.y + welcome_text.height + 50, 'logo');
            logo.x -= (logo.width/2);

            var pushtext = game.add.bitmapText(game.width/2, logo.y + logo.height + 50, "carrier_command", "PUSH ANY KEY TO START", 28);
            pushtext.updateText();
            pushtext.x -= (pushtext.width / 2)

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