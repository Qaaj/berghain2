(function(berghain2) {

    'use strict';

    berghain2.GameObjectCreatedCommand = function(dispatcher, injector, mediators, lo, config, game, physics_model) {

        this.execute = function(event) {
            lo.g("COMMAND", "Game object has been created, Initialising INPUT");
                       
            var input = new berghain2.Input(game,dispatcher,lo);
            injector.mapValue("input", input);
            
             // Create the mediator for the game object
            mediators.create(berghain2.GameMediator, game);

            dispatcher.dispatch('init_states');
        }    
    };

})(window.berghain2 = window.berghain2 || {});