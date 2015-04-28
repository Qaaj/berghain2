(function(berghain2) {

    'use strict';

    berghain2.PlayerMediator  = function(target, dispatcher, mediators, lo) {

    	lo.g("MEDIATOR","Player mediator instantiated", target);

        dispatcher.addEventListener('event', function(event) {



        });

    };

  

})(window.berghain2 = window.berghain2 || {});