class EventManager {
    constructor() {
        this.endTurnListeners = [];
        this.customListeners = {};
    }

    addTurnListener(listener) {
        if (typeof listener === 'function') {
            this.endTurnListeners.push(listener);
        } else {
            throw new Error('Listener must be a function');
        }
    }

    // Add methods for custom events
    on(event, listener) {
        if (!this.customListeners[event]) {
            this.customListeners[event] = [];
        }
        this.customListeners[event].push(listener);
    }

    emit(event, data) {
        if (this.customListeners[event]) {
            this.customListeners[event].forEach(listener => listener(data));
        }
    }

    removeTurnListener(listener) {
        this.endTurnListeners = this.endTurnListeners.filter(l => l !== listener);
    }

    endTurn() {
        this.endTurnListeners.forEach(listener => listener());
    }

    // placeholder for f1
    undoTurn() {

    }
}