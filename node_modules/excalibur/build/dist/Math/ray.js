/**
 * A 2D ray that can be cast into the scene to do collision detection
 */
export class Ray {
    /**
     * @param pos The starting position for the ray
     * @param dir The vector indicating the direction of the ray
     */
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir.normalize();
    }
    /**
     * Tests a whether this ray intersects with a line segment. Returns a number greater than or equal to 0 on success.
     * This number indicates the mathematical intersection time.
     * @param line  The line to test
     */
    intersect(line) {
        const numerator = line.begin.sub(this.pos);
        // Test is line and ray are parallel and non intersecting
        if (this.dir.cross(line.getSlope()) === 0 && numerator.cross(this.dir) !== 0) {
            return -1;
        }
        // Lines are parallel
        const divisor = this.dir.cross(line.getSlope());
        if (divisor === 0) {
            return -1;
        }
        const t = numerator.cross(line.getSlope()) / divisor;
        if (t >= 0) {
            const u = numerator.cross(this.dir) / divisor / line.getLength();
            if (u >= 0 && u <= 1) {
                return t;
            }
        }
        return -1;
    }
    intersectPoint(line) {
        const time = this.intersect(line);
        if (time < 0) {
            return null;
        }
        return this.getPoint(time);
    }
    /**
     * Returns the point of intersection given the intersection time
     */
    getPoint(time) {
        return this.pos.add(this.dir.scale(time));
    }
}
//# sourceMappingURL=ray.js.map