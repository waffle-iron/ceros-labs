define(['lodash', 'Howler', 'modules/helpers'], function(_, Howler, helpers) {
    'use strict';



    /*
     * Class that holds the SoundJs sound Object as well as other options
     * Sounds are stored as a CreateJs.AbstractSoundInstance
     * Contains every method related to handling playback events
     * @param {CerosComponent} cerosComponent The component whose payload/tags will be used to create the SoundComponent
     */
    var SoundComponent = function(cerosComponent, preloadSetting) {

        this.funcs = {};

        //Defaults settings for sounds
        this.soundDefaults = {
            preload: preloadSetting,
            shown: false,
            start: 0, //in milliseconds
            duration: null,
            interrupt: false,
            fastforwardtime: 3000, //in milliseconds
            rewindtime: 3000, //in milliseconds
            fadeintime: 2000, // fade in time in milliseconds
            fadeouttime: 1000, // fade out time in milliseconds
            html5: false, //if true, forces html5, needed for streams
            stream: false,
            format: [],
            volume: 100, //percentage
            rate: 100, //percentage

        };


        this.cerosComponent = cerosComponent;
        this.id = cerosComponent.id;

        var url = cerosComponent.getPayload();


        // Used for fixing download link
        // Removes any parameters so correct file format is discovered
        // www.dropbox.com links do not work, instead that must be changed to dl.dropboxusercontent.com
        // @param {String} url Url to be fixed

        var fixedUrl = url.split('?')[0];
        var dropboxUrl = "www.dropbox.com";
        var dropboxFix = "dl.dropboxusercontent.com";
        var dropboxLoc = fixedUrl.indexOf("www.dropbox.com");
        //if dropbox link, swap out correct link
        if (dropboxLoc > -1) {
            fixedUrl = fixedUrl.slice(0, dropboxLoc) +
                dropboxFix +
                fixedUrl.slice(dropboxLoc + dropboxUrl.length, fixedUrl.length);
        }
        this.url = fixedUrl;


        var componentOptions = helpers.optionsForComponent(this.cerosComponent, this.soundDefaults);
        this.soundOptions = componentOptions;
        // Parsing in the sound options allows for more customization in the studio
        // This does allow for clients to break a couple things, but they would have to set out to do so
        // Only easy one is i

        // This converts time options from ms to seconds
        this.soundOptions.start /= 1000;
        this.soundOptions.fastforwardtime /= 1000;
        this.soundOptions.rewindtime /= 1000;

        // This converts percentages to decimals
        this.soundOptions.volume /= 100;
        this.soundOptions.rate /= 100;



        // Set background looping/playing settings
        var autoplaySetting = false;
        var loopSetting = false;
        if (this.soundOptions.hasOwnProperty("background")) {
            if (this.soundOptions.background == "play") {
                autoplaySetting = true;
            } else if (this.soundOptions.background == "loop") {
                autoplaySetting = true;
                loopSetting = true;
            }
        }


        //If format is specified, must be set as an array
        if (this.soundOptions.format.length !== 0) {
            this.soundOptions.format = [this.soundOptions.format];
        }

        // Set proper stream settings if it is a stream
        if (this.soundOptions.stream) {

            this.soundOptions.html5 = true;
            this.soundOptions.preload = false;
            this.soundOptions.rate = 1;
            if (this.soundOptions.format.length === 0) {
                this.soundOptions.format = ['mp3']; //defaults to mp3 files for streams
            }
        }


        // Creates a sound instance of the loaded file
        this.sound = new Howl({
            src: [this.url],
            autoplay: autoplaySetting,
            loop: loopSetting,
            html5: this.soundOptions.html5,
            format: this.soundOptions.format,
            volume: this.soundOptions.volume,
            rate: this.soundOptions.rate,
            preload: this.soundOptions.preload,
        });



        // custom events that can be triggered through component events
        // .bind(this) needed to keep this consistent when functions are called
        this.funcs["mute"] = this.handleMute.bind(this);
        this.funcs["play"] = this.handlePlay.bind(this);
        this.funcs["pause"] = this.handlePause.bind(this);
        this.funcs["reset"] = this.handleReset.bind(this);
        this.funcs["toggle"] = this.handleToggle.bind(this);
        this.funcs["loop"] = this.handleLoop.bind(this);
        this.funcs["looptoggle"] = this.handleLoopToggle.bind(this);
        this.funcs["fastforward"] = this.handleFastForward.bind(this);
        this.funcs["rewind"] = this.handleRewind.bind(this);
        this.funcs["stop"] = this.handleStop.bind(this);
        this.funcs["fadeout"] = this.handleFadeOut.bind(this);
        this.funcs["fadein"] = this.handleFadeIn.bind(this);

    };



    SoundComponent.prototype = {


        /**
         * Custom function for playing sounds
         * If sound is already playing, and this.interrupt is true, the sound is interrupted and played again
         */
        play: function() {

            // Checks if song has been loaded yet, if not, then loads it

            if (!this.soundOptions.preload) {
                this.sound.on('load', function() {
                    this.soundOptions.preload = true;
                    this.play();
                }.bind(this));

                this.sound.load();

                return;
            }
            var startTime = this.soundOptions.start; //ms to seconds
            if (this.sound.seek() < startTime) {
                this.sound.seek(startTime); //sets the seek to start time IN SECONDS
            }
            if (this.soundOptions.interrupt) {
                this.interrupt();
            }

            if (!this.sound.playing()) {
                this.sound.play();
            }

        },



        /**
         * If sound is already playing, stops sound and plays it from beginning
         */
        interrupt: function() {
            if (this.sound.playing()) {
                this.sound.stop();
                this.play();
            }
        },


        // EVENT HANDLERS

        /**
         * Toggles the volume on a sound
         */

        //TODO Must check to see if it toggles or not
        handleMute: function() {
            if (this.sound.mute()) {
                this.sound.mute(false);
            } else {
                this.sound.mute(true);
            }
        },

        /**
         * Plays the sound
         */
        handlePlay: function() {
            this.play();
        },

        /**
         * Pauses the sound
         */
        handlePause: function() {
            this.sound.pause();
        },

        /**
         * Plays the sound. Subsequent clicks will pause/play the sound
         */
        handleToggle: function() {

            if (this.sound.playing()) {
                this.sound.pause();
            } else {
                this.play();
            }
        },

        /**
         * Resets and plays the sound from the beginning
         */
        handleReset: function() {
            this.sound.seek(this.soundOptions.start);
        },

        /**
         * Plays the sound and sets it to loop indefinitely.
         */
        handleLoop: function() {
            this.sound.loop(true);
            this.play();
        },

        /**
         * Plays the sound(s) and sets it to loop indefinitely.  Subsequent clicks will play/pause the sound.
         */
        handleLoopToggle: function() {
            this.sound.loop(true);
            this.handleToggle();
        },

        /**
         * Fast forwards the sound by 1 second, whether it's playing or paused.  Does not play/unpause sounds.
         */
        handleFastForward: function() {
            var jumpTime = this.soundOptions.fastforwardtime;
            var currentTime = this.sound.seek();
            this.sound.seek(currentTime + jumpTime);
        },

        /**
         * Fast forwards the sound by the time specified in settings (default: 3 seconds)
         * Triggers whether it's playing or paused.  Does not play/unpause paused sounds.
         */
        handleRewind: function() {
            var startTime = this.soundOptions.start;
            var jumpTime = this.soundOptions.rewindtime;
            var currentTime = this.sound.seek();
            if ((currentTime - jumpTime) >= startTime) {
                this.sound.seek(currentTime - jumpTime);

            } else {
                // If rewind would send it earlier than startTime, send it to startTime
                this.sound.seek(startTime);
            }
        },

        /**
         * Fades the volume from 0 to the volume in soundOptions  (default: 2 second)
         * Plays the sound when done.
         */
        handleFadeIn: function() {
            //Need to decide what to do about interrupts, and repeated clicks...

            //Only triggers if the sound is not playing
            if (!this.sound.playing()) {
                this.sound.volume(0); //sets volume to 0 before playing
                this.play();
                this.sound.fade(0, this.soundOptions.volume, this.soundOptions.fadeintime);
            }
        },

        /**
         * Fades the volume from the set volume to 0  (default: 1 second)
         * Stops the sound when done.
         */
        handleFadeOut: function() {
            this.sound.fade(this.sound.volume(), 0, this.soundOptions.fadeouttime);

            //delays the stop until the fadeout has finished
            _.delay(function() {
                this.handleStop();
            }.bind(this), this.soundOptions.fadeouttime);
        },



        /**
         * Stops the sound
         */
        handleStop: function() {
            this.sound.stop();
        },



        /**
         *  Dispatches the event to this.sound
         *
         * @param {String} func Event name of function to call
         */
        dispatch: function(evtName) {

            // NOTE: dispatchEvent, sends the object it is called on as "this" to the handle function.
            // in this case this.sound becomes this in the handle function
            if (this.funcs.hasOwnProperty(evtName)) {
                this.funcs[evtName]();
            }
        },

        /**
         * If component has name tag, returns name, otherwise returns false
         * @returns {String || null}
         */
        getName: function() {
            if (this.soundOptions.hasOwnProperty("name")) {
                return this.soundOptions.name;
            }
            return null;
        }



    };

    return SoundComponent;



});