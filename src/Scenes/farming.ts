
// Placeholder type definitions for external references
declare const game: { config: { width: number; height: number } };
declare const my: {
    eventMan: EventManager;
    gridManager: GridManager;
    commandMan: CommandManager;
    inventory: Record<string, number>;
    scene: Phaser.Scene;
    sprite: {
        ground?: Phaser.GameObjects.Sprite;
        player?: Phaser.Physics.Arcade.Sprite;
    };
    text: {
        dayCount?: Phaser.GameObjects.Text;
        inventory?: Phaser.GameObjects.Text;
        inventoryItems?: Record<string, Phaser.GameObjects.Text>;
        message?: Phaser.GameObjects.Text;
        winMessage?: Phaser.GameObjects.Text;
    };
};

// Placeholder imports or declarations for classes and enums that you reference
// You need to import or define these classes and enums from your actual project.
class EventManager {
    constructor(scene: Phaser.Scene) {}
    saveGame(slot: string): void {}
    loadGame(slot: string): void {}
}
class ScenarioManager {
    constructor(scene: Phaser.Scene) {}
    loadScenario(name: string): void {}
}
class GridManager {
    constructor(cols: number, rows: number, cellSize: number) {}
    initializeGrid(scene: Phaser.Scene): void {}
    canPlant(x: number, y: number, plant: string): boolean { return false; }
    getPlantType(x: number, y: number): number { return 0; }
    getGrowthLevel(x: number, y: number): number { return 0; }
    checkWinCondition(amount: number, level: number): boolean { return false; }
}
class CommandManager {
    executeCommand(command: any): void {}
    undo(): void {}
    redo(): void {}
}
enum PlantTypes {
    NONE = 0,
    CARROTS = 1,
    ROSES = 2,
    CORNS = 3
}
class AdvanceTimeCommand {}
class RemovePlantCommand {
    constructor(gridX: number, gridY: number, plantTypeCode: number, growthLevel: number) {}
}
class PlantCropCommand {
    constructor(gridX: number, gridY: number, selectedPlant: string) {}
}

// Global victory conditions
let victory_condition_amount = 9;
let victory_condition_level = 3;

// Convert the class to TypeScript
export class farming extends Phaser.Scene {
    private selectedPlant: string = 'carrots';
    private saveSlots: string[] = ['saveSlot1', 'saveSlot2', 'saveSlot3'];
    private playerSpeed: number = 3.0;
    private dayCount: number = 1;
    private inventory: Record<string, number> = { carrots: 5, roses: 5, corns: 5 };
    private cellSize: number = 70;
    private scenarioManager!: ScenarioManager;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wKey!: Phaser.Input.Keyboard.Key;
    private aKey!: Phaser.Input.Keyboard.Key;
    private sKey!: Phaser.Input.Keyboard.Key;
    private dKey!: Phaser.Input.Keyboard.Key;
    private spacebar!: Phaser.Input.Keyboard.Key;
    private eKey!: Phaser.Input.Keyboard.Key;
    private qKey!: Phaser.Input.Keyboard.Key;
    private zKey!: Phaser.Input.Keyboard.Key;
    private xKey!: Phaser.Input.Keyboard.Key;

    constructor() {
        super("farming");
    }

    init(): void {
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
        this.scenarioManager.loadScenario('scenario1');  // Load the TOML scenario file
    }

    preload(): void {
        this.load.setPath("./public/assets/");
        this.load.image('ground', 'ground_01.png');
        this.load.image('player', 'player_05.png');

        // Load plant assets using a loop to reduce redundancy
        const plants = ['carrots', 'roses', 'corns'];
        const stages = ['Seedling', 'Growing', 'FullGrown'];
        plants.forEach(plant => {
            stages.forEach(stage => {
                const key = `${plant}${stage}`;
                const filename = this.getAssetFilename(plant, stage);
                this.load.image(key, filename);
            });
        });
    }

    // Helper method to get asset filenames
    private getAssetFilename(plant: string, stage: string): string {
        const filenames: Record<string, string> = {
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
        return filenames[`${plant}${stage}`];
    }

    create(): void {
        // Initialize event manager
        my.eventMan = new EventManager(this);

        // Initialize grid manager
        const cols = Math.floor(game.config.width / this.cellSize);
        const rows = Math.floor(game.config.height / this.cellSize);
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
    }

    private promptContinue(): void {
        // Check if saveSlot3 exists (this assumes you're using localStorage for persistence)
        if (localStorage.getItem('saveSlot3')) {
            const continueGame = confirm("Do you want to continue from where you left off? ");
            if (continueGame) {
                my.eventMan.loadGame('saveSlot3');
                this.updateInventory();
                console.log("Game loaded from saveSlot3");
            } else {
                console.log("Starting a new game...");
            }
        } else {
            console.log("No previous save found. Starting a new game...");
        }
    }

    // Create ground sprite
    private createGround(): void {
        my.sprite.ground = this.add.sprite(game.config.width / 2, game.config.height / 2, 'ground');
        my.sprite.ground.setScale(23.0);
    }

    // Create player sprite
    private createPlayer(): void {
        my.sprite.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'player');
        my.sprite.player.setOrigin(0, 0);
    }

    // Initialize UI elements
    private initUI(): void {
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' };
        my.text.dayCount = this.add.text(10, 10, `Day: ${this.dayCount}`, textStyle);

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
    }

    // Set up input controls
    private setupInput(): void {
        // Plant selection keys
        this.input.keyboard!.on('keydown-ONE', () => { this.selectPlant('carrots'); });
        this.input.keyboard!.on('keydown-TWO', () => { this.selectPlant('corns'); });
        this.input.keyboard!.on('keydown-THREE', () => { this.selectPlant('roses'); });

        // Movement keys
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Action keys
        this.spacebar = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.qKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        // Undo / redo
        this.zKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.xKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        // Save/load keys
        this.input.keyboard!.on('keydown-K', () => {
            const slot = prompt("Enter save slot number (1-3):");
            if (slot && this.saveSlots.includes(`saveSlot${slot}`)) {
                my.eventMan.saveGame(`saveSlot${slot}`);
            } else {
                console.error("Invalid save slot.");
            }
        });

        this.input.keyboard!.on('keydown-L', () => {
            const slot = prompt("Enter save slot number (1-3):");
            if (slot && this.saveSlots.includes(`saveSlot${slot}`)) {
                my.eventMan.loadGame(`saveSlot${slot}`);
                this.updateInventory();
            } else {
                console.error("Invalid save slot.");
            }
        });
    }

    private autoSavePrompt(): void {
        my.eventMan.saveGame('saveSlot3');
        console.log("Auto-saved to saveSlot3");
    }

    // Select a plant type
    private selectPlant(plant: string): void {
        this.selectedPlant = plant;
        this.updateInventory();
    }

    // Game loop
    update(): void {
        this.movePlayer();
        this.handleActions();
    }

    // Handle player actions
    private handleActions(): void {
        this.advanceTime();
        this.pickUpPlant();
        this.plantCrop();
        this.undoKey();
        this.redoKey();
    }

    // Create a 2D grid over the game
    private drawGrid(cellSize: number): void {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xffffff, 0.2);

        // Draw vertical and horizontal lines
        for (let x = 0; x < game.config.width; x += cellSize) {
            graphics.strokeLineShape(new Phaser.Geom.Line(x, 0, x, game.config.height));
        }
        for (let y = 0; y < game.config.height; y += cellSize) {
            graphics.strokeLineShape(new Phaser.Geom.Line(0, y, game.config.width, y));
        }
    }

    // Player movement
    private movePlayer(): void {
        const moveX = (this.aKey.isDown ? -1 : 0) + (this.dKey.isDown ? 1 : 0);
        const moveY = (this.wKey.isDown ? -1 : 0) + (this.sKey.isDown ? 1 : 0);

        if (my.sprite.player) {
            my.sprite.player.x = Phaser.Math.Clamp(
                my.sprite.player.x + moveX * this.playerSpeed,
                0,
                (this.sys.game.config.width as number) - my.sprite.player.width
            );
            my.sprite.player.y = Phaser.Math.Clamp(
                my.sprite.player.y + moveY * this.playerSpeed,
                0,
                (this.sys.game.config.height as number) - my.sprite.player.height
            );
        }
    }

    // Picking up plants with the E key
    private pickUpPlant(): void {
        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
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
    }

    // Plant crops with the Q key
    private plantCrop(): void {
        if (Phaser.Input.Keyboard.JustDown(this.qKey) && this.inventory[this.selectedPlant] > 0) {
            const { gridX, gridY } = this.getPlayerGridPosition();

            if (my.gridManager.canPlant(gridX, gridY, this.selectedPlant)) {
                // Make plant command
                const command = new PlantCropCommand(gridX, gridY, this.selectedPlant);
                // Execute with CommandManager (also pushes to history stack).
                my.commandMan.executeCommand(command);
                
                this.updateInventory();
                if (my.text.message) {
                    my.text.message.setText('');
                }
            } else {
                if (my.text.message) {
                    my.text.message.setText('Cannot plant here.');
                }
                this.time.delayedCall(3000, () => {
                    if (my.text.message) {
                        my.text.message.setText('');
                    }
                });
            }
        }
    }

    // Advance time in the game with the Spacebar.
    private advanceTime(): void {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            const command = new AdvanceTimeCommand();
            my.commandMan.executeCommand(command);
            if (my.gridManager.checkWinCondition(victory_condition_amount, victory_condition_level)) {
                this.winGame();
            }
        }
    }

    // Undo with Z
    private undoKey(): void {
        if (Phaser.Input.Keyboard.JustDown(this.zKey)) {
            my.commandMan.undo();
            this.updateInventory();
        }
    }

    // Redo with X
    private redoKey(): void {
        if (Phaser.Input.Keyboard.JustDown(this.xKey)) {
            my.commandMan.redo();
            this.updateInventory();
        }
    }

    // Update inventory display
    private updateInventory(): void {
        const colors: Record<string, string> = { carrots: '#ffffff', corns: '#ffffff', roses: '#ffffff' };
        colors[this.selectedPlant] = '#aaffaa';

        for (const [plant, textObj] of Object.entries(my.text.inventoryItems || {})) {
            textObj.setText(`${plant.charAt(0).toUpperCase() + plant.slice(1)}: ${this.inventory[plant]}`);
            textObj.setColor(colors[plant]);
        }
    }

    // Handle winning the game
    private winGame(): void {
        this.input.keyboard!.enabled = false;
        if (my.text.winMessage) {
            my.text.winMessage.setText('You win!');
        }

        this.time.delayedCall(2500, () => {
            this.input.keyboard!.enabled = true;
            if (my.text.winMessage) {
                my.text.winMessage.setText('');
            }
            this.scene.restart();
        });
    }

    // Get player's current grid position
    private getPlayerGridPosition(): { gridX: number; gridY: number } {
        if (my.sprite.player) {
            const playerCenterX = my.sprite.player.x + my.sprite.player.width / 2;
            const playerCenterY = my.sprite.player.y + my.sprite.player.height / 2;
            const gridX = Math.floor(playerCenterX / this.cellSize);
            const gridY = Math.floor(playerCenterY / this.cellSize);
            return { gridX, gridY };
        }
        return { gridX: 0, gridY: 0 };
    }
}
