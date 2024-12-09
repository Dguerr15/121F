import { ActionContext } from '../ActionContext';
/**
 * Action that can represent a sequence of actions, this can be useful in conjunction with
 * [[ParallelActions]] to run multiple sequences in parallel.
 */
export class ActionSequence {
    constructor(entity, actionBuilder) {
        this._stopped = false;
        this._sequenceBuilder = actionBuilder;
        this._sequenceContext = new ActionContext(entity);
        this._actionQueue = this._sequenceContext.getQueue();
        this._sequenceBuilder(this._sequenceContext);
    }
    update(delta) {
        this._actionQueue.update(delta);
    }
    isComplete() {
        return this._stopped || this._actionQueue.isComplete();
    }
    stop() {
        this._stopped = true;
    }
    reset() {
        this._stopped = false;
        this._actionQueue.reset();
    }
    clone(entity) {
        return new ActionSequence(entity, this._sequenceBuilder);
    }
}
//# sourceMappingURL=ActionSequence.js.map