import { my } from "../Globals.js";

export class EventManager {
    constructor(scene) {
        // this.scene = scene;
    }
    //game saving stuff
    saveGame(saveSlotName) {
        const saveData = {
            grid: my.gridManager.getGridState(),
            player: {
                x: my.player.pos.x,
                y: my.player.pos.y,
            },
            inventory: my.scene.inventory,
            dayCount: my.scene.dayCount,
            history: my.commandMan.serializeHistory(),
            redoStack: my.commandMan.serializeRedoStack()
        };

        localStorage.setItem(`${saveSlotName}`, JSON.stringify(saveData));
    }

    loadGame(saveSlotName) {
        const saveData = JSON.parse(localStorage.getItem(`${saveSlotName}`));

        if (!saveData) {
            return false;
        }

        // load grid state
        my.gridManager.setGridState(saveData.grid, my.scene);

        // restore player state
        my.player.pos.x = saveData.player.x;
        my.player.pos.y = saveData.player.y;

        // restore inv and day ct
        my.scene.inventory = saveData.inventory;
        my.scene.dayCount = saveData.dayCount;
        my.inventory = saveData.inventory;


        // load command history
        my.commandMan.deserialize(saveData.history);
        my.commandMan.deserializeRedoStack(saveData.redoStack);

        // update text and ui
        my.scene.updateInventory();
        my.scene.updateDayCountText();

        return true;
    }
}