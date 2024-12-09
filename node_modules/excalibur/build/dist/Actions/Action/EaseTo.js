import { TransformComponent } from '../../EntityComponentSystem/Components/TransformComponent';
import { MotionComponent } from '../../EntityComponentSystem/Components/MotionComponent';
import { vec, Vector } from '../../Math/vector';
export class EaseTo {
    constructor(entity, x, y, duration, easingFcn) {
        this.easingFcn = easingFcn;
        this._currentLerpTime = 0;
        this._lerpDuration = 1 * 1000; // 1 second
        this._lerpStart = new Vector(0, 0);
        this._lerpEnd = new Vector(0, 0);
        this._initialized = false;
        this._stopped = false;
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        this._lerpDuration = duration;
        this._lerpEnd = new Vector(x, y);
    }
    _initialize() {
        this._lerpStart = new Vector(this._tx.pos.x, this._tx.pos.y);
        this._currentLerpTime = 0;
    }
    update(delta) {
        if (!this._initialized) {
            this._initialize();
            this._initialized = true;
        }
        // Need to update lerp time first, otherwise the first update will always be zero
        this._currentLerpTime += delta;
        let newX = this._tx.pos.x;
        let newY = this._tx.pos.y;
        if (this._currentLerpTime < this._lerpDuration) {
            if (this._lerpEnd.x < this._lerpStart.x) {
                newX =
                    this._lerpStart.x -
                        (this.easingFcn(this._currentLerpTime, this._lerpEnd.x, this._lerpStart.x, this._lerpDuration) - this._lerpEnd.x);
            }
            else {
                newX = this.easingFcn(this._currentLerpTime, this._lerpStart.x, this._lerpEnd.x, this._lerpDuration);
            }
            if (this._lerpEnd.y < this._lerpStart.y) {
                newY =
                    this._lerpStart.y -
                        (this.easingFcn(this._currentLerpTime, this._lerpEnd.y, this._lerpStart.y, this._lerpDuration) - this._lerpEnd.y);
            }
            else {
                newY = this.easingFcn(this._currentLerpTime, this._lerpStart.y, this._lerpEnd.y, this._lerpDuration);
            }
            // Given the lerp position figure out the velocity in pixels per second
            this._motion.vel = vec((newX - this._tx.pos.x) / (delta / 1000), (newY - this._tx.pos.y) / (delta / 1000));
        }
        else {
            this._tx.pos = vec(this._lerpEnd.x, this._lerpEnd.y);
            this._motion.vel = Vector.Zero;
        }
    }
    isComplete() {
        return this._stopped || this._currentLerpTime >= this._lerpDuration;
    }
    reset() {
        this._initialized = false;
        this._stopped = false;
        this._currentLerpTime = 0;
    }
    stop() {
        this._motion.vel = vec(0, 0);
        this._stopped = true;
    }
}
//# sourceMappingURL=EaseTo.js.map