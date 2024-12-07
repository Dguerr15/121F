
// import { PlantCropCommand, RemovePlantCommand, AdvanceTimeCommand } from './commands';
// import { Command } from './Command';

// Placeholder types for CommandData and Command if not already defined
interface CommandData {
    command: string;
    [key: string]: any;
}

interface Command {
    execute(): void;
    undo(): void;
    serialize(): CommandData;
    // static deserialize(data: CommandData): Command; // Implemented in each subclass
}

declare const PlantCropCommand: {
    deserialize(data: CommandData): Command;
};
declare const RemovePlantCommand: {
    deserialize(data: CommandData): Command;
};
declare const AdvanceTimeCommand: {
    deserialize(data: CommandData): Command;
};

export class CommandManager {
    private history: Command[];
    private redoStack: Command[];

    constructor() {
        this.history = [];
        this.redoStack = [];
    }

    executeCommand(command: Command): void {
        command.execute();
        this.history.push(command);
        this.redoStack = []; // Clear redo stack on new command
    }

    undo(): void {
        if (this.history.length > 0) {
            const command = this.history.pop()!;
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo(): void {
        if (this.redoStack.length > 0) {
            const command = this.redoStack.pop()!;
            command.execute();
            this.history.push(command);
        }
    }

    serializeHistory(): CommandData[] {
        return this.history.map(cmd => cmd.serialize());
    }

    serializeRedoStack(): CommandData[] {
        return this.redoStack.map(cmd => cmd.serialize());
    }

    deserialize(data: CommandData[]): void {
        this.history = data.map((cmdData) => {
            let command: Command;
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

    deserializeRedoStack(data: CommandData[]): void {
        this.redoStack = data.map((cmdData) => {
            let command: Command;
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
