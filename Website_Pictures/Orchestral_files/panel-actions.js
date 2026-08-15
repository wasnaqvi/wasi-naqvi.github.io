// Panel Actions Framework
// Modular system for adding action buttons (copy, edit, regenerate, etc.) to Rich panels

class PanelActionsManager {
    constructor(orchestralUI) {
        this.orchestralUI = orchestralUI;
        this.actions = new Map(); // Map of action name -> action config
        this.panelDetectors = new Map(); // Map of panel type -> detector function
        this.codeBackgroundColor = null; // Will be fetched from backend

        this._fetchThemeConfig();
        this._registerDefaultActions();
        this._registerDefaultDetectors();
    }

    /**
     * Fetch theme configuration from backend
     * @private
     */
    async _fetchThemeConfig() {
        try {
            const response = await fetch('/api/theme');
            const config = await response.json();
            this.codeBackgroundColor = config.code_background_color;
            console.log('[PanelActions] Loaded theme config:', config);
        } catch (err) {
            console.warn('[PanelActions] Failed to fetch theme config, using fallback:', err);
            this.codeBackgroundColor = '#242933'; // Fallback
        }
    }

    /**
     * Register default actions (copy, edit, regenerate, etc.)
     * @private
     */
    _registerDefaultActions() {
        // Unified copy action (works for all panels)
        this.registerAction('copy', {
            icon: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 3.5V2C5.5 1.44772 5.94772 1 6.5 1H13.5C14.0523 1 14.5 1.44772 14.5 2V11C14.5 11.5523 14.0523 12 13.5 12H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="1.5" y="4.5" width="9" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
            </svg>`,
            successIcon: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            title: 'Copy',
            className: 'panel-action-btn copy-btn',
            onClick: async (button, panelElement) => {
                // Extract clean text from the panel (removes box-drawing characters)
                const text = this._extractCleanText(panelElement);

                try {
                    await navigator.clipboard.writeText(text);

                    // Visual feedback
                    const originalIcon = button.innerHTML;
                    button.innerHTML = button.dataset.successIcon;
                    button.classList.add('success');

                    setTimeout(() => {
                        button.innerHTML = originalIcon;
                        button.classList.remove('success');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        });

        // Edit system prompt action
        this.registerAction('edit-system-prompt', {
            icon: '⚙',
            title: 'Edit system prompt',
            className: 'panel-action-btn edit-system-prompt-btn',
            onClick: (button, panelElement) => {
                if (this.orchestralUI && this.orchestralUI.showSystemPromptModal) {
                    this.orchestralUI.showSystemPromptModal();
                }
            }
        });

        // Edit user message action (enables edit and resend)
        this.registerAction('edit-message', {
            icon: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5 1.5L14.5 4.5L5.5 13.5L2 14.5L3 11L12 2L11.5 1.5Z" stroke="#a0b0d0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 3L13 6" stroke="#a0b0d0" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`,
            title: 'Edit message',
            className: 'panel-action-btn edit-message-btn',
            onClick: (button, panelElement) => {
                console.log('[PanelActions] Edit button clicked, panelElement:', panelElement);
                if (this.orchestralUI && this.orchestralUI.enterEditMode) {
                    // panelElement is the <pre> tag - need to traverse up to find .message
                    // Structure: .message > .message-content > <pre>
                    let messageDiv = panelElement.closest('.message');

                    // If not found, try going up through wrapper
                    if (!messageDiv && panelElement.parentElement) {
                        messageDiv = panelElement.parentElement.closest('.message');
                    }

                    console.log('[PanelActions] Found messageDiv:', messageDiv);
                    console.log('[PanelActions] Message index:', messageDiv?.dataset?.messageIndex);

                    const messageIndex = messageDiv ? messageDiv.dataset.messageIndex : null;

                    if (messageIndex !== null && messageIndex !== undefined) {
                        // Toggle behavior: if already editing this message, cancel instead
                        if (this.orchestralUI.isEditMode &&
                            this.orchestralUI.editingMessageIndex === parseInt(messageIndex)) {
                            this.orchestralUI.cancelEdit();
                        } else {
                            this.orchestralUI.enterEditMode(parseInt(messageIndex));
                        }
                    } else {
                        console.error('[PanelActions] Cannot edit: message index not found', {
                            messageDiv,
                            dataset: messageDiv?.dataset
                        });
                    }
                }
            }
        });

        // Copy TeX representation
        this.registerAction('copy-tex', {
            icon: `<span style="font-family: 'Times New Roman', serif; font-size: 10px; color: #a0b0d0;">T<span style="font-size: 10px; vertical-align: sub;">E</span>X</span>`,
            successIcon: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            title: 'Copy as TeX',
            className: 'panel-action-btn copy-tex-btn',
            onClick: async (button, panelElement) => {
                console.log('[PanelActions] TeX copy button clicked');

                // Find message index from panel element
                let messageDiv = panelElement.closest('.message');
                if (!messageDiv && panelElement.parentElement) {
                    messageDiv = panelElement.parentElement.closest('.message');
                }

                console.log('[PanelActions] Found messageDiv:', messageDiv);
                console.log('[PanelActions] messageDiv.dataset:', messageDiv ? messageDiv.dataset : 'null');

                let messageIndex = messageDiv ? messageDiv.dataset.messageIndex : null;

                // Special case: system prompts don't have messageIndex but are always at index 0
                if ((messageIndex === null || messageIndex === undefined) && panelElement) {
                    const panelText = panelElement.textContent || panelElement.innerText || '';
                    const isSystemPrompt = panelText.includes('System') ||
                                          panelElement.querySelector('pre')?.textContent?.includes('╭─ System');

                    if (isSystemPrompt) {
                        console.log('[PanelActions] Detected system prompt, using index 0');
                        messageIndex = 0;
                    }
                }

                // Fallback: if still no index, calculate it from DOM position
                // This handles older messages that were created before we added message_index tracking
                if ((messageIndex === null || messageIndex === undefined) && messageDiv) {
                    console.log('[PanelActions] No message index found, calculating from DOM position');

                    // Find all message divs in the conversation
                    const allMessages = document.querySelectorAll('#chat-container .message');
                    console.log('[PanelActions] Found total messages:', allMessages.length);
                    const position = Array.from(allMessages).indexOf(messageDiv);

                    if (position !== -1) {
                        messageIndex = position;
                        console.log('[PanelActions] Calculated message index from DOM:', messageIndex);
                    } else {
                        console.error('[PanelActions] Could not find message in DOM list');
                    }
                }

                console.log('[PanelActions] messageIndex:', messageIndex);

                if (messageIndex === null || messageIndex === undefined) {
                    console.error('[PanelActions] Cannot copy TeX: message index not found');
                    console.error('[PanelActions] messageDiv:', messageDiv);
                    return;
                }

                // Store original icon for later
                const originalIcon = button.innerHTML;

                try {
                    console.log('[PanelActions] Fetching LaTeX for message index:', messageIndex);

                    // Create a promise that we'll resolve with clipboard write permission
                    // This preserves the user gesture context
                    const clipboardItem = new Promise(async (resolve) => {
                        // Call backend API to convert message to LaTeX
                        const response = await fetch('/api/message_to_latex', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ message_index: parseInt(messageIndex) })
                        });

                        console.log('[PanelActions] Response status:', response.status);

                        const data = await response.json();
                        console.log('[PanelActions] Response data:', data);

                        if (data.error) {
                            console.error('[PanelActions] LaTeX conversion error:', data.error);
                            resolve(new Blob([''], { type: 'text/plain' }));
                            return;
                        }

                        if (!data.latex) {
                            console.error('[PanelActions] No LaTeX in response:', data);
                            resolve(new Blob([''], { type: 'text/plain' }));
                            return;
                        }

                        console.log('[PanelActions] Got LaTeX, length:', data.latex.length);
                        resolve(new Blob([data.latex], { type: 'text/plain' }));
                    });

                    // Write to clipboard using ClipboardItem API
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'text/plain': clipboardItem
                        })
                    ]);

                    console.log('[PanelActions] Successfully copied to clipboard');

                    // Visual feedback
                    button.innerHTML = button.dataset.successIcon;
                    button.classList.add('success');

                    setTimeout(() => {
                        button.innerHTML = originalIcon;
                        button.classList.remove('success');
                    }, 2000);

                } catch (err) {
                    console.error('[PanelActions] Failed to copy TeX:', err);
                    console.error('[PanelActions] Error stack:', err.stack);

                    // Reset button on error
                    button.innerHTML = originalIcon;
                }
            }
        });

        // Copy code action (for code blocks specifically)
        this.registerAction('copy-code', {
            icon: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 3.5V2C5.5 1.44772 5.94772 1 6.5 1H13.5C14.0523 1 14.5 1.44772 14.5 2V11C14.5 11.5523 14.0523 12 13.5 12H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="1.5" y="4.5" width="9" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
            </svg>`,
            successIcon: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            title: 'Copy code',
            className: 'panel-action-btn copy-code-btn',
            onClick: async (button, codeElement) => {
                // Get code text from dataset (stored during wrapping)
                const codeText = codeElement.dataset.codeText || this._extractCodeText(codeElement);

                try {
                    await navigator.clipboard.writeText(codeText);

                    // Visual feedback
                    const originalIcon = button.innerHTML;
                    button.innerHTML = button.dataset.successIcon;
                    button.classList.add('success');

                    setTimeout(() => {
                        button.innerHTML = originalIcon;
                        button.classList.remove('success');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                }
            }
        });

        // Regenerate response action (future feature)
        this.registerAction('regenerate', {
            icon: '🔄',
            title: 'Regenerate response',
            className: 'panel-action-btn regenerate-btn',
            onClick: (button, panelElement) => {
                console.log('Regenerate clicked - not yet implemented');
                // TODO: Implement regeneration
            }
        });

        // Branch conversation action (future feature)
        this.registerAction('branch', {
            icon: '🌿',
            title: 'Branch from here',
            className: 'panel-action-btn branch-btn',
            onClick: (button, panelElement) => {
                console.log('Branch clicked - not yet implemented');
                // TODO: Implement branching
            }
        });
    }

    /**
     * Register default panel detectors
     * @private
     */
    _registerDefaultDetectors() {
        // System prompt detector
        this.registerPanelDetector('system-prompt', (pre) => {
            const text = pre.textContent || pre.innerText;
            const html = pre.innerHTML;

            // Detect system prompt panels by title (supports both ┌ and ╭─ box styles)
            return (
                html.includes('>System<') ||
                html.includes('>system<') ||
                ((text.includes('┌') || text.includes('╭─')) && text.includes('System'))
            );
        });

        // User message detector
        this.registerPanelDetector('user-message', (pre) => {
            const text = pre.textContent || pre.innerText;
            const html = pre.innerHTML;

            // Detect user message panels (supports both ┌ and ╭─ box styles)
            const isUserMessage = (
                html.includes('>User<') ||
                html.includes('>user<') ||
                ((text.includes('┌') || text.includes('╭─')) && text.includes('User'))
            );

            return isUserMessage;
        });

        // Agent message detector
        this.registerPanelDetector('agent-message', (pre) => {
            const text = pre.textContent || pre.innerText;
            const html = pre.innerHTML;

            // Detect agent message panels (supports both ┌ and ╭─ box styles)
            return (
                html.includes('>Assistant<') ||
                html.includes('>assistant<') ||
                html.includes('>Agent<') ||
                html.includes('>agent<') ||
                ((text.includes('┌') || text.includes('╭─')) && (text.includes('Assistant') || text.includes('Agent')))
            );
        });

        // Code block detector
        this.registerPanelDetector('code-block', (element) => {
            if (element.classList.contains('code-block-wrapper')) {
                return true;
            }

            const html = element.innerHTML;
            const bgColor = this.codeBackgroundColor || '#242933';
            return html.includes(`background-color: ${bgColor}`) ||
                   html.includes(`background-color:${bgColor}`);
        });

        // Generic panel detector (any panel) - supports both box styles
        this.registerPanelDetector('any-panel', (pre) => {
            const text = pre.textContent || pre.innerText;
            return text.includes('┌') || text.includes('│') || text.includes('╭─') || text.includes('│');
        });
    }

    /**
     * Register a new action
     * @param {string} name - Action name
     * @param {Object} config - Action configuration
     */
    registerAction(name, config) {
        this.actions.set(name, {
            icon: config.icon || '○',
            successIcon: config.successIcon || config.icon,
            title: config.title || name,
            className: config.className || 'panel-action-btn',
            onClick: config.onClick || (() => {}),
            position: config.position || 'top-right' // top-right, top-left, bottom-right, bottom-left
        });
    }

    /**
     * Register a panel type detector
     * @param {string} panelType - Panel type name
     * @param {Function} detector - Function that returns true if element matches this panel type
     */
    registerPanelDetector(panelType, detector) {
        this.panelDetectors.set(panelType, detector);
    }

    /**
     * Apply actions to panels in the given element based on rules
     * @param {HTMLElement} element - Container to search
     * @param {Array} rules - Array of {panelType, actions: [actionName, ...]}
     */
    applyActions(element, rules) {
        // First, handle code blocks specifically (they're inside panels, not panels themselves)
        this._applyCodeBlockActions(element, rules);

        // Then handle panel-level actions
        // Find all <pre> tags (Rich panels are in <pre> tags)
        const preElements = element.querySelectorAll('pre:not(.panel-actions-processed)');

        preElements.forEach(pre => {
            // Debug: log what we're looking at
            const text = pre.textContent || pre.innerText;
            const html = pre.innerHTML;
            console.log('[PanelActions] Analyzing pre element:', {
                textPreview: text.substring(0, 150),
                htmlPreview: html.substring(0, 300),
                hasBoxChar: text.includes('┌'),
                hasUser: text.includes('User'),
                hasAgent: text.includes('Agent') || text.includes('Assistant')
            });

            // Determine what type of panel this is
            const panelTypes = [];
            for (const [type, detector] of this.panelDetectors) {
                // Skip code-block detector here - handled separately
                if (type === 'code-block') {
                    continue;
                }
                if (detector(pre)) {
                    panelTypes.push(type);
                }
            }

            if (panelTypes.length === 0) {
                return; // Not a recognized panel
            }

            console.log('[PanelActions] Detected panel types:', panelTypes, 'for pre element');

            // Find matching rules
            const actionsToApply = new Set();
            for (const rule of rules) {
                if (panelTypes.includes(rule.panelType)) {
                    rule.actions.forEach(action => actionsToApply.add(action));
                }
            }

            if (actionsToApply.size === 0) {
                console.log('[PanelActions] No actions to apply for panel types:', panelTypes);
                return; // No actions for this panel type
            }

            console.log('[PanelActions] Applying actions:', Array.from(actionsToApply), 'to panel types:', panelTypes);

            // Mark as processed
            pre.classList.add('panel-actions-processed');

            // Wrap panel if not already wrapped
            let wrapper = pre.parentElement;
            if (!wrapper.classList.contains('panel-wrapper')) {
                wrapper = document.createElement('div');
                wrapper.className = 'panel-wrapper';
                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(pre);
            }

            // Add action buttons with offsets
            const actionsList = Array.from(actionsToApply);
            actionsList.forEach((actionName, index) => {
                const actionConfig = this.actions.get(actionName);
                if (!actionConfig) {
                    // console.warn(`[PanelActions] Unknown action: ${actionName}`);
                    return;
                }

                const button = this._createActionButton(actionConfig, pre, index);
                wrapper.appendChild(button);
            });
        });
    }

    /**
     * Apply actions specifically to code blocks within panels
     * @private
     */
    _applyCodeBlockActions(element, rules) {
        // Find code block rules
        const codeBlockRule = rules.find(rule => rule.panelType === 'code-block');
        if (!codeBlockRule || codeBlockRule.actions.length === 0) {
            return;
        }

        // Find all <pre> elements
        const preElements = element.querySelectorAll('pre:not(.code-buttons-processed)');

        preElements.forEach(pre => {
            pre.classList.add('code-buttons-processed');

            const html = pre.innerHTML;
            const text = pre.textContent || pre.innerText;

            // Detect if this pre is inside a tool panel
            // Tool panels have tool names followed by colons in the panel title area
            // Look for the panel border structure with a tool name
            const isInToolPanel = /┌.*(?:Read|Write|Edit|Glob|Grep|Bash|Task|WebFetch|WebSearch|SlashCommand|TodoWrite|NotebookEdit|ExitPlanMode)(?:\s|:)/i.test(text);

            // console.log('[PanelActions] Panel detection - isInToolPanel:', isInToolPanel, 'text preview:', text.substring(0, 100));

            // Find code block ranges (lines with code background color)
            const lines = html.split('\n');
            const codeBlockRanges = [];
            let inCodeBlock = false;
            let blockStart = -1;

            lines.forEach((line, index) => {
                // Use dynamic theme color if available, otherwise fallback
                const bgColor = this.codeBackgroundColor || '#242933';
                const hasCodeBg = line.includes(`background-color: ${bgColor}`) ||
                                 line.includes(`background-color:${bgColor}`);

                if (hasCodeBg && !inCodeBlock) {
                    inCodeBlock = true;
                    blockStart = index;
                } else if (!hasCodeBg && inCodeBlock && line.trim() !== '') {
                    codeBlockRanges.push({start: blockStart, end: index - 1});
                    inCodeBlock = false;
                }
            });

            if (inCodeBlock) {
                codeBlockRanges.push({start: blockStart, end: lines.length - 1});
            }

            if (codeBlockRanges.length === 0) {
                return;
            }

            // console.log(`[PanelActions] Found ${codeBlockRanges.length} code blocks`);

            // Process in reverse to preserve indices
            for (let i = codeBlockRanges.length - 1; i >= 0; i--) {
                const range = codeBlockRanges[i];
                const codeHTMLLines = lines.slice(range.start, range.end + 1);
                const codeHTML = codeHTMLLines.join('\n');

                // Detect if THIS specific code block is inside a tool panel
                // Look backwards from the code block to find tool panel borders
                const precedingLines = lines.slice(Math.max(0, range.start - 50), range.start).join('\n');
                // Tool panels use ╭─ or ├─ for borders, followed by tool name
                const isInToolPanelBlock = /[╭├└╰]─\s*(?:Read|Write|Edit|Glob|Grep|Bash|Task|WebFetch|WebSearch|SlashCommand|TodoWrite|NotebookEdit|ExitPlanMode|RunPython|RunCommand)/i.test(precedingLines);

                // console.log(`[PanelActions] Code block ${i} - isInToolPanel:`, isInToolPanelBlock, 'sample:', precedingLines.substring(Math.max(0, precedingLines.length - 150)));

                // Extract text for copying
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = codeHTML;
                const codeText = this._extractCodeText(tempDiv);

                // Create wrapper
                const wrapperId = `code-block-${Date.now()}-${i}`;
                const wrapperClass = isInToolPanelBlock ? 'code-block-wrapper in-tool-panel' : 'code-block-wrapper';
                // console.log(`[PanelActions] Creating wrapper with class: ${wrapperClass}`);
                const wrapperStart = `<span class="${wrapperClass}" id="${wrapperId}" style="position: relative; display: inline-block;">`;
                const wrapperEnd = `</span>`;

                lines.splice(range.start, range.end - range.start + 1, wrapperStart + codeHTML + wrapperEnd);

                setTimeout(() => {
                    const wrapper = pre.querySelector(`#${wrapperId}`);
                    if (!wrapper) return;

                    wrapper.dataset.codeText = codeText;

                    codeBlockRule.actions.forEach((actionName, actionIndex) => {
                        const actionConfig = this.actions.get(actionName);
                        if (!actionConfig) return;

                        const button = this._createActionButton(actionConfig, wrapper, actionIndex);
                        wrapper.appendChild(button);
                    });
                }, 0);
            }

            pre.innerHTML = lines.join('\n');
        });
    }

    /**
     * Create an action button element
     * @private
     */
    _createActionButton(config, panelElement, buttonIndex = 0) {
        const button = document.createElement('button');
        button.className = config.className;

        // Add offset class for multiple buttons (stack horizontally)
        if (buttonIndex > 0) {
            button.classList.add(`action-offset-${buttonIndex}`);
        }

        button.innerHTML = config.icon;
        button.title = config.title;
        button.dataset.successIcon = config.successIcon;

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            config.onClick(button, panelElement);
        });

        return button;
    }

    /**
     * Extract code text from a code block
     * @private
     */
    _extractCodeText(codeElement) {
        let text = codeElement.textContent || codeElement.innerText;

        // Split into lines
        let codeLines = text.split('\n');

        // Remove box-drawing characters
        codeLines = codeLines.map(line => {
            line = line.replace(/│/g, '');
            return line;
        }).filter(line => line.trim().length > 0);

        // Find minimum indentation (excluding empty lines)
        const minIndent = Math.min(...codeLines.map(line => {
            const match = line.match(/^(\s*)/);
            return match ? match[1].length : 0;
        }));

        // Remove common indentation and trailing whitespace
        return codeLines
            .map(line => line.substring(minIndent).trimEnd())
            .join('\n')
            .trim();
    }

    /**
     * Extract clean text from a Rich panel (removing box-drawing chars, titles, subtitles)
     * Formats tool calls with headers for better readability
     * @private
     */
    _extractCleanText(panelElement) {
        let text = panelElement.textContent || panelElement.innerText;

        // Split into lines
        let lines = text.split('\n');

        // Process each line
        let sections = []; // Array of {type: 'tool'|'text', content: [lines]}
        let currentSection = null;
        let inContent = false;

        // Tool name patterns (RunCommand, ReadFile, WriteFile, etc.)
        const toolNamePattern = /^(Run\w+|Read\w+|Write\w+|Search\w+|Get\w+|Set\w+|Create\w+|Delete\w+|Update\w+|List\w+|Execute\w+|Fetch\w+|Send\w+|Process\w+|Calculate\w+|Generate\w+|Parse\w+|Validate\w+|Transform\w+):/;

        for (let line of lines) {
            // Remove box-drawing characters
            let cleaned = line.replace(/[┌┐└┘├┤┬┴┼─│╭╮╯╰]/g, '').trim();

            // Skip empty lines (but track them for section breaks)
            if (cleaned.length === 0) {
                continue;
            }

            // Skip panel titles (Agent, User, System, etc.)
            if (!inContent && (
                cleaned === 'Agent' ||
                cleaned === 'User' ||
                cleaned === 'System' ||
                cleaned === 'Assistant'
            )) {
                inContent = true;
                continue;
            }

            // Skip model names / subtitles
            if (cleaned.includes('Claude') ||
                cleaned.includes('GPT') ||
                cleaned.includes('Gemini') ||
                cleaned.includes('Haiku') ||
                cleaned.includes('Sonnet') ||
                cleaned.includes('Opus')) {
                continue;
            }

            // Detect tool call start (e.g., "RunCommand: `ls`")
            if (toolNamePattern.test(cleaned)) {
                // Start new tool section
                currentSection = { type: 'tool', content: [cleaned] };
                sections.push(currentSection);
                inContent = true;
                continue;
            }

            // If we're in a tool section, continue adding to it
            // Tool sections typically have keywords like "output:", "Command:", "Return Code:", etc.
            if (currentSection && currentSection.type === 'tool' &&
                (cleaned.toLowerCase().includes('output') ||
                 cleaned.toLowerCase().includes('command') ||
                 cleaned.toLowerCase().includes('return code') ||
                 cleaned.toLowerCase().includes('standard') ||
                 cleaned.toLowerCase().includes('error') ||
                 cleaned.toLowerCase().includes('result') ||
                 cleaned.toLowerCase().includes('status') ||
                 cleaned.startsWith('None') ||
                 cleaned.match(/^[\d\w_-]+:/))) {
                currentSection.content.push(cleaned);
                continue;
            }

            // Otherwise, it's regular text content
            if (!currentSection || currentSection.type !== 'text') {
                currentSection = { type: 'text', content: [] };
                sections.push(currentSection);
            }
            currentSection.content.push(cleaned);
            inContent = true;
        }

        // Format sections with headers
        let formattedParts = [];

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (section.type === 'tool') {
                // Add tool call header
                formattedParts.push('---');
                formattedParts.push('### Tool Call:');
                formattedParts.push(section.content.join('\n'));
                formattedParts.push('---');
                formattedParts.push(''); // Empty line after tool section
            } else {
                // Add assistant header for text after tool calls
                if (i > 0 && sections[i - 1].type === 'tool') {
                    formattedParts.push('### Assistant:');
                }
                formattedParts.push(section.content.join('\n'));
            }
        }

        return formattedParts.join('\n').trim();
    }
}

// Export for use in main app
window.PanelActionsManager = PanelActionsManager;
