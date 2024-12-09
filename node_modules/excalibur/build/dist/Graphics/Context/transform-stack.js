import { AffineMatrix } from '../../Math/affine-matrix';
export class TransformStack {
    constructor() {
        this._transforms = [];
        this._currentTransform = AffineMatrix.identity();
    }
    save() {
        this._transforms.push(this._currentTransform);
        this._currentTransform = this._currentTransform.clone();
    }
    restore() {
        this._currentTransform = this._transforms.pop();
    }
    translate(x, y) {
        return this._currentTransform.translate(x, y);
    }
    rotate(angle) {
        return this._currentTransform.rotate(angle);
    }
    scale(x, y) {
        return this._currentTransform.scale(x, y);
    }
    set current(matrix) {
        this._currentTransform = matrix;
    }
    get current() {
        return this._currentTransform;
    }
}
//# sourceMappingURL=transform-stack.js.map