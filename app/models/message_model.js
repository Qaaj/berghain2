(function(berghain2) {

	'use strict';

	var MessageModel = function(dispatcher,input,lo,config,game) {
		lo.g("MODEL","Message Model Initiated");
		 
		 this.currentMessage;// = new berghain2.MessageVO(0, "Standard Message", berghain2.MessageVO.MESSAGE_TYPE		);
		 this.messages = [];
		 this.isTweening = false;
		 
		 this.addMessage = function(message){
			lo.g("MODEL","Adding message to que");
			
			var messageID = this.messages.length;
			
			var message = new berghain2.MessageVO(messageID, message.text, berghain2.MessageVO.MESSAGE_TYPE);
			
			this.currentMessage = message;
			this.messages.push(message);
			
			lo.g("MODEL","" + this.messages.length + " messages in que");
		}
		
		this.removeLastMessageFromQue = function(){
			lo.g("MODEL","Removing last message from que");
			
			this.messages.splice(0, 1);
			
			lo.g("MODEL","" + this.messages.length + " messages in que");
			
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
	
	berghain2.MessageModel = MessageModel;

})(window.berghain2 = window.berghain2 || {});