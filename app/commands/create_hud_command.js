(function(berghain2) {

    'use strict';

    berghain2.CreateHudCommand = function(dispatcher, lo, config, game, mediators) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        this.execute = function(event) {

            lo.g("COMMAND", "Creating HUD");

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
            var message = { text: "welcome to berghain II", type: "large"};
            
            dispatcher.dispatch("show_message", message);
            
            var message = { text: "chapter I ", type: "medium"};
            
            dispatcher.dispatch("show_message", message);
            
            var message = { text: "get some cigarettes", type: "small"};
            
            dispatcher.dispatch("show_message", message);
        }
    };

})(window.berghain2 = window.berghain2 || {});