class Command {
    execute() { throw new Error("execute() must be implemented"); }
    undo() { throw new Error("undo() must be implemented"); }
    serialize() { throw new Error("serialize() must be implemented"); }
    static deserialize(data) { throw new Error("deserialize() must be implemented"); }
}

class PlantCropCommand {
    constructor(gridX, gridY, plantName) {
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

class RemovePlantCommand {
    constructor(gridX, gridY, plantTypeCode, growthLevel) {
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
        // update display of growth level

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

class AdvanceTimeCommand {
    constructor() {
        this.growthEvents = [];
    }

    execute() {
        this.advanceOneDay();

        // Increment day count
        my.scene.dayCount++;
        my.text.dayCount.setText(`Day: ${my.scene.dayCount}`);
    }

    undo () {
        this.undoOneDay();
        
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
            const plantData = my.gridManager.getPlantAttributesByCode(plantType);

            if (sunLevel >= plantData.sunNeeded && waterLevel >= plantData.waterNeeded) {
                if (growthLevel < 3) {
                    // Growth Event.
                    my.gridManager.setGrowthLevel(x, y, growthLevel + 1);
                    my.gridManager.setWaterLevel(x, y, waterLevel - plantData.waterNeeded);
                    my.gridManager.updatePlantSprite(x, y);
                    // Store in some kind of data structure inside the command object here:
                    this.growthEvents.push({x, y});
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
        for (let i = this.growthEvents.length - 1; i >= 0; i--) {
            const {x, y} = this.growthEvents[i];
            this.undoPlantGrowth(x, y);
            my.gridManager.drawCellInfo(my.scene, x, y);
        }
    }

    undoResources(x, y){
        this.undoWaterLevel(x, y);
        this.undoSunLevel(x, y); // sun level is not accumulated, can reuse update function.
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
            const plantData = my.gridManager.getPlantAttributesByCode(plantType);

            if (growthLevel > 0) {
                my.gridManager.setGrowthLevel(x, y, growthLevel - 1);
                my.gridManager.setWaterLevel(x, y, my.gridManager.getWaterLevel(x, y) + plantData.waterNeeded);
                my.gridManager.updatePlantSprite(x, y);
            }
        }
        
    }
}