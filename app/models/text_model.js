(function (berghain2) {

	'use strict';

	var TextModel = function (dispatcher, lo, game, config) {

		lo.g("MODEL", "Text Model initiated for language: " + config.locale);

		this.localise = function(str) {
			var lang = config.locale;
			console.log("lang = " + lang);
			
			var loc = game.cache.getJSON("text");

			// return the specified string in the specified language
			return loc[str][lang];
		}
	};

	berghain2.TextModel = TextModel;

})(window.berghain2 = window.berghain2 || {});