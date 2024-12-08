
import { Scene, Color, Actor, vec } from "excalibur";
import { Player } from "./player.js";
import { GroundTile } from "./groundTile.js";

export class MyLevel extends Scene {
    onInitialize(engine) {
        // Scene.onInitialize is where we recommend you perform the composition for your game
        const player = new Player();
        this.add(player); // Actors need to be added to a scene to be drawn

        this.cellSize = 64;
        this.gridWidth = 17;
        this.gridHeight = 11;
        for (let i = 0; i < this.gridWidth; i++) {
            for (let j = 0; j < this.gridHeight; j++) {
                const ground = new GroundTile();
                ground.pos.x = i * this.cellSize;
                ground.pos.y = j * this.cellSize;
                this.add(ground);
            }
        }
    }

    onPreLoad(loader) {
        // Add any scene specific resources to load
    }

    onActivate(context) {
        // Called when Excalibur transitions to this scene
        // Only 1 scene is active at a time

        console.log ("level onActivate called");
        this.drawGrid (this.cellSize, this.gridWidth * this.cellSize, this.gridHeight * this.cellSize, this);
    }

    onDeactivate(context) {
        // Called when Excalibur transitions away from this scene
        // Only 1 scene is active at a time
    }

    onPreUpdate(engine, elapsedMs) {
        // Called before anything updates in the scene
    }

    onPostUpdate(engine, elapsedMs) {
        // Called after everything updates in the scene
    }

    onPreDraw(ctx, elapsedMs) {
        // Called before Excalibur draws to the screen
    }

    onPostDraw(ctx, elapsedMs) {
        // Called after Excalibur draws to the screen
    }

    drawGrid(cellSize, gameWidth, gameHeight, scene) {
        // Create vertical lines
        for (let x = 0; x < gameWidth; x += cellSize) {
          const verticalLine = new Actor({
            pos: vec(x, gameHeight                       / 2), // Center the line vertically
            width: 1,                      // Line thickness
            height: gameHeight,            // Full height of the screen
            z: 2,
            color: Color.Black // Black color with transparency
          });
          scene.add(verticalLine);
        }
      
        // Create horizontal lines
        for (let y = 0; y < gameHeight; y += cellSize) {
          const horizontalLine = new Actor({
            pos: vec(gameWidth / 2, y),  // Center the line horizontally
            width: gameWidth,              // Full width of the screen
            height: 1,                     // Line thickness
            z: 2, 
            color: Color.Black // Black color with transparency
          });
          scene.add(horizontalLine);
        }
    }
}