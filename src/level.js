
import { Scene, Label, Font, FontUnit, Color, Actor, vec, Keys } from "excalibur";
import { Player } from "./player.js";
import { GroundTile } from "./groundTile.js";
import { my } from "./Globals.js";

import { EventManager } from "./Objects/EventManager.js";
import { CommandManager } from "./Objects/CommandManager.js";
import { GridManager } from "./Objects/GridManager.js";

export class MyLevel extends Scene {
    onInitialize(engine) {
        // Scene.onInitialize is where we recommend you perform the composition for your game
        const player = new Player();
        this.add(player); // Actors need to be added to a scene to be drawn

        this.dayCount = 1;
        this.inventory = {
            carrots: 5,
            roses: 5,
            corns: 5
        };
        this.inventoryText = {carrots: null, roses: null, corns: null};
        this.initInventoryDisplay(); // creates label objects for inventory display

        this.selectedPlant = 'carrots';

        this.cellSize = 64;
        this.gridWidth = 13;
        this.gridHeight = 10;
        for (let i = 0; i < this.gridWidth; i++) {
            for (let j = 0; j < this.gridHeight; j++) {
                const ground = new GroundTile();
                ground.pos.x = i * this.cellSize;
                ground.pos.y = j * this.cellSize;
                this.add(ground);
            }
        }

    }

    onActivate(context) {
        // Called when Excalibur transitions to this scene
        // Only 1 scene is active at a time
        console.log ("level onActivate called"); // test

        // Draw grid lines on z 2
        this.drawGrid (this.cellSize, this.gridWidth * this.cellSize, this.gridHeight * this.cellSize, this);
        
        // Initialize event manager
        my.eventMan = new EventManager(this);
        
        // Initialize grid manager
        const cols = this.gridWidth;
        const rows = this.gridHeight;
        my.gridManager = new GridManager(cols, rows, this.cellSize);
        my.gridManager.initializeGrid(this);

        // Initialize command manager. WIP*

        // Initialize scenario manager. WIP*

        // Initialize UI elements. WIP*

        // Add autosave. WIP* 

        // this.promptContinue(); WIP*

    
    }
    onPreUpdate(engine, elapsedMs) {
        // Called before anything updates in the scene
    }

    onPostUpdate(engine, elapsedMs) {
        // Called after everything updates in the scene
        this.handlePlantSelection(engine);
    }

    handlePlantSelection(engine){
        if (engine.input.keyboard.wasPressed(Keys.Key1)) {
            console.log ("ONE pressed"); // test
            this.selectPlant('carrots');
            this.updateInventory();
        }
        if (engine.input.keyboard.wasPressed(Keys.Key2)) {
            console.log ("TWO pressed"); // test 
            this.selectPlant('roses');
            this.updateInventory();
        }
        if (engine.input.keyboard.wasPressed(Keys.Key3)) {
            console.log ("THREE pressed"); // test
            this.selectPlant('corns');
            this.updateInventory();
        }
    }

    selectPlant(plant){
        this.selectedPlant = plant;
        // update inventory WIP*
    }

    updateInventory(){
        const colors = { carrots: '#ffffff', corns: '#ffffff', roses: '#ffffff' };
        colors[this.selectedPlant] = '#aaffaa';
        for (const key in this.inventoryText) {
            this.inventoryText[key].font.color = colors[key];
            this.inventoryText[key].text = `${key}: ${this.inventory[key]}`;
        }
    }

    initInventoryDisplay(){
        this.inventoryText.carrots = new Label({
            text: `Carrots: ${this.inventory['carrots']}`,
            pos: vec(10, 10),
            font: new Font({
                family: 'impact',
                size: 24,
                unit: FontUnit.Px,
                color: '#ffffff'
            }),
            z: 4
            }); 
        this.add (this.inventoryText.carrots);
        this.inventoryText.roses = new Label({
                    text: `Roses: ${this.inventory['roses']}`,
                    pos: vec(10, 90),
                    font: new Font({
                        family: 'impact',
                        size: 24,
                        unit: FontUnit.Px,
                        color: '#ffffff'
                    }),
                    z: 4
                    });
        this.add (this.inventoryText.roses);
        this.inventoryText.corns = new Label({
                    text: `Corns: ${this.inventory['corns']}`,
                    pos: vec(10, 170),
                    font: new Font({
                        family: 'impact',
                        size: 24,
                        unit: FontUnit.Px,
                        color: '#ffffff'
                    }),
                    z: 4
                    });
        this.add (this.inventoryText.corns);
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

    onPreLoad(loader) {
        // Add any scene specific resources to load
    }

    onDeactivate(context) {
        // Called when Excalibur transitions away from this scene
        // Only 1 scene is active at a time
    }

    onPreDraw(ctx, elapsedMs) {
        // Called before Excalibur draws to the screen
    }

    onPostDraw(ctx, elapsedMs) {
        // Called after Excalibur draws to the screen
    }

}