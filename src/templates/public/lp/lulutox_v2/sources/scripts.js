$(document).ready(function () {

   const totalComments = $(".comment-flex").length;
   $("#commentsCounter").text(totalComments);

   $("#hottest").on("click", function () {
      $(".show-comments-buttons button").removeClass("active");
      $(this).addClass("active");

      $(".comment").each(function () {
         const likes = parseInt($(this).find(".likes").text().trim());
         if (likes >= 20) {
            $(this).show();
         } else {
            $(this).hide();
         }
      });

      (function() {
         // Initialize
         var bLazy = new Blazy();
      })();
   });

   $("#recent").on("click", function () {
      $(".show-comments-buttons button").removeClass("active");
      $(this).addClass("active");

      $(".comment").show();

      (function() {
         // Initialize
         var bLazy = new Blazy();
      })();
   });

});