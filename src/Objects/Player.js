class Player {
    constructor(sprite, playerSpeed = 3.0) {
        this.playerSpeed = playerSpeed
        this.sprite = sprite;
    }

    getX(){
        return this.sprite.x;
    }
    getY(){
        return this.sprite.y;
    }
    move(x, y) {
        this.sprite.x += x * this.playerSpeed;
        this.sprite.y += y * this.playerSpeed;
    }
}