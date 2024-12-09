import { RotationType } from '../RotationType';
import { TransformComponent } from '../../EntityComponentSystem/Components/TransformComponent';
import { MotionComponent } from '../../EntityComponentSystem/Components/MotionComponent';
import { TwoPI } from '../../Math/util';
export class RotateTo {
    constructor(entity, angleRadians, speed, rotationType) {
        this._started = false;
        this._stopped = false;
        this._tx = entity.get(TransformComponent);
        this._motion = entity.get(MotionComponent);
        this._end = angleRadians;
        this._speed = speed;
        this._rotationType = rotationType || RotationType.ShortestPath;
    }
    update(_delta) {
        if (!this._started) {
            this._started = true;
            this._start = this._tx.rotation;
            this._currentNonCannonAngle = this._tx.rotation;
            const distance1 = Math.abs(this._end - this._start);
            const distance2 = TwoPI - distance1;
            if (distance1 > distance2) {
                this._shortDistance = distance2;
                this._longDistance = distance1;
            }
            else {
                this._shortDistance = distance1;
                this._longDistance = distance2;
            }
            this._shortestPathIsPositive = (this._start - this._end + TwoPI) % TwoPI >= Math.PI;
            switch (this._rotationType) {
                case RotationType.ShortestPath:
                    this._distance = this._shortDistance;
                    if (this._shortestPathIsPositive) {
                        this._direction = 1;
                    }
                    else {
                        this._direction = -1;
                    }
                    break;
                case RotationType.LongestPath:
                    this._distance = this._longDistance;
                    if (this._shortestPathIsPositive) {
                        this._direction = -1;
                    }
                    else {
                        this._direction = 1;
                    }
                    break;
                case RotationType.Clockwise:
                    this._direction = 1;
                    if (this._shortestPathIsPositive) {
                        this._distance = this._shortDistance;
                    }
                    else {
                        this._distance = this._longDistance;
                    }
                    break;
                case RotationType.CounterClockwise:
                    this._direction = -1;
                    if (!this._shortestPathIsPositive) {
                        this._distance = this._shortDistance;
                    }
                    else {
                        this._distance = this._longDistance;
                    }
                    break;
            }
        }
        this._motion.angularVelocity = this._direction * this._speed;
        this._currentNonCannonAngle += this._direction * this._speed * (_delta / 1000);
        if (this.isComplete()) {
            this._tx.rotation = this._end;
            this._motion.angularVelocity = 0;
            this._stopped = true;
        }
    }
    isComplete() {
        const distanceTraveled = Math.abs(this._currentNonCannonAngle - this._start);
        return this._stopped || distanceTraveled >= Math.abs(this._distance);
    }
    stop() {
        this._motion.angularVelocity = 0;
        this._stopped = true;
    }
    reset() {
        this._started = false;
        this._stopped = false;
    }
}
//# sourceMappingURL=RotateTo.js.map