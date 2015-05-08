(function (berghain2) {

	'use strict';

	var PlayerNotificationModel = function (dispatcher, input, lo, config, game) {
		lo.g("MODEL", "Player Notification Model instantiated");

		this.currentMessage;
		this.messages = {};
		this.isTweening = false;

		var messages =  '{ "employees" : [' +
'{ "firstName":"John" , "lastName":"Doe" },' +
'{ "firstName":"Anna" , "lastName":"Smith" },' +
'{ "firstName":"Peter" , "lastName":"Jones" } ]}';

		this.addMessage = function (messageObj) {
			var messageID = messageObj.uid;//Object.keys(this.messages).length;

			if (typeof this.messages[messageID] !== undefined) {
				var message = new berghain2.MessageVO(messageID, messageObj.text, messageObj.messageType);

				lo.g("MODEL", "Adding player notification to que with text " + messageObj.text + " & type fontsize " + messageObj.messageType.fontSize);
				
				this.messages[messageID] = message;
				this.currentMessage = message;
			}
		}

		this.removeMessage = function (message) {
			lo.g("MODEL", "Removing player notification from que: " + message.id);

			var messageID = message.id;
			delete this.messages[messageID];

			this.currentMessage = this.setCurrentMessageToNextMessageInQue();
		}

		this.setCurrentMessageToNextMessageInQue = function () {
			this.currentMessage = this.getNextPlayerNotificationInQue();
		}

		this.getNextPlayerNotificationInQue = function () {
			var id = Object.keys(this.messages).length;
			var nextMessageId = id;
			
			for (var key in this.messages) {
				if (this.messages.hasOwnProperty(key)) {
					if ( key < nextMessageId ){
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