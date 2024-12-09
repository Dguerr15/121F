/**
 * Action that can run multiple [[Action]]s or [[ActionSequence]]s at the same time
 */
export class ParallelActions {
    constructor(parallelActions) {
        this._actions = parallelActions;
    }
    update(delta) {
        for (let i = 0; i < this._actions.length; i++) {
            this._actions[i].update(delta);
        }
    }
    isComplete(entity) {
        return this._actions.every(a => a.isComplete(entity));
    }
    reset() {
        this._actions.forEach(a => a.reset());
    }
    stop() {
        this._actions.forEach(a => a.stop());
    }
}
//# sourceMappingURL=ParallelActions.js.map