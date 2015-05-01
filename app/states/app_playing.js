(function (berghain2) {

    'use strict';

    var Playing = function (dispatcher,input,lo,config,game) {

        this.name = "App playing state";
          
        this.init = function (target) {
            console.log("> APP PLAYING INIT");
        }

        this.preload = function (target) {       
            
        }

        this.create = function (target) {
            console.log("--- YOU ARE NOW PLAYING ---");
            
            dispatcher.dispatch('create_world');
        }

        this.update = function (target) {
             if(input.goLeft){
                 console.log("left");
             }
        }

        this.shutdown = function (target) {

        }

    };

    berghain2.Playing = Playing;

})(window.berghain2 = window.berghain2 || {});