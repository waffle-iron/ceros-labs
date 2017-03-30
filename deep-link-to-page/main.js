(function () {
    'use strict';

    var scriptTag = document.getElementById("ceros-deep-link"),
        pageParamName = scriptTag.getAttribute("data-page-param") || "page";

    /**
     * Class to parse a URL
     *
     * @param {String} url
     * @constructor
     */
    var Url = function(url) {
        this.url = url;
    };

    Url.prototype = {
        /**
         * Get value for query string param
         *
         * @param {string} name
         * @param {*=null} defaultValue
         * @return {*}
         */
        getQueryStringParameter: function(name, defaultValue) {

            defaultValue = defaultValue || null;

            var queryString = this.url.substring(
                this.url.indexOf('?') + 1
            );

            var params = queryString.split('&');

            for (var i = 0; i < params.length; i++) {

                var p = params[i].split('=');

                if (p[0] == name) {
                    return decodeURIComponent(p[1]);
                }
            }

            return defaultValue;
        }
    };

    require.config({
        paths: {
            CerosSDK: "//sdk.ceros.com/standalone-player-sdk-v4.min"
        }
    });

    // if we have a referrer
    if (typeof document.referrer !== "undefined") {

        require(['CerosSDK'], function (CerosSDK) {

            CerosSDK.findExperience()
                .fail(function (error) {
                    console.error(error);
                })
                .done(function (experience) {

                    var referringUrl = new Url(document.referrer);

                    var requiredPageStr = referringUrl.getQueryStringParameter(pageParamName);

                    var requiredPageInt = parseInt(requiredPageStr);

                    // If we were able to parse it...
                    if (requiredPageInt) {
                        // Go to the required page
                        experience.goToPage(requiredPageInt);
                    }
                });

        });
    }


})();