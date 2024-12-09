import { MotionComponent } from '../../EntityComponentSystem/Components/MotionComponent';
import { TransformComponent } from '../../EntityComponentSystem/Components/TransformComponent';
import { Vector, vec } from '../../Math/vector';
import { Logger } from '../../Util/Log';
export class MoveBy {
    constructor(entity, offsetX, offsetY, speed) {
        this._started = false;
        this._stopped = false;
        this._entity = entity;
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        this._speed = speed;
        this._offset = new Vector(offsetX, offsetY);
        if (speed <= 0) {
            Logger.getInstance().error('Attempted to moveBy with speed less than or equal to zero : ' + speed);
            throw new Error('Speed must be greater than 0 pixels per second');
        }
    }
    update(_delta) {
        if (!this._started) {
            this._started = true;
            this._start = new Vector(this._tx.pos.x, this._tx.pos.y);
            this._end = this._start.add(this._offset);
            this._distance = this._offset.size;
            this._dir = this._end.sub(this._start).normalize();
        }
        if (this.isComplete(this._entity)) {
            this._tx.pos = vec(this._end.x, this._end.y);
            this._motion.vel = vec(0, 0);
        }
        else {
            this._motion.vel = this._dir.scale(this._speed);
        }
    }
    isComplete(entity) {
        const tx = entity.get(TransformComponent);
        return this._stopped || tx.pos.distance(this._start) >= this._distance;
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
//# sourceMappingURL=MoveBy.js.map