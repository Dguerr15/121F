// // commands/PlantCommand.js
// class PlantCommand extends Command {
//     constructor(gridManager, inventory, gridX, gridY, plantType) {
//         super();
//         this.gridManager = gridManager;
//         this.inventory = inventory;
//         this.gridX = gridX;
//         this.gridY = gridY;
//         this.plantType = plantType;
//     }

//     execute() {
//         if (this.inventory[this.plantType] > 0 && this.gridManager.canPlant(this.gridX, this.gridY, this.plantType)) {
//             this.gridManager.plantCrop(this.gridX, this.gridY, this.plantType);
//             this.inventory[this.plantType]--;
//         }
//     }

//     undo() {
//         this.gridManager.removePlant(this.gridX, this.gridY);
//         this.inventory[this.plantType]++;
//     }
// }