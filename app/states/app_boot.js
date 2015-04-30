(function(berghain2) {

    'use strict';

    var Boot = function(dispatcher, input, lo, config, state_model) {

        this.create = function(target) {
             lo.g("STATE", "Entering Boot state!");

 
        }

        this.update = function(target) {


 
        }

    };

    // ContentModel.prototype.clear = function() {
    // };

    berghain2.Boot = Boot;

})(window.berghain2 = window.berghain2 || {});