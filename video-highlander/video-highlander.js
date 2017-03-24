

require.config({
    paths: {
        CerosSDK: 'https://sdk.ceros.com/standalone-player-sdk-v4.min',
        jQuery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min'
    }
});

require(['CerosSDK'], function(CerosSDK) {
    CerosSDK.findExperience()
      .fail(function(err){
        console.error("Error:", err);
      })
      .done(function(experience){

        // find components tagged "video"
        var videos = experience.findComponentsByTag("video");

        // array of DOM elements that hold the videos
        var videoDOM = document.getElementsByTagName("video");

        // check current vs previous
        var videosPlayingLastCycle = new Array(videos.length);

        // repeat calls setTimeout on checkVideos at repeatInterval so play/pause state is checked every X milliseconds
        var repeat;
        var repeatInterval = 100;

        // set all videos to be paused initially
        for(var i = 0; i < videosPlayingLastCycle.length; i++)
        {
          videosPlayingLastCycle[i] = false;
        }



        // count the number of videos that are currently playing
        function playingVideosCount()
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
        function pausePreviouslyPlayingVideos()
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
        function updatePlayingLastCheck()
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
        function checkVideos()
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

      });
  });
