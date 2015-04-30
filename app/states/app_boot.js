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
            console.log("-------> " + input);
            
            var text = game.add.bitmapText(100, 50, "carrier_command", "WELCOME TO BERGHAIN II", 34);
            game.add.bitmapText(100, 100, "carrier_command", "CLICK TO START", 34);

            //TODO Replace by input inject, COULDN'T USE INPUT INJECT HERE?
            var higherButton = this.game.add.button(160, 100, "higher", this.clickedHigher, this);
        }

        this.clickedHigher = function () {
            game.state.start('Playing'); 
        }

        this.update = function (target) {

        }

        this.shutdown = function (target) {

        }

    };

    berghain2.Boot = Boot;

})(window.berghain2 = window.berghain2 || {});