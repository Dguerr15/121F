// Placeholder declarations for global variables and their methods.
// Replace these with actual type definitions or imports.
declare const my: {
    gridManager: {
        getGridState(): any; 
        setGridState(grid: any, scene: Phaser.Scene): void;
    };
    sprite: {
        player: Phaser.Physics.Arcade.Sprite;
    };
    inventory: Record<string, number>;
    text: {
        dayCount: Phaser.GameObjects.Text;
    };
    commandMan: {
        serializeHistory(): any[];
        serializeRedoStack(): any[];
        deserialize(data: any[]): void;
        deserializeRedoStack(data: any[]): void;
    };
};

interface SaveData {
    grid: any; // Replace 'any' with the actual grid state type
    player: {
        x: number;
        y: number;
    };
    inventory: Record<string, number>;
    dayCount: number;
    history: any[];   // Replace 'any[]' with the actual command data type
    redoStack: any[]; // Replace 'any[]' with the actual command data type
}

export class EventManager {
    private scene: Phaser.Scene & {
        inventory: Record<string, number>;
        dayCount: number;
        updateInventory: () => void;
    };

    constructor(scene: Phaser.Scene & { 
        inventory: Record<string, number>;
        dayCount: number; 
        updateInventory: () => void; 
    }) {
        this.scene = scene;
    }

    // game saving stuff
    saveGame(saveSlotName: string): void {
        console.log("saving game");
        const saveData: SaveData = {
            grid: my.gridManager.getGridState(),
            player: {
                x: my.sprite.player.x,
                y: my.sprite.player.y
            },
            inventory: this.scene.inventory,
            dayCount: this.scene.dayCount,
            history: my.commandMan.serializeHistory(),
            redoStack: my.commandMan.serializeRedoStack()
        };

        localStorage.setItem(saveSlotName, JSON.stringify(saveData));
        console.log(`Game saved to slot ${saveSlotName}`);
    }

    loadGame(saveSlotName: string): boolean {
        console.log("loading game");
        const rawData = localStorage.getItem(saveSlotName);
        if (!rawData) {
            console.log(`No save data found in slot ${saveSlotName}`);
            return false;
        }

        const saveData: SaveData = JSON.parse(rawData);
        if (!saveData) {
            console.log(`No save data found in slot ${saveSlotName}`);
            return false;
        }

        // load grid state
        my.gridManager.setGridState(saveData.grid, this.scene);

        // restore player state
        my.sprite.player.x = saveData.player.x;
        my.sprite.player.y = saveData.player.y;

        // restore inventory and day count
        this.scene.inventory = saveData.inventory;
        this.scene.dayCount = saveData.dayCount;
        my.inventory = saveData.inventory;

        // update text and UI
        this.scene.updateInventory();
        my.text.dayCount.setText(`Day: ${this.scene.dayCount}`);

        // load command history
        my.commandMan.deserialize(saveData.history);
        my.commandMan.deserializeRedoStack(saveData.redoStack);

        console.log(`Game loaded from slot ${saveSlotName}`);
        return true;
    }
}
