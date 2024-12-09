import { Entity } from './Entity';
import { Observable } from '../Util/Observable';
import { Component, ComponentCtor } from '../EntityComponentSystem/Component';
export type ComponentInstance<T> = T extends ComponentCtor<infer R> ? R : never;
/**
 * Represents query for entities that match a list of types that is cached and observable
 *
 * Queries can be strongly typed by supplying a type union in the optional type parameter
 * ```typescript
 * const queryAB = new ex.Query<ComponentTypeA | ComponentTypeB>(['A', 'B']);
 * ```
 */
export declare class Query<TKnownComponentCtors extends ComponentCtor<Component> = never> {
    readonly requiredComponents: TKnownComponentCtors[];
    readonly id: string;
    components: Set<TKnownComponentCtors>;
    entities: Entity<ComponentInstance<TKnownComponentCtors>>[];
    /**
     * This fires right after the component is added
     */
    entityAdded$: Observable<Entity<ComponentInstance<TKnownComponentCtors>>>;
    /**
     * This fires right before the component is actually removed from the entity, it will still be available for cleanup purposes
     */
    entityRemoved$: Observable<Entity<ComponentInstance<TKnownComponentCtors>>>;
    constructor(requiredComponents: TKnownComponentCtors[]);
    static createId(requiredComponents: Function[]): string;
    /**
     * Potentially adds an entity to a query index, returns true if added, false if not
     * @param entity
     */
    checkAndAdd(entity: Entity): boolean;
    removeEntity(entity: Entity): void;
    /**
     * Returns a list of entities that match the query
     * @param sort Optional sorting function to sort entities returned from the query
     */
    getEntities(sort?: (a: Entity, b: Entity) => number): Entity<ComponentInstance<TKnownComponentCtors>>[];
}
