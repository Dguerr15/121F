
import { Scene, Label, Font, FontUnit, Color, Actor, vec, Keys } from "excalibur";
import { Player } from "./player.js";
import { GroundTile } from "./groundTile.js";
import { my } from "./Globals.js";


import { PlantCropCommand, RemovePlantCommand, AdvanceTimeCommand } from "./Objects/Command.js";
import { EventManager } from "./Objects/EventManager.js";
import { CommandManager } from "./Objects/CommandManager.js";
import { GridManager } from "./Objects/GridManager.js";

// Enumeration for plant types
const PlantTypes = {
    NONE: 0,
    CARROTS: 1,
    CORNS: 2,
    ROSES: 3
};

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

        this.initUI();

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

        my.player = player; // add player instance to the global container
        my.inventory = this.inventory; // add inventory to the global container 
    }

    onActivate(context) {
        // Called when Excalibur transitions to this scene
        // Only 1 scene is active at a time
        console.log ("level onActivate called"); // test

        // Draw grid lines on z 2
        this.drawGrid (this.cellSize, this.gridWidth * this.cellSize, this.gridHeight * this.cellSize, this);
        
        my.scene = this;

        // Initialize event manager
        my.eventMan = new EventManager(this);
        
        // Initialize grid manager
        const cols = this.gridWidth;
        const rows = this.gridHeight;
        my.gridManager = new GridManager(cols, rows, this.cellSize);
        my.gridManager.initializeGrid(this);

        // Initialize command manager. WIP*
        my.commandMan = new CommandManager();

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
        this.handlePlantSelectionKeys(engine);
        this.handlePlantingKeys(engine);
    }

    handlePlantingKeys(engine){
        if (engine.input.keyboard.wasPressed(Keys.Q)) {
            console.log ("Q pressed"); // test
            // plant selected plant
            const { gridX, gridY } = this.getPlayerGridPosition();
            console.log ("Player is at grid position: ", gridX, gridY); // test
            this.plantCrop();
        }
        if (engine.input.keyboard.wasPressed(Keys.E)) {
            console.log ("W pressed"); // test 
            // pull selected plant
            this.pickUpPlant();

        }
    }

    plantCrop(){
        if (this.inventory[this.selectedPlant] <= 0) {
            console.log ("No more plants of this type in inventory");
            return;
        }
        const { gridX, gridY } = this.getPlayerGridPosition();

        if (my.gridManager.canPlant(gridX, gridY, this.selectedPlant)){
            // Make plant command
            const command = new PlantCropCommand(gridX, gridY, this.selectedPlant);
            // Execute with CommandManager (also pushes to history stack).
            my.commandMan.executeCommand(command);
            
            this.updateInventory();
            // my.text.message.setText('');
        } else {
            // my.text.message.setText('Cannot plant here.');
            // this.time.delayedCall(3000, () => {
                // my.text.message.setText('');
        }
    }

    pickUpPlant(){
        const { gridX, gridY } = this.getPlayerGridPosition();
        const plantTypeCode = my.gridManager.getPlantType(gridX, gridY);
        const growthLevel = my.gridManager.getGrowthLevel(gridX, gridY);

        if (plantTypeCode !== PlantTypes.NONE) {
            // Make plant command.
            const command = new RemovePlantCommand(gridX, gridY, plantTypeCode, growthLevel);
            // Execute with CommandManager (also pushes to history stack).
            my.commandMan.executeCommand(command);

            this.updateInventory();
        }
    }

    handlePlantSelectionKeys(engine){
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
        console.log ("selected plant: ", this.selectedPlant); // test
        this.updateInventory();
    }

    updateInventory(){
        const colors = { carrots: '#ffffff', corns: '#ffffff', roses: '#ffffff' };
        colors[this.selectedPlant] = '#aaffaa';
        for (const key in this.inventoryText) {
            this.inventoryText[key].font.color = colors[key];
            this.inventoryText[key].text = `${key}: ${this.inventory[key]}`;
        }
    }

    initUI(){
        this.textHeight = 10;
        this.textHeightIncrement = 70;
        this.dayCountText = null;
        this.initDayCountText();

        this.inventoryText = {carrots: null, roses: null, corns: null};
        this.initInventoryDisplay(); // creates label objects for inventory display
        this.selectPlant ('carrots'); // default selected plant
    }

    initDayCountText(){
        console.log ("initDayCountText called"); // test
        this.dayCountText = new Label({
            text: `Day: ${this.dayCount}`,
            pos: vec(10, this.textHeight),
            font: new Font({
                family: 'impact',
                size: 24,
                unit: FontUnit.Px,
                color: '#ffffff'
            }),
            z: 4
            });
        this.add (this.dayCountText);
        this.textHeight += this.textHeightIncrement;
    }

    initInventoryDisplay(){
        this.inventoryText.carrots = new Label({
            text: `carrots: ${this.inventory['carrots']}`,
            pos: vec(10, this.textHeight),
            font: new Font({
                family: 'impact',
                size: 24,
                unit: FontUnit.Px,
                color: '#ffffff'
            }),
            z: 4
            }); 
        this.add (this.inventoryText.carrots);
        this.textHeight += this.textHeightIncrement;
        this.inventoryText.roses = new Label({
                    text: `roses: ${this.inventory['roses']}`,
                    pos: vec(10, this.textHeight),
                    font: new Font({
                        family: 'impact',
                        size: 24,
                        unit: FontUnit.Px,
                        color: '#ffffff'
                    }),
                    z: 4
                    });
        this.add (this.inventoryText.roses);
        this.textHeight += this.textHeightIncrement;
        this.inventoryText.corns = new Label({
                    text: `corns: ${this.inventory['corns']}`,
                    pos: vec(10, this.textHeight),
                    font: new Font({
                        family: 'impact',
                        size: 24,
                        unit: FontUnit.Px,
                        color: '#ffffff'
                    }),
                    z: 4
                    });
        this.add (this.inventoryText.corns);
        this.textHeight += this.textHeightIncrement;
    }

    getPlayerGridPosition() {
        const playerCenterX = my.player.pos.x;
        const playerCenterY = my.player.pos.y;
        const gridX = Math.floor(playerCenterX / this.cellSize);
        const gridY = Math.floor(playerCenterY / this.cellSize);
        return { gridX, gridY };
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