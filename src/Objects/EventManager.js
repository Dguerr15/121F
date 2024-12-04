class EventManager {
    constructor(scene) {
        this.scene = scene;

        this.endTurnListeners = [];
        this.customListeners = {};
    }

    addTurnListener(listener) {
        if (typeof listener === 'function') {
            this.endTurnListeners.push(listener);
        } else {
            throw new Error('Listener must be a function');
        }
    }

    emit(event, data) {
        if (this.customListeners[event]) {
            this.customListeners[event].forEach(listener => listener(data));
        }
    }

    removeTurnListener(listener) {
        this.endTurnListeners = this.endTurnListeners.filter(l => l !== listener);
    }

    endTurn() {
        this.endTurnListeners.forEach(listener => listener());
    }


    //game saving stuff
    saveGame(saveSlotName) {
        console.log("saving game");
        const saveData = {
            grid: my.gridManager.getGridState(),
            player: {
                x: my.sprite.player.x,
                y: my.sprite.player.y
            },
            inventory: this.scene.inventory,
            dayCount: this.scene.dayCount,
            // history: my.commandMan.history,
            // redoStack: my.commandMan.redoStack
        };

        localStorage.setItem(`${saveSlotName}`, JSON.stringify(saveData));
        console.log(`Game saved to slot ${saveSlotName}`);
    }

    loadGame(saveSlotName) {
        console.log("loading game");
        const saveData = JSON.parse(localStorage.getItem(`${saveSlotName}`));

        if (!saveData) {
            console.log(`No save data found in slot ${saveSlotName}`);
            return false;
        }

        // load grid state
        my.gridManager.setGridState(saveData.grid, this.scene);

        // restore player state
        my.sprite.player.x = saveData.player.x;
        my.sprite.player.y = saveData.player.y;

        // restore inv and day ct
        this.scene.inventory = saveData.inventory;
        this.scene.dayCount = saveData.dayCount;

        // update text and ui
        this.scene.updateInventory();
        my.text.dayCount.setText(`Day: ${this.scene.dayCount}`);

        // load command history
        // my.commandMan.history = saveData.history;
        // my.commandMan.redoStack = saveData.redoStack;

        console.log(`Game loaded from slot ${saveSlotName}`);
        return true;
    }


    // placeholder for f1
    undoTurn() {

    }
}