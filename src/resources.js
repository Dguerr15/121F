import { ImageSource, Loader } from "excalibur";

// It is convenient to put your resources in one place
export const Resources = {
  Sword: new ImageSource("./src/images/sword.png"), // Vite public/ directory serves the root images
  player: new ImageSource("./assets/player_05.png"),
  ground: new ImageSource("./assets/ground_01.png"),
  carrotsSeedling: new ImageSource('./assets/tile_0088.png'),
  carrotsGrowing: new ImageSource('./assets/tile_0072.png'),
  carrotsFullGrown: new ImageSource('./assets/tile_0056.png'),
  rosesSeedling: new ImageSource('./assets/tile_0089.png'),
  rosesGrowing: new ImageSource('./assets/tile_0073.png'),
  rosesFullGrown: new ImageSource('./assets/tile_0057.png'),
  cornsSeedling: new ImageSource('./assets/tile_0091.png'),
  cornsGrowing: new ImageSource('./assets/tile_0075.png'),
  cornsFullGrown: new ImageSource('./assets/tile_0059.png')
}
// So when you type Resources.Sword -> ImageSource

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
