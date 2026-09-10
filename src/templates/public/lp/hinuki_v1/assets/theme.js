/**
 * Theme Module — Light/Dark Mode Toggle
 * Handles theme switching with localStorage persistence and prefers-color-scheme
 */

const Theme = (function() {
    'use strict';

    const STORAGE_KEY = 'bhn-theme';
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark'
    };

    let currentTheme = THEMES.LIGHT;
    let toggleButton = null;

    /**
     * Get system preference for color scheme
     */
    function getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return THEMES.DARK;
        }
        return THEMES.LIGHT;
    }

    /**
     * Get stored theme preference
     */
    function getStoredPreference() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    }

    /**
     * Store theme preference
     */
    function storePreference(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
    }

    /**
     * Apply theme to document
     */
    function applyTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);

        // Update toggle button aria state
        if (toggleButton) {
            toggleButton.setAttribute('aria-checked', theme === THEMES.DARK ? 'true' : 'false');
            toggleButton.setAttribute('aria-label', `Switch to ${theme === THEMES.DARK ? 'light' : 'dark'} mode`);
        }

        // Dispatch custom event for other modules
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    /**
     * Toggle between light and dark themes
     */
    function toggle() {
        const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        applyTheme(newTheme);
        storePreference(newTheme);
    }

    /**
     * Set up toggle button event listener
     */
    function setupToggle() {
        toggleButton = document.querySelector('.theme-toggle');

        if (toggleButton) {
            toggleButton.addEventListener('click', toggle);

            // Keyboard support
            toggleButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            });
        }
    }

    /**
     * Listen for system preference changes
     */
    function listenForSystemChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't set a preference
                if (!getStoredPreference()) {
                    applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
                }
            });
        }
    }

    /**
     * Initialize theme module
     */
    function init() {
        // Determine initial theme
        const storedTheme = getStoredPreference();
        const systemTheme = getSystemPreference();
        const initialTheme = storedTheme || systemTheme;

        // Apply theme immediately (before DOM ready if possible)
        applyTheme(initialTheme);

        // Set up UI after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setupToggle();
                listenForSystemChanges();
            });
        } else {
            setupToggle();
            listenForSystemChanges();
        }
    }

    // Public API
    return {
        init,
        toggle,
        get current() { return currentTheme; },
        THEMES
    };
})();

// Auto-initialize
Theme.init();
