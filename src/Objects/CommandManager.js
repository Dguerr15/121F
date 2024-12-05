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

    serializeHistory() {
        // Chat code.
        return this.history.map(cmd => cmd.serialize());
    }

    serializeRedoStack() {
        // Chat code.
        return this.redoStack.map(cmd => cmd.serialize());
    }

    deserialize(data) {
        // Ensure that we are iterating over the data array.
        this.history = data.map((cmdData) => {  // Correctly map over the data
            let command;
            switch (cmdData.command) {
                case "PlantCropCommand":
                    command = PlantCropCommand.deserialize(cmdData);
                    break;
                case "RemovePlantCommand":
                    command = RemovePlantCommand.deserialize(cmdData);
                    break;
                case "AdvanceTimeCommand":
                    command = AdvanceTimeCommand.deserialize(cmdData);
                    break;
                // Add more cases for other command types if necessary
                default:
                    throw new Error(`Unknown command type: ${cmdData.command}`);
            }
            return command;
        });
    }

    deserializeRedoStack(data){
        this.redoStack = data.map((cmdData) => {  // Correctly map over the data
            let command;
            switch (cmdData.command) {
                case "PlantCropCommand":
                    command = PlantCropCommand.deserialize(cmdData);
                    break;
                case "RemovePlantCommand":
                    command = RemovePlantCommand.deserialize(cmdData);
                    break;
                case "AdvanceTimeCommand":
                    command = AdvanceTimeCommand.deserialize(cmdData);
                    break;
                // Add more cases for other command types if necessary
                default:
                    throw new Error(`Unknown command type: ${cmdData.command}`);
            }
            return command;
        });
    }
}