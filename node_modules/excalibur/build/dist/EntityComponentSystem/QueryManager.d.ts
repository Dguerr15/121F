import { Entity } from './Entity';
import { Query } from './Query';
import { Component, ComponentCtor } from './Component';
import { World } from './World';
import { TagQuery } from './TagQuery';
/**
 * The query manager is responsible for updating all queries when entities/components change
 */
export declare class QueryManager {
    private _world;
    private _queries;
    private _addComponentHandlers;
    private _removeComponentHandlers;
    private _componentToQueriesIndex;
    private _tagQueries;
    private _addTagHandlers;
    private _removeTagHandlers;
    private _tagToQueriesIndex;
    constructor(_world: World);
    createQuery<TKnownComponentCtors extends ComponentCtor<Component>>(requiredComponents: TKnownComponentCtors[]): Query<TKnownComponentCtors>;
    createTagQuery<TKnownTags extends string>(requiredTags: TKnownTags[]): TagQuery<TKnownTags>;
    private _createAddComponentHandler;
    private _createRemoveComponentHandler;
    private _createAddTagHandler;
    private _createRemoveTagHandler;
    /**
     * Scans queries and locates any that need this entity added
     * @param entity
     */
    addEntity(entity: Entity): void;
    /**
     * Scans queries and locates any that need this entity removed
     * @param entity
     */
    removeEntity(entity: Entity): void;
    /**
     * Updates any queries when a component is added to an entity
     * @param entity
     * @param component
     */
    addComponent(entity: Entity, component: Component): void;
    /**
     * Updates any queries when a component is removed from an entity
     * @param entity
     * @param component
     */
    removeComponent(entity: Entity, component: Component): void;
    /**
     * Updates any queries when a tag is added to an entity
     * @param entity
     * @param tag
     */
    addTag(entity: Entity, tag: string): void;
    /**
     * Updates any queries when a component is removed from an entity
     * @param entity
     * @param tag
     */
    removeTag(entity: Entity, tag: string): void;
}
