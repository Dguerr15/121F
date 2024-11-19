class farming extends Phaser.Scene {
    constructor() {
        super("farming");
    }

    create ()
    {
        this.add.text(200, 200, 'Farming Game', { font: "48px Arial Black", fill: "#fff" });
        // Display on console if player clicks mouse
        this.input.on('pointerdown', function (pointer) {
            console.log('pointerdown at x: ' + pointer.x + ' y: ' + pointer.y);
        });
    }

    update ()
    {
    }
}