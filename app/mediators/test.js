(function(berghain2) {

    'use strict';

    var TestMediator = function(target, dispatcher, mediators, lo) {

    	lo.g("MEDIATOR","we can add custom Phaser objects to our mediators. WEEEE. This is just a test object:", target);

        dispatcher.addEventListener('event', function(event) {



        });

    };

    berghain2.TestMediator = TestMediator;

})(window.berghain2 = window.berghain2 || {});