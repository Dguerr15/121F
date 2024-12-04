class Command {
    execute() { throw new Error("execute() must be implemented"); }
    undo() { throw new Error("undo() must be implemented"); }
    serialize() { throw new Error("serialize() must be implemented"); }
}

class PlantCropCommand {
    constructor(gridManager, position, cropType) {
        this.gridManager = gridManager; // Reference to the grid manager
        this.position = position;      // Position to plant the crop
        this.cropType = cropType;      // Type of crop to plant
    }

    execute() {
        this.gridManager.plantCrop(this.position, this.cropType); // Plant the crop
    }

    undo() {
        this.gridManager.removePlant(this.position); // Reverse by removing the crop
    }

    serialize() {

    }

    static deserialize(gridManager, data) {

    }
}

class RemovePlantCommand {
    constructor(gridManager, position) {
        this.gridManager = gridManager;
        this.position = position;
        this.removedCrop = null; // Will hold details of the removed crop
    }

    execute() {
        this.removedCrop = this.gridManager.getCrop(this.position); // Save the crop being removed
        this.gridManager.removePlant(this.position); // Remove the crop
    }

    undo() {
        if (this.removedCrop) {
            this.gridManager.plantCrop(this.position, this.removedCrop); // Replant the crop
        }
    }

    serialize() {

    }

    static deserialize(gridManager, data) {
        
    }
}