import { Vector } from '../../Math/vector';
import { MotionComponent } from '../../EntityComponentSystem/Components/MotionComponent';
import { TransformComponent } from '../../EntityComponentSystem/Components/TransformComponent';
export class ScaleBy {
    constructor(entity, scaleOffsetX, scaleOffsetY, speed) {
        this._started = false;
        this._stopped = false;
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        this._offset = new Vector(scaleOffsetX, scaleOffsetY);
        this._speedX = this._speedY = speed;
    }
    update(_delta) {
        if (!this._started) {
            this._started = true;
            this._startScale = this._tx.scale.clone();
            this._endScale = this._startScale.add(this._offset);
            this._distanceX = Math.abs(this._endScale.x - this._startScale.x);
            this._distanceY = Math.abs(this._endScale.y - this._startScale.y);
            this._directionX = this._endScale.x < this._startScale.x ? -1 : 1;
            this._directionY = this._endScale.y < this._startScale.y ? -1 : 1;
        }
        this._motion.scaleFactor.x = this._speedX * this._directionX;
        this._motion.scaleFactor.y = this._speedY * this._directionY;
        if (this.isComplete()) {
            this._tx.scale = this._endScale;
            this._motion.scaleFactor.x = 0;
            this._motion.scaleFactor.y = 0;
        }
    }
    isComplete() {
        return (this._stopped ||
            (Math.abs(this._tx.scale.x - this._startScale.x) >= (this._distanceX - 0.01) &&
                Math.abs(this._tx.scale.y - this._startScale.y) >= (this._distanceY - 0.01)));
    }
    stop() {
        this._motion.scaleFactor.x = 0;
        this._motion.scaleFactor.y = 0;
        this._stopped = true;
    }
    reset() {
        this._started = false;
        this._stopped = false;
    }
}
//# sourceMappingURL=ScaleBy.js.map