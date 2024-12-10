import { Actor, vec, Keys } from "excalibur";
import { Resources } from "./resources.js";

export class Player extends Actor {
  constructor() {
    super({
      name: 'Player',
      pos: vec(150, 150),
      width: 100,
      height: 100,
      z: 4,
    }); 
  }

  onInitialize() {
    this.graphics.add(Resources.player.toSprite());
  }

  update(engine, delta){
    this.handleMovement(engine, delta);
  }

  handleMovement(engine, delta){
    let moveSpeed = 300.0;
    let moveRight = 0.0;
    let moveDown = 0.0;
    // check wasd keys if they are currently pressed
    if (engine.input.keyboard.isHeld(Keys.A)) {
      moveRight -= moveSpeed;
    }
    if (engine.input.keyboard.isHeld(Keys.D)) {
      moveRight += moveSpeed;
    }
    if (engine.input.keyboard.isHeld(Keys.W)) {
      moveDown -= moveSpeed;
    }
    if (engine.input.keyboard.isHeld(Keys.S)) {
      moveDown += moveSpeed;
    }
    if (moveRight !== 0 && moveDown !== 0) {
      moveRight /= Math.sqrt(2);
      moveDown /= Math.sqrt(2);
    }
    let deltaTimeSeconds = delta / 1000;
    this.pos.x += moveRight * deltaTimeSeconds;
    this.pos.y += moveDown * deltaTimeSeconds;

    this.constrainToGrid();
  }

  constrainToGrid() {
    // Grid properties
    const cellSize = 64; // Size of each tile
    const gridWidth = 13; // Grid width (number of tiles)
    const gridHeight = 10; // Grid height (number of tiles)

    // Constrain player position within grid bounds
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    // Horizontal constraint (left and right edges)
    if (this.pos.x - halfWidth < 0) {
      this.pos.x = halfWidth; // Player can't go past the left edge
    } else if (this.pos.x + halfWidth > gridWidth * cellSize) {
      this.pos.x = gridWidth * cellSize - halfWidth; // Player can't go past the right edge
    }

    // Vertical constraint with extra leeway upwards
    const extraUpwardSpace = 32; // Amount of space to allow movement upwards beyond grid top
    if (this.pos.y - halfHeight < -extraUpwardSpace) {
      this.pos.y = halfHeight - extraUpwardSpace; // Allow some upward movement past grid top
    } else if (this.pos.y + halfHeight > gridHeight * cellSize) {
      this.pos.y = gridHeight * cellSize - halfHeight; // Player can't go past the bottom edge
    }
  }
}
