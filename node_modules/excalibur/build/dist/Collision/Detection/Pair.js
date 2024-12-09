import { CollisionType } from '../CollisionType';
import { BodyComponent } from '../BodyComponent';
/**
 * Models a potential collision between 2 colliders
 */
export class Pair {
    constructor(colliderA, colliderB) {
        this.colliderA = colliderA;
        this.colliderB = colliderB;
        this.id = null;
        this.id = Pair.calculatePairHash(colliderA.id, colliderB.id);
    }
    /**
     * Returns whether a it is allowed for 2 colliders in a Pair to collide
     * @param colliderA
     * @param colliderB
     */
    static canCollide(colliderA, colliderB) {
        var _a, _b;
        const bodyA = (_a = colliderA === null || colliderA === void 0 ? void 0 : colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent);
        const bodyB = (_b = colliderB === null || colliderB === void 0 ? void 0 : colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent);
        // Prevent self collision
        if (colliderA.id === colliderB.id) {
            return false;
        }
        // Colliders with the same owner do not collide (composite colliders)
        if (colliderA.owner &&
            colliderB.owner &&
            colliderA.owner.id === colliderB.owner.id) {
            return false;
        }
        // if the pair has a member with zero dimension don't collide
        if (colliderA.localBounds.hasZeroDimensions() || colliderB.localBounds.hasZeroDimensions()) {
            return false;
        }
        // Body's needed for collision in the current state
        // TODO can we collide without a body?
        if (!bodyA || !bodyB) {
            return false;
        }
        // If both are in the same collision group short circuit
        if (!bodyA.group.canCollide(bodyB.group)) {
            return false;
        }
        // if both are fixed short circuit
        if (bodyA.collisionType === CollisionType.Fixed && bodyB.collisionType === CollisionType.Fixed) {
            return false;
        }
        // if the either is prevent collision short circuit
        if (bodyB.collisionType === CollisionType.PreventCollision || bodyA.collisionType === CollisionType.PreventCollision) {
            return false;
        }
        // if either is dead short circuit
        if (!bodyA.active || !bodyB.active) {
            return false;
        }
        return true;
    }
    /**
     * Returns whether or not it is possible for the pairs to collide
     */
    get canCollide() {
        const colliderA = this.colliderA;
        const colliderB = this.colliderB;
        return Pair.canCollide(colliderA, colliderB);
    }
    /**
     * Runs the collision intersection logic on the members of this pair
     */
    collide() {
        return this.colliderA.collide(this.colliderB);
    }
    /**
     * Check if the collider is part of the pair
     * @param collider
     */
    hasCollider(collider) {
        return collider === this.colliderA || collider === this.colliderB;
    }
    /**
     * Calculates the unique pair hash id for this collision pair (owning id)
     */
    static calculatePairHash(idA, idB) {
        if (idA.value < idB.value) {
            return `#${idA.value}+${idB.value}`;
        }
        else {
            return `#${idB.value}+${idA.value}`;
        }
    }
}
//# sourceMappingURL=Pair.js.map