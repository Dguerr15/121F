// // commands/PassDayCommand.js
// class PassDayCommand extends Command {
//     constructor(gridManager, dayCountReference) {
//         super();
//         this.gridManager = gridManager;
//         this.dayCountReference = dayCountReference;
//     }

//     execute() {
//         this.dayCountReference++;
//         this.gridManager.endTurn();
//     }

//     undo() {
//         this.dayCountReference--;
//         this.gridManager.revertEndTurn();
//     }
// }