(function(berghain2) {
    'use strict';

    berghain2.CreatePlayerCommand = function(player_model, state_model, game_model, game, mediators, physics_model, lo) {
        this.execute = function(event) {
            lo.g("COMMAND", "Create Player Command executed", event.params);

            var player = game.add.sprite(player_model.xPosition, player_model.yPosition, 'punker');
            player.name = "Punker";
            
            // Attach the mediator to the player
            mediators.create(berghain2.PlayerMediator, player);
            
            physics_model.player = player;
        }
    };
})(window.berghain2 = window.berghain2 || {});

