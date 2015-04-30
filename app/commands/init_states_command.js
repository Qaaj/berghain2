(function(berghain2) {

    'use strict';

    berghain2.InitStatesCommand = function(dispatcher, lo, config, game, input) {

        this.execute = function(event) {
            lo.g("COMMAND", "Initializing states");

            var bootState = new berghain2.Boot(game,input);
		    var playState = new berghain2.Playing(dispatcher,input,lo,config,game);
        
            game.state.add('Boot', bootState);
            /*game.state.add('Preloader', berghain2.Preloader);
            game.state.add('MainMenu', berghain2.MainMenu);*/
            game.state.add('Playing', playState);

            game.state.start('Boot'); 
        }

    };

})(window.berghain2 = window.berghain2 || {});