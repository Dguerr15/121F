import { Actor, vec, Keys } from "excalibur";
import { Resources } from "./resources.js";

export class GroundTile extends Actor {
  constructor() {
    super({
      name: 'GroundTile',
      pos: vec(150, 150),
      width: 100,
      height: 100,
      z: 1,
    });
    
  }

  onInitialize() {
    this.graphics.add(Resources.ground.toSprite());
  }
}
