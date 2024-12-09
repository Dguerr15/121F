import { ActionContext } from '../ActionContext';
export class Repeat {
    constructor(entity, repeatBuilder, repeat) {
        this._stopped = false;
        this._repeatBuilder = repeatBuilder;
        this._repeatContext = new ActionContext(entity);
        this._actionQueue = this._repeatContext.getQueue();
        this._repeat = repeat;
        this._originalRepeat = repeat;
        this._repeatBuilder(this._repeatContext);
        this._repeat--; // current execution is the first repeat
    }
    update(delta) {
        if (this._actionQueue.isComplete()) {
            this._actionQueue.clearActions();
            this._repeatBuilder(this._repeatContext);
            this._repeat--;
        }
        this._actionQueue.update(delta);
    }
    isComplete() {
        return this._stopped || (this._repeat <= 0 && this._actionQueue.isComplete());
    }
    stop() {
        this._stopped = true;
    }
    reset() {
        this._repeat = this._originalRepeat;
    }
}
//# sourceMappingURL=Repeat.js.map