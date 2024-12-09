export class ExEvent {
    constructor() {
        this._active = true;
    }
    get active() {
        return this._active;
    }
    cancel() {
        this._active = false;
    }
}
//# sourceMappingURL=ExEvent.js.map