/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Scenes/farming.ts":
/*!*******************************!*\
  !*** ./src/Scenes/farming.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   farming: () => (/* binding */ farming)
/* harmony export */ });
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Placeholder imports or declarations for classes and enums that you reference
// You need to import or define these classes and enums from your actual project.
var EventManager = /** @class */ (function () {
    function EventManager(scene) {
    }
    EventManager.prototype.saveGame = function (slot) { };
    EventManager.prototype.loadGame = function (slot) { };
    return EventManager;
}());
var ScenarioManager = /** @class */ (function () {
    function ScenarioManager(scene) {
    }
    ScenarioManager.prototype.loadScenario = function (name) { };
    return ScenarioManager;
}());
var GridManager = /** @class */ (function () {
    function GridManager(cols, rows, cellSize) {
    }
    GridManager.prototype.initializeGrid = function (scene) { };
    GridManager.prototype.canPlant = function (x, y, plant) { return false; };
    GridManager.prototype.getPlantType = function (x, y) { return 0; };
    GridManager.prototype.getGrowthLevel = function (x, y) { return 0; };
    GridManager.prototype.checkWinCondition = function (amount, level) { return false; };
    return GridManager;
}());
var CommandManager = /** @class */ (function () {
    function CommandManager() {
    }
    CommandManager.prototype.executeCommand = function (command) { };
    CommandManager.prototype.undo = function () { };
    CommandManager.prototype.redo = function () { };
    return CommandManager;
}());
var PlantTypes;
(function (PlantTypes) {
    PlantTypes[PlantTypes["NONE"] = 0] = "NONE";
    PlantTypes[PlantTypes["CARROTS"] = 1] = "CARROTS";
    PlantTypes[PlantTypes["ROSES"] = 2] = "ROSES";
    PlantTypes[PlantTypes["CORNS"] = 3] = "CORNS";
})(PlantTypes || (PlantTypes = {}));
var AdvanceTimeCommand = /** @class */ (function () {
    function AdvanceTimeCommand() {
    }
    return AdvanceTimeCommand;
}());
var RemovePlantCommand = /** @class */ (function () {
    function RemovePlantCommand(gridX, gridY, plantTypeCode, growthLevel) {
    }
    return RemovePlantCommand;
}());
var PlantCropCommand = /** @class */ (function () {
    function PlantCropCommand(gridX, gridY, selectedPlant) {
    }
    return PlantCropCommand;
}());
// Global victory conditions
var victory_condition_amount = 9;
var victory_condition_level = 3;
// Convert the class to TypeScript
var farming = /** @class */ (function (_super) {
    __extends(farming, _super);
    function farming() {
        var _this = _super.call(this, "farming") || this;
        _this.selectedPlant = 'carrots';
        _this.saveSlots = ['saveSlot1', 'saveSlot2', 'saveSlot3'];
        _this.playerSpeed = 3.0;
        _this.dayCount = 1;
        _this.inventory = { carrots: 5, roses: 5, corns: 5 };
        _this.cellSize = 70;
        return _this;
    }
    farming.prototype.init = function () {
        this.playerSpeed = 3.0;
        this.dayCount = 1;
        this.inventory = {
            carrots: 5,
            roses: 5,
            corns: 5
        };
        this.cellSize = 70;
        // Initialize the ScenarioManager
        this.scenarioManager = new ScenarioManager(this);
        this.scenarioManager.loadScenario('scenario1'); // Load the TOML scenario file
    };
    farming.prototype.preload = function () {
        var _this = this;
        this.load.setPath("./public/assets/");
        this.load.image('ground', 'ground_01.png');
        this.load.image('player', 'player_05.png');
        // Load plant assets using a loop to reduce redundancy
        var plants = ['carrots', 'roses', 'corns'];
        var stages = ['Seedling', 'Growing', 'FullGrown'];
        plants.forEach(function (plant) {
            stages.forEach(function (stage) {
                var key = "".concat(plant).concat(stage);
                var filename = _this.getAssetFilename(plant, stage);
                _this.load.image(key, filename);
            });
        });
    };
    // Helper method to get asset filenames
    farming.prototype.getAssetFilename = function (plant, stage) {
        var filenames = {
            carrotsSeedling: 'tile_0088.png',
            carrotsGrowing: 'tile_0072.png',
            carrotsFullGrown: 'tile_0056.png',
            rosesSeedling: 'tile_0089.png',
            rosesGrowing: 'tile_0073.png',
            rosesFullGrown: 'tile_0057.png',
            cornsSeedling: 'tile_0091.png',
            cornsGrowing: 'tile_0075.png',
            cornsFullGrown: 'tile_0059.png'
        };
        return filenames["".concat(plant).concat(stage)];
    };
    farming.prototype.create = function () {
        // Initialize event manager
        my.eventMan = new EventManager(this);
        // Initialize grid manager
        var cols = Math.floor(game.config.width / this.cellSize);
        var rows = Math.floor(game.config.height / this.cellSize);
        my.gridManager = new GridManager(cols, rows, this.cellSize);
        my.gridManager.initializeGrid(this);
        // Initialize command manager.
        my.commandMan = new CommandManager();
        // Add a reference to inventory to the global context
        my.inventory = this.inventory;
        // Add a reference to the scene to the global context
        my.scene = this;
        // Create ground and player
        this.createGround();
        this.createPlayer();
        // Draw grid lines
        this.drawGrid(this.cellSize);
        // Initialize UI elements
        this.initUI();
        // Set up input controls
        this.setupInput();
        this.time.addEvent({
            delay: 5000, // 5 seconds
            callback: this.autoSavePrompt,
            callbackScope: this,
            loop: true
        });
        this.promptContinue();
    };
    farming.prototype.promptContinue = function () {
        // Check if saveSlot3 exists (this assumes you're using localStorage for persistence)
        if (localStorage.getItem('saveSlot3')) {
            var continueGame = confirm("Do you want to continue from where you left off? ");
            if (continueGame) {
                my.eventMan.loadGame('saveSlot3');
                this.updateInventory();
                console.log("Game loaded from saveSlot3");
            }
            else {
                console.log("Starting a new game...");
            }
        }
        else {
            console.log("No previous save found. Starting a new game...");
        }
    };
    // Create ground sprite
    farming.prototype.createGround = function () {
        my.sprite.ground = this.add.sprite(game.config.width / 2, game.config.height / 2, 'ground');
        my.sprite.ground.setScale(23.0);
    };
    // Create player sprite
    farming.prototype.createPlayer = function () {
        my.sprite.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'player');
        my.sprite.player.setOrigin(0, 0);
    };
    // Initialize UI elements
    farming.prototype.initUI = function () {
        var textStyle = { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' };
        my.text.dayCount = this.add.text(10, 10, "Day: ".concat(this.dayCount), textStyle);
        // Inventory text
        this.selectedPlant = 'carrots';
        my.text.inventory = this.add.text(10, 50, 'Inventory:', textStyle);
        my.text.inventoryItems = {
            carrots: this.add.text(180, 50, '', textStyle),
            corns: this.add.text(180, 90, '', textStyle),
            roses: this.add.text(180, 130, '', textStyle)
        };
        this.updateInventory();
        // Messages
        my.text.message = this.add.text(10, 170, '', { fontFamily: 'Arial', fontSize: '24px', color: '#ff0000' });
        my.text.winMessage = this.add.text(600, 300, '', { fontFamily: 'Arial', fontSize: '42px', color: '#00ff00' });
    };
    // Set up input controls
    farming.prototype.setupInput = function () {
        var _this = this;
        // Plant selection keys
        this.input.keyboard.on('keydown-ONE', function () { _this.selectPlant('carrots'); });
        this.input.keyboard.on('keydown-TWO', function () { _this.selectPlant('corns'); });
        this.input.keyboard.on('keydown-THREE', function () { _this.selectPlant('roses'); });
        // Movement keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        // Action keys
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        // Undo / redo
        this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        // Save/load keys
        this.input.keyboard.on('keydown-K', function () {
            var slot = prompt("Enter save slot number (1-3):");
            if (slot && _this.saveSlots.includes("saveSlot".concat(slot))) {
                my.eventMan.saveGame("saveSlot".concat(slot));
            }
            else {
                console.error("Invalid save slot.");
            }
        });
        this.input.keyboard.on('keydown-L', function () {
            var slot = prompt("Enter save slot number (1-3):");
            if (slot && _this.saveSlots.includes("saveSlot".concat(slot))) {
                my.eventMan.loadGame("saveSlot".concat(slot));
                _this.updateInventory();
            }
            else {
                console.error("Invalid save slot.");
            }
        });
    };
    farming.prototype.autoSavePrompt = function () {
        my.eventMan.saveGame('saveSlot3');
        console.log("Auto-saved to saveSlot3");
    };
    // Select a plant type
    farming.prototype.selectPlant = function (plant) {
        this.selectedPlant = plant;
        this.updateInventory();
    };
    // Game loop
    farming.prototype.update = function () {
        this.movePlayer();
        this.handleActions();
    };
    // Handle player actions
    farming.prototype.handleActions = function () {
        this.advanceTime();
        this.pickUpPlant();
        this.plantCrop();
        this.undoKey();
        this.redoKey();
    };
    // Create a 2D grid over the game
    farming.prototype.drawGrid = function (cellSize) {
        var graphics = this.add.graphics();
        graphics.lineStyle(1, 0xffffff, 0.2);
        // Draw vertical and horizontal lines
        for (var x = 0; x < game.config.width; x += cellSize) {
            graphics.strokeLineShape(new Phaser.Geom.Line(x, 0, x, game.config.height));
        }
        for (var y = 0; y < game.config.height; y += cellSize) {
            graphics.strokeLineShape(new Phaser.Geom.Line(0, y, game.config.width, y));
        }
    };
    // Player movement
    farming.prototype.movePlayer = function () {
        var moveX = (this.aKey.isDown ? -1 : 0) + (this.dKey.isDown ? 1 : 0);
        var moveY = (this.wKey.isDown ? -1 : 0) + (this.sKey.isDown ? 1 : 0);
        if (my.sprite.player) {
            my.sprite.player.x = Phaser.Math.Clamp(my.sprite.player.x + moveX * this.playerSpeed, 0, this.sys.game.config.width - my.sprite.player.width);
            my.sprite.player.y = Phaser.Math.Clamp(my.sprite.player.y + moveY * this.playerSpeed, 0, this.sys.game.config.height - my.sprite.player.height);
        }
    };
    // Picking up plants with the E key
    farming.prototype.pickUpPlant = function () {
        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            var _a = this.getPlayerGridPosition(), gridX = _a.gridX, gridY = _a.gridY;
            var plantTypeCode = my.gridManager.getPlantType(gridX, gridY);
            var growthLevel = my.gridManager.getGrowthLevel(gridX, gridY);
            if (plantTypeCode !== PlantTypes.NONE) {
                // Make plant command.
                var command = new RemovePlantCommand(gridX, gridY, plantTypeCode, growthLevel);
                // Execute with CommandManager (also pushes to history stack).
                my.commandMan.executeCommand(command);
                this.updateInventory();
            }
        }
    };
    // Plant crops with the Q key
    farming.prototype.plantCrop = function () {
        if (Phaser.Input.Keyboard.JustDown(this.qKey) && this.inventory[this.selectedPlant] > 0) {
            var _a = this.getPlayerGridPosition(), gridX = _a.gridX, gridY = _a.gridY;
            if (my.gridManager.canPlant(gridX, gridY, this.selectedPlant)) {
                // Make plant command
                var command = new PlantCropCommand(gridX, gridY, this.selectedPlant);
                // Execute with CommandManager (also pushes to history stack).
                my.commandMan.executeCommand(command);
                this.updateInventory();
                if (my.text.message) {
                    my.text.message.setText('');
                }
            }
            else {
                if (my.text.message) {
                    my.text.message.setText('Cannot plant here.');
                }
                this.time.delayedCall(3000, function () {
                    if (my.text.message) {
                        my.text.message.setText('');
                    }
                });
            }
        }
    };
    // Advance time in the game with the Spacebar.
    farming.prototype.advanceTime = function () {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            var command = new AdvanceTimeCommand();
            my.commandMan.executeCommand(command);
            if (my.gridManager.checkWinCondition(victory_condition_amount, victory_condition_level)) {
                this.winGame();
            }
        }
    };
    // Undo with Z
    farming.prototype.undoKey = function () {
        if (Phaser.Input.Keyboard.JustDown(this.zKey)) {
            my.commandMan.undo();
            this.updateInventory();
        }
    };
    // Redo with X
    farming.prototype.redoKey = function () {
        if (Phaser.Input.Keyboard.JustDown(this.xKey)) {
            my.commandMan.redo();
            this.updateInventory();
        }
    };
    // Update inventory display
    farming.prototype.updateInventory = function () {
        var colors = { carrots: '#ffffff', corns: '#ffffff', roses: '#ffffff' };
        colors[this.selectedPlant] = '#aaffaa';
        for (var _i = 0, _a = Object.entries(my.text.inventoryItems || {}); _i < _a.length; _i++) {
            var _b = _a[_i], plant = _b[0], textObj = _b[1];
            textObj.setText("".concat(plant.charAt(0).toUpperCase() + plant.slice(1), ": ").concat(this.inventory[plant]));
            textObj.setColor(colors[plant]);
        }
    };
    // Handle winning the game
    farming.prototype.winGame = function () {
        var _this = this;
        this.input.keyboard.enabled = false;
        if (my.text.winMessage) {
            my.text.winMessage.setText('You win!');
        }
        this.time.delayedCall(2500, function () {
            _this.input.keyboard.enabled = true;
            if (my.text.winMessage) {
                my.text.winMessage.setText('');
            }
            _this.scene.restart();
        });
    };
    // Get player's current grid position
    farming.prototype.getPlayerGridPosition = function () {
        if (my.sprite.player) {
            var playerCenterX = my.sprite.player.x + my.sprite.player.width / 2;
            var playerCenterY = my.sprite.player.y + my.sprite.player.height / 2;
            var gridX = Math.floor(playerCenterX / this.cellSize);
            var gridY = Math.floor(playerCenterY / this.cellSize);
            return { gridX: gridX, gridY: gridY };
        }
        return { gridX: 0, gridY: 0 };
    };
    return farming;
}(Phaser.Scene));



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SCALE: () => (/* binding */ SCALE),
/* harmony export */   game: () => (/* binding */ game),
/* harmony export */   my: () => (/* binding */ my)
/* harmony export */ });
/* harmony import */ var _src_Scenes_farming__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/Scenes/farming */ "./src/Scenes/farming.ts");

var my = {
    sprite: {},
    text: {},
    vfx: {},
    grid: {},
    eventMan: {}
};
// Game configuration
var config = {
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
    scene: [_src_Scenes_farming__WEBPACK_IMPORTED_MODULE_0__.farming]
};
// Define scale globally for reuse
var SCALE = 2.0;
// Create the Phaser game instance
var game = new Phaser.Game(config);


})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map