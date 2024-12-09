/**
 * Simple Observable implementation
 * @template T is the typescript Type that defines the data being observed
 */
export class Observable {
    constructor() {
        this.observers = [];
        this.subscriptions = [];
    }
    /**
     * Register an observer to listen to this observable
     * @param observer
     */
    register(observer) {
        this.observers.push(observer);
    }
    /**
     * Register a callback to listen to this observable
     * @param func
     */
    subscribe(func) {
        this.subscriptions.push(func);
    }
    /**
     * Remove an observer from the observable
     * @param observer
     */
    unregister(observer) {
        const i = this.observers.indexOf(observer);
        if (i !== -1) {
            this.observers.splice(i, 1);
        }
    }
    /**
     * Remove a callback that is listening to this observable
     * @param func
     */
    unsubscribe(func) {
        const i = this.subscriptions.indexOf(func);
        if (i !== -1) {
            this.subscriptions.splice(i, 1);
        }
    }
    /**
     * Broadcasts a message to all observers and callbacks
     * @param message
     */
    notifyAll(message) {
        const observersLength = this.observers.length;
        for (let i = 0; i < observersLength; i++) {
            this.observers[i].notify(message);
        }
        const subscriptionsLength = this.subscriptions.length;
        for (let i = 0; i < subscriptionsLength; i++) {
            this.subscriptions[i](message);
        }
    }
    /**
     * Removes all observers and callbacks
     */
    clear() {
        this.observers.length = 0;
        this.subscriptions.length = 0;
    }
}
//# sourceMappingURL=Observable.js.map