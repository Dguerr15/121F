import { Actor, vec, Keys } from "excalibur";
import { Resources } from "./resources.js";

export class PlantSprite extends Actor {
  constructor() {
    super({
      name: 'PlantSprite',
      pos: vec(150, 150),
      width: 100,
      height: 100,
      z: 3,
    });
    
  }

  
  initSprite(posX, posY, sprite){
    this.getPlantSprite(sprite);
    this.pos.x = posX;
    this.pos.y = posY;
  }

  setTexture(sprite){

    switch (sprite){
      case 'carrotsSeedling':
        this.graphics.use(Resources.carrotsSeedling.toSprite());
        break;
      case 'rosesSeedling':
        this.graphics.use(Resources.rosesSeedling.toSprite());
        break;
      case 'cornsSeedling':
        this.graphics.use(Resources.cornsSeedling.toSprite());
        break;
      case 'carrotsGrowing':
        this.graphics.use(Resources.carrotsGrowing.toSprite());
        break;
      case 'rosesGrowing':
        this.graphics.use(Resources.rosesGrowing.toSprite());
        break;
      case 'cornsGrowing':
        this.graphics.use(Resources.cornsGrowing.toSprite());
        break;
      case 'carrotsFullGrown':
        this.graphics.use(Resources.carrotsFullGrown.toSprite());
        break;
      case 'rosesFullGrown':
        this.graphics.use(Resources.rosesFullGrown.toSprite());
        break;
      case 'cornsFullGrown':
        this.graphics.use(Resources.cornsFullGrown.toSprite());
        break;
      default:
        this.graphics.use(Resources.carrotsSeedling.toSprite());
        break;
    }
  }

  getPlantSprite(name){
    switch (name){
      case 'carrotsSeedling':
        this.graphics.add(Resources.carrotsSeedling.toSprite());
        break;
      case 'rosesSeedling':
        this.graphics.add(Resources.rosesSeedling.toSprite());
        break;
      case 'cornsSeedling':
        this.graphics.add(Resources.cornsSeedling.toSprite());
        break;
      case 'carrotsGrowing':
        this.graphics.add(Resources.carrotsGrowing.toSprite());
        break;
      case 'rosesGrowing':
        this.graphics.add(Resources.rosesGrowing.toSprite());
        break;
      case 'cornsGrowing':
        this.graphics.add(Resources.cornsGrowing.toSprite());
        break;
      case 'carrotsFullGrown':
        this.graphics.add(Resources.carrotsFullGrown.toSprite());
        break;
      case 'rosesFullGrown':
        this.graphics.add(Resources.rosesFullGrown.toSprite());
        break;
      case 'cornsFullGrown':
        this.graphics.add(Resources.cornsFullGrown.toSprite());
        break;
      default:
        this.graphics.add(Resources.carrotsSeedling.toSprite());
        break;
    }
  }
}
