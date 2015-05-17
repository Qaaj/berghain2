(function (berghain2) {

    'use strict';

    berghain2.InitStatesCommand = function (dispatcher, lo, config, game, input, physics_model, text_model) {

        this.execute = function (event) {
            lo.g("COMMAND", "Initializing states ");

            var bootState = new berghain2.Boot(game, input, text_model);
            var playState = new berghain2.Playing(dispatcher, input, lo, config, game, physics_model);
            var buildingState = new berghain2.InBuilding(game, input, text_model, dispatcher);
            var ubahnState = new berghain2.InUbahn(game, input, text_model);

            game.state.add('Boot', bootState);
            game.state.add('Playing', playState);
            game.state.add('InBuilding', buildingState)
            game.state.add('InUbahn', ubahnState)

            if (config.skipIntro) {
                game.state.start('Playing');
            } else {
                game.state.start('Boot');
            }
        }
    };

})(window.berghain2 = window.berghain2 || {});