(function (berghain2) {

    'use strict';

    var Playing = function (dispatcher,input,lo,config,game) {

        this.name = "App playing state";
          
        this.init = function (target) {

        }

        this.preload = function (target) {       
            
        }

        this.create = function (target) {
            dispatcher.dispatch('create_world');
        }

        this.update = function (target) {
            dispatcher.dispatch('game_update');
        }

        this.shutdown = function (target) {

        }

        this.render = function(target){
            dispatcher.dispatch('game_render');
        }

    };

    berghain2.Playing = Playing;

})(window.berghain2 = window.berghain2 || {});