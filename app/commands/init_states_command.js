(function(berghain2) {

    'use strict';

    berghain2.InitStatesCommand = function(dispatcher, lo, config, game) {

        this.execute = function(event) {

            lo.g("COMMAND", "Initializing states");

           /* game.state.add('Boot', berghain2.Boot);
            /*game.state.add('Preloader', berghain2.Preloader);
            game.state.add('MainMenu', berghain2.MainMenu);
            game.state.add('Game', berghain2.Game); 

            game.state.start('Boot'); */
        }

    };

})(window.berghain2 = window.berghain2 || {});