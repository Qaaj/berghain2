(function (berghain2) {

    'use strict';

    var InBuilding = function (game, input) {

        this.name = "InBuilding boot state";

        this.init = function (target) {
            console.log("> InBuilding INIT");
        }

        this.preload = function (target) {

        }

        this.create = function (target) {     
            var pushtext = game.add.bitmapText(game.width/2, game.height/2, "carrier_command", "You are inside a building. It's quite amazing - too bad the light's out.", 12);
            
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

        this.render = function(target){
            // dispatcher.dispatch('game_render');
        }

    };

    berghain2.InBuilding = InBuilding;

})(window.berghain2 = window.berghain2 || {});