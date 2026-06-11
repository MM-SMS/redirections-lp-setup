$(function () {
  var e = [],
    t = "",
    i = "";
  $("#show-test").click(function (e) {
    e.preventDefault(), $(".quiz-item").removeClass("active"), $(this).parents(".quiz-item").next().addClass("active");
  }),
    $(".quiz-item .btn-test").click(function (n) {
      n.preventDefault(),
        $(".quiz-item").removeClass("active"),
        $(this).parents(".quiz-item").next().addClass("active"),
        (i = $(this).parents(".quiz-item").find("p").text()),
        (t = $(this).parents(".quiz-item").hasClass("-range")
          ? $(this).parents(".quiz-item").find("input[type=radio]:checked").val()
          : $(this).parents(".quiz-item").hasClass("-checkboxes")
            ? $(this).parents(".quiz-item").find("input[type=checkbox]:checked").parent().text()
            : $(this).parents(".quiz-item").find("input[type=radio]:checked").parent().text()),
        e.push({
          q: i,
          a: t,
        });
    }),
    $(".last-click").click(function (t) {
      t.preventDefault();
      $(".result-block").show();
    });
});