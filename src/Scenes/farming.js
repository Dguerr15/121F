class farming extends Phaser.Scene {
    constructor() {
        super("farming");
    }

    // This function defines variables
    init () 
    {
        this.playerSpeed = 3.0;
        this.dayCount = 1;
        this.carrotsInInventory = 5;
        this.distanceToCarrot = 50;
        this.cellSize = 70;
    }
    
    // This function is called once at the start and preloads all assets
    preload ()
    {
        this.load.setPath("./assets/");
        this.load.image('ground', 'ground_01.png');
        this.load.image('player', 'player_05.png');
        this.load.image('carrotFullGrown', 'tile_0056.png');
        this.load.image('carrotGrowing', 'tile_0072.png');
        this.load.image('carrotSeedling', 'tile_0088.png');
        this.load.image("roseSeedling", "tile_0089.png");
        this.load.image('cornSeedling', 'tile_0091.png');
        this.load.image('roseFullGrown', 'tile_0057.png');
        this.load.image('cornFullGrown', 'tile_0059.png');
        this.load.image('roseGrowing', 'tile_0073.png');
        this.load.image('cornGrowing', 'tile_0075.png');

    }
    
    // This function is called once at the start
    create ()
    {
        // Creating event manager
        my.eventMan = new EventManager();

        my.eventMan.on('plantGrew', this.onPlantGrew.bind(this));

        // Creating an abstract grid
        let cols = Math.floor(game.config.width / this.cellSize);
        let rows = Math.floor(game.config.height / this.cellSize);

        // Creating grid manager
        my.gridManager = new GridManager(cols, rows, this.cellSize);

        // Initialize grid manager to set up the grid
        my.gridManager.initializeGrid(cols, rows, this);

        // Creating the ground
        my.sprite.ground = this.add.sprite(game.config.width/2, game.config.height/2, 'ground');
        // Scaling the ground
        my.sprite.ground.setScale(23.0);

        // Drawing a grid
        this.drawGrid(this.cellSize);

        // Creating the player
        my.sprite.player = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'player');
        my.sprite.player.setOrigin(0, 0);

        // Creating text for day count
        my.text.dayCount = this.add.text(10, 10, 'Day: ' + this.dayCount, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
    
        // Creating text for carrots in inventory
        my.text.carrotsInInventory = this.add.text(10, 50, 'Carrots: ' + this.carrotsInInventory, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });

        // Creating WASD keys for player movement
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Creating spacebar for advancing time
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Creating E key for picking up carrots
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Creating Q key for planting carrots
        this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        // Carrot group
        this.carrots = this.add.group();
    }

    // This function is called each frame
    update ()
    {
        this.movePlayer();      // Function for player movement
        this.advanceTime();     // Function for advancing time by 1 day
        this.pickUpCarrot();    // Function for picking up carrots
        this.plantCarrot();     // Function for planting carrots
    }

    // This function creates a 2D grid over the game
    drawGrid(cellSize) {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xffffff, 0.2); // Set line color (white) and transparency

        // Vertical lines
        for (let x = 0; x < game.config.width; x += cellSize) {
            graphics.beginPath();
            graphics.moveTo(x, 0);
            graphics.lineTo(x, game.config.height);
            graphics.strokePath();
        }

        // Horizontal lines
        for (let y = 0; y < game.config.height; y += cellSize) {
            graphics.beginPath();
            graphics.moveTo(0, y);
            graphics.lineTo(game.config.width, y);
            graphics.strokePath();
        }
    }
    
    // This function handles movement for the player
    movePlayer() 
    {
        this.moveX = 0;
        this.moveY = 0;

        if (this.aKey.isDown) {
            this.moveX -= 1;
        }
        if (this.dKey.isDown) {
            this.moveX += 1;
        }

        if (this.wKey.isDown) {
            this.moveY -= 1;
        }
        if (this.sKey.isDown) {
            this.moveY += 1;
        }

        my.sprite.player.x += this.moveX * this.playerSpeed;
        my.sprite.player.y += this.moveY * this.playerSpeed;

        // Clamp the player's position to the screen bounds
        my.sprite.player.x = Phaser.Math.Clamp(my.sprite.player.x, 0, this.sys.game.config.width);
        my.sprite.player.y = Phaser.Math.Clamp(my.sprite.player.y, 0, this.sys.game.config.height);
    }

    // This function allows the player to pick up carrots with the e key
    pickUpCarrot() {
        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            let closestCarrot = null;
            let closestDistance = Infinity;
    
            // Find the closest carrot
            this.carrots.getChildren().forEach(carrot => {
                const distance = Phaser.Math.Distance.Between(
                    my.sprite.player.x + my.sprite.player.displayWidth / 2, // Use player sprite center
                    my.sprite.player.y + my.sprite.player.displayHeight / 2,
                    carrot.x,
                    carrot.y
                );
    
                if (distance < this.distanceToCarrot && (distance < closestDistance || (distance === closestDistance && carrot.x > (closestCarrot?.x || -Infinity)))) { // Prefer the one to the right
                    closestCarrot = carrot;
                    closestDistance = distance;
                }
            });
    
            // Pick up the closest carrot if found
            if (closestCarrot) {
                this.carrotsInInventory++;
                my.text.carrotsInInventory.setText('Carrots: ' + this.carrotsInInventory);
    
                // Destroy the carrot sprite
                closestCarrot.destroy();
    
                // Remove the plant from the grid
                const gridX = Phaser.Math.Clamp(Math.floor(closestCarrot.x / this.cellSize), 0, my.gridManager.gridWidth - 1);
                const gridY = Phaser.Math.Clamp(Math.floor(closestCarrot.y / this.cellSize), 0, my.gridManager.gridHeight - 1);
    
                const cell = my.gridManager.grid[gridX][gridY];
                if (cell.plant) {
                    my.gridManager.pickUpPlant(gridX, gridY);
                    if (cell.carrotSprite === closestCarrot) {
                        cell.carrotSprite = null;
                    }
                }
            }
        }
    }
    
    plantCarrot() {
        if (Phaser.Input.Keyboard.JustDown(this.qKey) && this.carrotsInInventory > 0) {
            // Calculate the center position of the player sprite
            const playerCenterX = my.sprite.player.x + my.sprite.player.width / 2;
            const playerCenterY = my.sprite.player.y + my.sprite.player.height / 2;
    
            // Map the center position to the grid
            const gridX = Phaser.Math.Clamp(Math.floor(playerCenterX / this.cellSize), 0, my.gridManager.gridWidth - 1);
            const gridY = Phaser.Math.Clamp(Math.floor(playerCenterY / this.cellSize), 0, my.gridManager.gridHeight - 1);
    
            const cell = my.gridManager.grid[gridX][gridY];
            if (!cell.plant) {  // Check if the cell is empty
                // Add a visual carrot on the grid
                const x = gridX * this.cellSize + this.cellSize / 2;
                const y = gridY * this.cellSize + this.cellSize / 2;
    
                const carrot = this.physics.add.image(x, y, 'carrotSeedling');
                carrot.setScale(2.5);
                this.carrots.add(carrot);
    
                // Update inventory and plant a crop in the GridManager
                this.carrotsInInventory--;
                my.text.carrotsInInventory.setText('Carrots: ' + this.carrotsInInventory);
                my.gridManager.plantCrop(gridX, gridY, 'carrot');
    
                cell.carrotSprite = carrot; // Store sprite reference in the cell
                cell.plant = {
                    type: 'carrot',
                    growthLevel: 0,
                    sunNeeded: my.gridManager.plantTypes.carrot.sunNeeded,
                    waterNeeded: my.gridManager.plantTypes.carrot.waterNeeded
                };
            }
        }
    }
    

    // This function is called when a plant grows
    onPlantGrew(data) {
        const { x, y, growthLevel, plantType } = data;
    
        // Find the corresponding carrot sprite
        const cell = my.gridManager.grid[x][y];
        const carrotSprite = cell.carrotSprite; // Assuming you stored it during planting
    
        if (carrotSprite) {
            let newTextureKey = '';
    
            // Determine the new texture based on growth level
            if (growthLevel === 1) {
                newTextureKey = 'carrotSeedling';
            } else if (growthLevel === 2) {
                newTextureKey = 'carrotGrowing';
            } else if (growthLevel === 3) {
                newTextureKey = 'carrotFullGrown';
            }
    
            // Update the sprite's texture
            carrotSprite.setTexture(newTextureKey);
        }
    }

    // This function advances time in the game
    advanceTime()
    {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar))
        {
            console.log("spacebar pressed");
            this.dayCount++;
            my.text.dayCount.setText('Day: ' + this.dayCount);

            // Generate resources every turn
            my.gridManager.generateResources();

            // Update plant growth
            my.gridManager.updatePlantGrowth();

            my.eventMan.endTurn();

            // Check win condition
            const win = my.gridManager.checkWinCondition(5, 3); // At least 5 plants at growth level 3
            if (win) {
                console.log("Victory! You've completed the scenario.");
            }
        }
    }
}