// src/Objects/globals.ts
import Phaser from 'phaser';
import { GridManager } from './GridManager';
import { EventManager } from './EventManager';
import { CommandManager } from './CommandManager';
import { farming } from '../Scenes/farming';



// Define the `my` global context
interface MyGlobals {
    eventMan?: EventManager;
    gridManager?: GridManager;
    commandMan?: CommandManager;
    inventory?: Record<string, number>;
    sprite?: Record<string, Phaser.GameObjects.Sprite>;
    text?: {
        dayCount?: Phaser.GameObjects.Text;
        message?: Phaser.GameObjects.Text;
        winMessage?: Phaser.GameObjects.Text;
        inventory?: Phaser.GameObjects.Text;
        inventoryItems?: Record<string, Phaser.GameObjects.Text>;
    };
    scene?: farming;
}

const my: MyGlobals = {
    eventMan: undefined,
    gridManager: undefined,
    commandMan: undefined,
    inventory: {},
    sprite: {},
    text: {
        dayCount: undefined,
        message: undefined,
        winMessage: undefined,
        inventory: undefined,
        inventoryItems: {}
    },
    scene: undefined
};

export { my };

// Global `my` object type
// interface GlobalContext {
//     sprite: Record<string, Phaser.GameObjects.Sprite | Phaser.Physics.Arcade.Sprite>;
//     text: Record<string, Phaser.GameObjects.Text>;
//     vfx: Record<string, any>;
//     grid: Record<string, any>;
//     eventMan: Record<string, any>;
//     inventory?: Record<string, number>;
//     scene?: farming;
//     commandMan?: any;
// }

// const my: GlobalContext = {
//     sprite: {},
//     text: {},
//     vfx: {},
//     grid: {},
//     eventMan: {}
// };