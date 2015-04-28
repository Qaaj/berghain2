(function(berghain2) {

    'use strict';

    berghain2.StartApplication = function(dispatcher, lo, config) {

        this.execute = function(event) {

            lo.g("APPLICATION", "Application Starting");

            if (config.debug == true) {
                lo.g("APPLICATION", "DEBUG MODE ON");
            }

        };

    };

})(window.berghain2 = window.berghain2 || {});