// Image rendering functionality
// Detects image markers and places images ABOVE the tool panel

class ImageRenderer {
    constructor() {
        // Match text markers in format: [ORCHESTRAL_IMAGE:path/to/image.png]
        this.imageMarkerPattern = /\[ORCHESTRAL_IMAGE:(.*?)\]/g;
    }

    /**
     * Render images by detecting markers and placing images above panels
     * @param {HTMLElement} element - Container element to search for image markers
     */
    render(element) {
        // Find all elements with image markers
        const elementsWithMarkers = this._findElementsWithMarkers(element);

        if (elementsWithMarkers.length === 0) {
            return; // No markers found
        }

        // Process each element with markers
        elementsWithMarkers.forEach(({element: markerElement, imagePath}) => {
            // Find the closest .message ancestor (the panel container)
            const messageDiv = markerElement.closest('.message');

            if (messageDiv) {
                // Check if image already exists for this marker
                const existingImage = messageDiv.previousElementSibling;
                if (existingImage && existingImage.classList.contains('orchestral-image-container')) {
                    // Image already rendered, skip
                    return;
                }

                // Create and insert image above the message div
                const imageContainer = this._createImageElement(imagePath);
                messageDiv.parentNode.insertBefore(imageContainer, messageDiv);
            }

            // Hide the marker text from display
            this._hideMarkerText(markerElement);
        });
    }

    /**
     * Find all elements that contain image markers
     * @param {HTMLElement} element - Container to search
     * @returns {Array} Array of {element, imagePath} objects
     */
    _findElementsWithMarkers(element) {
        const results = [];
        const html = element.innerHTML;

        // Check if this element has markers
        this.imageMarkerPattern.lastIndex = 0;
        let match;

        while ((match = this.imageMarkerPattern.exec(html)) !== null) {
            results.push({
                element: element,
                imagePath: match[1]
            });
        }

        return results;
    }

    /**
     * Hide marker text from display
     * @param {HTMLElement} element - Element containing the marker
     */
    _hideMarkerText(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null
        );

        const nodesToModify = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.textContent.includes('[ORCHESTRAL_IMAGE:')) {
                nodesToModify.push(node);
            }
        }

        // Hide marker text by wrapping in hidden span
        nodesToModify.forEach(node => {
            const span = document.createElement('span');
            span.style.display = 'none';
            node.parentNode.insertBefore(span, node);
            span.appendChild(node);
        });
    }

    /**
     * Create an image element (DOM node, not HTML string)
     * @param {string} imagePath - Path to the image (as provided by the tool)
     * @returns {HTMLElement} Image container element
     */
    _createImageElement(imagePath) {
        // Extract just the filename from the full path
        const filename = this._extractFilename(imagePath);

        // Create the URL for the image endpoint
        const imageUrl = `/workspace-image/${encodeURIComponent(filename)}`;

        // Create container div
        const container = document.createElement('div');
        container.className = 'orchestral-image-container';
        container.style.margin = '10px 0';
        container.style.textAlign = 'center';

        // Create image element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = filename;
        img.className = 'orchestral-image';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '4px';
        img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';

        // Create error message div
        const errorDiv = document.createElement('div');
        errorDiv.className = 'image-error';
        errorDiv.style.display = 'none';
        errorDiv.style.color = '#888';
        errorDiv.style.fontSize = '0.9em';
        errorDiv.style.padding = '10px';
        errorDiv.textContent = `Failed to load image: ${filename}`;

        // Handle image load errors
        img.onerror = function() {
            img.style.display = 'none';
            errorDiv.style.display = 'block';
        };

        container.appendChild(img);
        container.appendChild(errorDiv);

        return container;
    }

    /**
     * Extract filename from a full path
     * @param {string} path - Full path to the file
     * @returns {string} Just the filename
     */
    _extractFilename(path) {
        // Handle both Unix and Windows paths
        const parts = path.replace(/\\/g, '/').split('/');
        return parts[parts.length - 1];
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Check if element contains image markers
     * @param {HTMLElement} element - Element to check
     * @returns {boolean}
     */
    hasImageMarkers(element) {
        this.imageMarkerPattern.lastIndex = 0;
        return this.imageMarkerPattern.test(element.innerHTML);
    }
}

// Export for use in main app
window.ImageRenderer = ImageRenderer;
