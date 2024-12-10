import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources.js";
import { MyLevel } from "./level.js";

// Goal is to keep main.ts small and just enough to configure the engine

const gameWidth = window.innerWidth * .8;
const gameHeight = window.innerHeight;

const game = new Engine({
  width: gameWidth, // Logical width and height in game pixels
  height: gameHeight,
  displayMode: DisplayMode.Fixed, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    start: MyLevel
  },
});

game.start('start', { // name of the start scene 'start'
  loader, // Optional loader (but needed for loading images/sounds)
  inTransition: new FadeInOut({ // Optional in transition
    duration: 1000,
    direction: 'in',
    color: Color.ExcaliburBlue
  })
}).then(() => {
  // Do something after the game starts
});