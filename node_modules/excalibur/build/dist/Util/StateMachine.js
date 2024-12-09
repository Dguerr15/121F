export class StateMachine {
    constructor() {
        this.states = new Map();
    }
    get currentState() {
        return this._currentState;
    }
    set currentState(state) {
        this._currentState = state;
    }
    static create(machineDescription, data) {
        const machine = new StateMachine();
        machine.data = data;
        for (const stateName in machineDescription.states) {
            machine.states.set(stateName, {
                name: stateName,
                ...machineDescription.states[stateName]
            });
        }
        // validate transitions are states
        for (const state of machine.states.values()) {
            for (const transitionState of state.transitions) {
                if (transitionState === '*') {
                    continue;
                }
                if (!machine.states.has(transitionState)) {
                    throw Error(`Invalid state machine, state [${state.name}] has a transition to another state that doesn't exist [${transitionState}]`);
                }
            }
        }
        machine.currentState = machine.startState = machine.states.get(machineDescription.start);
        return machine;
    }
    in(state) {
        return this.currentState.name === state;
    }
    go(stateName, eventData) {
        var _a, _b;
        if (this.currentState.transitions.includes(stateName) || this.currentState.transitions.includes('*')) {
            const potentialNewState = this.states.get(stateName);
            if (this.currentState.onExit) {
                const canExit = (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.onExit({ to: potentialNewState.name, data: this.data });
                if (canExit === false) {
                    return false;
                }
            }
            if (potentialNewState === null || potentialNewState === void 0 ? void 0 : potentialNewState.onEnter) {
                const canEnter = potentialNewState === null || potentialNewState === void 0 ? void 0 : potentialNewState.onEnter({ from: this.currentState.name, eventData, data: this.data });
                if (canEnter === false) {
                    return false;
                }
            }
            // console.log(`${this.currentState.name} => ${potentialNewState.name} (${eventData})`);
            this.currentState = potentialNewState;
            if ((_b = this.currentState) === null || _b === void 0 ? void 0 : _b.onState) {
                this.currentState.onState();
            }
            return true;
        }
        return false;
    }
    update(elapsedMs) {
        if (this.currentState.onUpdate) {
            this.currentState.onUpdate(this.data, elapsedMs);
        }
    }
    save(saveKey) {
        localStorage.setItem(saveKey, JSON.stringify({
            currentState: this.currentState.name,
            data: this.data
        }));
    }
    restore(saveKey) {
        const state = JSON.parse(localStorage.getItem(saveKey));
        this.currentState = this.states.get(state.currentState);
        this.data = state.data;
    }
}
//# sourceMappingURL=StateMachine.js.map