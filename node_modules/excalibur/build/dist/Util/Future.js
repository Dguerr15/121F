/**
 * Future is a wrapper around a native browser Promise to allow resolving/rejecting at any time
 */
export class Future {
    constructor() {
        this._isCompleted = false;
        this.promise = new Promise((resolve, reject) => {
            this._resolver = resolve;
            this._rejecter = reject;
        });
    }
    get isCompleted() {
        return this._isCompleted;
    }
    resolve(value) {
        if (this._isCompleted) {
            return;
        }
        this._isCompleted = true;
        this._resolver(value);
    }
    reject(error) {
        if (this._isCompleted) {
            return;
        }
        this._isCompleted = true;
        this._rejecter(error);
    }
}
//# sourceMappingURL=Future.js.map