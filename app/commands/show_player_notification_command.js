(function (berghain2) {

    'use strict';

    berghain2.ShowPlayerNotificationCommand = function (lo, config, game, player_model, message_type, mediators, player_notification_model, dispatcher) {

        var screenWidth = 0;
        var centerX = 0;

        var screenHeight = 0;
        var centerY = 0;

        var font = "carrier_command";
        var fontSize = 34;

        this.execute = function (event) {
            lo.g("COMMAND", "Show player notification: ");

            if (event.params) {
                var currentMessage = event.params;
                player_notification_model.addMessage(currentMessage);
            }

            if (!player_notification_model.isTweening) {
                var notif = player_notification_model.getNextPlayerNotificationInQue();

                if (typeof notif !== "undefined") {
                    player_notification_model.isTweening = true;

                    currentMessage = notif;
                    showMessage(currentMessage);
                }
            }
        }

        function showMessage(currentMessage) {         
            setScreenSettings();
            createMessageThatLocksOnPlayerPosition(currentMessage);
        }

        function setScreenSettings() {
            screenWidth = game.width;
            centerX = screenWidth / 2;

            screenHeight = game.height;
            centerY = screenHeight / 2;
        }

        function createMessageThatLocksOnPlayerPosition(currentMessage) {
            var text = new berghain2.MessageView(game, currentMessage, dispatcher, player_notification_model);
            mediators.create(berghain2.MessageMediator, text);
        }
    };

})(window.berghain2 = window.berghain2 || {});