import { ActionsComponent } from '../ActionsComponent';
export class Die {
    constructor(entity) {
        this._stopped = false;
        this._entity = entity;
    }
    update(_delta) {
        this._entity.get(ActionsComponent).clearActions();
        this._entity.kill();
        this._stopped = true;
    }
    isComplete() {
        return this._stopped;
    }
    stop() {
        return;
    }
    reset() {
        return;
    }
}
//# sourceMappingURL=Die.js.map