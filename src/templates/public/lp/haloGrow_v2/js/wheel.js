$(function () {

   var rotationContainer = document.querySelector('.rotation-container');

   $('.wheel-button').click(function () {
      $('.wheel-button').css('pointer-events', 'none');

      rotationContainer.classList.add('super-rotation');
      setTimeout(function () {
         rotationContainer.style.transform = 'rotate(1628deg)';
         rotationContainer.classList.remove('super-rotation');
      }, 7000);
      setTimeout(function () {
         $('.spin-wrapper').slideUp();
         $('.order_block').fadeIn();
         var top = $('#scroll').offset().top - 20;
         $('body,html').animate({
            scrollTop: top
         }, 800);
      }, 9000);
   });


   $("a")
      .not("footer a, .button, .cert")
      .click(function () {
         $("html, body").animate({
               scrollTop: $("#scroll").offset().top - 20,
            },
            800
         );
      });

});