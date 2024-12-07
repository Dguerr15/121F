declare const Phaser: typeof import('phaser');

import { farming } from '../src/Scenes/farming';

// Game configuration type
interface GameConfig extends Phaser.Types.Core.GameConfig {
    parent: string;
    type: number;
    render: {
        pixelArt: boolean;
    };
    physics: {
        default: string;
        arcade: {
            debug: boolean;
            gravity: {
                x: number;
                y: number;
            };
        };
    };
    width: number;
    height: number;
    scene: typeof farming[];
}


// Global `my` object type
interface GlobalContext {
    sprite: Record<string, Phaser.GameObjects.Sprite | Phaser.Physics.Arcade.Sprite>;
    text: Record<string, Phaser.GameObjects.Text>;
    vfx: Record<string, any>;
    grid: Record<string, any>;
    eventMan: Record<string, any>;
    inventory?: Record<string, number>;
    scene?: farming;
    commandMan?: any;
}

const my: GlobalContext = {
    sprite: {},
    text: {},
    vfx: {},
    grid: {},
    eventMan: {}
};


// Game configuration
const config: GameConfig = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1280, // 16:9 aspect ratio
    height: 720, // 16:9 aspect ratio
    scene: [farming]
};

// Define scale globally for reuse
const SCALE = 2.0;

// Create the Phaser game instance
const game = new Phaser.Game(config);



export { SCALE, game, my};
