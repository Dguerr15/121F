declare const my: {
    gridManager: {
        plantCrop: (x: number, y: number, plantName: string, scene: Phaser.Scene) => void;
        removePlant: (x: number, y: number) => void;
        getPlantTypeName: (plantTypeCode: number) => string;
        getPlantType: (x: number, y: number) => number;
        setGrowthLevel: (x: number, y: number, level: number) => void;
        updatePlantSprite: (x: number, y: number) => void;
        getWaterLevel: (x: number, y: number) => number;
        getSunLevel: (x: number, y: number) => number;
        setWaterLevel: (x: number, y: number, level: number) => void;
        setSunLevel: (x: number, y: number, level: number) => void;
        getFakeRand: (x: number, y: number, dayCount: number) => number;
        drawCellInfo: (scene: Phaser.Scene, x: number, y: number) => void;
        returnAdjacentCells: (x: number, y: number) => { x: number; y: number }[];
        getGrowthLevel: (x: number, y: number) => number;
        gridWidth: number;
        gridHeight: number;
    };
    inventory: Record<string, number>;
    scene: Phaser.Scene & { dayCount: number; };
    text: {
        dayCount: Phaser.GameObjects.Text;
    };
};

declare const PlantTypes: {
    NONE: number;
    [key: string]: number;
};

interface GrowthCondition {
    check: (context: {
        sunLevel: number;
        waterLevel: number;
        neighbors: { x: number; y: number }[];
        gridManager: typeof my.gridManager;
    }) => boolean;
}

interface GrowthDefinition {
    growthConditions: GrowthCondition[];
    consumeResources: {
        waterNeeded: number;
    };
}

declare const GrowthDefinitions: Record<number, GrowthDefinition>;
declare const MAX_WATER_CAPACITY: number;
declare const RAND_SUN_MAX: number;
declare const RAND_WATER_MAX: number;

// Base Command interface
interface CommandData {
    command: string;
    [key: string]: any;
}

abstract class Command {
    abstract execute(): void;
    abstract undo(): void;
    abstract serialize(): CommandData;
    static deserialize(data: CommandData): Command {
        throw new Error("deserialize() must be implemented");
    }
}

class PlantCropCommand extends Command {
    private gridX: number;
    private gridY: number;
    private plantName: string;

    constructor(gridX: number, gridY: number, plantName: string) {
        super();
        this.gridX = gridX; // X position of the crop
        this.gridY = gridY; // Y position of the crop
        this.plantName = plantName; // Type of crop to plant
    }

    execute(): void {
        my.gridManager.plantCrop(this.gridX, this.gridY, this.plantName, my.scene); // Plant the crop
        my.inventory[this.plantName]--;
    }

    undo(): void {
        console.log("undoing plant crop command: ", this.plantName);
        my.inventory[this.plantName]++;
        my.gridManager.removePlant(this.gridX, this.gridY); // Reverse by removing the crop
    }

    serialize(): CommandData {
        return {
            command: "PlantCropCommand",
            gridX: this.gridX,
            gridY: this.gridY,
            plantName: this.plantName
        };
    }

    static deserialize(data: CommandData): PlantCropCommand {
        return new PlantCropCommand(data.gridX, data.gridY, data.plantName);
    }
}

class RemovePlantCommand extends Command {
    private gridX: number;
    private gridY: number;
    private plantTypeCode: number;
    private growthLevel: number;

    constructor(gridX: number, gridY: number, plantTypeCode: number, growthLevel: number) {
        super();
        this.gridX = gridX;
        this.gridY = gridY;
        this.plantTypeCode = plantTypeCode;
        this.growthLevel = growthLevel;
    }

    execute(): void {
        const plantType = my.gridManager.getPlantTypeName(this.plantTypeCode);
        my.inventory[plantType]++;
        my.gridManager.removePlant(this.gridX, this.gridY);
    }

    undo(): void {
        const plantType = my.gridManager.getPlantTypeName(this.plantTypeCode);
        // Replant the crop.
        my.gridManager.plantCrop(this.gridX, this.gridY, plantType, my.scene);
        // Decrement inventory.
        my.inventory[plantType]--;
        // Update growth level
        my.gridManager.setGrowthLevel(this.gridX, this.gridY, this.growthLevel);
        my.gridManager.updatePlantSprite(this.gridX, this.gridY);
    }

    serialize(): CommandData {
        return {
            command: "RemovePlantCommand",
            gridX: this.gridX,
            gridY: this.gridY,
            plantTypeCode: this.plantTypeCode,
            growthLevel: this.growthLevel
        };
    }

    static deserialize(data: CommandData): RemovePlantCommand {
        return new RemovePlantCommand(data.gridX, data.gridY, data.plantTypeCode, data.growthLevel);
    }
}

class AdvanceTimeCommand extends Command {
    private growthEvents: Map<string, { x: number; y: number }>;

    constructor() {
        super();
        this.growthEvents = new Map<string, { x: number; y: number }>();
    }

    execute(): void {
        this.advanceOneDay();

        // Increment day count
        my.scene.dayCount++;
        my.text.dayCount.setText(`Day: ${my.scene.dayCount}`);
    }

    undo(): void {
        this.undoOneDay();
        // Decrement day count
        my.scene.dayCount--;
        my.text.dayCount.setText(`Day: ${my.scene.dayCount}`);
    }

    serialize(): CommandData {
        return {
            command: "AdvanceTimeCommand"
        };
    }

    static deserialize(_data: CommandData): AdvanceTimeCommand {
        return new AdvanceTimeCommand();
    }

    private advanceOneDay(): void {
        for (let x = 0; x < my.gridManager.gridWidth; x++) {
            for (let y = 0; y < my.gridManager.gridHeight; y++) {
                this.updateResources(x, y);
                this.updatePlantGrowth(x, y);
                my.gridManager.drawCellInfo(my.scene, x, y);
            }
        }
    }

    private updateResources(x: number, y: number): void {
        this.updateWaterLevel(x, y);
        this.updateSunLevel(x, y);
    }

    private updateWaterLevel(x: number, y: number): void {
        const currentWater = my.gridManager.getWaterLevel(x, y);
        const additionalWater = my.gridManager.getFakeRand(x, y, my.scene.dayCount) % RAND_WATER_MAX;
        my.gridManager.setWaterLevel(x, y, Math.min(currentWater + additionalWater, MAX_WATER_CAPACITY));
    }

    private updateSunLevel(x: number, y: number): void {
        const sun = my.gridManager.getFakeRand(x, y, my.scene.dayCount) % RAND_SUN_MAX;
        my.gridManager.setSunLevel(x, y, sun);
    }

    private updatePlantGrowth(x: number, y: number): void {
        const plantType = my.gridManager.getPlantType(x, y);
        if (plantType !== PlantTypes.NONE) {
            const growthLevel = my.gridManager.getGrowthLevel(x, y);
            const sunLevel = my.gridManager.getSunLevel(x, y);
            const waterLevel = my.gridManager.getWaterLevel(x, y);

            const neighbors = my.gridManager.returnAdjacentCells(x, y);
            const growthDef = GrowthDefinitions[plantType];
            if (!growthDef) return;

            const conditions = growthDef.growthConditions;
            const context = {
                sunLevel,
                waterLevel,
                neighbors,
                gridManager: my.gridManager
            };

            // Check if all conditions are met
            const canGrow = conditions.every(cond => cond.check(context));

            if (canGrow && growthLevel < 3) {
                // Growth Event.
                my.gridManager.setGrowthLevel(x, y, growthLevel + 1);
                // Consume resources based on DSL definition
                const consume = growthDef.consumeResources;
                my.gridManager.setWaterLevel(x, y, waterLevel - consume.waterNeeded);
                my.gridManager.updatePlantSprite(x, y);

                // Store growth event
                const eventKey = `${x},${y}`;
                if (!this.growthEvents.has(eventKey)) {
                    this.growthEvents.set(eventKey, { x, y });
                }
            }
        }
    }

    private undoOneDay(): void {
        for (let x = 0; x < my.gridManager.gridWidth; x++) {
            for (let y = 0; y < my.gridManager.gridHeight; y++) {
                this.undoResources(x, y);
                my.gridManager.drawCellInfo(my.scene, x, y);
            }
        }
        const eventsArray = Array.from(this.growthEvents.values());
        for (let i = eventsArray.length - 1; i >= 0; i--) {
            const { x, y } = eventsArray[i];
            this.undoPlantGrowth(x, y);
            my.gridManager.drawCellInfo(my.scene, x, y);
        }
    }

    private undoResources(x: number, y: number): void {
        this.undoWaterLevel(x, y);
        this.undoSunLevel(x, y);
    }

    private undoWaterLevel(x: number, y: number): void {
        const currentWater = my.gridManager.getWaterLevel(x, y);
        const additionalWater = my.gridManager.getFakeRand(x, y, my.scene.dayCount - 1) % RAND_WATER_MAX;
        my.gridManager.setWaterLevel(x, y, Math.max(currentWater - additionalWater, 0));
    }

    private undoSunLevel(x: number, y: number): void {
        const sun = my.gridManager.getFakeRand(x, y, my.scene.dayCount - 1) % RAND_SUN_MAX;
        my.gridManager.setSunLevel(x, y, sun);
    }

    private undoPlantGrowth(x: number, y: number): void {
        const plantType = my.gridManager.getPlantType(x, y);
        if (plantType !== PlantTypes.NONE) {
            const growthLevel = my.gridManager.getGrowthLevel(x, y);
            const growthDef = GrowthDefinitions[plantType];
            if (!growthDef) return;

            if (growthLevel > 1) {
                // Revert the last growth step
                my.gridManager.setGrowthLevel(x, y, growthLevel - 1);
                // Return resources consumed
                const consume = growthDef.consumeResources;
                const currentWater = my.gridManager.getWaterLevel(x, y);
                my.gridManager.setWaterLevel(x, y, Math.min(currentWater + consume.waterNeeded, MAX_WATER_CAPACITY));
                my.gridManager.updatePlantSprite(x, y);
            }
        }
    }
}

// Export classes if needed
export {
    Command,
    PlantCropCommand,
    RemovePlantCommand,
    AdvanceTimeCommand
};
