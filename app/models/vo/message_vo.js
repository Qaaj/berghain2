(function (berghain2) {

	'use strict';

	var MessageVO = function (id, text, message_type) {		
		this.id = id;
		this.text = text;
		this.type = message_type;
		this.isWaitingForUserInteraction = false;
		
		//this.toString = function() { return "" + this.id + " " + this.text}
	};

	berghain2.MessageVO = MessageVO;

})(window.berghain2 = window.berghain2 || {});