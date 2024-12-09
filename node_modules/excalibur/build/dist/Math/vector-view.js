import { Vector } from './vector';
export class VectorView extends Vector {
    constructor(options) {
        super(0, 0);
        this._getX = options.getX;
        this._getY = options.getY;
        this._setX = options.setX;
        this._setY = options.setY;
    }
    get x() {
        return (this._x = this._getX());
    }
    set x(val) {
        this._setX(val);
        this._x = val;
    }
    get y() {
        return (this._y = this._getY());
    }
    set y(val) {
        this._setY(val);
        this._y = val;
    }
}
//# sourceMappingURL=vector-view.js.map