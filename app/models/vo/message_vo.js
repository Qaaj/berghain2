(function(berghain2) {

	'use strict';
	
	
								 
	var MessageVO = function(id, text, MESSAGE_TYPE) {
		//lo.g("MODEL","Message Model Initiated");
		console.log("> MESSAGE VO");
		this.MESSAGE_TYPE = {
			 				SMALL : 1, 
							MEDIUM : 2,
							LARGE : 3,
							
							//https://stijndewitt.wordpress.com/2014/01/26/enums-in-javascript/
							properties: {
							    1: {name: "small", value: 1, code: "S"},
							    2: {name: "medium", value: 2, code: "M"},
							    3: {name: "large", value: 3, code: "L"}
							  }
							  
							  //var myCode = MESSAGE_TYPE.properties[mySize].code; // myCode == "M"  
							}
							
		 this.id = id;
		 this.text = text;
		 this.type = "small";
		 this.isWaitingForUserInteraction = false;
	};
	
	berghain2.MessageVO = MessageVO;

})(window.berghain2 = window.berghain2 || {});