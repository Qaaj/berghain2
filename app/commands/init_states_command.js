(function(berghain2) {

    'use strict';

    berghain2.InitStatesCommand = function(dispatcher, lo, config, game) {

        this.execute = function(event) {

            lo.g("COMMAND", "Initializing states");

            game.state.add('Boot', Candy.Boot);
            game.state.add('Preloader', Candy.Preloader);
            game.state.add('MainMenu', Candy.MainMenu);
            game.state.add('Game', Candy.Game);

            game.state.start('Boot'); 
        }

    };

})(window.berghain2 = window.berghain2 || {});