// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
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
    width: 1280,  // 16:9 aspect ratio
    height: 720,  // 16:9 aspect ratio
    scene: [farming]
}

const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}, grid: {}};

const game = new Phaser.Game(config);