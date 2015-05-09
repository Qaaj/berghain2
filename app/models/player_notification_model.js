(function (berghain2) {

	'use strict';

	var PlayerNotificationModel = function (dispatcher, input, lo, config, game) {
		lo.g("MODEL", "Player Notification Model instantiated");

		this.currentMessage;
		this.messages = {};
		this.isShowingNotification = false;

		this.addMessage = function (messageObj) {
			var messageID = messageObj.text;//Object.keys(this.messages).length;

			if (typeof this.messages[messageID] !== undefined) {
				lo.g("MODEL", "Adding player notification to que with text " + messageObj.text + " & type fontsize " + messageObj.type.fontSize);

				this.messages[messageID] = messageObj;
			}
		}

		this.removeMessage = function (message) {
			var messageID = message.id;

			lo.g("MODEL", "Removing player notification from que: " + message.id);

			delete this.messages[messageID];
			this.currentMessage = null;
		}

		this.setCurrentMessageToNextMessageInQue = function () {
			this.currentMessage = this.getNextPlayerNotificationInQue();
		}

		this.getNextPlayerNotificationInQue = function () {
			var id = Object.keys(this.messages).length;
			var nextMessageId = id;

			for (var key in this.messages) {
				if (this.messages.hasOwnProperty(key)) {
					if (key < nextMessageId) {
						nextMessageId = key;
					}
				}
			}

			var message = this.messages[key];
			return message;
		}
	};

	berghain2.PlayerNotificationModel = PlayerNotificationModel;

})(window.berghain2 = window.berghain2 || {});