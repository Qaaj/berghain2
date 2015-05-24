(function (berghain2) {

    'use strict';

    berghain2.CreateHudCommand = function (dispatcher, lo, config, game, mediators, message_type, text_model) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        this.execute = function (event) {
            lo.g("COMMAND", "Creating HUD: " + text_model);

            setScreenSettings();
            showIntroText();

            var healthBar = new berghain2.HealthBarView(game, mediators);

        }

        function setScreenSettings() {
            screenWidth = game.width;
            centerX = screenWidth / 2;

            screenHeight = game.height;
            centerY = screenHeight / 2;
        }

        function showIntroText() {
            var message = {text: text_model.localise("welcome"), messageType: message_type.SMALL };
            dispatcher.dispatch("show_message", message);

            message = {text: text_model.localise("levels.level1.name"), messageType: message_type.MEDIUM };
            dispatcher.dispatch("show_message", message);

            message = {text: text_model.localise("levels.level1.chapter1.text"), messageType: message_type.LARGE };

            dispatcher.dispatch("show_message", message);
        }
    };

})(window.berghain2 = window.berghain2 || {});