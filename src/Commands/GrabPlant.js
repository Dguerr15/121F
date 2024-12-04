// // commands/GrabPlantCommand.js
// class GrabPlantCommand extends Command {
//     constructor(gridManager, inventory, gridX, gridY) {
//         super();
//         this.gridManager = gridManager;
//         this.inventory = inventory;
//         this.gridX = gridX;
//         this.gridY = gridY;
//     }

//     execute() {
//         const plantTypeCode = this.gridManager.getPlantType(this.gridX, this.gridY);
//         if (plantTypeCode !== PlantTypes.NONE) {
//             const plantType = this.gridManager.getPlantTypeName(plantTypeCode);
//             this.inventory[plantType]++;
//             this.gridManager.removePlant(this.gridX, this.gridY);
//         }
//     }

//     undo() {
//         const plantType = this.gridManager.getPlantTypeName(this.gridManager.getPlantType(this.gridX, this.gridY));
//         if (plantType) {
//             this.inventory[plantType]--;
//             this.gridManager.placePlant(this.gridX, this.gridY, plantType);
//         }
//     }
// }