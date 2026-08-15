// WebSocket connection management for Orchestral
// Simplified manager that handles connection and provides send helper

class WebSocketManager {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.reconnectDelay = 3000; // 3 seconds

        // Callbacks for connection events
        this.onConnect = null;
        this.onDisconnect = null;
        this.onError = null;
        this.onMessage = null;
    }

    /**
     * Connect to WebSocket server
     */
    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws`;

        console.log('Connecting to WebSocket:', wsUrl);
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            this.isConnected = true;
            console.log('WebSocket connected');
            if (this.onConnect) {
                this.onConnect();
            }
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (this.onMessage) {
                this.onMessage(data);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (this.onError) {
                this.onError(error);
            }
        };

        this.ws.onclose = () => {
            this.isConnected = false;
            console.log('WebSocket disconnected');
            if (this.onDisconnect) {
                this.onDisconnect();
            }

            // Try to reconnect after delay
            console.log(`Reconnecting in ${this.reconnectDelay / 1000} seconds...`);
            setTimeout(() => this.connect(), this.reconnectDelay);
        };
    }

    /**
     * Send a message to the server
     * @param {string} type - Message type
     * @param {Object} payload - Additional data to send (optional)
     */
    send(type, payload = {}) {
        if (!this.isConnected || !this.ws) {
            console.warn('WebSocket not connected. Cannot send message:', type);
            return false;
        }

        const message = { type, ...payload };
        this.ws.send(JSON.stringify(message));
        return true;
    }

    /**
     * Close the WebSocket connection
     */
    close() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.isConnected = false;
        }
    }

    /**
     * Get connection status
     * @returns {boolean}
     */
    getConnectionStatus() {
        return this.isConnected;
    }
}

// Export for use in main app
window.WebSocketManager = WebSocketManager;
