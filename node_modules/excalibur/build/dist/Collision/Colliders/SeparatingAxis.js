export class SeparatingAxis {
    static findPolygonPolygonSeparation(polyA, polyB) {
        let bestSeparation = -Number.MAX_VALUE;
        let bestSide = null;
        let bestAxis = null;
        let bestSideIndex = -1;
        let bestOtherPoint = null;
        const sides = polyA.getSides();
        const localSides = polyA.getLocalSides();
        for (let i = 0; i < sides.length; i++) {
            const side = sides[i];
            const axis = side.normal();
            const vertB = polyB.getFurthestPoint(axis.negate());
            // Separation on side i's axis
            // We are looking for the largest separation between poly A's sides
            const vertSeparation = side.distanceToPoint(vertB, true);
            if (vertSeparation > bestSeparation) {
                bestSeparation = vertSeparation;
                bestSide = side;
                bestAxis = axis;
                bestSideIndex = i;
                bestOtherPoint = vertB;
            }
        }
        return {
            collider: polyA,
            separation: bestAxis ? bestSeparation : 99,
            axis: bestAxis,
            side: bestSide,
            localSide: localSides[bestSideIndex],
            sideId: bestSideIndex,
            point: bestOtherPoint,
            localPoint: bestAxis ? polyB.getFurthestLocalPoint(bestAxis.negate()) : null
        };
    }
    static findCirclePolygonSeparation(circle, polygon) {
        const axes = polygon.axes;
        const pc = polygon.center;
        // Special SAT with circles
        const polyDir = pc.sub(circle.worldPos);
        const closestPointOnPoly = polygon.getFurthestPoint(polyDir.negate());
        axes.push(closestPointOnPoly.sub(circle.worldPos).normalize());
        let minOverlap = Number.MAX_VALUE;
        let minAxis = null;
        let minIndex = -1;
        for (let i = 0; i < axes.length; i++) {
            const proj1 = polygon.project(axes[i]);
            const proj2 = circle.project(axes[i]);
            const overlap = proj1.getOverlap(proj2);
            if (overlap <= 0) {
                return null;
            }
            else {
                if (overlap < minOverlap) {
                    minOverlap = overlap;
                    minAxis = axes[i];
                    minIndex = i;
                }
            }
        }
        if (minIndex < 0) {
            return null;
        }
        return minAxis.normalize().scale(minOverlap);
    }
}
//# sourceMappingURL=SeparatingAxis.js.map