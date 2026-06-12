$(document).ready(function () {
  // Quiz Pcs Counter
  var number = 48;

  if (localStorage.getItem("counter")) {
    if (localStorage.getItem("counter") <= 0) {
      var value = number;
    } else {
      var value = localStorage.getItem("counter");
    }
  } else {
    var value = number;
  }
  document.getElementById("pcs-left").innerHTML = value;

  var counter = function () {
    if (value <= 0) {
      localStorage.setItem("counter", number);
      value = number;
    } else {
      value = parseInt(value) - 1;
      localStorage.setItem("counter", value);
    }
    document.getElementById("pcs-left").innerHTML = value;
  };

  var interval = setInterval(function () {
    counter();
  }, 30000);

  // Quiz
  let o,
    l = 0,
    n = 600;

  function c() {
    --n;
    let e = Math.floor(n / 60),
      t = n - 60 * e;
    0 == e && 0 == t && clearInterval(o),
      (t = 10 <= t ? t : "0" + t),
      (e = 10 <= e ? e : "0" + e),
      (document.querySelector("#mins").innerHTML = e),
      (document.querySelector("#secs").innerHTML = t);
  }
  const e = document.querySelectorAll(".option"),
    t = document.querySelectorAll(".quiz-step"),
    r = document.querySelectorAll(".num");
  var s = !1;
  e.forEach((e) => {
    e.addEventListener("click", () => {
      s ||
        ((s = !0),
        l++,
        e.classList.add("active"),
        setTimeout(() => {
          t.forEach((e, t) => {
            t == l
              ? ((e.style.display = "block"),
                e.classList.add("active"),
                3 == l
                  ? ((document.querySelector(".quiz-nums").style.display = "none"),
                    (document.querySelector(".quiz-title").style.display = "none"),
                    (document.querySelector(".order-title").style.display = "block"),
                    (o = setInterval(c, 1e3)),
                    setTimeout(() => {
                      setTimeout(() => {
                        var e = $("#scroll"),
                          e = $(e).offset().top;
                        $("body,html").animate(
                          {
                            scrollTop: e,
                          },
                          800
                        );
                      }, 200);
                    }, 400))
                  : r[l].classList.add("active"))
              : (e.classList.remove("active"), (e.style.display = "none"));
          }),
            (s = !1);
        }, 400));
    });
  });
});
