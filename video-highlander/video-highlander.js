

require.config({
    paths: {
        CerosSDK: 'https://sdk.ceros.com/standalone-player-sdk-v4.min'
    }
});

require(['CerosSDK'], function(CerosSDK) {
    CerosSDK.findExperience()
      .fail(function(err){
        console.error("Error:", err);
      })
      .done(function(experience){

        (function (){


        var videoComponents = experience.findComponentsByTag("video"), // find components tagged "video"
            videoDOM = document.getElementsByTagName("video"), // array of DOM elements that hold the videos
            videosPlayingLastCycle = [], // check current vs previous
            repeat, // repeat calls setTimeout on checkVideos at repeatInterval so play/pause state is checked every X milliseconds
            repeatInterval = 100;

        // set all videos to be paused initially
        for(var i = 0; i < videosPlayingLastCycle.length; i++)
        {
          videosPlayingLastCycle[i] = false;
        }



        // count the number of videos that are currently playing
        var playingVideosCount = function()
        {
          var count = 0;
          for(var i = 0; i < videoDOM.length; i++)
          {
            if(videoDOM[i].paused == false)
            { // if the paused property of the video's DOM element is false, that means it's currently playing
              count++;
            }
          }
          return count;
        };

        // pause all videos that were playing during the last check cycle
        var pausePreviouslyPlayingVideos = function ()
        {
          // pause all videos that were playing last check cycle, which ignores the newly playing video
          for(var i = 0; i < videosPlayingLastCycle.length; i++)
          {
            if(videosPlayingLastCycle[i] == true)
            {
              videoDOM[i].pause();
            }
          }
        };

        // update the list of video play/pause states, called at the end of the check cycle
        var updatePlayingLastCheck = function ()
        {
          for(var i = 0; i < videoDOM.length; i++)
          {
            if (videoDOM[i].paused) // video is not currently playing
            {
              videosPlayingLastCycle[i] = false;
            }
            else // video is currently playing
            {
              videosPlayingLastCycle[i] = true;
            }
          }
        };

        // check the states of all videos and pause as necessary
        var checkVideos = function ()
        {
          // if there is more than one video playing currently
          if(playingVideosCount() > 1)
          {
            // pause all videos that were playing last check cycle, leaving only the newly played video
            pausePreviouslyPlayingVideos();
          }
          // update the list of video play/pause states
          updatePlayingLastCheck();

          repeat = setTimeout(checkVideos, repeatInterval);
        };

        checkVideos();

        })();
      });
  });
