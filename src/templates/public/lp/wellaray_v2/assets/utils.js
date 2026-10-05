/**
 * Utilities Module — Helper Functions
 * Common utilities for DOM manipulation, formatting, and validation
 */

const Utils = (function() {
    'use strict';

    /**
     * Generate a unique ID
     */
    function generateId() {
        return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Escape HTML to prevent XSS
     * Uses textContent internally — does not interpret HTML
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Create element with attributes and children
     */
    function createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                const event = key.slice(2).toLowerCase();
                element.addEventListener(event, value);
            } else if (key === 'innerHTML') {
                // Only use for trusted content
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });

        return element;
    }

    /**
     * Format relative time (e.g., "2h", "Yesterday") - Facebook style without "ago"
     */
    function formatRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) {
            return 'Just now';
        } else if (minutes < 60) {
            return `${minutes}m`;
        } else if (hours < 24) {
            return `${hours}h`;
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return `${days}d`;
        } else {
            return formatDate(timestamp);
        }
    }

    /**
     * Format date in UK style (e.g., "18 January 2025")
     */
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    /**
     * Format date and time in UK style
     */
    function formatDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Throttle function execution
     */
    function throttle(func, limit) {
        let inThrottle = false;
        let lastResult;

        return function(...args) {
            if (!inThrottle) {
                lastResult = func.apply(this, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
            return lastResult;
        };
    }

    /**
     * Debounce function execution
     */
    function debounce(func, wait) {
        let timeout;

        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Get initial letter from name
     */
    function getInitial(name) {
        if (!name || typeof name !== 'string') return '?';
        return name.trim().charAt(0).toUpperCase();
    }

    /**
     * Validate text length
     */
    function validateTextLength(text, min, max) {
        const length = text.trim().length;
        return length >= min && length <= max;
    }

    /**
     * Validate name (letters, spaces, hyphens, apostrophes)
     */
    function validateName(name) {
        const trimmed = name.trim();
        if (trimmed.length < 2 || trimmed.length > 40) return false;
        // Allow letters (including Unicode), spaces, hyphens, apostrophes
        return /^[\p{L}\s\-']+$/u.test(trimmed);
    }

    /**
     * Resize image to max dimensions while maintaining aspect ratio
     * Returns a Promise with the resized image as base64
     */
    function resizeImage(file, maxWidth = 1280, maxHeight = 960, quality = 0.85) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('Invalid file type'));
                return;
            }

            // Check file size (max 1MB)
            if (file.size > 1024 * 1024) {
                reject(new Error('File size exceeds 1MB limit'));
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    let { width, height } = img;

                    // Calculate new dimensions
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }

                    // Create canvas and draw resized image
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64
                    const resizedBase64 = canvas.toDataURL(file.type, quality);

                    resolve({
                        url: resizedBase64,
                        width: Math.round(width),
                        height: Math.round(height)
                    });
                };

                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Simple profanity filter (basic implementation)
     */
    const PROFANITY_LIST = [
        // Basic list - can be extended
        'spam', 'scam'
    ];

    function containsProfanity(text) {
        const lowerText = text.toLowerCase();
        return PROFANITY_LIST.some(word =>
            new RegExp(`\\b${word}\\b`, 'i').test(lowerText)
        );
    }

    /**
     * Storage utilities with error handling
     */
    function _prefixKey(key) {
        return (typeof LS_PREFIX !== 'undefined' ? LS_PREFIX : '') + key;
    }

    const Storage = {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(_prefixKey(key));
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Storage.get error:', e);
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(_prefixKey(key), JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Storage.set error:', e);
                return false;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(_prefixKey(key));
                return true;
            } catch (e) {
                console.warn('Storage.remove error:', e);
                return false;
            }
        }
    };

    /**
     * Accessibility helper — announce message to screen readers
     */
    function announceToScreenReader(message, priority = 'polite') {
        const announcement = createElement('div', {
            'aria-live': priority,
            'aria-atomic': 'true',
            className: 'sr-only',
            textContent: message
        });

        document.body.appendChild(announcement);

        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }

    // Public API
    return {
        generateId,
        escapeHtml,
        createElement,
        formatRelativeTime,
        formatDate,
        formatDateTime,
        throttle,
        debounce,
        getInitial,
        validateTextLength,
        validateName,
        resizeImage,
        containsProfanity,
        Storage,
        announceToScreenReader
    };
})();
