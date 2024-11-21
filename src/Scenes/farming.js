class farming extends Phaser.Scene {
    constructor() {
        super("farming");
    }

    // This function defines variables
    init () 
    {
        this.playerSpeed = 3.0;
        this.dayCount = 1;
        this.carrotsOnScreen = 5;
        this.carrotsInInventory = 0;
        this.distanceToCarrot = 50;
        this.cellSize = 70;
    }
    
    // This function is called once at the start and preloads all assets
    preload ()
    {
        this.load.setPath("./assets/");
        this.load.image('ground', 'ground_01.png');
        this.load.image('player', 'player_05.png');
        this.load.image('carrot', 'tile_0056.png');
    }
    
    // This function is called once at the start
    create ()
    {
        // Creating the ground
        my.sprite.ground = this.add.sprite(game.config.width/2, game.config.height/2, 'ground');
        // Scaling the ground
        my.sprite.ground.setScale(23.0);

        // Creating the player
        my.sprite.player = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'player');
        
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

        // Creating 2D grid
        this.createGrid(this.cellSize);

        // Create a group for carrots and put the carrots on the grid
        this.createCarrot(this.cellSize);
    }

    // This function is called each frame
    update ()
    {
        this.movePlayer();      // Function for player movement
        this.advanceTime();     // Function for advancing time by 1 day
        this.pickUpCarrot();    // Function for picking up carrots
    }

    // This function creates a 2D grid over the game
    createGrid(cellSize) {
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

    // This function creates carrots randomly on the grid
    createCarrot(cellSize) 
    {
        this.carrots = this.add.group();    // Create a group for carrots
        
        for (let i = 0; i < this.carrotsOnScreen; i++) {
            let x = Phaser.Math.Between(0, game.config.width/cellSize - 1) * cellSize + cellSize/2;
            let y = Phaser.Math.Between(0, game.config.height/cellSize - 1) * cellSize + cellSize/2;
            let carrot = this.physics.add.image(x, y, 'carrot');
            carrot.setScale(2.5);

            this.carrots.add(carrot);
        }
    }

    // This function allows the player to pick up carrots with the e key
    pickUpCarrot()
    {
        // Check if player is near a carrot and press E to pick it up
        this.carrots.getChildren().forEach(carrot => {
            const distance = Phaser.Math.Distance.Between(my.sprite.player.x, my.sprite.player.y, carrot.x, carrot.y);
    
            if (distance < this.distanceToCarrot && this.eKey.isDown) {
                this.carrotsInInventory++;
                my.text.carrotsInInventory.setText('Carrots: ' + this.carrotsInInventory);
                carrot.destroy();
            }
        });
    }

    // This function handles movement for the player
    movePlayer() 
    {
        this.moveX = 0;
        this.moveY = 0;

        if (this.aKey.isDown) {
            this.moveX = -this.playerSpeed;
        }
        else if (this.dKey.isDown) {
            this.moveX = this.playerSpeed;
        }

        if (this.wKey.isDown) {
            this.moveY = -this.playerSpeed;
        }
        else if (this.sKey.isDown) {
            this.moveY = this.playerSpeed;
        }

        my.sprite.player.x += this.moveX;
        my.sprite.player.y += this.moveY;
    }

    // This function advances time in the game
    advanceTime()
    {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar))
        {
            this.dayCount++;
            my.text.dayCount.setText('Day: ' + this.dayCount);
        }
    }
}