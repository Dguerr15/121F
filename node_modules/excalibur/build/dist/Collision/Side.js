import { Vector } from '../Math/vector';
/**
 * An enum that describes the sides of an axis aligned box for collision
 */
export var Side;
(function (Side) {
    Side["None"] = "None";
    Side["Top"] = "Top";
    Side["Bottom"] = "Bottom";
    Side["Left"] = "Left";
    Side["Right"] = "Right";
})(Side || (Side = {}));
(function (Side) {
    /**
     * Returns the opposite side from the current
     */
    function getOpposite(side) {
        if (side === Side.Top) {
            return Side.Bottom;
        }
        if (side === Side.Bottom) {
            return Side.Top;
        }
        if (side === Side.Left) {
            return Side.Right;
        }
        if (side === Side.Right) {
            return Side.Left;
        }
        return Side.None;
    }
    Side.getOpposite = getOpposite;
    /**
     * Given a vector, return the Side most in that direction (via dot product)
     */
    function fromDirection(direction) {
        const directions = [Vector.Left, Vector.Right, Vector.Up, Vector.Down];
        const directionEnum = [Side.Left, Side.Right, Side.Top, Side.Bottom];
        let max = -Number.MAX_VALUE;
        let maxIndex = -1;
        for (let i = 0; i < directions.length; i++) {
            if (directions[i].dot(direction) > max) {
                max = directions[i].dot(direction);
                maxIndex = i;
            }
        }
        return directionEnum[maxIndex];
    }
    Side.fromDirection = fromDirection;
})(Side || (Side = {}));
//# sourceMappingURL=Side.js.map