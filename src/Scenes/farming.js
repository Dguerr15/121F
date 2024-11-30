class farming extends Phaser.Scene {
    constructor() {
        super("farming");
        this.selectedPlant = 'carrots';
    }

    // Define variables
    init() {
        this.playerSpeed = 3.0;
        this.dayCount = 1;
        this.inventory = {
            carrots: 5,
            roses: 5,
            corns: 5
        };
        this.distanceToPlant = 50;
        this.cellSize = 70;
    }
    
    // Preload assets
    preload () {
        this.load.setPath("./assets/");
        this.load.image('ground', 'ground_01.png');
        this.load.image('player', 'player_05.png');
        // Carrot Assets
        this.load.image('carrotsFullGrown', 'tile_0056.png');
        this.load.image('carrotsGrowing', 'tile_0072.png');
        this.load.image('carrotsSeedling', 'tile_0088.png');
        // Rose Assets
        this.load.image("rosesSeedling", 'tile_0089.png');
        this.load.image('rosesFullGrown', 'tile_0057.png');
        this.load.image('rosesGrowing', 'tile_0073.png');
        // Corn Assets
        this.load.image('cornsSeedling', 'tile_0091.png');
        this.load.image('cornsFullGrown', 'tile_0059.png');
        this.load.image('cornsGrowing', 'tile_0075.png');
    }
    
    // Create game objects
    create () {
        // Creating event manager
        my.eventMan = new EventManager();

        // Creating an abstract grid
        let cols = Math.floor(game.config.width / this.cellSize);
        let rows = Math.floor(game.config.height / this.cellSize);

        // Creating grid manager
        my.gridManager = new GridManager(cols, rows, this.cellSize);

        // Initialize grid manager to set up the grid
        my.gridManager.initializeGrid(this);

        // Creating the ground
        my.sprite.ground = this.add.sprite(game.config.width / 2, game.config.height / 2, 'ground');
        // Scaling the ground
        my.sprite.ground.setScale(23.0);

        // Drawing a grid
        this.drawGrid(this.cellSize);

        // Creating the player
        my.sprite.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, 'player');
        my.sprite.player.setOrigin(0, 0);

        // Creating text for day count
        my.text.dayCount = this.add.text(10, 10, 'Day: ' + this.dayCount, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
    
        // Creating text for inventory
        this.selectedPlant = 'carrots';
        my.text.inventory = this.add.text(10, 50, 'Inventory:', { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        my.text.inventoryOne = this.add.text(180, 50, 'Carrots: ' + this.inventory.carrots, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        my.text.inventoryTwo = this.add.text(180, 90, 'Corn: ' + this.inventory.corns, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        my.text.inventoryThree = this.add.text(180, 130, 'Roses: ' + this.inventory.roses, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });
        this.updateInventory();

        // Message text for player feedback on planting in adjacent cells
        my.text.message = this.add.text(10, 170, '', { fontFamily: 'Arial', fontSize: 24, color: '#ff0000' });

        // Message text for winning game
        my.text.winMessage = this.add.text(600, 300, '', { fontFamily: 'Arial', fontSize: 42, color: '#00ff00' });

        // Input for plant selection (1 = carrots, 2 = corns, 3 = roses)
        this.input.keyboard.on('keydown-ONE', () => { this.selectedPlant = 'carrots'; this.updateInventory(); });
        this.input.keyboard.on('keydown-TWO', () => { this.selectedPlant = 'corns'; this.updateInventory(); });
        this.input.keyboard.on('keydown-THREE', () => { this.selectedPlant = 'roses'; this.updateInventory(); });

        // WASD keys for player movement
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Spacebar for advancing time
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // E key for picking up crops
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Q key for planting crops
        this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    // Game loop
    update () {
        this.movePlayer();      // Player movement
        this.advanceTime();     // Advance time by 1 day
        this.pickUpPlant();     // Picking up crops
        this.plantCrop();       // Planting crops
    }

    // Create a 2D grid over the game
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
    
    // Player movement
    movePlayer() {
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
        my.sprite.player.y = Phaser.Math.Clamp(my.sprite.player.y, 0, this.sys.game.config.height - 75);    // -75 to prevent going below screen border
    }

    // Picking up plants with the E key
    pickUpPlant() {
        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            const playerCenterX = my.sprite.player.x + my.sprite.player.width / 2;
            const playerCenterY = my.sprite.player.y + my.sprite.player.height / 2;
            const gridX = Math.floor(playerCenterX / this.cellSize);
            const gridY = Math.floor(playerCenterY / this.cellSize);

            const plantTypeCode = my.gridManager.getPlantType(gridX, gridY);
            if (plantTypeCode !== PlantTypes.NONE) {
                const plantType = my.gridManager.getPlantTypeName(plantTypeCode);
                // Update inventory
                this.inventory[plantType]++;
                this.updateInventory();

                // Update grid data
                my.gridManager.setPlantType(gridX, gridY, PlantTypes.NONE);
                my.gridManager.setGrowthLevel(gridX, gridY, 0);

                // Remove plant sprite
                const spriteKey = `${gridX},${gridY}`;
                const plantSprite = my.gridManager.plantSprites[spriteKey];
                if (plantSprite) {
                    plantSprite.destroy();
                    delete my.gridManager.plantSprites[spriteKey];
                }
            }
        }
    }
    
    // Update inventory display
    updateInventory() {
        let carrotSelected = '#ffffff';
        let cornSelected = '#ffffff';
        let roseSelected = '#ffffff';
        switch (this.selectedPlant){
            case 'carrots':
                carrotSelected = '#aaffaa';
                break;
            case 'corns':
                cornSelected = '#aaffaa';
                break;
            case 'roses':
                roseSelected = '#aaffaa';
                break;
        }
        my.text.inventoryOne.setText('Carrots: ' + this.inventory.carrots);
        my.text.inventoryTwo.setText('Corn: ' + this.inventory.corns);
        my.text.inventoryThree.setText('Roses: ' + this.inventory.roses);

        // Set color of inventory items
        my.text.inventoryOne.setColor(carrotSelected);
        my.text.inventoryTwo.setColor(cornSelected);
        my.text.inventoryThree.setColor(roseSelected);
    }

    // Plant crops with the Q key
    plantCrop() {
        if (Phaser.Input.Keyboard.JustDown(this.qKey) && this.inventory[this.selectedPlant] > 0) {
            const playerCenterX = my.sprite.player.x + my.sprite.player.width / 2;
            const playerCenterY = my.sprite.player.y + my.sprite.player.height / 2;
            const gridX = Math.floor(playerCenterX / this.cellSize);
            const gridY = Math.floor(playerCenterY / this.cellSize);

            const plantTypeCode = my.gridManager.getPlantTypeCode(this.selectedPlant);

            if (my.gridManager.getPlantType(gridX, gridY) === PlantTypes.NONE) {
                // Enforce planting rules based on adjacent plants
                const adjacentPlantCount = my.gridManager.getAdjacentPlantCount(gridX, gridY);
                if (adjacentPlantCount < 2) {
                    // Create plant sprite
                    const x = gridX * this.cellSize + this.cellSize / 2;
                    const y = gridY * this.cellSize + this.cellSize / 2;
                    const textureKey = `${this.selectedPlant}Seedling`;
                    const plantSprite = this.physics.add.image(x, y, textureKey);
                    plantSprite.setScale(2.5);

                    // Update grid data
                    my.gridManager.setPlantType(gridX, gridY, plantTypeCode);
                    my.gridManager.setGrowthLevel(gridX, gridY, 1);
                    my.gridManager.plantSprites[`${gridX},${gridY}`] = plantSprite;

                    // Update inventory
                    this.inventory[this.selectedPlant]--;
                    this.updateInventory();
                    my.text.message.setText(''); // Clear any previous message
                } else {
                    my.text.message.setText('Cannot plant here: too many adjacent plants.');
                    this.time.delayedCall(3000, () => {
                        my.text.message.setText('');
                    }, [], this);
                }
            } else {
                my.text.message.setText('Cannot plant here: cell is occupied.');
                this.time.delayedCall(3000, () => {
                    my.text.message.setText('');
                }, [], this);
            }
        }
    }

    // Advance time in the game
    advanceTime() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.dayCount++;
            my.text.dayCount.setText('Day: ' + this.dayCount);

            // Trigger end of turn updates
            my.eventMan.endTurn();

            // Check win condition
            const win = my.gridManager.checkWinCondition(9, 3); // At least 9 plants at growth level 3
            if (win) {
                // Disable all controls and display win message
                this.input.keyboard.enabled = false;
                my.text.winMessage.setText('You win!');

                // Clear the message after 3 seconds and restart the game
                this.time.delayedCall(2500, () => {
                    this.input.keyboard.enabled = true;
                    my.text.winMessage.setText('');
                    this.scene.restart();
                }, [], this);
            }
        }
    }
}
