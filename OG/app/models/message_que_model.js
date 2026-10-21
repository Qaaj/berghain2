(function(berghain2) {

	'use strict';

	var MessageQueModel = function(dispatcher,input,lo,config,game) {
		
		lo.g("MODEL","Message Model Initiated");
		 
		 this.currentMessage;// = new berghain2.MessageVO(0, "Standard Message", berghain2.MessageVO.MESSAGE_TYPE		);
		 this.messages = [];
		 this.isTweening = false;
		 
		 this.addMessage = function(messageObj){
			lo.g("MODEL","Adding message to message que model with type " + messageObj.messageType);
			
			var messageID = this.messages.length;
			
			var message = new berghain2.MessageVO(messageID, messageObj.text, messageObj.messageType);
			
			this.currentMessage = message;
			this.messages.push(message);
		}
		
		this.removeLastMessageFromQue = function(){
			lo.g("MODEL","Removing last message from message que model");
			
			this.messages.splice(0, 1);			
			this.setCurrentMessageToNextMessageInQue();
		}
		
		this.setCurrentMessageToNextMessageInQue = function(){
			if ( this.message != null ){
				this.currentMessage = this.messsages[0];
			}else{
				this.currentMessage = null;
			}
		}
	};
	
	berghain2.MessageQueModel = MessageQueModel;

})(window.berghain2 = window.berghain2 || {});