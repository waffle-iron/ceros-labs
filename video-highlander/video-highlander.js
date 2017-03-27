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

        var videoDOM = document.getElementsByTagName("video"); // array of DOM elements that hold the videos

        var pauseAllOtherVideos = function (e)
        {
          console.log("Pausing all videos but the most recently played...");
          for (var i = 0; i < videoDOM.length; i++)
          {
            if (videoDOM[i].id != e.target.id)
            {
              videoDOM[i].pause();
            }
          }
        };

        var createEventListeners = function ()
        {
          for(var i = 0; i < videoDOM.length; i++)
          {
            videoDOM[i].addEventListener('playing', pauseAllOtherVideos, false);
          }
        };

        createEventListeners();

        })();
      });
  });
