import { MotionComponent } from '../../EntityComponentSystem/Components/MotionComponent';
import { TransformComponent } from '../../EntityComponentSystem/Components/TransformComponent';
import { vec, Vector } from '../../Math/vector';
export class Follow {
    constructor(entity, entityToFollow, followDistance) {
        this._started = false;
        this._stopped = false;
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        this._followTx = entityToFollow.get(TransformComponent);
        this._followMotion = entityToFollow.get(MotionComponent);
        this._current = new Vector(this._tx.pos.x, this._tx.pos.y);
        this._end = new Vector(this._followTx.pos.x, this._followTx.pos.y);
        this._maximumDistance = followDistance !== undefined ? followDistance : this._current.distance(this._end);
        this._speed = 0;
    }
    update(_delta) {
        if (!this._started) {
            this._started = true;
            this._distanceBetween = this._current.distance(this._end);
            this._dir = this._end.sub(this._current).normalize();
        }
        const actorToFollowSpeed = Math.sqrt(Math.pow(this._followMotion.vel.x, 2) + Math.pow(this._followMotion.vel.y, 2));
        if (actorToFollowSpeed !== 0) {
            this._speed = actorToFollowSpeed;
        }
        this._current = vec(this._tx.pos.x, this._tx.pos.y);
        this._end = vec(this._followTx.pos.x, this._followTx.pos.y);
        this._distanceBetween = this._current.distance(this._end);
        this._dir = this._end.sub(this._current).normalize();
        if (this._distanceBetween >= this._maximumDistance) {
            const m = this._dir.scale(this._speed);
            this._motion.vel = vec(m.x, m.y);
        }
        else {
            this._motion.vel = vec(0, 0);
        }
        if (this.isComplete()) {
            this._tx.pos = vec(this._end.x, this._end.y);
            this._motion.vel = vec(0, 0);
        }
    }
    stop() {
        this._motion.vel = vec(0, 0);
        this._stopped = true;
    }
    isComplete() {
        // the actor following should never stop unless specified to do so
        return this._stopped;
    }
    reset() {
        this._started = false;
        this._stopped = false;
    }
}
//# sourceMappingURL=Follow.js.map