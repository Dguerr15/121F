import { Actor, vec, Keys } from "excalibur";
import { Resources } from "./resources.js";

// Actors are the main unit of composition you'll likely use, anything that you want to draw and move around the screen
// is likely built with an actor

// They contain a bunch of useful components that you might use
// actor.transform
// actor.motion
// actor.graphics
// actor.body
// actor.collider
// actor.actions
// actor.pointer


export class PlantSprite extends Actor {
  constructor() {
    super({
      // Giving your actor a name is optional, but helps in debugging using the dev tools or debug mode
      // https://github.com/excaliburjs/excalibur-extension/
      // Chrome: https://chromewebstore.google.com/detail/excalibur-dev-tools/dinddaeielhddflijbbcmpefamfffekc
      // Firefox: https://addons.mozilla.org/en-US/firefox/addon/excalibur-dev-tools/
      name: 'PlantSprite',
      pos: vec(150, 150),
      width: 100,
      height: 100,
      z: 5, // Z is the draw order, higher means closer to the screen
            // 1 ground
            // 2 grid lines
            // 3 plants/crops
            // 4 player
            // 5 UI
      // anchor: vec(0, 0), // Actors default center colliders and graphics with anchor (0.5, 0.5)
      // collisionType: CollisionType.Active, // Collision Type Active means this participates in collisions read more https://excaliburjs.com/docs/collisiontypes
    });
    
  }

  onInitialize() {
    // Generally recommended to stick logic in the "On initialize"
    // This runs before the first update
    // Useful when
    // 1. You need things to be loaded like Images for graphics
    // 2. You need excalibur to be initialized & started 
    // 3. Deferring logic to run time instead of constructor time
    // 4. Lazy instantiation

    // Actions are useful for scripting common behavior, for example patrolling enemies
    // this.actions.delay(2000);
    // this.actions.repeatForever(ctx => {
    //   this.pos.x += 1;
    // });


  }
  initSprite(posX, posY, sprite){
    console.log ('init sprite called');
    this.getPlantSprite(sprite);
    this.pos.x = posX;
    this.pos.y = posY;

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
