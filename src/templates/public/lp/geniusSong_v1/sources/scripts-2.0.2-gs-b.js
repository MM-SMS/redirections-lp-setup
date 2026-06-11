cookieName = typeof cookieName == "undefined" ? "repeatVisitorVSL" : cookieName;

function bigVideo() {
  $(".vb").removeClass("video-border"),
    $(".vb").addClass("video-border-none"),
    $(".video-lights").addClass("black-background-vid"),
    $(".parent-container").removeClass("container").removeClass("bdinpad"),
    $(".vslvideobx").addClass("is-marginless").addClass("is-paddingless"),
    document.querySelector('body').classList.add('fullwidth');
  $("html, body").animate(
    {
      scrollTop: $(".video-section").offset().top,
    },
    250,
    function () { }
  );
  if (scrollInPlace) {
    $(".video-container").addClass("ovrfl");
  } else {
    $("body").addClass("ovrfl");
  }
}
function smallVideo() {
  $(".vb").removeClass("video-border-none"),
    $(".vb").addClass("video-border"),
    $(".video-lights").removeClass("black-background-vid"),
    $(".parent-container").addClass("container").addClass("bdinpad"),
    $(".vslvideobx").removeClass("is-marginless").removeClass("is-paddingless")
  document.querySelector('body').classList.remove('fullwidth');
  if (scrollInPlace) {
    $(".video-container").removeClass("ovrfl");
  } else {
    $("body").removeClass("ovrfl");
  }
  $("html, body").animate(
    {
      scrollTop: $("#head").offset().top,
    },
    250,
    function () { }
  );
}

var playfirst = true;
window.wistiaID = video_id;
let stillUrl = "";

window.addEventListener('load', (event) => {
  var s = document.createElement('script');
  s.setAttribute('src', "https://fast.wistia.com/embed/medias/" + window.wistiaID + ".jsonp");
  s.setAttribute('id', "vidloader");
  s.async = true;
  s.onload = wistiacallback;
  document.querySelector(".wistia_embed").classList.add("wistia_async_" + window.wistiaID);
  document.head.appendChild(s);
});

function wistiacallback() {
  (window._wq = window._wq || []),
    _wq.push({
      id: video_id,
      options: {
        fullscreenOnRotateToLandscape: false,
        copyLinkAndThumbnailEnabled: false,
        playsinline: true,
        resumable: false,
        seo: false,
        volume: 1,
        wmode: "transparent",
        playbar: ld_video_controls,
        smallPlayButton: ld_video_controls,
        volumeControl: ld_video_controls,
        fullscreenButton: ld_video_controls,
        playSuspendedOffScreen: false,
        autoPlay: false,
        stillUrl: stillUrl
      },
      onReady: function (video) {
        window.video = video;
        $(".loading-video-inner").hide();
        var n = false,
          i = 0;
        video.bind("play", function () {
          if (playfirst == true) {
            video.time(0);
            playfirst = false;
            if (window.video.aspect() <= 1) {
              let h = window.innerWidth / window.video.aspect();
              document.querySelector('#vid-container').style.height = h + "px";
            }
          }
          video.isMuted()
            ? $(".button-unmute").show()
            : ($(".button-unmute").hide(),
              (n = true),
              fullscreen_video && bigVideo());
          $(".button-continue").hide();
        }),
          $(".button-unmute").click(function () {
            false === n && ((n = true), 2 < i && video.time(0)),
              video.unmute(),
              $(".button-unmute").hide(),
              fullscreen_video && bigVideo();
          }),
          $(".button-continue").click(function () {
            false === n && ((n = true), 2 < i && video.time(0)),
              video.play(),
              $(".button-continue").hide();
          }),
          video.bind("pause", function () {
            video.unmute(),
              $(".button-unmute").hide(),
              fullscreen_video && smallVideo(),
              $(".button-continue").show();
          }),
          video.bind("end", function () {
            video.unmute(),
              $(".button-unmute").hide(),
              fullscreen_video && smallVideo(),
              $(".button-continue").show();
          }),
          // video.bind("widthchange", function() {
          //   console.log("The width changed to " + video.width());
          //   if (video.state() === "playing") {
          //     let toHeight = Math.floor(window.innerWidth / window.video.aspect());
          //     if (toHeight > window.innerHeight) 
          //       toHeight = window.innerHeight;
          //     
          //     let toWidth = Math.floor(toHeight * window.video.aspect());
          //     window.video.width(toWidth, {constrain: true});
          //   }
          // }),
          video.bind("secondchange", function (time) {
            i = time;
            if (!video.isMuted() && time * 1000 > timeForDelay && !isCTADisplayed) {
              displayLink();
              setCookie(cookieName, "yes", 1);
            }
          });
      },
    });
}

function preload(e) {
  $(e).each(function () {
    $("<img />").attr("src", this).appendTo("body").css("display", "none").attr("loading", "lazy");
  });
}
preload([
  "../assets/images/loading-video.gif",
  "../assets/images/" + ld_image_continue,
  "../assets/images/" + ld_image_unmute,
]),
  $(document).bind("contextmenu", function (e) {
    return false;
  });
