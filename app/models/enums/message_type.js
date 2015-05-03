(function (berghain2) {

	'use strict';

	 berghain2.MessageType = function () {
 		
		// Free interpretation of https://stijndewitt.wordpress.com/2014/01/26/enums-in-javascript/
		this.SMALL = { id: 1, name: "small", code: "S", fontSize: 10 };
		this.MEDIUM = { id: 2, name: "medium", code: "M", fontSize: 15 };
		this.LARGE = { id: 3, name: "large", code: "L", fontSize: 20 };
		
		this.LOCK_ON_PLAYER = { id: 50, name: "lockOnPlayer", code: "P", fontSize: 8 };
	};

})(window.berghain2 = window.berghain2 || {});