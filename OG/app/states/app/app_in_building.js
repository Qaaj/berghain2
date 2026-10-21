(function (berghain2) {

    'use strict';

    var InBuilding = function (game, input, text_model, dispatcher) {

        this.name = "InBuilding boot state";

        this.init = function (target) {
            console.log("> InBuilding INIT");
        }

        this.preload = function (target) {

        }

        this.create = function (target) {           
            input.currentInput = input.INPUT_TOP_DOWN;
                   
            dispatcher.dispatch("create_building");
        }

        this.update = function (target) {  
          input.update();          
          dispatcher.dispatch('game_update');
        }

        this.shutdown = function (target) {

        }

        this.render = function(target){
            // dispatcher.dispatch('game_render');
        }

    };

    berghain2.InBuilding = InBuilding;

})(window.berghain2 = window.berghain2 || {});