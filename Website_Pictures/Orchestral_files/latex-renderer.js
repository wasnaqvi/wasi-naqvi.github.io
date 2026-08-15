// LaTeX rendering functionality using KaTeX
// Renders mathematical notation in various LaTeX delimiter formats

// LATEX CONFIGURATION: Set to true to enable $...$ and $$...$$ syntax (see LATEX_FORMATTING.md)
const ENABLE_DOLLAR_LATEX = false;

class LatexRenderer {
    constructor() {
        // Build delimiters based on configuration
        this.delimiters = [
            {left: '\\[', right: '\\]', display: true},
            {left: '\\(', right: '\\)', display: false}
        ];

        // Add dollar delimiters if enabled
        if (ENABLE_DOLLAR_LATEX) {
            this.delimiters.unshift(
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            );
        }

        this.config = {
            delimiters: this.delimiters,
            throwOnError: false,
            trust: true,
            // Rich wraps everything in <pre>, so we can't ignore pre tags
            // We'll handle code blocks separately in the render method
            ignoredTags: ['script', 'noscript', 'style', 'textarea']
        };

        // Store code background color (will be set dynamically)
        this.codeBackgroundColor = null;
    }

    /**
     * Render LaTeX equations in the given element
     * Protects code blocks by temporarily hiding them from KaTeX
     * @param {HTMLElement} element - Container element to search for LaTeX
     */
    render(element) {
        // Check if renderMathInElement is available (KaTeX auto-render)
        if (typeof renderMathInElement === 'function') {
            // Protect code blocks from LaTeX rendering
            const protectedBlocks = this._protectCodeBlocks(element);

            // Render LaTeX
            renderMathInElement(element, this.config);

            // Restore code blocks
            this._restoreCodeBlocks(element, protectedBlocks);
        } else {
            console.warn('KaTeX renderMathInElement not available. LaTeX rendering disabled.');
        }
    }

    /**
     * Temporarily hide code blocks from KaTeX by replacing LaTeX patterns
     * @param {HTMLElement} element - Container element
     * @returns {Array} Array of {element, originalText} objects
     */
    _protectCodeBlocks(element) {
        const protectedBlocks = [];

        // Find all spans with code background color (Rich's code blocks)
        // This targets code syntax highlighting which uses background-color: #242933
        const codeSpans = element.querySelectorAll('span[style*="background-color"][style*="#242933"]');

        codeSpans.forEach((span) => {
            const originalText = span.textContent;
            // Only protect spans that contain LaTeX-like patterns
            if (this._containsLatexPattern(originalText)) {
                // Replace LaTeX delimiters with safe characters that KaTeX won't process
                let protectedText = originalText
                    .replace(/\\\(/g, '⦅')  // Replace \( with white parenthesis
                    .replace(/\\\)/g, '⦆')  // Replace \) with white parenthesis
                    .replace(/\\\[/g, '⦋')  // Replace \[ with white bracket
                    .replace(/\\\]/g, '⦌'); // Replace \] with white bracket

                // Only protect $ if dollar LaTeX is enabled
                if (ENABLE_DOLLAR_LATEX) {
                    protectedText = protectedText.replace(/\$/g, '＄');  // Replace $ with fullwidth dollar sign
                }

                protectedBlocks.push({
                    element: span,
                    originalText: originalText
                });

                span.textContent = protectedText;
            }
        });

        return protectedBlocks;
    }

    /**
     * Restore code blocks after KaTeX rendering
     * @param {HTMLElement} element - Container element (unused, kept for consistency)
     * @param {Array} protectedBlocks - Array of {element, originalText} objects
     */
    _restoreCodeBlocks(element, protectedBlocks) {
        // Restore original text content
        protectedBlocks.forEach(({element, originalText}) => {
            element.textContent = originalText;
        });
    }

    /**
     * Check if text contains LaTeX-like patterns
     * @param {string} text - Text to check
     * @returns {boolean}
     */
    _containsLatexPattern(text) {
        // Check for common LaTeX delimiters
        return /\$|\\\(|\\\[|\\frac|\\sqrt|\\sum|\\int/.test(text);
    }

    /**
     * Check if KaTeX is loaded and available
     * @returns {boolean}
     */
    isAvailable() {
        return typeof renderMathInElement === 'function';
    }

    /**
     * Update configuration (e.g., to add custom delimiters)
     * @param {Object} newConfig - Configuration options to merge
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Export for use in main app
window.LatexRenderer = LatexRenderer;
