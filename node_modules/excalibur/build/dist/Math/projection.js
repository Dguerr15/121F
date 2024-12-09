/**
 * A 1 dimensional projection on an axis, used to test overlaps
 */
export class Projection {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    overlaps(projection) {
        return this.max > projection.min && projection.max > this.min;
    }
    getOverlap(projection) {
        if (this.overlaps(projection)) {
            if (this.max > projection.max) {
                return projection.max - this.min;
            }
            else {
                return this.max - projection.min;
            }
        }
        return 0;
    }
}
//# sourceMappingURL=projection.js.map