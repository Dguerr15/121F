import { my } from "../Globals.js";

export class Command {
    execute() { throw new Error("execute() must be implemented"); }
    undo() { throw new Error("undo() must be implemented"); }
    serialize() { throw new Error("serialize() must be implemented"); }
    static deserialize(data) { throw new Error("deserialize() must be implemented"); }
}

export class PlantCropCommand extends Command {
    constructor(gridX, gridY, plantName) {
        super();
        this.gridX = gridX; // X position of the crop
        this.gridY = gridY; // Y position of the crop
        this.plantName = plantName; // Type of crop to plant
    }

    execute() {
        my.gridManager.plantCrop(this.gridX, this.gridY, this.plantName, my.scene); // Plant the crop
        my.inventory[this.plantName]--;
    }

    undo() {
        console.log ("undoing plant crop command: ", this.plantName);
        my.inventory[this.plantName]++;
        my.gridManager.removePlant(this.gridX, this.gridY); // Reverse by removing the crop
    }

    serialize() {
        return {
            command: "PlantCropCommand",
            gridX: this.gridX,
            gridY: this.gridY,
            plantName: this.plantName
        };
    }

    static deserialize(data) {
        return new PlantCropCommand(data.gridX, data.gridY, data.plantName);
    }
}

export class RemovePlantCommand extends Command {
    constructor(gridX, gridY, plantTypeCode, growthLevel) {
        super();
        this.gridX = gridX;
        this.gridY = gridY;
        this.plantTypeCode = plantTypeCode;
        this.growthLevel = growthLevel;
    }

    execute() {
        const plantType = my.gridManager.getPlantTypeName(this.plantTypeCode);
        my.inventory[plantType]++;
        my.gridManager.removePlant(this.gridX, this.gridY);
    }

    undo() {
        const plantType = my.gridManager.getPlantTypeName(this.plantTypeCode);
        // Replant the crop.
        my.gridManager.plantCrop(this.gridX, this.gridY, plantType, my.scene);
        // Decrement inventory.
        my.inventory[plantType]--;
        // Update growth level
        my.gridManager.setGrowthLevel(this.gridX, this.gridY, this.growthLevel);
        my.gridManager.updatePlantSprite(this.gridX, this.gridY);
    }

    serialize() {
        return {
            command: "RemovePlantCommand",
            gridX: this.gridX,
            gridY: this.gridY,
            plantTypeCode: this.plantTypeCode,
            growthLevel: this.growthLevel
        };
    }

    static deserialize(data) {
        return new RemovePlantCommand(data.gridX, data.gridY, data.plantTypeCode, data.growthLevel);
    }
}

export class AdvanceTimeCommand extends Command {
    constructor() {
        super();
        this.growthEvents = new Map();
    }

    execute() {
        this.advanceOneDay();

        // Increment day count
        my.scene.dayCount++;
        my.text.dayCount.setText(`Day: ${my.scene.dayCount}`);
    }

    undo () {
        this.undoOneDay();
        // Decrement day count
        my.scene.dayCount--;
        my.text.dayCount.setText(`Day: ${my.scene.dayCount}`);
    }

    serialize(){
        return {
            command: "AdvanceTimeCommand"
        };
    }

    static deserialize(data){
        return new AdvanceTimeCommand();
    }

    advanceOneDay(){
        for (let x = 0; x < my.gridManager.gridWidth; x++) {
            for (let y = 0; y < my.gridManager.gridHeight; y++) {
                this.updateResources(x, y);
                this.updatePlantGrowth(x, y);
                my.gridManager.drawCellInfo(my.scene, x, y);
            }
        }
    }

    updateResources(x, y) {
        this.updateWaterLevel(x, y);
        this.updateSunLevel(x, y);
    }

    updateWaterLevel(x, y) {
        const currentWater = my.gridManager.getWaterLevel(x, y);
        const additionalWater = my.gridManager.getFakeRand(x, y, my.scene.dayCount) % RAND_WATER_MAX;
        my.gridManager.setWaterLevel(x, y, Math.min(currentWater + additionalWater, MAX_WATER_CAPACITY));
    }

    updateSunLevel(x, y) {
        const sun = my.gridManager.getFakeRand(x, y, my.scene.dayCount) % RAND_SUN_MAX;
        my.gridManager.setSunLevel(x, y, sun);
    }

    updatePlantGrowth(x, y) {
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
                    this.growthEvents.set(eventKey, {x, y});
                }
            }
        }
    }

    undoOneDay(){
        for (let x = 0; x < my.gridManager.gridWidth; x++) {
            for (let y = 0; y < my.gridManager.gridHeight; y++) {
                this.undoResources(x, y);
                my.gridManager.drawCellInfo(my.scene, x, y);
            }
        }
        const eventsArray = Array.from(this.growthEvents.values());
        for (let i = eventsArray.length - 1; i >= 0; i--) {
            const {x, y} = eventsArray[i];
            this.undoPlantGrowth(x, y);
            my.gridManager.drawCellInfo(my.scene, x, y);
        }
    }

    undoResources(x, y){
        this.undoWaterLevel(x, y);
        this.undoSunLevel(x, y);
    }

    undoWaterLevel(x, y){
        const currentWater = my.gridManager.getWaterLevel(x, y);
        const additionalWater = my.gridManager.getFakeRand(x, y, my.scene.dayCount - 1) % RAND_WATER_MAX;
        my.gridManager.setWaterLevel(x, y, Math.max(currentWater - additionalWater, 0));
    }

    undoSunLevel(x, y){
        const sun = my.gridManager.getFakeRand(x, y, my.scene.dayCount - 1) % RAND_SUN_MAX;
        my.gridManager.setSunLevel(x, y, sun);
    }

    undoPlantGrowth(x, y){
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
