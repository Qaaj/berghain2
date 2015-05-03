(function(berghain2) {

    'use strict';

    berghain2.CreateHudCommand = function(dispatcher, lo, config, game, mediators, message_type, message_model) {

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
            
            var message = { text: "Wow", type: message_type.LOCK_ON_PLAYER};
            dispatcher.dispatch("show_message", message);
             
            var message = { text: "welcome to berghain II ", type: message_type.SMALL};
            
            dispatcher.dispatch("show_message", message);
            
            var message = { text: "chapter I ", type: message_type.MEDIUM};
            
            dispatcher.dispatch("show_message", message);
            
            var message = { text: "get some cigarettes", type: message_type.LARGE};
            
            dispatcher.dispatch("show_message", message);
            
            /*var message = { text: "I need some cigs...", type: message_type.LOCK_ON_PLAYER};
            message_model.addMessage(message);*/
        }
    };

})(window.berghain2 = window.berghain2 || {});