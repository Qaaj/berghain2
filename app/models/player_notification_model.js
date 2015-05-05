(function (berghain2) {

	'use strict';

	var PlayerNotificationModel = function (dispatcher, input, lo, config, game) {
		lo.g("MODEL", "Player Notification Model Initiated");

		this.currentMessage;// = new berghain2.MessageVO(0, "Standard Message", berghain2.MessageVO.MESSAGE_TYPE		);
		this.messagesIndexesDictionary = {};
		this.messages = [];
		this.isTweening = false;
		 
		/* this.addMessage = function(messageObj){
			lo.g("MODEL","Adding message to que with type " + messageObj.type);
			
			var messageID = this.messages.length;
			
			var message = new berghain2.MessageVO(messageID, messageObj.text, messageObj.type);
			
			this.currentMessage = message;
			this.messages.push(message);
			
			lo.g("MODEL","" + this.messages.length + " messages in que");
		}*/

		this.addMessage = function (messageObj) {
			lo.g("MODEL", "Adding player notification to que with type " + messageObj.type);

			var messageID = messageObj.id;

			var message = new berghain2.MessageVO(messageID, messageObj.text, messageObj.type);

			console.log(this.messagesIndexesDictionary[messageID]);

			if (this.messagesIndexesDictionary[messageID] == null){
				this.messagesIndexesDictionary[messageID] = messageObj;
				this.currentMessage = message;
				this.messages.push(message);

				lo.g("MODEL", "" + this.messages.length + " player notifications in que");
			}
		}

		this.removeLastMessageFromQue = function () {
			lo.g("MODEL", "Removing last player notification from que");

			this.messages.splice(0, 1);

			lo.g("MODEL", "" + this.messages.length + " player notifications in que");

			this.setCurrentMessageToNextMessageInQue();
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