export class CallMethod {
    constructor(method) {
        this._method = null;
        this._hasBeenCalled = false;
        this._method = method;
    }
    update(_delta) {
        this._method();
        this._hasBeenCalled = true;
    }
    isComplete() {
        return this._hasBeenCalled;
    }
    reset() {
        this._hasBeenCalled = false;
    }
    stop() {
        this._hasBeenCalled = true;
    }
}
//# sourceMappingURL=CallMethod.js.map