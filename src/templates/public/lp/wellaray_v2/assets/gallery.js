/**
 * Gallery Module — Independent-style Image Gallery with Lightbox
 */

const Gallery = (function() {
    'use strict';

    let lightbox = null;
    let currentGallery = null;
    let currentIndex = 0;

    /**
     * Initialize all galleries on the page
     */
    function init() {
        createLightbox();
        bindGalleries();
        bindKeyboard();
    }

    /**
     * Create lightbox DOM structure
     */
    function createLightbox() {
        lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <button class="lightbox-close" aria-label="Close gallery">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <button class="lightbox-nav lightbox-prev" aria-label="Previous image">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button class="lightbox-nav lightbox-next" aria-label="Next image">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
                <div class="lightbox-content">
                    <img class="lightbox-image" src="" alt="">
                </div>
                <div class="lightbox-footer">
                    <div class="lightbox-caption"></div>
                    <div class="lightbox-counter">
                        <span class="lightbox-current">1</span> / <span class="lightbox-total">1</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);

        // Bind lightbox events
        lightbox.querySelector('.lightbox-overlay').addEventListener('click', close);
        lightbox.querySelector('.lightbox-close').addEventListener('click', close);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
    }

    /**
     * Find and bind all galleries
     */
    function bindGalleries() {
        const galleries = document.querySelectorAll('[data-gallery]');
        galleries.forEach(gallery => {
            const trigger = gallery.querySelector('.gallery-badge, .figure-image-wrapper, .hero-image-wrapper');
            if (trigger) {
                trigger.style.cursor = 'pointer';
                trigger.addEventListener('click', () => openGallery(gallery));
            }
        });
    }

    /**
     * Open gallery lightbox
     */
    function openGallery(galleryEl) {
        const images = JSON.parse(galleryEl.dataset.gallery);
        if (!images || images.length === 0) return;

        currentGallery = images;
        currentIndex = 0;

        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        updateLightbox();
        updateNavigation();
    }

    /**
     * Close lightbox
     */
    function close() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        currentGallery = null;
    }

    /**
     * Show previous image
     */
    function showPrev() {
        if (!currentGallery) return;
        currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightbox();
    }

    /**
     * Show next image
     */
    function showNext() {
        if (!currentGallery) return;
        currentIndex = (currentIndex + 1) % currentGallery.length;
        updateLightbox();
    }

    /**
     * Update lightbox content
     */
    function updateLightbox() {
        if (!currentGallery) return;

        const item = currentGallery[currentIndex];
        const img = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        const current = lightbox.querySelector('.lightbox-current');
        const total = lightbox.querySelector('.lightbox-total');

        // Show loading state
        img.style.opacity = '0.5';

        img.onload = () => {
            img.style.opacity = '1';
        };

        img.src = item.src;
        img.alt = item.alt || '';
        caption.innerHTML = item.caption || '';
        if (item.credit) {
            caption.innerHTML += ` <span class="lightbox-credit">${item.credit}</span>`;
        }
        current.textContent = currentIndex + 1;
        total.textContent = currentGallery.length;

        updateNavigation();
    }

    /**
     * Update navigation visibility
     */
    function updateNavigation() {
        if (!currentGallery) return;

        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        // Always show both buttons for looping navigation
        prevBtn.style.display = currentGallery.length > 1 ? '' : 'none';
        nextBtn.style.display = currentGallery.length > 1 ? '' : 'none';
    }

    /**
     * Keyboard navigation
     */
    function bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;

            switch (e.key) {
                case 'Escape':
                    close();
                    break;
                case 'ArrowLeft':
                    showPrev();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
            }
        });
    }

    // Auto-init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init,
        open: openGallery,
        close
    };
})();
