/* Froza AC DTC — Minimal JS */
document.addEventListener('DOMContentLoaded', function () {
    /* Copyright year */
    var el = document.getElementById('copy-year');
    if (el) el.textContent = new Date().getFullYear();

    /* Sticky bar — show after scrolling 600px */
    var bar = document.getElementById('sticky-bar');
    if (bar) {
        window.addEventListener('scroll', function () {
            bar.classList.toggle('visible', (window.scrollY || window.pageYOffset) > 600);
        }, { passive: true });
    }

    /* Subtle fade-in on scroll for slide images */
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.slide-img, .review-card, .feature-card, .step').forEach(function (el) {
            el.classList.add('fade-target');
            observer.observe(el);
        });
    }
});

/* FAQ toggle */
function toggleFaq(btn) {
    var item = btn.parentElement;
    item.classList.toggle('open');
}