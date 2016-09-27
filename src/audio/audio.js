/**
 * Ceros Plugin for HowlerJs
 * @version 0.9.0
 * @support support@ceros.com
 *
 * This plugin is licensed under the MIT license. A copy of this license and
 * the accompanying source code is available at https://github.com/ceros/ceros-plugins
 */

(function() {
    'use strict';

    var scriptTag = document.getElementById("ceros-audio-plugin");

    // Calculate an absolute URL for our modules, so they're not loaded from view.ceros.com if lazy loaded
    var absUrl,
        srcAttribute = scriptTag.getAttribute("src");

    // Check that a src attibute was defined, and code hasn't been inlined by third party
    if (typeof srcAttribute !== "undefined") {
        var path = srcAttribute.split('?')[0];
        absUrl = path.split('/').slice(0, -1).join('/') +'/';        
    } else {
        absUrl = "./"
    }

    require.config({
        paths: {
            CerosSDK: "//sdk.ceros.com/standalone-player-sdk-v3",
            Howler: "https://cdnjs.cloudflare.com/ajax/libs/howler/2.0.0/howler",
            lodash: "https://cdn.jsdelivr.net/lodash/4.14.0/lodash.min",
            modules: absUrl + "modules"
        }
    });

    require([
        'CerosSDK',
        'Howler',
        'lodash',
        'modules/SoundComponents'
    ], function(CerosSDK, Howler, _, SoundComponents) {
        CerosSDK.findExperience().done(function(cerosExperience) {


            var componentsWithSound = cerosExperience.findComponentsByTag("playsound");
            var componentsWithEvent = cerosExperience.findComponentsByTag("sound-click");

            //creates the SoundComponents object that holds all of the soundjs sounds
            var sounds = new SoundComponents(componentsWithSound);



            /**
             * Finds the id's of all the sounds the event will fire on
             * Targets taken from component tags
             *
             * @param {CerosSDK.CerosComponent} component
             * @returns {Array}
             */
            var getTargetComponentIds = function(component) {

                var tags = component.getTags();
                var targets = [];

                _.forEach(tags, function(value, key) {
                    if (value.indexOf("target:") > -1) {
                        var target = value.slice(7, value.length);
                        targets.push(target);
                    }
                });

                // Check if each of the targets is an id or name
                for (var i = 0; i < targets.length; i++) {

                    // If name, replaces with the corresponding sound id
                    if (sounds.nameMatch(targets[i]) !== null) {
                        targets[i] = sounds.nameMatch(targets[i]);
                    }
                }

                // If no proper targets were found, returns own component id as target
                if (targets.length === 0) {
                    targets.push(component.id);
                }

                return targets;

            };



            /**
             * Reads tags of an event component, and dispatches the proper event(s)
             *
             * @param {CerosSDK.CerosComponent} component
             */
            var parseEventComponentTags = function(component) {
                var evtName = null;

                var tags = component.getTags();

                var soundIds = getTargetComponentIds(component);

                _.forEach(tags, function(value, key) {
                    if (value.indexOf("event:") > -1) {
                        evtName = value.slice(6, value.length);
                        sounds.dispatch(evtName, soundIds);
                    } else if (value.indexOf("eventall:") > -1) {
                        evtName = value.slice(9, value.length);
                        sounds.dispatchAll(evtName);
                    }

                });
            };


            componentsWithEvent.subscribe(CerosSDK.EVENTS.CLICKED, function(component) {
                parseEventComponentTags(component);
            });


        });
    });
})();