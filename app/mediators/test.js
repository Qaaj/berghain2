(function(berghain2) {

    'use strict';

    var TestMediator = function(target, dispatcher, mediators, lo) {

    	lo.g(target);

        dispatcher.addEventListener('event', function(event) {



        });

    };

    berghain2.TestMediator = TestMediator;

})(window.berghain2 = window.berghain2 || {});