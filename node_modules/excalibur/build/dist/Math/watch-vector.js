import { Vector } from './vector';
/**
 * Wraps a vector and watches for changes in the x/y, modifies the original vector.
 */
export class WatchVector extends Vector {
    constructor(original, change) {
        super(original.x, original.y);
        this.original = original;
        this.change = change;
    }
    get x() {
        return this._x = this.original.x;
    }
    set x(newX) {
        this.change(newX, this._y);
        this._x = this.original.x = newX;
    }
    get y() {
        return this._y = this.original.y;
    }
    set y(newY) {
        this.change(this._x, newY);
        this._y = this.original.y = newY;
    }
}
//# sourceMappingURL=watch-vector.js.map