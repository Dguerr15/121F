import { Vector } from '../../Math/vector';
import { BodyComponent } from '../BodyComponent';
/**
 * Holds information about contact points, meant to be reused over multiple frames of contact
 */
export class ContactConstraintPoint {
    constructor(point, local, contact) {
        this.point = point;
        this.local = local;
        this.contact = contact;
        /**
         * Impulse accumulated over time in normal direction
         */
        this.normalImpulse = 0;
        /**
         * Impulse accumulated over time in the tangent direction
         */
        this.tangentImpulse = 0;
        /**
         * Effective mass seen in the normal direction
         */
        this.normalMass = 0;
        /**
         * Effective mass seen in the tangent direction
         */
        this.tangentMass = 0;
        /**
         * Direction from center of mass of bodyA to contact point
         */
        this.aToContact = new Vector(0, 0);
        /**
         * Direction from center of mass of bodyB to contact point
         */
        this.bToContact = new Vector(0, 0);
        /**
         * Original contact velocity combined with bounciness
         */
        this.originalVelocityAndRestitution = 0;
        this.update();
    }
    /**
     * Updates the contact information
     */
    update() {
        var _a, _b;
        const bodyA = (_a = this.contact.colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent);
        const bodyB = (_b = this.contact.colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent);
        if (bodyA && bodyB) {
            const normal = this.contact.normal;
            const tangent = this.contact.tangent;
            this.aToContact = this.point.sub(bodyA.globalPos);
            this.bToContact = this.point.sub(bodyB.globalPos);
            const aToContactNormal = this.aToContact.cross(normal);
            const bToContactNormal = this.bToContact.cross(normal);
            this.normalMass =
                bodyA.inverseMass +
                    bodyB.inverseMass +
                    bodyA.inverseInertia * aToContactNormal * aToContactNormal +
                    bodyB.inverseInertia * bToContactNormal * bToContactNormal;
            const aToContactTangent = this.aToContact.cross(tangent);
            const bToContactTangent = this.bToContact.cross(tangent);
            this.tangentMass =
                bodyA.inverseMass +
                    bodyB.inverseMass +
                    bodyA.inverseInertia * aToContactTangent * aToContactTangent +
                    bodyB.inverseInertia * bToContactTangent * bToContactTangent;
        }
        return this;
    }
    /**
     * Returns the relative velocity between bodyA and bodyB
     */
    getRelativeVelocity() {
        var _a, _b;
        const bodyA = (_a = this.contact.colliderA.owner) === null || _a === void 0 ? void 0 : _a.get(BodyComponent);
        const bodyB = (_b = this.contact.colliderB.owner) === null || _b === void 0 ? void 0 : _b.get(BodyComponent);
        if (bodyA && bodyB) {
            // Relative velocity in linear terms
            // Angular to linear velocity formula -> omega = velocity/radius so omega x radius = velocity
            const velA = bodyA.vel.add(Vector.cross(bodyA.angularVelocity, this.aToContact));
            const velB = bodyB.vel.add(Vector.cross(bodyB.angularVelocity, this.bToContact));
            return velB.sub(velA);
        }
        return Vector.Zero;
    }
}
//# sourceMappingURL=ContactConstraintPoint.js.map