(function(berghain2) {

    'use strict';

    berghain2.GameObjectCreatedCommand = function(dispatcher, injector, mediators, lo, config, game, physics_model) {

        this.execute = function(event) {

            lo.g("COMMAND", "Game object has been created");

            console.log(physics_model);

           
            // Initialise the interface that will handle the inputs
            var input = new berghain2.Input(game,dispatcher,lo);
            injector.mapValue("input",input);

             // Create the mediator for the game object
            mediators.create(berghain2.GameMediator, game);

            // We need to initialise the models before we start the first game state, so we can toggle between different states


            
            dispatcher.dispatch('init_states');
        }    
    };

})(window.berghain2 = window.berghain2 || {});