/* Froza AC Promo — Script */
document.addEventListener('DOMContentLoaded', function () {
    /* Copyright year */
    var yr = document.getElementById('yr');
    if (yr) yr.textContent = new Date().getFullYear();

    /* Sticky bar — show after 600px scroll */
    var sticky = document.getElementById('sticky');
    if (sticky) {
        window.addEventListener('scroll', function () {
            sticky.classList.toggle('visible', (window.scrollY || window.pageYOffset) > 600);
        }, { passive: true });
    }

    /* Scroll-reveal for key elements */
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });

        var els = document.querySelectorAll(
            '.feat-card, .review-card, .editorial-img, .demo-gif, .lifestyle-card, .how-step, .showcase-product, .split-banner'
        );
        els.forEach(function (el) {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }
});

/* FAQ toggle */
function toggleFaq(btn) {
    btn.parentElement.classList.toggle('open');
}