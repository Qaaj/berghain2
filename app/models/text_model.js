(function (berghain2) {

	'use strict';

	var TextModel = function (dispatcher, lo, game, config) {

		lo.g("MODEL", "Text Model initiated for language: " + config.locale);

		this.localise = function(str) {
			var lang = config.locale;
			console.log("lang = " + lang);
			
			var loc = game.cache.getJSON("text");

			var lowercaseSearchString = str.toLowerCase();
			
			var text;
			try {
			     text = loc[lowercaseSearchString][lang];
			}
			catch(err) {
				text = "???";
			    console.log("> ERROR! Couldn't find languages.json key " + lowercaseSearchString + " in " + lang);
			}

			// return the specified string in the specified language
			return text;
		}
	};

	berghain2.TextModel = TextModel;

})(window.berghain2 = window.berghain2 || {});