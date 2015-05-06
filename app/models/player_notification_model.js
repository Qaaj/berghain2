(function (berghain2) {

	'use strict';

	var PlayerNotificationModel = function (dispatcher, input, lo, config, game) {
		lo.g("MODEL", "Player Notification Model instantiated");

		this.currentMessage;// = new berghain2.MessageVO(0, "Standard Message", berghain2.MessageVO.MESSAGE_TYPE		);
		this.messagesIndexesDictionary = {};
		this.messages = [];
		this.isTweening = false;
		 
		this.addMessage = function (messageObj) {
			lo.g("MODEL", "Received player notification: " + messageObj.text);

			var messageID = messageObj.id;

			if (this.messagesIndexesDictionary[messageID] == null){
				var message = new berghain2.MessageVO(messageID, messageObj.text, messageObj.messageType);
				
				lo.g("MODEL", "Adding player notification to que with text " + messageObj.text + " & type fontsize " + messageObj.messageType.fontSize);
				
				this.messagesIndexesDictionary[messageID] = messageObj;
				this.currentMessage = message;
				this.messages.push(message);

				lo.g("MODEL", "" + this.messages.length + " player notifications in que");
			}
		}
 
		this.removeMessage = function (message) {
			lo.g("MODEL", "Removing player notification from que: " + message.text);

			var messageID = message.id;
			this.messagesIndexesDictionary[messageID] = null;

			lo.g("MODEL", "Message was nulled: " + this.messagesIndexesDictionary[messageID]);

			this.setCurrentMessageToNextMessageInQue();
		}
		
		this.removeLastMessageFromQue = function () {
			lo.g("MODEL", "Removing last player notification from que");

			var message = this.messages[0]
			this.messages.splice(0, 1);
			this.messagesIndexesDictionary[message.id] = null;
			
			lo.g("MODEL", "" + this.messages.length + " player notifications in que");
		}

		this.setCurrentMessageToNextMessageInQue = function () {
			if (this.message != null) {
				this.currentMessage = this.messsages[0];
			} else {
				this.currentMessage = null;
			}
		}
	};

	berghain2.PlayerNotificationModel = PlayerNotificationModel;

})(window.berghain2 = window.berghain2 || {});