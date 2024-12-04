class Command {
    execute() { throw new Error("execute() must be implemented"); }
    undo() { throw new Error("undo() must be implemented"); }
    serialize() { throw new Error("serialize() must be implemented"); }
}

class PlantCropCommand {
    constructor(gridManager, gridX, gridY, plantName, inventory, scene) {
        this.gridManager = gridManager; // Reference to the grid manager
        this.gridX = gridX; // X position of the crop
        this.gridY = gridY; // Y position of the crop
        this.plantName = plantName // Type of crop to plant
        this.inventory = inventory; // Reference to the inventory
        this.scene = scene; // Reference to the scene
    }

    execute() {
        this.gridManager.plantCrop(this.gridX, this.gridY, this.plantName, this.scene); // Plant the crop
        this.inventory[this.plantName]--;
    }

    undo() {
        this.inventory[this.plantName]++;
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
    constructor(gridManager, gridX, gridY, plantTypeCode, growthLevel, inventory, scene) {
        this.gridManager = gridManager;
        this.gridX = gridX;
        this.gridY = gridY;
        this.plantTypeCode = plantTypeCode;
        this.growthLevel = growthLevel;
        this.inventory = inventory;
        this.scene = scene;
    }

    execute() {
        const plantType = this.gridManager.getPlantTypeName(this.plantTypeCode);
        this.inventory[plantType]++;
        this.gridManager.removePlant(this.gridX, this.gridY);
    }

    undo() {
        const plantType = this.gridManager.getPlantTypeName(this.plantTypeCode);
        // Replant the crop.
        this.gridManager.plantCrop(this.gridX, this.gridY, plantType, this.scene);
        // Decrement inventory.
        this.inventory[plantType]--;
        // Update growth level
        this.gridManager.setGrowthLevel(this.gridX, this.gridY, this.growthLevel);
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
        
    }
}