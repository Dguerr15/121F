class CommandManager {
    constructor(gridManager) {
        this.gridManager = gridManager; // The gridManager to manipulate
        this.history = [];
        this.redoStack = [];
    }

    executeCommand(command) {
        command.execute();
        this.history.push(command);
        this.redoStack = []; // Clear redo stack on new command
    }

    undo() {
        if (this.history.length > 0) {
            const command = this.history.pop();
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            const command = this.redoStack.pop();
            command.execute();
            this.history.push(command);
        }
    }

    serialize() {
        // Chat code.
        // return this.history.map(cmd => cmd.serialize());
    }

    deserialize(data) {
        // Chat code.
        // this.history = data.map(serializedCmd => {
        //     if (serializedCmd.command === "PlantCropCommand") {
        //         return PlantCropCommand.deserialize(this.gridManager, serializedCmd);
        //     } else if (serializedCmd.command === "RemovePlantCommand") {
        //         return RemovePlantCommand.deserialize(this.gridManager, serializedCmd);
        //     }
        // });
    }
}