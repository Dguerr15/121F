import { MotionComponent } from '../../EntityComponentSystem/Components/MotionComponent';
import { TransformComponent } from '../../EntityComponentSystem/Components/TransformComponent';
import { Vector, vec } from '../../Math/vector';
export class Meet {
    constructor(actor, actorToMeet, speed) {
        this._started = false;
        this._stopped = false;
        this._speedWasSpecified = false;
        this._tx = actor.get(TransformComponent);
        this._motion = actor.get(MotionComponent);
        this._meetTx = actorToMeet.get(TransformComponent);
        this._meetMotion = actorToMeet.get(MotionComponent);
        this._current = new Vector(this._tx.pos.x, this._tx.pos.y);
        this._end = new Vector(this._meetTx.pos.x, this._meetTx.pos.y);
        this._speed = speed || 0;
        if (speed !== undefined) {
            this._speedWasSpecified = true;
        }
    }
    update(_delta) {
        if (!this._started) {
            this._started = true;
            this._distanceBetween = this._current.distance(this._end);
            this._dir = this._end.sub(this._current).normalize();
        }
        const actorToMeetSpeed = Math.sqrt(Math.pow(this._meetMotion.vel.x, 2) + Math.pow(this._meetMotion.vel.y, 2));
        if (actorToMeetSpeed !== 0 && !this._speedWasSpecified) {
            this._speed = actorToMeetSpeed;
        }
        this._current = vec(this._tx.pos.x, this._tx.pos.y);
        this._end = vec(this._meetTx.pos.x, this._meetTx.pos.y);
        this._distanceBetween = this._current.distance(this._end);
        this._dir = this._end.sub(this._current).normalize();
        const m = this._dir.scale(this._speed);
        this._motion.vel = vec(m.x, m.y);
        if (this.isComplete()) {
            this._tx.pos = vec(this._end.x, this._end.y);
            this._motion.vel = vec(0, 0);
        }
    }
    isComplete() {
        return this._stopped || this._distanceBetween <= 1;
    }
    stop() {
        this._motion.vel = vec(0, 0);
        this._stopped = true;
    }
    reset() {
        this._started = false;
        this._stopped = false;
        this._distanceBetween = undefined;
    }
}
//# sourceMappingURL=Meet.js.map