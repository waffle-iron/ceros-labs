define([
    'lodash',
    'Howler',
    'modules/helpers',
    'modules/SoundComponent'
], function(_, Howler, helpers, SoundComponent) {

    'use strict';


    /**
     * Initializes a collection of SoundComponent(s), stores a director of names:ids
     *
     * @param {CerosSDK.CerosComponentCollection} cerosComponentCollection The collection of CerosComponents that contain sound files
     */
    var SoundComponents = function(cerosComponentCollection) {

        // Object to hold all of the SoundComponent(s)
        this.sounds = {};
        // Object to hold all of the name:id pairs
        this.names = {};

        // Holds urls that are already loading, improves load times/ bandwith drastically
        var cachedUrls = [];


        this.cerosComponentCollection = cerosComponentCollection;

        //TODO check what happens with empty payload
        _.forEach(this.cerosComponentCollection.components, function(soundComponent, soundComponentIndex) {

            var preload = true;
            var url = soundComponent.getPayload();

            // If the url is being loaded elsewhere, cancels preload
            if (cachedUrls.indexOf(url) > -1) {
                preload = false;
            } else {
                cachedUrls.push(url);
            }
            this.sounds[soundComponent.id] = new SoundComponent(soundComponent, preload);

            var name = this.sounds[soundComponent.id].getName();

            if (name !== null) {
                this.names[name] = soundComponent.id;
            }

        }.bind(this));

    };

    SoundComponents.prototype = {


        /**
         * Dispatches the event to every sound in this.sounds
         *
         * @param {CreateJs.Event} evt Event that will be dispatched
         */
        dispatchAll: function(evt) {
            _.forEach(this.sounds, function(soundComponent, key) {
                soundComponent.dispatch(evt);
            });
        },

        /**
         * Dispatches the event to every sound specified
         *
         * @param {CreateJs.Event} evt Event that will be dispatched
         * @param {Array} soundIds The ids of the sounds to dispatch event to
         */
        dispatch: function(evt, soundIds) {
            for (var i = 0; i < soundIds.length; i++) {
                var currentSoundId = soundIds[i];
                // Verifies that there is a sound for each id before dispatching event
                if (this.sounds.hasOwnProperty(currentSoundId)) {
                    this.sounds[currentSoundId].dispatch(evt);
                }

            }
        },


        /**
         * Returns the Id of a sound with the given name, if none exists, returns false
         *
         * @param {String} name Name that will be checked for a match
         * @returns {String || Boolean} 
         */
        nameMatch: function(name) {
            if (this.names.hasOwnProperty(name)) {
                return this.names[name];
            }
            return null;
        }

    };

    return SoundComponents;



});