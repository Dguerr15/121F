import { GraphicsComponent } from '../../Graphics/GraphicsComponent';
import { Logger } from '../../Util/Log';
export class Fade {
    constructor(entity, endOpacity, speed) {
        this._multiplier = 1;
        this._started = false;
        this._stopped = false;
        this._graphics = entity.get(GraphicsComponent);
        this._endOpacity = endOpacity;
        this._speed = this._ogspeed = speed;
    }
    update(delta) {
        if (!this._graphics) {
            return;
        }
        if (!this._started) {
            this._started = true;
            this._speed = this._ogspeed;
            // determine direction when we start
            if (this._endOpacity < this._graphics.opacity) {
                this._multiplier = -1;
            }
            else {
                this._multiplier = 1;
            }
        }
        if (this._speed > 0) {
            this._graphics.opacity += (this._multiplier *
                (Math.abs(this._graphics.opacity - this._endOpacity) * delta)) / this._speed;
        }
        this._speed -= delta;
        if (this.isComplete()) {
            this._graphics.opacity = this._endOpacity;
        }
        Logger.getInstance().debug('[Action fade] Actor opacity:', this._graphics.opacity);
    }
    isComplete() {
        return this._stopped || Math.abs(this._graphics.opacity - this._endOpacity) < 0.05;
    }
    stop() {
        this._stopped = true;
    }
    reset() {
        this._started = false;
        this._stopped = false;
    }
}
//# sourceMappingURL=Fade.js.map