class EventManager {
    constructor() {
        this.endTurnListeners = [];
    }

    addTurnListener(listener) {
        if (typeof listener === 'function') {
            this.endTurnListeners.push(listener);
        } else {
            throw new Error('Listener must be a function');
        }
    }

    removeTurnListener(listener) {
        this.endTurnListeners = this.endTurnListeners.filter(l => l !== listener);
    }

    endTurn() {
        this.endTurnListeners.forEach(listener => listener());
    }
}