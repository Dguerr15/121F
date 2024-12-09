import { ActionContext } from '../ActionContext';
/**
 * RepeatForever Action implementation, it is recommended you use the fluent action
 * context API.
 *
 *
 */
export class RepeatForever {
    constructor(entity, repeatBuilder) {
        this._stopped = false;
        this._repeatBuilder = repeatBuilder;
        this._repeatContext = new ActionContext(entity);
        this._actionQueue = this._repeatContext.getQueue();
        this._repeatBuilder(this._repeatContext);
    }
    update(delta) {
        if (this._stopped) {
            return;
        }
        if (this._actionQueue.isComplete()) {
            this._actionQueue.clearActions();
            this._repeatBuilder(this._repeatContext);
        }
        this._actionQueue.update(delta);
    }
    isComplete() {
        return this._stopped;
    }
    stop() {
        this._stopped = true;
        this._actionQueue.clearActions();
    }
    reset() {
        return;
    }
}
//# sourceMappingURL=RepeatForever.js.map