(function(berghain2) {

    'use strict';

    berghain2.GameObjectCreatedCommand = function(dispatcher, injector, mediators, lo, config, game) {

        this.execute = function(event) {

            lo.g("COMMAND", "Game object has been created");

           
            // Initialise the interface that will handle the inputs
            var input = new berghain2.Input(game,dispatcher,lo);
            injector.mapValue("input",input);

             // Create the mediator for the game object
            mediators.create(berghain2.GameMediator, game);



        }

        

    };

})(window.berghain2 = window.berghain2 || {});