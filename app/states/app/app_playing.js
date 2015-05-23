(function (berghain2) {

    'use strict';

    var Playing = function (dispatcher,input,lo,config,game,physics_model) {

        this.name = "App playing state";
        console.log(physics_model);
          
        this.init = function (target) {

        }

        this.preload = function (target) {       
            
        }

        this.create = function (target) {            
            dispatcher.dispatch('create_world');
        }

        this.update = function (target) {          
            input.update();
            
            dispatcher.dispatch('game_update');
        }

        this.shutdown = function (target) {
            physics_model.reset();
        }

        this.render = function(target){
            dispatcher.dispatch('game_render');
        }

    };

    berghain2.Playing = Playing;

})(window.berghain2 = window.berghain2 || {});