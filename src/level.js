
import { Scene } from "excalibur";
import { Player } from "./player.js";

export class MyLevel extends Scene {
    onInitialize(engine) {
        // Scene.onInitialize is where we recommend you perform the composition for your game
        const player = new Player();
        this.add(player); // Actors need to be added to a scene to be drawn
    }

    onPreLoad(loader) {
        // Add any scene specific resources to load
    }

    onActivate(context) {
        // Called when Excalibur transitions to this scene
        // Only 1 scene is active at a time
    }

    onDeactivate(context) {
        // Called when Excalibur transitions away from this scene
        // Only 1 scene is active at a time
    }

    onPreUpdate(engine, elapsedMs) {
        // Called before anything updates in the scene
    }

    onPostUpdate(engine, elapsedMs) {
        // Called after everything updates in the scene
    }

    onPreDraw(ctx, elapsedMs) {
        // Called before Excalibur draws to the screen
    }

    onPostDraw(ctx, elapsedMs) {
        // Called after Excalibur draws to the screen
    }
}