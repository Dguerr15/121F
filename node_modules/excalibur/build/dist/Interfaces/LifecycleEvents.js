/**
 * Type guard checking for internal initialize method
 * @internal
 * @param a
 */
export function has_initialize(a) {
    return !!a._initialize;
}
/**
 *
 */
export function hasOnInitialize(a) {
    return !!a.onInitialize;
}
/**
 *
 */
export function has_preupdate(a) {
    return !!a._preupdate;
}
/**
 *
 */
export function hasOnPreUpdate(a) {
    return !!a.onPreUpdate;
}
/**
 *
 */
export function has_postupdate(a) {
    return !!a.onPostUpdate;
}
/**
 *
 */
export function hasOnPostUpdate(a) {
    return !!a.onPostUpdate;
}
/**
 *
 */
export function hasPreDraw(a) {
    return !!a.onPreDraw;
}
/**
 *
 */
export function hasPostDraw(a) {
    return !!a.onPostDraw;
}
//# sourceMappingURL=LifecycleEvents.js.map