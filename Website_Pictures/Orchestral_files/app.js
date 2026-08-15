// Orchestral Web UI - WebSocket Client

class OrchestralUI {
    constructor() {
        this.isProcessing = false;
        this.userHasScrolled = false;
        this.currentConversationId = null;
        this.conversations = [];
        this.activeDropdown = null;
        this.renameConversationId = null;
        this.isInterrupted = false;  // Track if current message was interrupted

        // Edit mode state
        this.isEditMode = false;
        this.editingMessageIndex = null;
        this.originalInputText = '';  // Store original text for cancel

        // Queue mode state
        this.isQueueMode = false;
        this.messageQueue = [];  // Queue of messages to send after agent completes (max 1 for now)

        // Feature flags
        this.displayTexCopyButton = true;  // Enable TeX copy button (placeholder feature)

        // Model name mappings: technical name -> friendly display name
        this.modelDisplayNames = {
            // OpenAI models
            'gpt-4o-mini': 'GPT-4o-mini',
            'gpt-4o-mini-2024-07-18': 'GPT-4o-mini',
            'gpt-4o': 'GPT-4o',
            'gpt-4o-2024-08-06': 'GPT-4o',
            'gpt-4.1-mini': 'GPT-4.1-mini',
            'gpt-4.1-mini-2025-04-14': 'GPT-4.1-mini',
            'gpt-4.1': 'GPT-4.1',
            'gpt-4.1-2025-04-14': 'GPT-4.1',
            'gpt-5-mini': 'GPT-5-mini',
            'gpt-5': 'GPT-5',

            // Anthropic models
            'claude-3-5-haiku-latest': 'Claude Haiku 3.5',
            'claude-3-5-haiku-20241022': 'Claude Haiku 3.5',
            'claude-3-haiku-20240307': 'Claude Haiku 3.0',
            'claude-sonnet-4-0': 'Claude Sonnet 4',
            'claude-sonnet-4-20250514': 'Claude Sonnet 4',
            'claude-3-7-sonnet-20250219': 'Claude Sonnet 3.7',
            'claude-opus-4-0': 'Claude Opus 4',
            'claude-opus-4-20250514': 'Claude Opus 4',
            'claude-opus-4-1': 'Claude Opus 4.1',

            // Google models
            'gemini-2.0-flash-exp': 'Gemini 2.0 Flash',
            'gemini-1.5-pro': 'Gemini 1.5 Pro',
            'gemini-1.5-flash': 'Gemini 1.5 Flash',
            'gemini-1.5-flash-8b': 'Gemini 1.5 Flash-8B',
            'gemini-1.0-pro': 'Gemini 1.0 Pro',

            // Groq models
            'llama-3.3-70b-versatile': 'Llama 3.3 70B',
            'llama-3.1-8b-instant': 'Llama 3.1 8B',
            'meta-llama/llama-4-scout-17b-16e-instruct': 'Llama 4 Scout 17B',
            'meta-llama/llama-4-maverick-17b-128e-instruct': 'Llama 4 Maverick 17B',
            'openai/gpt-oss-20b': 'GPT-OSS 20B',
            'openai/gpt-oss-120b': 'GPT-OSS 120B',
            'qwen/qwen3-32b': 'Qwen 3 32B'
        };

        // Voice recording state
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordingStartTime = null;

        // DOM elements
        this.chatContainer = document.getElementById('chat-container');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.micBtn = document.getElementById('mic-btn');
        this.undoBtn = document.getElementById('undo-btn');
        this.usageTracker = document.getElementById('usage-tracker');
        this.statusDot = document.getElementById('status-dot');
        this.statusDivider = document.getElementById('status-divider');
        this.usageCostContent = document.getElementById('usage-cost-content');
        this.costTokenDivider = document.getElementById('cost-token-divider');
        this.usageTokenContent = document.getElementById('usage-token-content');
        this.sidebar = document.getElementById('sidebar');
        this.toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
        this.newConversationBtn = document.getElementById('new-conversation-btn');
        this.conversationsList = document.getElementById('conversations-list');
        this.settingsSidebar = document.getElementById('settings-sidebar');
        this.toggleSettingsBtn = document.getElementById('toggle-settings-btn');
        this.renameModal = document.getElementById('rename-modal');
        this.renameInput = document.getElementById('rename-input');
        this.renameCancelBtn = document.getElementById('rename-cancel-btn');
        this.renameConfirmBtn = document.getElementById('rename-confirm-btn');
        this.workspaceModal = document.getElementById('workspace-modal');
        this.workspaceInput = document.getElementById('workspace-input');
        this.workspaceDisplay = document.getElementById('workspace-display');
        this.editWorkspaceBtn = document.getElementById('edit-workspace-btn');
        this.workspaceCancelBtn = document.getElementById('workspace-cancel-btn');
        this.workspaceConfirmBtn = document.getElementById('workspace-confirm-btn');
        this.systemPromptModal = document.getElementById('system-prompt-modal');
        this.systemPromptInput = document.getElementById('system-prompt-input');
        this.editSystemPromptBtn = document.getElementById('edit-system-prompt-btn');
        this.systemPromptCancelBtn = document.getElementById('system-prompt-cancel-btn');
        this.systemPromptConfirmBtn = document.getElementById('system-prompt-confirm-btn');
        this.latexHelpModal = document.getElementById('latex-help-modal');
        this.latexHelpBtn = document.getElementById('latex-help-btn');
        this.latexHelpCloseBtn = document.getElementById('latex-help-close-btn');
        this.copyOrchestralTexBtn = document.getElementById('copy-orchestral-tex-btn');
        this.downloadOrchestralTexBtn = document.getElementById('download-orchestral-tex-btn');
        this.maxCostModal = document.getElementById('max-cost-modal');
        this.maxCostInput = document.getElementById('max-cost-input');
        this.maxCostClearBtn = document.getElementById('max-cost-clear-btn');
        this.maxCostCancelBtn = document.getElementById('max-cost-cancel-btn');
        this.maxCostConfirmBtn = document.getElementById('max-cost-confirm-btn');
        this.modelBtn = document.getElementById('model-btn');
        this.modelDisplay = document.getElementById('model-display');
        this.modelDropdown = document.getElementById('model-dropdown');
        this.toggleModelNamesBtn = document.getElementById('toggle-model-names-btn');
        this.toggleModelNamesCheckbox = document.getElementById('toggle-model-names-checkbox');
        this.showModelNames = false;
        this.streamToggle = document.getElementById('stream-toggle');
        this.streamEnabled = true; // Default to streaming enabled
        this.cacheToggle = document.getElementById('cache-toggle');
        this.cacheEnabled = true; // Default to caching enabled
        this.systemPromptToggle = document.getElementById('system-prompt-toggle');
        this.showSystemPrompt = false; // Default to hiding system prompt
        this.currentBaseDirectory = null;
        this.refreshSettingsBtn = document.getElementById('refresh-settings-btn');
        this.clearSettingsBtn = document.getElementById('clear-settings-btn');
        this.toolTogglesContainer = document.getElementById('tool-toggles-container');
        this.popupContainer = document.getElementById('popup-container');
        // resetStreamingBtn removed - auto-reset on model change handles this

        // Initialize feature modules
        this.latexRenderer = new window.LatexRenderer();
        this.imageRenderer = new window.ImageRenderer();
        this.wsManager = new window.WebSocketManager();

        // Initialize modular panel actions system
        this.panelActions = new window.PanelActionsManager(this);

        // Define which actions to apply to which panel types
        // Build user message actions based on feature flags
        // Note: buttons are positioned right-to-left, so rightmost button is first
        const userMessageActions = this.displayTexCopyButton
            ? ['copy', 'edit-message', 'copy-tex']
            : ['copy', 'edit-message'];

        const agentMessageActions = this.displayTexCopyButton
            ? ['copy', 'copy-tex']
            : ['copy'];

        const systemMessageActions = this.displayTexCopyButton
            ? ['copy', 'edit-system-prompt', 'copy-tex']
            : ['copy', 'edit-system-prompt'];

        this.panelActionRules = [
            // System prompts: copy + edit + TeX
            { panelType: 'system-prompt', actions: systemMessageActions },

            // User messages: copy + optional TeX + edit
            { panelType: 'user-message', actions: userMessageActions },

            // Agent messages: copy + optional TeX
            { panelType: 'agent-message', actions: agentMessageActions },

            // Code blocks: copy code only
            { panelType: 'code-block', actions: ['copy-code'] },

            // Any panel: copy (fallback)
            { panelType: 'any-panel', actions: ['copy'] },
        ];

        this.init();
    }

    init() {
        // Set up WebSocket connection and handlers
        this.setupWebSocket();

        // Set up event listeners
        this.userInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.userInput.addEventListener('input', () => this.autoResizeTextarea());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.micBtn.addEventListener('click', () => this.toggleVoiceRecording());

        // Initialize textarea height
        this.autoResizeTextarea();

        // Cancel button - handles both edit and queue modes
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => {
                if (this.isQueueMode) {
                    this.cancelQueue();
                } else if (this.isEditMode) {
                    this.cancelEdit();
                }
            });
        }

        this.undoBtn.addEventListener('click', () => this.undoLastMessage());
        this.toggleSidebarBtn.addEventListener('click', () => this.toggleSidebar());
        this.toggleSettingsBtn.addEventListener('click', () => this.toggleSettings());
        this.newConversationBtn.addEventListener('click', () => this.newConversation());
        this.renameCancelBtn.addEventListener('click', () => this.closeRenameModal());
        this.renameConfirmBtn.addEventListener('click', () => this.confirmRename());
        this.editWorkspaceBtn.addEventListener('click', () => this.showWorkspaceModal());
        this.workspaceDisplay.addEventListener('click', () => this.showWorkspaceModal());
        this.workspaceCancelBtn.addEventListener('click', () => this.closeWorkspaceModal());
        this.workspaceConfirmBtn.addEventListener('click', () => this.confirmWorkspace());
        this.editSystemPromptBtn.addEventListener('click', () => this.showSystemPromptModal());
        this.systemPromptCancelBtn.addEventListener('click', () => this.closeSystemPromptModal());
        this.systemPromptConfirmBtn.addEventListener('click', () => this.confirmSystemPrompt());
        this.latexHelpBtn.addEventListener('click', () => this.showLatexHelpModal());
        this.latexHelpCloseBtn.addEventListener('click', () => this.closeLatexHelpModal());
        this.copyOrchestralTexBtn.addEventListener('click', () => this.copyOrchestralTex());
        this.downloadOrchestralTexBtn.addEventListener('click', () => this.downloadOrchestralTex());

        // Max cost modal
        this.usageTracker.addEventListener('click', () => this.showMaxCostModal());
        this.maxCostCancelBtn.addEventListener('click', () => this.closeMaxCostModal());
        this.maxCostConfirmBtn.addEventListener('click', () => this.confirmMaxCost());
        this.maxCostClearBtn.addEventListener('click', () => this.clearMaxCost());

        // Close rename modal on Escape
        this.renameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.confirmRename();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.closeRenameModal();
            }
        });

        // Workspace modal keyboard handlers
        this.workspaceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.confirmWorkspace();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.closeWorkspaceModal();
            }
        });

        // Max cost modal keyboard handlers
        this.maxCostInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.confirmMaxCost();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.closeMaxCostModal();
            }
        });

        // System prompt modal keyboard handlers
        this.systemPromptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.closeSystemPromptModal();
            }
            // Ctrl/Cmd + Enter to save
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.confirmSystemPrompt();
            }
        });

        // LaTeX help modal keyboard handlers and click outside
        this.latexHelpModal.addEventListener('click', (e) => {
            // Close if clicking on the modal background (not the content)
            if (e.target === this.latexHelpModal) {
                this.closeLatexHelpModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.latexHelpModal.classList.contains('hidden')) {
                this.closeLatexHelpModal();
            }
        });

        // Settings controls
        this.toggleModelNamesCheckbox.addEventListener('change', () => this.toggleModelNames());
        this.streamToggle.addEventListener('change', () => this.toggleStreaming());
        this.cacheToggle.addEventListener('change', () => this.toggleCache());
        this.systemPromptToggle.addEventListener('change', () => this.toggleSystemPrompt());
        this.refreshSettingsBtn.addEventListener('click', () => this.refreshConnection());
        this.clearSettingsBtn.addEventListener('click', () => this.clearConversation());
        // resetStreamingBtn event listener removed - auto-reset on model change handles this

        // Model selector
        this.modelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleModelDropdown();
        });

        // Model selection
        document.querySelectorAll('.model-item').forEach(item => {
            item.addEventListener('click', () => {
                const provider = item.dataset.provider;
                const model = item.dataset.model;
                const displayName = item.textContent;
                this.selectModel(provider, model, displayName);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.activeDropdown && !e.target.closest('.conversation-actions')) {
                this.closeDropdown();
            }
            if (!this.modelDropdown.classList.contains('hidden') && !e.target.closest('.model-selector-container')) {
                this.modelDropdown.classList.add('hidden');
            }
        });

        // Track user scroll behavior
        this.chatContainer.addEventListener('scroll', () => {
            const threshold = 100; // pixels from bottom
            const atBottom = this.chatContainer.scrollHeight - this.chatContainer.scrollTop - this.chatContainer.clientHeight < threshold;
            this.userHasScrolled = !atBottom;
        });

        // Global Esc key listener for interrupts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isProcessing) {
                e.preventDefault();
                this.sendInterrupt();
            }
        });

        // Focus input on load
        this.userInput.focus();

        // Add window resize listener to update cost display responsively
        const updateResponsiveDisplay = () => {
            console.log('[Resize] Window resized, updating cost display');
            // Always update if we have stored values (maxCost can be undefined/null)
            if (this.currentCost !== undefined || this.currentTokens !== undefined) {
                const currentCost = this.currentCost || 0;
                const currentTokens = this.currentTokens || 0;
                const currentContextWindow = this.currentContextWindow || 128000;
                console.log('[Resize] Updating with:', {currentCost, currentTokens, currentContextWindow, maxCost: this.maxCost});
                this.updateUsageTracker(currentCost, currentTokens, currentContextWindow, this.maxCost);
            } else {
                console.log('[Resize] Skipping update - no stored values yet');
            }
        };

        window.addEventListener('resize', updateResponsiveDisplay);

        // Also add ResizeObserver to watch the header container size as backup
        const headerContainer = document.querySelector('.header-content');
        if (headerContainer) {
            this.usageTrackerObserver = new ResizeObserver(updateResponsiveDisplay);
            this.usageTrackerObserver.observe(headerContainer);
        }
    }

    setupWebSocket() {
        // Set up connection state callbacks
        this.wsManager.onConnect = () => {
            this.updateStatus('connected', 'Connected');
            // Request conversation history and list
            this.requestHistory();
            this.requestConversationsList();
            // Request available models
            this.requestAvailableModels();
            // Request available Ollama models
            this.requestOllamaModels();
            // Request tools info
            this.requestToolsInfo();
            // Request pending approval state if any
            this.requestPendingApproval();
            // Sync initial settings with backend
            this.wsManager.send('toggle_streaming', { enabled: this.streamEnabled });
            this.wsManager.send('toggle_cache', { enabled: this.cacheEnabled });
        };

        this.wsManager.onDisconnect = () => {
            this.updateStatus('error', 'Disconnected');
            this.isProcessing = false;
            this.updateInputState();
        };

        this.wsManager.onError = () => {
            this.updateStatus('error', 'Connection error');
        };

        // Set up message routing
        this.wsManager.onMessage = (data) => {
            this.handleMessage(data);
        };

        // Update status and connect
        this.updateStatus('connecting', 'Connecting...');
        this.wsManager.connect();
    }

    autoResizeTextarea() {
        const textarea = this.userInput;
        const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
        const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop);
        const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom);
        const maxLines = 8;
        const maxHeight = (lineHeight * maxLines) + paddingTop + paddingBottom;

        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';

        // Set new height based on content, capped at max
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = newHeight + 'px';

        // Show scrollbar if content exceeds max height
        if (textarea.scrollHeight > maxHeight) {
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.overflowY = 'hidden';
        }
    }

    handleKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Enter without Shift: send message
            e.preventDefault();
            this.sendMessage();
        } else if (e.key === 'Escape') {
            // Esc: interrupt
            e.preventDefault();
            this.sendInterrupt();
        }
        // Shift+Enter: natural newline (browser default)
    }

    sendMessage() {
        const message = this.userInput.value.trim();

        if (!message || !this.wsManager.getConnectionStatus()) {
            return;
        }

        // If agent is currently processing, queue the message instead
        if (this.isProcessing) {
            this.queueMessage(message);
            return;
        }

        // If in edit mode, truncate context and clear display
        if (this.isEditMode && this.editingMessageIndex !== null) {
            this.wsManager.send('truncate_context', { message_index: this.editingMessageIndex });

            // Clear chat display and refresh to show truncated history
            this.chatContainer.innerHTML = '';
            this.wsManager.send('get_history');

            // Exit edit mode
            this.exitEditMode();

            // Wait briefly for history to load before sending new message
            setTimeout(() => {
                this.wsManager.send('chat', { message });
                this.userInput.value = '';
                this.autoResizeTextarea();
                this.isProcessing = true;
                this.isInterrupted = false;
                this.userHasScrolled = false;
                this.updateInputState();
            }, 100);

            return;
        }

        // Normal send flow
        this.wsManager.send('chat', { message });

        // Clear input
        this.userInput.value = '';
        this.autoResizeTextarea();

        // Update state
        this.isProcessing = true;
        this.isInterrupted = false;  // Reset interrupt flag for new message
        this.userHasScrolled = false; // Reset scroll tracking on new message
        this.updateInputState();
    }

    queueMessage(message) {
        console.log('[Queue] Queuing message:', message.substring(0, 50) + '...');

        // Add message to queue (max 1 for now, but extensible)
        this.messageQueue = [message];
        this.isQueueMode = true;

        // Disable input and update UI
        this.userInput.disabled = true;
        this.userInput.classList.add('queued');
        this.updateQueueModeUI();
    }

    cancelQueue() {
        console.log('[Queue] Canceling queued message');

        // Clear queue
        this.messageQueue = [];
        this.isQueueMode = false;

        // Re-enable input and clear the queued message
        this.userInput.disabled = false;
        this.userInput.classList.remove('queued');
        this.userInput.value = '';
        this.autoResizeTextarea();

        // Update UI
        this.updateQueueModeUI();
        this.userInput.focus();
    }

    updateQueueModeUI() {
        const cancelBtn = document.getElementById('cancel-edit-btn');

        if (this.isQueueMode) {
            // Change Send button to Queued button (purple)
            this.sendBtn.textContent = 'Queued';
            this.sendBtn.classList.add('queue-mode');
            this.sendBtn.disabled = true;

            // Show cancel button (X) - reuse edit cancel button
            if (cancelBtn) {
                cancelBtn.classList.add('visible');
                cancelBtn.classList.add('queue-cancel');
            }
        } else {
            // Restore normal send button
            this.sendBtn.textContent = 'Send';
            this.sendBtn.classList.remove('queue-mode');
            this.sendBtn.disabled = false;

            // Hide cancel button
            if (cancelBtn) {
                cancelBtn.classList.remove('visible');
                cancelBtn.classList.remove('queue-cancel');
            }
        }
    }

    sendInterrupt() {
        console.log('[DEBUG] sendInterrupt called, isConnected:', this.wsManager.getConnectionStatus(), 'isProcessing:', this.isProcessing);

        if (!this.wsManager.getConnectionStatus() || !this.isProcessing) {
            console.log('[DEBUG] Interrupt blocked - not connected or not processing');
            return;
        }

        // Clear any queued messages when interrupting
        if (this.isQueueMode) {
            this.cancelQueue();
        }

        // Set interrupt flag BEFORE sending to prevent race conditions
        this.isInterrupted = true;

        // Send interrupt signal
        console.log('[DEBUG] Sending interrupt message');
        this.wsManager.send('interrupt');

        this.showStatus('Interrupting...', 'interrupted');
    }

    enterEditMode(messageIndex) {
        console.log('[Edit] Entering edit mode for message index:', messageIndex);

        if (!this.wsManager.getConnectionStatus() || this.isProcessing) {
            this.showStatus('Cannot edit while processing', 'warning');
            return;
        }

        // Block editing while queue is active
        if (this.isQueueMode) {
            console.log('[Edit] Blocked - queue mode is active');
            return;
        }

        // Store state
        this.isEditMode = true;
        this.editingMessageIndex = messageIndex;
        this.originalInputText = this.userInput.value;

        // Request message text from backend
        this.wsManager.send('get_message_text', { message_index: messageIndex });

        // Note: UI will be updated when we receive the message text
    }

    exitEditMode() {
        console.log('[Edit] Exiting edit mode');

        this.isEditMode = false;
        this.editingMessageIndex = null;
        this.originalInputText = '';

        // Update UI
        this.updateEditModeUI();
        this.updateInputState();
    }

    cancelEdit() {
        console.log('[Edit] Canceling edit');

        // Restore original text
        this.userInput.value = this.originalInputText;

        // Exit edit mode
        this.exitEditMode();
    }

    receiveMessageText(text) {
        console.log('[Edit] Received message text:', text.substring(0, 50) + '...');

        // Populate input
        this.userInput.value = text;

        // Update UI to show edit mode
        this.updateEditModeUI();
        this.updateInputState();

        // Focus input
        this.userInput.focus();
    }

    updateEditModeUI() {
        const cancelBtn = document.getElementById('cancel-edit-btn');

        if (this.isEditMode) {
            // Change Send button to Edit button (red)
            this.sendBtn.textContent = 'Edit';
            this.sendBtn.classList.add('edit-mode');

            // Show cancel button (X) - this pushes Edit button to the left
            if (cancelBtn) {
                cancelBtn.classList.add('visible');
            }
        } else {
            // Restore normal send button
            this.sendBtn.textContent = 'Send';
            this.sendBtn.classList.remove('edit-mode');

            // Hide cancel button
            if (cancelBtn) {
                cancelBtn.classList.remove('visible');
            }
        }
    }

    clearConversation() {
        if (!this.wsManager.getConnectionStatus() || this.isProcessing) {
            return;
        }

        if (confirm('Clear conversation history?')) {
            this.wsManager.send('clear');

            // Clear chat display
            this.chatContainer.innerHTML = '';

            // Reset usage tracker
            this.updateUsageTracker(0, 0, 128000);
        }
    }

    refreshConnection() {
        // Clear display and request history from server
        this.chatContainer.innerHTML = '';
        // Reset interrupted flag to allow messages to display
        this.isInterrupted = false;
        if (this.wsManager.getConnectionStatus()) {
            this.requestHistory();
        }
    }

    requestHistory() {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }
        // Request conversation history from server
        this.wsManager.send('get_history');
    }

    handleMessage(data) {
        switch (data.type) {
            case 'user_message':
                this.appendMessage(data.content, true, data.message_index);  // Mark as user message with index
                break;

            case 'agent_update':
            case 'stream_chunk':
                // Ignore updates if we've interrupted - prevents duplicate panels
                if (this.isInterrupted) {
                    console.log('[DEBUG] Ignoring agent update after interrupt');
                    break;
                }
                this.updateOrAppendAgentMessage(data.content, data.message_index);
                break;

            case 'interrupted':
                this.showStatus(data.message || 'Interrupted by user', 'interrupted');
                break;

            case 'complete':
                this.isProcessing = false;
                this.updateInputState();

                // Auto-send queued message if one exists
                if (this.isQueueMode && this.messageQueue.length > 0) {
                    console.log('[Queue] Auto-sending queued message');
                    const queuedMessage = this.messageQueue[0];

                    // Clear queue and UI
                    this.cancelQueue();

                    // Send the queued message
                    this.wsManager.send('chat', { message: queuedMessage });
                    this.isProcessing = true;
                    this.isInterrupted = false;
                    this.userHasScrolled = false;
                    this.updateInputState();
                } else {
                    this.userInput.focus();
                }

                // Refresh conversations list after completion (to update timestamps)
                this.requestConversationsList();
                break;

            case 'error':
                this.showStatus(data.message || 'Error occurred', 'error');
                this.isProcessing = false;
                this.updateInputState();
                break;

            case 'warning':
                this.showStatus(data.message, 'warning');
                break;

            case 'info':
                this.showStatus(data.message, 'info');
                break;

            case 'conversations_list':
                this.updateConversationsList(data.conversations);
                break;

            case 'usage_update':
                this.updateUsageTracker(data.cost, data.tokens, data.context_window, data.max_cost);
                break;

            case 'cost_info':
                // Legacy support - redirect to usage_update
                this.updateUsageTracker(data.cost, 0, undefined);
                break;

            case 'model_changed':
                // Backend changed the model (e.g., when loading a conversation)
                this.updateModelDisplay(data.provider, data.model);
                break;

            case 'base_directory_info':
                // Backend sends base directory (e.g., on connection or load)
                this.setBaseDirectory(data.base_directory);
                break;

            case 'system_prompt_info':
                // Backend sends system prompt (when requested)
                this.receiveSystemPrompt(data.system_prompt);
                break;

            case 'ollama_models':
                // Backend sends available Ollama models
                this.handleOllamaModels(data.models);
                break;

            case 'approval_request':
                // Backend requests user approval for an action
                this.showApprovalModal(data);
                break;

            case 'tools_info':
                // Backend sends tools information
                this.handleToolsInfo(data);
                break;

            case 'message_text':
                // Backend sends message text for editing
                this.receiveMessageText(data.text);
                break;

            case 'available_models':
                // Backend sends available models list
                this.handleAvailableModels(data.models);
                break;

            case 'transcription':
                // Backend sends transcribed text from voice input
                this.handleTranscription(data.text);
                break;

            case 'popup_notification':
                // Backend sends a popup notification
                this.showPopup(data.title, data.message, data.notification_type || 'info');
                break;
        }

        // Auto-scroll to bottom only if user hasn't manually scrolled up
        if (!this.userHasScrolled) {
            this.scrollToBottom();
        }
    }

    appendMessage(htmlContent, isUser = false, messageIndex = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message rich-content';
        if (isUser) {
            messageDiv.dataset.isUser = 'true';
            // Store message index for edit functionality
            if (messageIndex !== null && messageIndex !== -1) {
                messageDiv.dataset.messageIndex = messageIndex;
            }
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = htmlContent;

        messageDiv.appendChild(contentDiv);
        this.chatContainer.appendChild(messageDiv);

        // Render LaTeX in the new content
        this.latexRenderer.render(contentDiv);

        // Render images in the new content
        this.imageRenderer.render(contentDiv);

        // Apply panel actions (modular system handles all copy buttons)
        this.panelActions.applyActions(contentDiv, this.panelActionRules);
    }

    updateOrAppendAgentMessage(htmlContent, messageIndex = null) {
        // Check if last message is an agent message (for streaming updates)
        const lastMessage = this.chatContainer.lastElementChild;

        // Only update if it's a message div AND not preceded by a status message
        // (which would indicate it's an existing agent message we're streaming to)
        if (lastMessage && lastMessage.classList.contains('message') &&
            !lastMessage.dataset.isUser) {
            // Update existing agent message content
            const contentDiv = lastMessage.querySelector('.message-content');
            if (contentDiv) {
                contentDiv.innerHTML = htmlContent;

                // Set message index if provided
                if (messageIndex !== null && messageIndex !== undefined) {
                    lastMessage.dataset.messageIndex = messageIndex;
                }

                // Render LaTeX in the updated content
                this.latexRenderer.render(contentDiv);

                // Render images in the updated content
                this.imageRenderer.render(contentDiv);

                // Apply panel actions (modular system handles all copy buttons)
                this.panelActions.applyActions(contentDiv, this.panelActionRules);
                return;
            }
        }

        // Otherwise, append new message and mark it as agent message
        // All messages use Rich HTML now
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message rich-content';
        messageDiv.dataset.isAgent = 'true';

        // Set message index if provided
        if (messageIndex !== null && messageIndex !== undefined) {
            messageDiv.dataset.messageIndex = messageIndex;
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = htmlContent;

        messageDiv.appendChild(contentDiv);
        this.chatContainer.appendChild(messageDiv);

        // Render LaTeX in the new content
        this.latexRenderer.render(contentDiv);

        // Render images in the new content
        this.imageRenderer.render(contentDiv);

        // Apply panel actions (new modular system)
        this.panelActions.applyActions(contentDiv, this.panelActionRules);

        // Legacy managers are now disabled - panel actions handles everything
    }

    showStatus(message, type = 'info') {
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message ${type}`;
        statusDiv.textContent = message;
        this.chatContainer.appendChild(statusDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            statusDiv.style.opacity = '0';
            statusDiv.style.transition = 'opacity 0.3s';
            setTimeout(() => statusDiv.remove(), 300);
        }, 5000);
    }

    showPopup(title, message, type = 'info') {
        // Create popup element
        const popup = document.createElement('div');
        popup.className = `popup-notification ${type}`;

        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-title">${this.escapeHtml(title)}</div>
                <div class="popup-message">${this.escapeHtml(message)}</div>
            </div>
            <button class="popup-close">×</button>
        `;

        // Add close handler
        const closeBtn = popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', () => this.closePopup(popup));

        // Add to container
        this.popupContainer.appendChild(popup);

        // Auto-close after 10 seconds for info/success, never auto-close for error/warning
        if (type === 'info' || type === 'success') {
            setTimeout(() => {
                if (popup.parentElement) {
                    this.closePopup(popup);
                }
            }, 10000);
        }
    }

    closePopup(popup) {
        popup.classList.add('closing');
        setTimeout(() => {
            if (popup.parentElement) {
                popup.remove();
            }
        }, 200);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStatus(state, text) {
        // Update status dot class
        this.statusDot.className = `status-dot ${state}`;

        // If disconnected or connecting, override usage display
        if (state === 'error' || state === 'connecting') {
            this.usageCostContent.textContent = text;
            this.usageTokenContent.textContent = '';
            // Hide dividers when showing status text
            this.statusDivider.style.display = 'none';
            this.costTokenDivider.style.display = 'none';
        } else if (state === 'connected') {
            // Show dividers and initial usage when connected
            this.statusDivider.style.display = 'block';
            this.updateUsageTracker(0, 0, 128000);
        }
    }

    updateInputState() {
        // Don't override queue mode disabled state
        if (this.isQueueMode) {
            // In queue mode, input stays disabled, send button is disabled
            // Only update other UI elements
            this.undoBtn.disabled = true;
            if (this.refreshSettingsBtn) {
                this.refreshSettingsBtn.disabled = this.isProcessing;
            }
            if (this.clearSettingsBtn) {
                this.clearSettingsBtn.disabled = true;
            }
            this.userInput.placeholder = 'Message queued (Click X to cancel)';
            return;
        }

        // Don't override edit mode UI
        if (this.isEditMode) {
            // Edit mode manages its own button state
            // Just update other elements
            this.undoBtn.disabled = true;
            if (this.refreshSettingsBtn) {
                this.refreshSettingsBtn.disabled = this.isProcessing;
            }
            if (this.clearSettingsBtn) {
                this.clearSettingsBtn.disabled = true;
            }
            return;
        }

        // Input is only disabled when disconnected (NOT when processing - allow queueing)
        const isDisconnected = !this.wsManager.getConnectionStatus();

        this.userInput.disabled = isDisconnected;
        this.sendBtn.disabled = false; // Send button always enabled (becomes Queue button when processing)
        this.undoBtn.disabled = isDisconnected || this.isProcessing;

        // Update settings sidebar buttons if they exist
        if (this.refreshSettingsBtn) {
            this.refreshSettingsBtn.disabled = this.isProcessing;
        }
        if (this.clearSettingsBtn) {
            this.clearSettingsBtn.disabled = isDisconnected || this.isProcessing;
        }

        // Update placeholder
        if (this.isProcessing) {
            this.userInput.placeholder = 'Agent is responding... (Type to queue next message)';
        } else if (!this.wsManager.getConnectionStatus()) {
            this.userInput.placeholder = 'Disconnected...';
        } else {
            this.userInput.placeholder = ' Type your message... (Enter to send, Shift+Enter for new line, Esc to interrupt)';
        }
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    // Undo functionality
    undoLastMessage() {
        if (!this.wsManager.getConnectionStatus() || this.isProcessing) {
            return;
        }

        this.wsManager.send('undo');

        // Refresh to show updated history
        this.refreshConnection();
    }

    // Sidebar functionality
    toggleSidebar() {
        this.sidebar.classList.toggle('hidden');
    }

    toggleSettings() {
        this.settingsSidebar.classList.toggle('hidden');
        // Push main content when settings open
        const mainContent = document.querySelector('.main-content');
        if (!this.settingsSidebar.classList.contains('hidden')) {
            mainContent.classList.add('settings-open');
        } else {
            mainContent.classList.remove('settings-open');
        }
    }

    newConversation() {
        if (!this.wsManager.getConnectionStatus() || this.isProcessing) {
            return;
        }

        // Clear without confirmation
        this.wsManager.send('clear');

        // Clear chat display and reset conversation ID
        this.chatContainer.innerHTML = '';
        this.currentConversationId = null;

        // Reset usage tracker
        this.updateUsageTracker(0, 0, 128000);
    }

    requestConversationsList() {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        this.wsManager.send('list_conversations');
    }

    updateConversationsList(conversations) {
        this.conversations = conversations;
        this.conversationsList.innerHTML = '';

        if (conversations.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'conversation-item';
            emptyDiv.style.textAlign = 'center';
            emptyDiv.style.color = '#888';
            emptyDiv.textContent = 'No conversations yet';
            this.conversationsList.appendChild(emptyDiv);
            return;
        }

        conversations.forEach(conv => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'conversation-item';
            if (conv.id === this.currentConversationId) {
                itemDiv.classList.add('active');
            }

            // Conversation info (clickable)
            const infoDiv = document.createElement('div');
            infoDiv.className = 'conversation-info';
            infoDiv.addEventListener('click', () => this.loadConversation(conv.id));

            const nameDiv = document.createElement('div');
            nameDiv.className = 'conversation-name';
            nameDiv.textContent = conv.name || 'Untitled';

            const timeDiv = document.createElement('div');
            timeDiv.className = 'conversation-time';
            timeDiv.textContent = conv.relative_time || '';

            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(timeDiv);

            // Actions menu (ellipsis button)
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'conversation-actions';

            const menuBtn = document.createElement('button');
            menuBtn.className = 'conversation-menu-btn';
            menuBtn.textContent = '⋯';
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(conv.id, actionsDiv);
            });

            // Dropdown menu
            const dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'conversation-dropdown hidden';
            dropdownDiv.dataset.conversationId = conv.id;

            const renameItem = document.createElement('div');
            renameItem.className = 'conversation-dropdown-item';
            renameItem.textContent = 'Rename';
            renameItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showRenameModal(conv.id, conv.name);
            });

            const duplicateItem = document.createElement('div');
            duplicateItem.className = 'conversation-dropdown-item';
            duplicateItem.textContent = 'Duplicate';
            duplicateItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.duplicateConversation(conv.id);
            });

            const deleteItem = document.createElement('div');
            deleteItem.className = 'conversation-dropdown-item danger';
            deleteItem.textContent = 'Delete';
            deleteItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteConversation(conv.id);
            });

            dropdownDiv.appendChild(renameItem);
            dropdownDiv.appendChild(duplicateItem);
            dropdownDiv.appendChild(deleteItem);

            actionsDiv.appendChild(menuBtn);
            actionsDiv.appendChild(dropdownDiv);

            itemDiv.appendChild(infoDiv);
            itemDiv.appendChild(actionsDiv);

            this.conversationsList.appendChild(itemDiv);
        });
    }

    loadConversation(conversationId) {
        if (!this.wsManager.getConnectionStatus() || this.isProcessing) {
            return;
        }

        this.wsManager.send('load_conversation', { conversation_id: conversationId });

        this.currentConversationId = conversationId;
        // Reset interrupted flag when loading a conversation
        this.isInterrupted = false;
        this.refreshConnection();
        this.requestConversationsList();
        this.requestToolsInfo();
    }

    // Update usage tracker
    updateUsageTracker(cost, tokens, contextWindow, maxCost) {
        if (cost === undefined || cost === null) {
            cost = 0;
        }
        if (tokens === undefined || tokens === null) {
            tokens = 0;
        }

        // Store values for later use (e.g., window resize)
        this.currentCost = cost;
        this.currentTokens = tokens;
        this.currentContextWindow = contextWindow;
        this.maxCost = maxCost;

        // Format cost as fraction
        let costStr;
        if (typeof cost === 'number') {
            if (cost === 0) {
                costStr = '0¢';
            } else if (cost < 0.01) {
                costStr = '< 1¢';
            } else if (cost < 1.00) {
                // Display in cents if less than $1
                const cents = Math.round(cost * 100);
                costStr = `${cents}¢`;
            } else {
                // Display in dollars if $1 or more
                costStr = `$${cost.toFixed(2)}`;
            }
        } else {
            costStr = '< 1¢';
        }

        // Add max cost display
        let maxCostStr;
        if (maxCost !== undefined && maxCost !== null) {
            if (maxCost < 1) {
                // Display in cents if less than $1
                const cents = Math.round(maxCost * 100);
                maxCostStr = `${cents}¢`;
            } else {
                maxCostStr = `$${maxCost.toFixed(2)}`;
            }
        } else {
            maxCostStr = '(no max set)';
        }

        // Format tokens with context window
        let tokensStr;
        if (typeof tokens === 'number' && typeof contextWindow === 'number' && contextWindow > 0) {
            tokensStr = `${tokens.toLocaleString()} / ${contextWindow.toLocaleString()} tokens`;
        } else if (typeof tokens === 'number') {
            tokensStr = `${tokens.toLocaleString()} tokens`;
        } else {
            tokensStr = '0 tokens';
        }

        // Update display with separate cost and token content
        // Calculate available space from header container (not tracker to avoid feedback loop)
        const headerContainer = document.querySelector('.header-content');
        const availableWidth = headerContainer ? headerContainer.offsetWidth : 1200;

        // Progressive disclosure based on available header space
        // Estimate space needed for other header elements (title, buttons, etc.)
        const reservedSpace = 500; // Space for title and settings button
        const trackerAvailableWidth = availableWidth - reservedSpace;

        if (trackerAvailableWidth > 400) {
            // Wide: show everything
            this.usageCostContent.textContent = `${costStr} / ${maxCostStr}`;
            this.usageTokenContent.textContent = tokensStr;
            this.statusDivider.style.display = 'block';
            this.costTokenDivider.style.display = 'block';
            this.usageTokenContent.style.display = 'block';
        } else if (trackerAvailableWidth > 200) {
            // Medium: show cost fraction only (hide trailing divider and tokens)
            this.usageCostContent.textContent = `${costStr} / ${maxCostStr}`;
            this.statusDivider.style.display = 'block';
            this.costTokenDivider.style.display = 'none';
            this.usageTokenContent.style.display = 'none';
        } else {
            // Narrow: show only current cost (hide trailing divider and tokens)
            this.usageCostContent.textContent = costStr;
            this.statusDivider.style.display = 'block';
            this.costTokenDivider.style.display = 'none';
            this.usageTokenContent.style.display = 'none';
        }

        // Always show tracker (it also serves as connection status)
        this.usageTracker.style.display = 'flex';

        // Update status dot to connected state when showing usage
        this.statusDot.className = 'status-dot connected';

        // Color-code cost based on cost threshold
        if (maxCost !== undefined && maxCost !== null && typeof cost === 'number') {
            const costRatio = cost / maxCost;
            if (cost > maxCost) {
                this.usageCostContent.style.color = '#f87171'; // Red when exceeded
            } else if (costRatio >= 0.75) {
                this.usageCostContent.style.color = '#fbbf24'; // Yellow at 75%+
            } else {
                this.usageCostContent.style.color = '#aaccff'; // Default blue
            }
        } else {
            this.usageCostContent.style.color = '#aaccff'; // Default blue
        }

        // Color-code tokens based on context window usage
        if (typeof tokens === 'number' && typeof contextWindow === 'number' && contextWindow > 0) {
            const usageRatio = tokens / contextWindow;
            if (usageRatio >= 0.9) {
                this.usageTokenContent.style.color = '#f87171'; // Red
            } else if (usageRatio >= 0.75) {
                this.usageTokenContent.style.color = '#fbbf24'; // Yellow
            } else {
                this.usageTokenContent.style.color = '#aaccff'; // Default blue
            }
        } else {
            this.usageTokenContent.style.color = '#aaccff'; // Default blue
        }
    }

    // Model selection
    toggleModelDropdown() {
        const isOpening = this.modelDropdown.classList.contains('hidden');

        this.modelDropdown.classList.toggle('hidden');

        // Refresh Ollama models list when opening the dropdown
        if (isOpening) {
            this.requestOllamaModels();
        }
    }

    selectModel(provider, model, displayName) {
        if (!this.wsManager.getConnectionStatus() || this.isProcessing) {
            return;
        }

        // Update display
        this.updateModelDisplay(provider, model, displayName);

        // Close dropdown
        this.modelDropdown.classList.add('hidden');

        // Send to backend
        this.wsManager.send('change_model', {
            provider: provider,
            model: model
        });

        console.log(`Model changed to: ${provider}/${model}`);
    }

    getFriendlyModelName(model) {
        console.log('[getFriendlyModelName] Input:', model);

        // First try exact match in mapping
        if (this.modelDisplayNames[model]) {
            console.log('[getFriendlyModelName] Exact match found:', this.modelDisplayNames[model]);
            return this.modelDisplayNames[model];
        }

        // Try general transformations for common patterns
        let friendlyName = model;

        // Remove date suffixes (e.g., -2024-07-18, -20241022)
        friendlyName = friendlyName.replace(/-\d{4}-\d{2}-\d{2}$/, '');  // YYYY-MM-DD
        friendlyName = friendlyName.replace(/-\d{8}$/, '');  // YYYYMMDD

        // Remove "latest" suffix
        friendlyName = friendlyName.replace(/-latest$/, '');

        console.log('[getFriendlyModelName] After cleanup:', friendlyName);

        // Try mapping again with cleaned name
        if (this.modelDisplayNames[friendlyName]) {
            console.log('[getFriendlyModelName] Cleaned match found:', this.modelDisplayNames[friendlyName]);
            return this.modelDisplayNames[friendlyName];
        }

        // Format the name nicely if no mapping exists
        // Replace hyphens with spaces and capitalize words
        friendlyName = friendlyName
            .split('-')
            .map(word => {
                // Keep version numbers lowercase (gpt-4o, not GPT-4O)
                if (/^\d/.test(word) || word.match(/^\d+[a-z]$/)) {
                    return word;
                }
                // Uppercase known abbreviations
                if (word === 'gpt' || word === 'llm') {
                    return word.toUpperCase();
                }
                // Capitalize first letter
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');

        console.log('[getFriendlyModelName] Formatted fallback:', friendlyName);
        return friendlyName;
    }

    updateModelDisplay(provider, model, displayName = null) {
        // Get friendly display name
        if (!displayName) {
            // First try the mapping for the exact model name
            displayName = this.getFriendlyModelName(model);

            // If not in mapping, try to find it in the dropdown
            if (displayName === model) {
                const modelItem = document.querySelector(`.model-item[data-provider="${provider}"][data-model="${model}"]`);
                if (modelItem) {
                    displayName = modelItem.textContent;
                }
            }
        }

        // Update display
        this.modelDisplay.textContent = displayName;

        // Update active state in dropdown
        document.querySelectorAll('.model-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.provider === provider && item.dataset.model === model) {
                item.classList.add('active');
            }
        });
    }

    // Toggle model names display
    toggleModelNames() {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        this.showModelNames = !this.showModelNames;

        // Update checkbox state
        this.toggleModelNamesCheckbox.checked = this.showModelNames;

        // Send to backend
        this.wsManager.send('toggle_model_names', {
            enabled: this.showModelNames
        });

        console.log(`Model names display: ${this.showModelNames ? 'enabled' : 'disabled'}`);

        // Refresh to apply the change to existing messages
        this.refreshConnection();
    }

    // Toggle streaming mode
    toggleStreaming() {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        this.streamEnabled = !this.streamEnabled;

        // Update checkbox state
        this.streamToggle.checked = this.streamEnabled;

        // Send to backend
        this.wsManager.send('toggle_streaming', {
            enabled: this.streamEnabled
        });

        console.log(`Streaming: ${this.streamEnabled ? 'enabled' : 'disabled'}`);
    }

    // Toggle prompt caching
    toggleCache() {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        this.cacheEnabled = !this.cacheEnabled;

        // Update checkbox state
        this.cacheToggle.checked = this.cacheEnabled;

        // Send to backend
        this.wsManager.send('toggle_cache', {
            enabled: this.cacheEnabled
        });

        console.log(`Prompt caching: ${this.cacheEnabled ? 'enabled' : 'disabled'}`);
    }

    // Toggle system prompt display
    toggleSystemPrompt() {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        this.showSystemPrompt = !this.showSystemPrompt;

        // Update checkbox state
        this.systemPromptToggle.checked = this.showSystemPrompt;

        // Send to backend
        this.wsManager.send('toggle_system_prompt', {
            enabled: this.showSystemPrompt
        });

        console.log(`System prompt display: ${this.showSystemPrompt ? 'enabled' : 'disabled'}`);

        // Refresh to apply the change to existing messages
        this.refreshConnection();
    }

    // resetStreamingBlocklist() method removed - auto-reset on model change handles this
    // If manual reset is needed in the future, the backend endpoint still exists

    // Dropdown management
    toggleDropdown(conversationId, actionsDiv) {
        const dropdown = actionsDiv.querySelector('.conversation-dropdown');

        // Close any existing dropdown
        if (this.activeDropdown && this.activeDropdown !== dropdown) {
            this.closeDropdown();
        }

        // Toggle current dropdown
        dropdown.classList.toggle('hidden');
        this.activeDropdown = dropdown.classList.contains('hidden') ? null : dropdown;
    }

    closeDropdown() {
        if (this.activeDropdown) {
            this.activeDropdown.classList.add('hidden');
            this.activeDropdown = null;
        }
    }

    // Rename conversation
    showRenameModal(conversationId, currentName) {
        this.renameConversationId = conversationId;
        this.renameInput.value = currentName;
        this.renameModal.classList.remove('hidden');
        this.renameInput.focus();
        this.renameInput.select();
        this.closeDropdown();
    }

    closeRenameModal() {
        this.renameModal.classList.add('hidden');
        this.renameConversationId = null;
        this.renameInput.value = '';
    }

    confirmRename() {
        const newName = this.renameInput.value.trim();
        if (!newName || !this.renameConversationId) {
            return;
        }

        this.wsManager.send('rename_conversation', {
            conversation_id: this.renameConversationId,
            new_name: newName
        });

        this.closeRenameModal();
    }

    // Duplicate conversation
    duplicateConversation(conversationId) {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        this.wsManager.send('duplicate_conversation', { conversation_id: conversationId });

        this.closeDropdown();
    }

    // Delete conversation
    deleteConversation(conversationId) {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        if (confirm('Are you sure you want to delete this conversation?')) {
            this.wsManager.send('delete_conversation', { conversation_id: conversationId });

            this.closeDropdown();
        }
    }

    // Workspace modal management
    showWorkspaceModal() {
        this.workspaceInput.value = this.currentBaseDirectory || '';
        this.workspaceModal.classList.remove('hidden');
        this.workspaceInput.focus();
        this.workspaceInput.select();
    }

    closeWorkspaceModal() {
        this.workspaceModal.classList.add('hidden');
        this.workspaceInput.value = '';
    }

    confirmWorkspace() {
        const newBaseDirectory = this.workspaceInput.value.trim();

        if (!newBaseDirectory) {
            this.showStatus('Workspace path cannot be empty', 'error');
            return;
        }

        // Only update if it changed
        if (newBaseDirectory !== this.currentBaseDirectory) {
            // Send to server
            if (this.wsManager.getConnectionStatus()) {
                this.wsManager.send('update_base_directory', { base_directory: newBaseDirectory });
                this.currentBaseDirectory = newBaseDirectory;
                this.updateWorkspaceDisplay(newBaseDirectory);
                this.showStatus('Workspace updated', 'info');
            }
        }

        this.closeWorkspaceModal();
    }

    // Update workspace display with truncated path
    updateWorkspaceDisplay(path) {
        if (!path) {
            this.workspaceDisplay.textContent = '...';
            return;
        }

        // Display full path but let CSS handle truncation from the left
        this.workspaceDisplay.textContent = path;
        this.workspaceDisplay.title = path;
    }

    // Set base directory (when loading conversation or connecting)
    setBaseDirectory(baseDirectory) {
        this.currentBaseDirectory = baseDirectory;
        this.updateWorkspaceDisplay(baseDirectory);
    }

    // Max cost modal management
    showMaxCostModal() {
        // Pre-fill with current max cost if set
        if (this.maxCost !== undefined && this.maxCost !== null) {
            this.maxCostInput.value = this.maxCost.toFixed(2);
        } else {
            this.maxCostInput.value = '';
        }
        this.maxCostModal.classList.remove('hidden');
        this.maxCostInput.focus();
        this.maxCostInput.select();
    }

    closeMaxCostModal() {
        this.maxCostModal.classList.add('hidden');
        this.maxCostInput.value = '';
    }

    confirmMaxCost() {
        const value = this.maxCostInput.value.trim();

        if (!value) {
            this.showStatus('Please enter a value or click "Clear Max"', 'error');
            return;
        }

        const maxCost = parseFloat(value);

        if (isNaN(maxCost) || maxCost < 0) {
            this.showStatus('Please enter a valid positive number', 'error');
            return;
        }

        // Send to backend
        this.wsManager.send('set_max_cost', { max_cost: maxCost });
        this.closeMaxCostModal();
    }

    clearMaxCost() {
        // Send null to backend to clear max cost
        this.wsManager.send('set_max_cost', { max_cost: null });
        this.closeMaxCostModal();
    }

    // System prompt modal management
    showSystemPromptModal() {
        if (!this.wsManager.getConnectionStatus()) {
            this.showStatus('Not connected', 'error');
            return;
        }

        // Request current system prompt from server
        this.wsManager.send('get_system_prompt');
    }

    receiveSystemPrompt(systemPrompt) {
        // Populate the modal and show it
        this.systemPromptInput.value = systemPrompt || '';
        this.systemPromptModal.classList.remove('hidden');
        this.systemPromptInput.focus();
    }

    closeSystemPromptModal() {
        this.systemPromptModal.classList.add('hidden');
        this.systemPromptInput.value = '';
    }

    confirmSystemPrompt() {
        const newSystemPrompt = this.systemPromptInput.value.trim();

        if (!newSystemPrompt) {
            this.showStatus('System prompt cannot be empty', 'error');
            return;
        }

        // Send to server
        if (this.wsManager.getConnectionStatus()) {
            this.wsManager.send('set_system_prompt', { system_prompt: newSystemPrompt });
            this.showStatus('System prompt updated', 'info');
        }

        this.closeSystemPromptModal();
    }

    // LaTeX help modal management
    showLatexHelpModal() {
        this.latexHelpModal.classList.remove('hidden');
    }

    closeLatexHelpModal() {
        this.latexHelpModal.classList.add('hidden');
    }

    async copyOrchestralTex() {
        try {
            // Create a promise that we'll resolve with clipboard write permission
            // This preserves the user gesture context (same pattern as TeX copy button)
            const clipboardItem = new Promise(async (resolve) => {
                // Fetch the orchestral.tex file content from API
                const response = await fetch('/api/latex/orchestral-tex');
                if (!response.ok) {
                    resolve(new Blob([''], { type: 'text/plain' }));
                    return;
                }
                const data = await response.json();
                if (data.error) {
                    resolve(new Blob([''], { type: 'text/plain' }));
                    return;
                }
                resolve(new Blob([data.content], { type: 'text/plain' }));
            });

            // Write to clipboard using ClipboardItem API
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/plain': clipboardItem
                })
            ]);

            // Show success feedback
            const originalText = this.copyOrchestralTexBtn.innerHTML;
            this.copyOrchestralTexBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="margin-right: 6px; vertical-align: middle;">
                    <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Copied!
            `;
            this.copyOrchestralTexBtn.style.backgroundColor = 'rgba(74, 222, 128, 0.2)';
            this.copyOrchestralTexBtn.style.borderColor = '#4ade80';
            this.copyOrchestralTexBtn.style.color = '#4ade80';

            setTimeout(() => {
                this.copyOrchestralTexBtn.innerHTML = originalText;
                this.copyOrchestralTexBtn.style.backgroundColor = '';
                this.copyOrchestralTexBtn.style.borderColor = '';
                this.copyOrchestralTexBtn.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy orchestral.tex:', err);
            this.showStatus('Failed to copy orchestral.tex', 'error');
        }
    }

    async downloadOrchestralTex() {
        try {
            // Fetch the orchestral.tex file content
            const response = await fetch('/static/orchestral.tex');
            if (!response.ok) {
                throw new Error('Failed to fetch orchestral.tex');
            }
            const content = await response.text();

            // Create download link
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'orchestral.tex';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Show success feedback
            const originalText = this.downloadOrchestralTexBtn.innerHTML;
            this.downloadOrchestralTexBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="margin-right: 6px; vertical-align: middle;">
                    <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Downloaded!
            `;
            this.downloadOrchestralTexBtn.style.backgroundColor = 'rgba(74, 222, 128, 0.2)';
            this.downloadOrchestralTexBtn.style.borderColor = '#4ade80';
            this.downloadOrchestralTexBtn.style.color = '#4ade80';

            setTimeout(() => {
                this.downloadOrchestralTexBtn.innerHTML = originalText;
                this.downloadOrchestralTexBtn.style.backgroundColor = '';
                this.downloadOrchestralTexBtn.style.borderColor = '';
                this.downloadOrchestralTexBtn.style.color = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to download orchestral.tex:', err);
            this.showStatus('Failed to download orchestral.tex', 'error');
        }
    }

    // Ollama models management
    requestOllamaModels() {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        this.wsManager.send('get_ollama_models');
    }

    handleOllamaModels(models) {
        console.log('[Ollama] Received models:', models);

        // Add Ollama models to the dropdown
        const modelDropdown = document.getElementById('model-dropdown');

        // Check if we already have an Ollama section
        let ollamaSection = modelDropdown.querySelector('.model-group.ollama-models');
        let ollamaDivider = modelDropdown.querySelector('.model-divider.ollama-divider');

        // Create section if it doesn't exist
        if (!ollamaSection) {
            // Create divider
            ollamaDivider = document.createElement('div');
            ollamaDivider.className = 'model-divider ollama-divider';
            modelDropdown.appendChild(ollamaDivider);

            // Create section
            ollamaSection = document.createElement('div');
            ollamaSection.className = 'model-group ollama-models';
            modelDropdown.appendChild(ollamaSection);
        } else {
            // Clear existing content
            ollamaSection.innerHTML = '';
        }

        if (!models || models.length === 0) {
            // No models available - show placeholder message
            const noModelsItem = document.createElement('div');
            noModelsItem.className = 'model-item disabled';
            noModelsItem.style.color = '#888';
            noModelsItem.style.fontStyle = 'italic';
            noModelsItem.style.cursor = 'default';
            noModelsItem.textContent = '(no local models available)';
            ollamaSection.appendChild(noModelsItem);

            console.log('[Ollama] No Ollama models available');
            return;
        }

        console.log('[Ollama] Found models:', models);

        // Add each Ollama model
        models.forEach(modelName => {
            const modelItem = document.createElement('div');
            modelItem.className = 'model-item';
            modelItem.dataset.provider = 'ollama';
            modelItem.dataset.model = modelName;

            // Create display name (e.g., "gpt-oss:20b" -> "GPT-OSS 20B")
            const displayName = this.formatOllamaModelName(modelName);
            modelItem.textContent = displayName;

            // Add click handler
            modelItem.addEventListener('click', () => {
                this.selectModel('ollama', modelName, displayName);
            });

            ollamaSection.appendChild(modelItem);
        });
    }

    formatOllamaModelName(modelName) {
        // Format Ollama model names for display
        // e.g., "gpt-oss:20b" -> "GPT-OSS 20B"
        //       "llama3.2" -> "Llama3.2"
        //       "mistral:7b-instruct" -> "Mistral 7B Instruct"

        // Split by colon for tags
        const [name, tag] = modelName.split(':');

        // Capitalize and format name
        let formatted = name
            .split(/[-_]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');

        // Add tag if present
        if (tag) {
            // Format tag (e.g., "20b" -> "20B", "7b-instruct" -> "7B Instruct")
            const formattedTag = tag
                .split('-')
                .map(part => {
                    // Uppercase "b" in sizes
                    if (part.match(/^\d+b$/i)) {
                        return part.toUpperCase();
                    }
                    return part.charAt(0).toUpperCase() + part.slice(1);
                })
                .join(' ');

            formatted += ` ${formattedTag}`;
        }

        return formatted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showApprovalModal(data) {
        const modal = document.getElementById('approval-modal');
        const description = document.getElementById('approval-description');
        const technicalDiv = document.getElementById('approval-technical');

        // Set description
        description.textContent = data.description;

        // Build technical details with all arguments
        technicalDiv.innerHTML = `<div><strong>Tool:</strong> <code class="tool-name">${this.escapeHtml(data.tool_name)}</code></div>`;

        // Add all arguments
        for (const [key, value] of Object.entries(data.arguments)) {
            const argDiv = document.createElement('div');
            argDiv.innerHTML = `<strong>${this.escapeHtml(key)}:</strong>`;

            // Check if this is a code argument (key contains 'code')
            if (key.toLowerCase().includes('code')) {
                // Use syntax highlighting for code
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.className = 'language-python';
                code.textContent = value;
                pre.appendChild(code);
                argDiv.appendChild(pre);

                // Apply syntax highlighting if highlight.js is available
                if (window.hljs) {
                    hljs.highlightElement(code);
                }
            } else {
                // Regular text formatting
                const pre = document.createElement('pre');
                pre.textContent = value;
                argDiv.appendChild(pre);
            }

            technicalDiv.appendChild(argDiv);
        }

        // Show modal
        modal.classList.remove('hidden');

        // Set up button handlers (remove old listeners first)
        const approveBtn = document.getElementById('approval-approve-btn');
        const denyBtn = document.getElementById('approval-deny-btn');

        const handleApprove = () => {
            this.sendApprovalResponse(true);
            modal.classList.add('hidden');
            approveBtn.removeEventListener('click', handleApprove);
            denyBtn.removeEventListener('click', handleDeny);
        };

        const handleDeny = () => {
            this.sendApprovalResponse(false);
            modal.classList.add('hidden');
            approveBtn.removeEventListener('click', handleApprove);
            denyBtn.removeEventListener('click', handleDeny);
        };

        approveBtn.addEventListener('click', handleApprove);
        denyBtn.addEventListener('click', handleDeny);

        // Keyboard shortcut: Enter to approve
        const handleKeyboard = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleApprove();
                document.removeEventListener('keydown', handleKeyboard);
            }
        };
        document.addEventListener('keydown', handleKeyboard);

        // Focus the approve button so Enter works immediately
        approveBtn.focus();
    }

    sendApprovalResponse(approved) {
        this.wsManager.send('approval_response', { approved });
    }

    // Tool management
    requestToolsInfo() {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        this.wsManager.send('get_tools_info');
    }

    // Model management
    requestAvailableModels() {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        this.wsManager.send('get_available_models');
    }

    handleAvailableModels(models) {
        console.log('[Models] Received available models:', models);

        // Store models data
        this.availableModels = models;

        // Dynamically populate model dropdown
        this.populateModelDropdown(models);
    }

    populateModelDropdown(models) {
        // Clear existing model dropdown content
        this.modelDropdown.innerHTML = '';

        // Helper to create provider group
        const createProviderGroup = (providerName, providerModels) => {
            if (providerModels.length === 0) return;

            const groupDiv = document.createElement('div');
            groupDiv.className = 'model-group';

            const labelDiv = document.createElement('div');
            labelDiv.className = 'model-group-label';
            labelDiv.textContent = providerName;
            groupDiv.appendChild(labelDiv);

            providerModels.forEach(model => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'model-item';
                itemDiv.setAttribute('data-provider', providerName.toLowerCase().replace(' ', ''));
                itemDiv.setAttribute('data-model', model.model_id);
                itemDiv.textContent = model.friendly_name;
                groupDiv.appendChild(itemDiv);
            });

            return groupDiv;
        };

        // Add providers in order
        const providers = [
            { name: 'OpenAI', key: 'openai' },
            { name: 'Anthropic', key: 'anthropic' },
            { name: 'Google', key: 'google' },
            { name: 'Groq', key: 'groq' }
        ];

        providers.forEach((provider, index) => {
            if (models[provider.key] && models[provider.key].length > 0) {
                const groupDiv = createProviderGroup(provider.name, models[provider.key]);
                if (groupDiv) {
                    this.modelDropdown.appendChild(groupDiv);

                    // Add divider between groups (except after last group)
                    if (index < providers.length - 1) {
                        const nextProvider = providers.slice(index + 1).find(p =>
                            models[p.key] && models[p.key].length > 0
                        );
                        if (nextProvider) {
                            const divider = document.createElement('div');
                            divider.className = 'model-divider';
                            this.modelDropdown.appendChild(divider);
                        }
                    }
                }
            }
        });

        // Re-attach click handlers to new model items
        document.querySelectorAll('.model-item').forEach(item => {
            item.addEventListener('click', () => {
                const provider = item.dataset.provider;
                const model = item.dataset.model;
                const displayName = item.textContent;
                this.selectModel(provider, model, displayName);
            });
        });
    }

    requestPendingApproval() {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        this.wsManager.send('get_pending_approval');
    }

    handleToolsInfo(data) {
        console.log('[Tools] Received tools info:', data);

        const available = data.available || [];
        const requested = data.requested || [];

        this.renderToolToggles(available, requested);
    }

    renderToolToggles(available, requested) {
        // Clear container
        this.toolTogglesContainer.innerHTML = '';

        // Show message if no tools
        if (available.length === 0 && requested.length === 0) {
            const noToolsDiv = document.createElement('div');
            noToolsDiv.className = 'setting-hint';
            noToolsDiv.textContent = 'No tools configured';
            this.toolTogglesContainer.appendChild(noToolsDiv);
            return;
        }

        // Render available tools
        available.forEach(tool => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'tool-toggle-item';

            const labelDiv = document.createElement('label');
            labelDiv.className = 'tool-toggle-label';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = tool.enabled;
            checkbox.addEventListener('change', () => {
                this.toggleTool(tool.name, checkbox.checked);
            });

            const nameSpan = document.createElement('span');
            nameSpan.className = 'tool-name';
            nameSpan.textContent = tool.name;

            labelDiv.appendChild(checkbox);
            labelDiv.appendChild(nameSpan);
            itemDiv.appendChild(labelDiv);

            this.toolTogglesContainer.appendChild(itemDiv);
        });

        // Render requested tools (grayed out)
        if (requested.length > 0) {
            requested.forEach(tool => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'tool-toggle-item unavailable';

                const labelDiv = document.createElement('label');
                labelDiv.className = 'tool-toggle-label';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = false;
                checkbox.disabled = true;

                const nameSpan = document.createElement('span');
                nameSpan.className = 'tool-name';
                nameSpan.textContent = tool.name;

                const badge = document.createElement('span');
                badge.className = 'tool-status-badge';
                badge.textContent = 'unavailable';

                labelDiv.appendChild(checkbox);
                labelDiv.appendChild(nameSpan);
                labelDiv.appendChild(badge);
                itemDiv.appendChild(labelDiv);

                this.toolTogglesContainer.appendChild(itemDiv);
            });
        }
    }

    toggleTool(toolName, enabled) {
        if (!this.wsManager.getConnectionStatus()) {
            return;
        }

        console.log(`[Tools] Toggling ${toolName} to ${enabled}`);
        this.wsManager.send('toggle_tool', {
            tool_name: toolName,
            enabled: enabled
        });
    }

    // ============================================================================
    // Voice Recording Methods
    // ============================================================================

    async toggleVoiceRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    async startRecording() {
        try {
            console.log('[Voice] Requesting microphone access...');

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create MediaRecorder
            // Use webm format with opus codec (widely supported and efficient)
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : 'audio/webm';

            this.mediaRecorder = new MediaRecorder(stream, { mimeType });
            this.audioChunks = [];

            // Collect audio data
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            });

            // Handle recording stop
            this.mediaRecorder.addEventListener('stop', () => {
                this.handleRecordingComplete();
            });

            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            // Update UI
            this.micBtn.classList.add('recording');
            this.micBtn.title = 'Recording... (click to stop)';
            console.log('[Voice] Recording started');

            // Show visual feedback
            this.userInput.placeholder = '🔴 Recording... (click mic to stop)';

        } catch (error) {
            console.error('[Voice] Error accessing microphone:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    }

    stopRecording() {
        if (!this.mediaRecorder || !this.isRecording) {
            return;
        }

        // Check minimum recording duration
        const duration = Date.now() - this.recordingStartTime;
        if (duration < 500) {
            console.warn('[Voice] Recording too short, ignoring');
            alert('Recording too short! Please hold the microphone button and speak for at least 1 second.');

            // Cancel recording
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            this.isRecording = false;
            this.micBtn.classList.remove('recording');
            this.micBtn.title = 'Voice input (click to start recording)';
            this.userInput.placeholder = ' Type your message... (Enter to send, Shift+Enter for new line, Esc to interrupt)';
            return;
        }

        console.log(`[Voice] Stopping recording... (duration: ${duration}ms)`);
        this.mediaRecorder.stop();

        // Stop all audio tracks
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());

        this.isRecording = false;

        // Update UI
        this.micBtn.classList.remove('recording');
        this.micBtn.title = 'Voice input (click to start recording)';
    }

    async handleRecordingComplete() {
        console.log('[Voice] Processing recorded audio...');

        // Create audio blob from chunks
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType });
        console.log(`[Voice] Audio blob size: ${audioBlob.size} bytes, type: ${audioBlob.type}`);

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Audio = reader.result; // Contains data:audio/webm;base64,...

            // Send to backend for transcription
            console.log('[Voice] Sending audio for transcription...');
            this.wsManager.send('voice_transcribe', {
                audio_data: base64Audio,
                format: this.mediaRecorder.mimeType
            });

            // Show loading indicator
            this.userInput.placeholder = 'Transcribing...';
        };
        reader.readAsDataURL(audioBlob);
    }

    handleTranscription(text) {
        console.log('[Voice] Received transcription:', text);

        // Insert transcribed text into input field
        this.userInput.value = text;
        this.autoResizeTextarea();

        // Focus input for editing
        this.userInput.focus();

        // Reset placeholder
        this.userInput.placeholder = ' Type your message... (Enter to send, Shift+Enter for new line, Esc to interrupt)';
    }

}

// Initialize UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new OrchestralUI();
});
