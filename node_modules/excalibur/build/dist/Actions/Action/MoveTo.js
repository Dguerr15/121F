import { MotionComponent } from '../../EntityComponentSystem/Components/MotionComponent';
import { TransformComponent } from '../../EntityComponentSystem/Components/TransformComponent';
import { Vector, vec } from '../../Math/vector';
export class MoveTo {
    constructor(entity, destx, desty, speed) {
        this.entity = entity;
        this._started = false;
        this._stopped = false;
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        this._end = new Vector(destx, desty);
        this._speed = speed;
    }
    update(_delta) {
        if (!this._started) {
            this._started = true;
            this._start = new Vector(this._tx.pos.x, this._tx.pos.y);
            this._distance = this._start.distance(this._end);
            this._dir = this._end.sub(this._start).normalize();
        }
        const m = this._dir.scale(this._speed);
        this._motion.vel = vec(m.x, m.y);
        if (this.isComplete(this.entity)) {
            this._tx.pos = vec(this._end.x, this._end.y);
            this._motion.vel = vec(0, 0);
        }
    }
    isComplete(entity) {
        const tx = entity.get(TransformComponent);
        return this._stopped || new Vector(tx.pos.x, tx.pos.y).distance(this._start) >= this._distance;
    }
    stop() {
        this._motion.vel = vec(0, 0);
        this._stopped = true;
    }
    reset() {
        this._started = false;
        this._stopped = false;
    }
}
//# sourceMappingURL=MoveTo.js.map