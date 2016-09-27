define(['lodash'], function(_) {
    'use strict';

    var parseTagExpression = new RegExp("([^:]+):(.+)$", "i");

    return {

        /**
         * Parse tags applied to a component, taking defaults from
         * its Page and the ExperienceDefaultOptions in Registry
         *
         * @param {CerosSDK.CerosComponent} component
         * @returns {*​}
         */
        optionsForComponent: function(component, componentDefaults) {

            var componentOptions = this.parseArrayOfTags(component.getTags());

            //NOTE MAY HAVE TO USE _.defaultsDeep
            var options = _.defaultsDeep(
                componentOptions,
                componentDefaults
            );
            return options;

        },

        /**
         * Turn ["option-one:x", "option-two:y"] into {option-one: "x", option-two: "y"}
         *
         * @param {Array} tags
         * @returns {Object}
         */
        parseArrayOfTags: function(tags) {
            var result = {};

            // For every tag
            for (var i = 0; i < tags.length; i++) {

                var matches = tags[i].match(parseTagExpression);

                // If tag matched naming convention
                if (matches) {

                    var val = matches[2];

                    //converts to bool if string is 'true' or 'false'
                    matches[2] = val === 'true' || (val === 'false' ? false : val);

                    //if string is a number, parses to int
                    if (!isNaN(val)) {
                        matches[2] = parseInt(matches[2], 10);
                    }

                    result[matches[1]] = matches[2];
                }
            }

            return result;
        }
    };
});