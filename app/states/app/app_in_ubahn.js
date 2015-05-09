(function (berghain2) {

    'use strict';

    var InUbahn = function (game, input, text_model) {

        this.name = "InUbahn boot state";

        this.init = function (target) {
            console.log("> InBuilding INIT");
        }

        this.preload = function (target) {

        }

        this.create = function (target) { 
            console.log("scheisssssse " + text_model);
                
            var pushtext = game.add.bitmapText(game.width/2, game.height/2, "carrier_command", text_model.localise("building.ubahn.welcome"), 12);
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

    berghain2.InUbahn = InUbahn;

})(window.berghain2 = window.berghain2 || {});