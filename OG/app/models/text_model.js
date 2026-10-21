(function(berghain2) {

    'use strict';

    var TextModel = function(dispatcher, lo, game, config) {

        lo.g("MODEL", "Text Model initiated for language: " + config.locale);

        var loc;

        window.txtmodel = this;

        this.localise = function(str) {
            
            var lang = config.locale;

            if (!loc) {
                lo.g("MODEL", "Caching languages.json in: " + config.locale);
                loc = game.cache.getJSON("text");
            }

            window.test = this;

            var lowercaseSearchString = str.toLowerCase();

            var searchString = lang + "." + lowercaseSearchString;

            var fetchFromObject = function(obj, prop) {
                //property not found
                if (typeof obj === 'undefined') return "Dictionary Error";

                //index of next property split
                var _index = prop.indexOf('.')

                //property split found; recursive call
                if (_index > -1) {
                    //get object at property (before split), pass on remainder
                    return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
                }

                //no split; get property
                return obj[prop];
            }

            var result = fetchFromObject(loc, searchString);

            return result;

            // var text;
            // try {
            //     var jsonType = loc[lowercaseSearchString][lang];

            //     // Check if loaded text is a string or an array (array used by speech randomizer)
            //     if (Object.prototype.toString.call(jsonType) === '[object Array]') {
            //         var arr = [];
            //         arr = loc[lowercaseSearchString][lang];

            //         var notificationsLength = arr.length;
            //         var randomNotificationID = Math.floor(this.getRandomNumber(0, notificationsLength));

            //         text = arr[randomNotificationID];
            //     } else {
            //         text = loc[lowercaseSearchString][lang];
            //     }
            // } catch (err) {
            //     text = "404:" + lowercaseSearchString;

            //     throw "> ERROR! Couldn't find languages.json key: '" + lowercaseSearchString + "' in " + lang;
            // }

            // // return the specified string in the specified language
            // return text;
        }



        this.getRandomNumber = function(min, max) {
            return Math.random() * (max - min) + min;
        }
    };

    berghain2.TextModel = TextModel;

})(window.berghain2 = window.berghain2 || {});