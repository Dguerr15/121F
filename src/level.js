
import { Scene, Label, Font, FontUnit, Color, Actor, vec, Keys, Timer } from "excalibur";
import { Player } from "./player.js";
import { GroundTile } from "./groundTile.js";
import { my } from "./Globals.js";


import { PlantCropCommand, RemovePlantCommand, AdvanceTimeCommand } from "./Objects/Command.js";
import { EventManager } from "./Objects/EventManager.js";
import { CommandManager } from "./Objects/CommandManager.js";
import { GridManager } from "./Objects/GridManager.js";
import { ScenarioManager } from "./Objects/ScenarioManager.js";

// global variables
let victory_condition_amount = 9
let victory_condition_level = 3

// Enumeration for plant types
const PlantTypes = {
    NONE: 0,
    CARROTS: 1,
    ROSES: 2,
    CORNS: 3
};

const language = {
    "en": {
        "carrots": "carrots",
        "roses": "roses",
        "corns": "corns"
    },
    "ar": {
        "carrots": "جزر",
        "roses": "ورود",
        "corns": "ذرة"
    },
    "zh": {
        "carrots": "胡萝卜",
        "roses": "玫瑰",
        "corns": "玉米"
    },
};

export class MyLevel extends Scene {
    onInitialize(engine) {
        // Scene.onInitialize is where we recommend you perform the composition for your game
        const player = new Player();
        this.add(player); // Actors need to be added to a scene to be drawn

        this.saveSlots = ['saveSlot1', 'saveSlot2', 'saveSlot3'];

        this.dayCount = 1;
        this.inventory = {
            carrots: 5,
            roses: 5,
            corns: 5
        };

        this.initUI();

        this.cellSize = 64;
        this.gridWidth = 31;
        this.gridHeight = 18;
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

        //init special events
        my.specialEvents = {};


        //scenario manager
        my.scenarioManager = new ScenarioManager(this);
        my.scenarioManager.loadScenario('scenario1');
        console.log("inventory", this.inventory);

        this.setupButtonControls(engine);
    }

    onActivate(context) {
        // Called when Excalibur transitions to this scene
        // Only 1 scene is active at a time

        // Draw grid lines on z 2
        this.drawGrid (this.cellSize, this.gridWidth * this.cellSize, this.gridHeight * this.cellSize, this);
        
        my.scene = this;
        my.scene.width = this.gridWidth * this.cellSize;
        my.scene.height = this.gridHeight * this.cellSize

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
        // Every 2 seconds, save the game to the autosave slot 3.
        const autoSaveTimer = new Timer({
            interval: 2000,
            fcn: () => {
                this.updateInventory();
                this.autoSavePrompt();
            },
            repeats: true
        });

        this.add(autoSaveTimer);
        autoSaveTimer.start();

        // Prompt to continue game from autosave
        this.promptContinue();
    }

    onPreUpdate(engine, elapsedMs) {
        // Called before anything updates in the scene
    }

    onPostUpdate(engine, elapsedMs) {
        // Called after everything updates in the scene
        this.handlePlantSelectionKeys(engine);
        this.handlePlantingKeys(engine);
        this.handleAdvanceTimeKey(engine);
        this.handleUndoRedoKeys(engine);
        this.handleSaveLoadKeys(engine);
    }

    setupButtonControls(engine) {
        const stepSize = 10; // Amount to move with each button press

        // Movement buttons
        document.getElementById("move-up").addEventListener("click", () => {
            my.player.pos.y -= stepSize;
        });

        document.getElementById("move-down").addEventListener("click", () => {
            my.player.pos.y += stepSize;
        });

        document.getElementById("move-left").addEventListener("click", () => {
            my.player.pos.x -= stepSize;
        });

        document.getElementById("move-right").addEventListener("click", () => {
            my.player.pos.x += stepSize;
        });

        // Planting and picking up
        document.getElementById("plant-crop").addEventListener("click", () => this.plantCrop());
        document.getElementById("pick-up").addEventListener("click", () => this.pickUpPlant());

        // Selecting plants
        document.getElementById("select-carrots").addEventListener("click", () => {
            this.selectPlant("carrots");
            this.updateInventory();
        });
        document.getElementById("select-roses").addEventListener("click", () => {
            this.selectPlant("roses");
            this.updateInventory();
        });
        document.getElementById("select-corns").addEventListener("click", () => {
            this.selectPlant("corns");
            this.updateInventory();
        });

        // Time advance
        document.getElementById("advance-time").addEventListener("click", () => {
            this.advanceTime();
        });

        // Save/Load
        document.getElementById("save-game").addEventListener("click", () => {
            this.saveGame();
        });

        document.getElementById("load-game").addEventListener("click", () => {
            this.loadGame();
        });

        // Undo/Redo
        document.getElementById("undo").addEventListener("click", () => {
            this.undoCommand();
        });

        document.getElementById("redo").addEventListener("click", () => {
            this.redoCommand();
        });
    }

    handleSaveLoadKeys(engine) {
        if (engine.input.keyboard.wasPressed(Keys.K)) {
            // save
            this.saveGame();
        }
        if (engine.input.keyboard.wasPressed(Keys.L)) {
            // load
            this.loadGame();
        }
    }

    handleUndoRedoKeys(engine) {
        if (engine.input.keyboard.wasPressed(Keys.Z)) {
            this.undoCommand();
        }
        if (engine.input.keyboard.wasPressed(Keys.X)) {
            this.redoCommand();
        }   
    }

    handleAdvanceTimeKey(engine) {
        if (engine.input.keyboard.wasPressed(Keys.Space)) {
            this.advanceTime();
        }
    }

    advanceTime() {
        const command = new AdvanceTimeCommand();
        my.commandMan.executeCommand(command);
        if (my.gridManager.checkWinCondition(victory_condition_amount, victory_condition_level)) {
            this.winGame();
        }
    }

    promptContinue() {
        // Check if saveSlot3 exists
        if (localStorage.getItem('saveSlot3')) {
            const continueGame = window.confirm("Do you want to continue from where you left off?");
            if (continueGame) {
                my.eventMan.loadGame('saveSlot3');
                this.updateInventory();
            }
        }
    }

    autoSavePrompt() {
        my.eventMan.saveGame('saveSlot3');
    }
    
    // Handle winning the game
    winGame() {
        this.input.keyboard.enabled = false;
        this.winMessageText.text = 'You win!\nLoad from save to continue.';
    }

    handlePlantingKeys(engine) {
        if (engine.input.keyboard.wasPressed(Keys.Q)) {
            // plant selected plant
            this.plantCrop();
        }
        if (engine.input.keyboard.wasPressed(Keys.E)) {
            // pick up plant
            this.pickUpPlant();
        }
    }

    plantCrop(){
        if (this.inventory[this.selectedPlant] <= 0) {
            return;
        }
        const { gridX, gridY } = this.getPlayerGridPosition();

        if (my.gridManager.canPlant(gridX, gridY, this.selectedPlant)){
            // Make plant command
            const command = new PlantCropCommand(gridX, gridY, this.selectedPlant);
            // Execute with CommandManager (also pushes to history stack).
            my.commandMan.executeCommand(command);
            
            this.updateInventory();
        } else {
            this.messageText.text = ('Cannot plant here.');
            const messageTimer = new Timer({
                interval: 2000,
                fcn: () => {
                    this.messageText.text = ('');
                },
                repeats: false
            });
            this.add(messageTimer);
            messageTimer.start();
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

    handlePlantSelectionKeys(engine) {
        if (engine.input.keyboard.wasPressed(Keys.Digit1)) {
            this.selectPlant('carrots');
            this.updateInventory();
        }
        if (engine.input.keyboard.wasPressed(Keys.Digit2)) {
            this.selectPlant('roses');
            this.updateInventory();
        }
        if (engine.input.keyboard.wasPressed(Keys.Digit3)) {
            this.selectPlant('corns');
            this.updateInventory();
        }
    }

    selectPlant(plant){
        this.selectedPlant = plant;
        this.updateInventory();
    }

    updateInventory(){
        const lang = localStorage.getItem('language');
        const colors = { carrots: '#ffffff', corns: '#ffffff', roses: '#ffffff' };
        colors[this.selectedPlant] = '#aaffaa';
        for (const key in this.inventoryText) {
            this.inventoryText[key].font.color = colors[key];
            this.inventoryText[key].text = `${language[lang][key]}: ${this.inventory[key]}`;
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

        this.messageText = null;
        this.initMessageText();

        this.winMessageText = null;
        this.initWinMessageText();
    }

    updateDayCountText(){
        this.dayCountText.text = `Day: ${this.dayCount}`;
    }

    initDayCountText(){
        this.dayCountText = new Label({
            text: `Day: ${this.dayCount}`,
            pos: vec(10, this.textHeight),
            font: new Font({
                family: 'impact',
                size: 24,
                unit: FontUnit.Px,
                color: '#ffffff'
            }),
            z: 5
            });
        this.add (this.dayCountText);
        this.textHeight += this.textHeightIncrement;
    }

    initInventoryDisplay() {
        const currentLang = language['en']; // Replace 'en' with dynamic language selection if needed
    
        this.inventoryText.carrots = new Label({
            text: `${currentLang['carrots']}: ${this.inventory['carrots']}`,
            pos: vec(10, this.textHeight),
            font: new Font({
                family: 'impact',
                size: 24,
                unit: FontUnit.Px,
                color: '#ffffff'
            }),
            z: 5
        });
        this.add(this.inventoryText.carrots);
        this.textHeight += this.textHeightIncrement;
    
        this.inventoryText.roses = new Label({
            text: `${currentLang['roses']}: ${this.inventory['roses']}`,
            pos: vec(10, this.textHeight),
            font: new Font({
                family: 'impact',
                size: 24,
                unit: FontUnit.Px,
                color: '#ffffff'
            }),
            z: 5
        });
        this.add(this.inventoryText.roses);
        this.textHeight += this.textHeightIncrement;
    
        this.inventoryText.corns = new Label({
            text: `${currentLang['corns']}: ${this.inventory['corns']}`,
            pos: vec(10, this.textHeight),
            font: new Font({
                family: 'impact',
                size: 24,
                unit: FontUnit.Px,
                color: '#ffffff'
            }),
            z: 5
        });
        this.add(this.inventoryText.corns);
        this.textHeight += this.textHeightIncrement;
    }

    initMessageText(){
        this.messageText = new Label({
            text: '',
            pos: vec(10, this.textHeight),
            font: new Font({
                family: 'impact',
                size: 24,
                unit: FontUnit.Px,
                color: '#aa0000'
            }),
            z: 5
            });
        this.add (this.messageText);
        this.textHeight += this.textHeightIncrement;
    }

    initWinMessageText(){
        const width = this.gridWidth * this.cellSize;
        console.log ("width: ", width); // test 
        const height = this.gridHeight * this.cellSize;
        console.log ("height: ", height); // test
        this.winMessageText = new Label({
            text: '',
            pos: vec(360, 300),
            font: new Font({
                family: 'impact',
                size: 24,
                unit: FontUnit.Px,
                color: '#44dd44'
            }),
            z: 5
            });
        this.add (this.winMessageText);
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

    // New helper methods to replicate keyboard logic for save/load/undo/redo
    saveGame() {
        const slot = prompt("Enter save slot number (1-3):");
        if (slot && this.saveSlots.includes(`saveSlot${slot}`)) {
            my.eventMan.saveGame(`saveSlot${slot}`);
        } else {
            console.error("Invalid save slot.");
        }
    }

    loadGame() {
        const slot = prompt("Enter save slot number (1-3):");
        if (slot && this.saveSlots.includes(`saveSlot${slot}`)) {
            my.eventMan.loadGame(`saveSlot${slot}`);
            this.updateInventory();
        } else {
            console.error("Invalid save slot.");
        }
    }

    undoCommand() {
        my.commandMan.undo();
        this.updateInventory();
    }

    redoCommand() {
        my.commandMan.redo();
        this.updateInventory();
    }

    onPreLoad(loader) {
        // Add any scene specific resources to load
    }

    onDeactivate(context) {
        // Called when Excalibur transitions away from this scene
    }

    onPreDraw(ctx, elapsedMs) {
        // Called before Excalibur draws to the screen
    }

    onPostDraw(ctx, elapsedMs) {
        // Called after Excalibur draws to the screen
    }
}