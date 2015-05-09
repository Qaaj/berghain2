(function (berghain2) {

	'use strict';

	var TextModel = function (dispatcher, lo, game, config) {

		lo.g("MODEL", "Text Model initiated for language: " + config.locale);

		var loc;

		this.localise = function (str) {
			var lang = config.locale;
			console.log("lang = " + lang);

			if (!loc) {
				lo.g("MODEL", "Caching languages.json in: " + config.locale);
				loc = game.cache.getJSON("text");
			}

			var lowercaseSearchString = str.toLowerCase();

			var text;
			try {				
				var jsonType = loc[lowercaseSearchString][lang];

				// Check if loaded text is a string or an array (array used by speech randomizer)
				if (Object.prototype.toString.call(jsonType) === '[object Array]') {					
					var arr = [];
					arr = loc[lowercaseSearchString][lang];

					var notificationsLength = arr.length;
					var randomNotificationID = Math.floor(this.getRandomNumber(0, notificationsLength));

					text = arr[randomNotificationID];
				}else{					
					text = loc[lowercaseSearchString][lang];
				}
			}
			catch (err) {
				text = "404:" + lowercaseSearchString;

				throw "> ERROR! Couldn't find languages.json key: '" + lowercaseSearchString + "' in " + lang;
			}

			// return the specified string in the specified language
			return text;
		}

		this.getRandomNumber = function (min, max) {
			return Math.random() * (max - min) + min;
		}
	};

	berghain2.TextModel = TextModel;

})(window.berghain2 = window.berghain2 || {});