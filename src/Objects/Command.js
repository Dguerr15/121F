class Command {
    execute() { throw new Error("execute() must be implemented"); }
    undo() { throw new Error("undo() must be implemented"); }
    serialize() { throw new Error("serialize() must be implemented"); }
}

class PlantCropCommand {
    constructor(gridManager, gridX, gridY, plantName) {
        this.gridManager = gridManager; // Reference to the grid manager
        this.gridX = gridX; // X position of the crop
        this.gridY = gridY; // Y position of the crop
        this.plantName = plantName // Type of crop to plant
    }

    execute() {
        this.gridManager.plantCrop(this.gridX, this.gridY, this.plantName, my.scene); // Plant the crop
        my.inventory[this.plantName]--;
    }

    undo() {
        my.inventory[this.plantName]++;
        this.gridManager.removePlant(this.gridX, this.gridY); // Reverse by removing the crop
    }

    serialize() {
        return {
            command: "PlantCropCommand",
            gridX: this.gridX,
            gridY: this.gridY,
            plantName: this.plantName
        };
    }

    static deserialize(gridManager, data) {
        return new PlantCropCommand(gridManager, data.gridX, data.gridY, data.plantName);

    }
}

class RemovePlantCommand {
    constructor(gridManager, gridX, gridY, plantTypeCode, growthLevel) {
        this.gridManager = gridManager;
        this.gridX = gridX;
        this.gridY = gridY;
        this.plantTypeCode = plantTypeCode;
        this.growthLevel = growthLevel;
    }

    execute() {
        const plantType = this.gridManager.getPlantTypeName(this.plantTypeCode);
        my.inventory[plantType]++;
        this.gridManager.removePlant(this.gridX, this.gridY);
    }

    undo() {
        const plantType = this.gridManager.getPlantTypeName(this.plantTypeCode);
        // Replant the crop.
        this.gridManager.plantCrop(this.gridX, this.gridY, plantType, my.scene);
        // Decrement inventory.
        my.inventory[plantType]--;
        // Update growth level
        this.gridManager.setGrowthLevel(this.gridX, this.gridY, this.growthLevel);
        this.gridManager.updatePlantSprite(this.gridX, this.gridY);
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

    static deserialize(gridManager, data) {
        return new RemovePlantCommand(gridManager, data.gridX, data.gridY, data.plantTypeCode, data.growthLevel);
    }
}