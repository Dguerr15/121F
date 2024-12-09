export class Delay {
    constructor(delay) {
        this._elapsedTime = 0;
        this._started = false;
        this._stopped = false;
        this._delay = delay;
    }
    update(delta) {
        if (!this._started) {
            this._started = true;
        }
        this._elapsedTime += delta;
    }
    isComplete() {
        return this._stopped || this._elapsedTime >= this._delay;
    }
    stop() {
        this._stopped = true;
    }
    reset() {
        this._elapsedTime = 0;
        this._started = false;
        this._stopped = false;
    }
}
//# sourceMappingURL=Delay.js.map