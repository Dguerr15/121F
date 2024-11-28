class farming extends Phaser.Scene {
    constructor() {
        super("farming");
        this.plants=[];
        this.selectedPlant = 'carrots';
    }

    addPlant(name, growthRate, waterNeed) {
        const plant = new Plant(name, growthRate, waterNeed);
        this.plants.push(plant);
    }

    // This function defines variables
    init () 
    {
        this.playerSpeed = 3.0;
        this.dayCount = 1;
        this.inventory = {
            carrots: 5,
            roses: 5,
            corns: 5
        }
        this.distanceToPlant = 50;
        this.cellSize = 70;
    }
    
    // This function is called once at the start and preloads all assets
    preload ()
    {
        this.load.setPath("./assets/");
        this.load.image('ground', 'ground_01.png');
        this.load.image('player', 'player_05.png');
        // Carrot Assets
        this.load.image('carrotsFullGrown', 'tile_0056.png');
        this.load.image('carrotsGrowing', 'tile_0072.png');
        this.load.image('carrotsSeedling', 'tile_0088.png');
        // Rose Assets
        this.load.image("rosesSeedling", "tile_0089.png");
        this.load.image('rosesFullGrown', 'tile_0057.png');
        this.load.image('rosesGrowing', 'tile_0073.png');
        // Corn Assets
        this.load.image('cornsSeedling', 'tile_0091.png');
        this.load.image('cornsFullGrown', 'tile_0059.png');
        this.load.image('cornsGrowing', 'tile_0075.png');

    }
    
    // This function is called once at the start
    create ()
    {
        // Creating event manager
        my.eventMan = new EventManager();

        //my.eventMan.on('plantGrew', this.onPlantGrew.bind(this));

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
    
        // Creating text for inventory
        my.text.inventory = this.add.text(10, 50, 'Inventory: Carrots: ' + this.inventory.carrots + ' Corn: ' + this.inventory.corns + ' Roses: ' + this.inventory.roses, { fontFamily: 'Arial', fontSize: 32, color: '#ffffff' });

        // Creating input for plant selection (1 = carrots, 2 = corns, 3 = roses)
        this.input.keyboard.on('keydown-ONE', () => { this.selectedPlant = 'carrots'; });
        this.input.keyboard.on('keydown-TWO', () => { this.selectedPlant = 'corns'; });
        this.input.keyboard.on('keydown-THREE', () => { this.selectedPlant = 'roses'; });
 
         
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

        // Plant group
        this.plantsGroup = this.add.group();
    }

    // This function is called each frame
    update ()
    {
        this.movePlayer();      // Function for player movement
        this.advanceTime();     // Function for advancing time by 1 day
        this.pickUpPlant();    // Function for picking up
        this.plantCrop();     // Function for planting 
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

    // This function allows the player to pick up plants with the e key
    pickUpPlant() {
        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            let closestPlant = null;
            let closestDistance = Infinity;
    
            // Find the closest Plant
            this.plantsGroup.getChildren().forEach(plant => {
                const distance = Phaser.Math.Distance.Between(
                    my.sprite.player.x + my.sprite.player.displayWidth / 2, // Use player sprite center
                    my.sprite.player.y + my.sprite.player.displayHeight / 2,
                    plant.x,
                    plant.y
                );
    
                if (distance < this.distanceToPlant && (distance < closestDistance)) { // Prefer the one to the right
                    closestPlant = plant;
                    closestDistance = distance;
                }
            });
    
            // Pick up the closest plant if found
            if (closestPlant) {
                this.inventory[this.selectedPlant]++;
                my.text.inventory.setText('Inventory: Carrots: ' + this.inventory.carrots + ' Corn: ' + this.inventory.corns + ' Roses: ' + this.inventory.roses);
                closestPlant.destroy();
                
                
                // Remove the plant from the grid
                const gridX = Phaser.Math.Clamp(Math.floor(closestPlant.x / this.cellSize), 0, my.gridManager.gridWidth - 1);
                const gridY = Phaser.Math.Clamp(Math.floor(closestPlant.y / this.cellSize), 0, my.gridManager.gridHeight - 1);
    
                const cell = my.gridManager.grid[gridX][gridY];
                if (cell.plant) {
                    my.gridManager.pickUpPlant(gridX, gridY);
                    if (cell.carrotSprite === closestPlant) {
                        cell.carrotSprite = null;
                    }
                }
            }
        }
    }
    
    plantCrop() {
        if (Phaser.Input.Keyboard.JustDown(this.qKey) && this.inventory[this.selectedPlant] > 0) {
            console.log("Planting a crop");
            // Calculate the center position of the player sprite
            const playerCenterX = my.sprite.player.x + my.sprite.player.width / 2;
            const playerCenterY = my.sprite.player.y + my.sprite.player.height / 2;
    
            // Map the center position to the grid
            const gridX = Phaser.Math.Clamp(Math.floor(playerCenterX / this.cellSize), 0, my.gridManager.gridWidth - 1);
            const gridY = Phaser.Math.Clamp(Math.floor(playerCenterY / this.cellSize), 0, my.gridManager.gridHeight - 1);
    
            const cell = my.gridManager.grid[gridX][gridY];
            if (!cell.plant) {  // Check if the cell is empty
                // Add a visual plant on the grid
                const x = gridX * this.cellSize + this.cellSize / 2;
                const y = gridY * this.cellSize + this.cellSize / 2;
                
                const plantType = this.selectedPlant;
                console.log("Planting a " + plantType);
                const plantImageKey = `${plantType}Seedling`;

                const plantSprite = this.physics.add.image(x, y, plantImageKey);
                plantSprite.setScale(2.5);
                this.plantsGroup.add(plantSprite);
    

                // Update inventory and plant a crop in the GridManager
                this.inventory[plantType]--;
                console.log(this.inventory);
                my.text.inventory.setText('Inventory: Carrots: ' + this.inventory['carrots'] + ' Corn: ' + this.inventory['corns'] + ' Roses: ' + this.inventory['roses']);

                my.gridManager.plantCrop(gridX, gridY, plantType, plantSprite);
                
                /*
                cell.plant = { 
                    type: plantType, 
                    growthLevel: 0, 
                    sunNeeded: my.gridManager.plantTypes[plantType].sunNeeded, 
                    waterNeeded: my.gridManager.plantTypes[plantType].waterNeeded 
                };
                */
            }
        }
    }
    

    // This function is called when a plant grows
    /*
    onPlantGrew(data) {
        const { x, y, growthLevel, plantType } = data;
    
        // Find the corresponding plant sprite
        const cell = my.gridManager.grid[x][y];
        const plantSprite = cell.plantSprite;
    
        if (growthLevel === 1) {
            plantSprite.setTexture(plantType + 'Growing');
        } else if (growthLevel === 2) {
            plantSprite.setTexture(plantType + 'FullGrown');
        }
    }
        */

    // This function advances time in the game
    advanceTime(){
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
            const win = my.gridManager.checkWinCondition(9, 3); // At least 5 plants at growth level 3
            if (win) {
                console.log("Victory! You've completed the scenario.");
            }
        }
    }
}