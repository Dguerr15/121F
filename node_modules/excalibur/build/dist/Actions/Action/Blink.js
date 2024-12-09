import { GraphicsComponent } from '../../Graphics/GraphicsComponent';
export class Blink {
    constructor(entity, timeVisible, timeNotVisible, numBlinks = 1) {
        this._timeVisible = 0;
        this._timeNotVisible = 0;
        this._elapsedTime = 0;
        this._totalTime = 0;
        this._stopped = false;
        this._started = false;
        this._graphics = entity.get(GraphicsComponent);
        this._timeVisible = timeVisible;
        this._timeNotVisible = timeNotVisible;
        this._duration = (timeVisible + timeNotVisible) * numBlinks;
    }
    update(delta) {
        if (!this._started) {
            this._started = true;
            this._elapsedTime = 0;
            this._totalTime = 0;
        }
        if (!this._graphics) {
            return;
        }
        this._elapsedTime += delta;
        this._totalTime += delta;
        if (this._graphics.visible && this._elapsedTime >= this._timeVisible) {
            this._graphics.visible = false;
            this._elapsedTime = 0;
        }
        if (!this._graphics.visible && this._elapsedTime >= this._timeNotVisible) {
            this._graphics.visible = true;
            this._elapsedTime = 0;
        }
        if (this.isComplete()) {
            this._graphics.visible = true;
        }
    }
    isComplete() {
        return this._stopped || this._totalTime >= this._duration;
    }
    stop() {
        if (this._graphics) {
            this._graphics.visible = true;
        }
        this._stopped = true;
    }
    reset() {
        this._started = false;
        this._stopped = false;
        this._elapsedTime = 0;
        this._totalTime = 0;
    }
}
//# sourceMappingURL=Blink.js.map