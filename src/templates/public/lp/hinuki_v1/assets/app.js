/**
 * British Health News — Main Application Entry
 * Initializes all modules and handles global interactions
 */

(function() {
    'use strict';

    /**
     * Initialize all modules when DOM is ready
     */
    function init() {
        // Theme is auto-initialized, but ensure toggle is set up
        // (Theme.init() is called in theme.js)

        // Initialize news feed
        if (typeof NewsFeed !== 'undefined') {
            NewsFeed.init();
        }

        // Initialize comments
        if (typeof Comments !== 'undefined') {
            Comments.init();
        }

        // Set up header interactions
        setupHeader();

        // Set up mobile rail toggle
        setupMobileRail();

        // Set up search functionality
        setupSearch();

        // Set up share buttons
        setupShareButtons();

        // Set up CTA forms
        setupCtaForms();

        // Log initialization
        console.log('British Health News initialized');
    }

    /**
     * Set up header interactions
     */
    function setupHeader() {
        // Support both UK and other nav toggles
        const navToggle = document.querySelector('.uk-nav-toggle') || document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.uk-nav-menu') || document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('is-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('is-open');
                }
            });

            // Close menu on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('is-open');
                    navToggle.focus();
                }
            });
        }
    }

    /**
     * Set up mobile rail toggle
     */
    function setupMobileRail() {
        const railToggle = document.querySelector('.rail-mobile-toggle');
        const sidebarRail = document.querySelector('.sidebar-rail');

        if (railToggle && sidebarRail) {
            railToggle.addEventListener('click', () => {
                const isExpanded = railToggle.getAttribute('aria-expanded') === 'true';

                if (!isExpanded) {
                    // Scroll to rail
                    sidebarRail.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    railToggle.setAttribute('aria-expanded', 'true');

                    // Reset after scroll
                    setTimeout(() => {
                        railToggle.setAttribute('aria-expanded', 'false');
                    }, 2000);
                }
            });
        }
    }

    /**
     * Set up search functionality
     */
    function setupSearch() {
        const searchToggle = document.querySelector('.search-toggle');
        const searchBox = document.querySelector('.search-box');
        const searchInput = document.querySelector('.search-input');
        const searchClose = document.querySelector('.search-close');

        if (searchToggle && searchBox) {
            searchToggle.addEventListener('click', () => {
                const isExpanded = searchToggle.getAttribute('aria-expanded') === 'true';

                if (isExpanded) {
                    closeSearch();
                } else {
                    openSearch();
                }
            });

            if (searchClose) {
                searchClose.addEventListener('click', closeSearch);
            }

            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !searchBox.hidden) {
                    closeSearch();
                }
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!searchBox.hidden &&
                    !searchBox.contains(e.target) &&
                    !searchToggle.contains(e.target)) {
                    closeSearch();
                }
            });

            // Handle search form submission
            if (searchInput) {
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const query = searchInput.value.trim();
                        if (query) {
                            // For demo, just log the search
                            console.log('Search query:', query);
                            alert(`Search functionality would search for: "${query}"`);
                        }
                    }
                });
            }
        }

        function openSearch() {
            searchBox.hidden = false;
            searchToggle.setAttribute('aria-expanded', 'true');
            if (searchInput) {
                searchInput.focus();
            }
        }

        function closeSearch() {
            searchBox.hidden = true;
            searchToggle.setAttribute('aria-expanded', 'false');
            searchToggle.focus();
        }
    }

    /**
     * Set up share buttons
     */
    function setupShareButtons() {
        const shareButtons = document.querySelectorAll('.share-btn');
        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);

        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('share-btn--twitter')) {
                    window.open(
                        `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
                        '_blank',
                        'width=550,height=420'
                    );
                } else if (btn.classList.contains('share-btn--facebook')) {
                    window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
                        '_blank',
                        'width=550,height=420'
                    );
                } else if (btn.classList.contains('share-btn--linkedin')) {
                    window.open(
                        `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`,
                        '_blank',
                        'width=550,height=420'
                    );
                } else if (btn.classList.contains('share-btn--email')) {
                    window.location.href = `mailto:?subject=${pageTitle}&body=${pageUrl}`;
                } else if (btn.classList.contains('share-btn--copy')) {
                    copyToClipboard(window.location.href);
                }
            });
        });
    }

    /**
     * Copy text to clipboard
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Link copied to clipboard');
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                document.execCommand('copy');
                showToast('Link copied to clipboard');
            } catch (e) {
                showToast('Failed to copy link');
            }

            document.body.removeChild(textarea);
        }
    }

    /**
     * Show toast notification
     */
    function showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: var(--color-ink);
            color: var(--color-paper);
            border-radius: 8px;
            font-family: var(--font-ui);
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: toastIn 0.3s ease-out;
        `;

        // Add animation keyframes if not exists
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes toastIn {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2500);

        // Announce to screen readers
        if (typeof Utils !== 'undefined') {
            Utils.announceToScreenReader(message);
        }
    }

    /**
     * Set up CTA forms
     */
    function setupCtaForms() {
        const ctaForms = document.querySelectorAll('.cta-form');

        ctaForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const emailInput = form.querySelector('input[type="email"]');
                const email = emailInput?.value?.trim();

                if (email && isValidEmail(email)) {
                    showToast('Thank you for subscribing!');
                    emailInput.value = '';
                } else {
                    showToast('Please enter a valid email address');
                }
            });
        });

        // CTA button (support)
        const ctaButton = document.querySelector('.cta-button--large');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                showToast('Thank you for your interest in supporting us!');
            });
        }
    }

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Update relative times periodically
     */
    function startTimeUpdates() {
        setInterval(() => {
            // Update comment times
            const commentTimes = document.querySelectorAll('.comment-time');
            commentTimes.forEach(el => {
                const datetime = el.getAttribute('datetime');
                if (datetime) {
                    el.textContent = Utils.formatRelativeTime(new Date(datetime).getTime());
                }
            });

            // Update news times
            const newsTimes = document.querySelectorAll('.news-time');
            // These don't have datetime attr in current implementation,
            // would need data attribute to update
        }, 60000); // Every minute
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            startTimeUpdates();
        });
    } else {
        init();
        startTimeUpdates();
    }

    // Expose for debugging
    window.BHN = {
        Theme: typeof Theme !== 'undefined' ? Theme : null,
        NewsFeed: typeof NewsFeed !== 'undefined' ? NewsFeed : null,
        Comments: typeof Comments !== 'undefined' ? Comments : null,
        CommentsData: typeof CommentsData !== 'undefined' ? CommentsData : null,
        Utils: typeof Utils !== 'undefined' ? Utils : null
    };
})();
