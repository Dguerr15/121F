const CACHE_NAME = "plow-pioneer-cache-v1";
const ASSETS_TO_CACHE = [
    //"./",
    "./index.html",
    "./game.webmanifest",
    "./src/main.js",
    "./favicon.ico",
    "./src/level.js",
    "./src/resources.js",
    "./src/player.js",
    "./src/PlantSprite.js",
    "./src/groundTile.js",
    "./src/Globals.js",
    "./src/Scenarios/scenario1.json",
    "./src/Objects/Command.js",
    "./src/Objects/CommandManager.js",
    "./src/Objects/EventManager.js",
    "./src/Objects/GridManager.js",
    "./src/Objects/PlantGrowthDSL.js",
    "./src/Objects/ScenarioManager.js",
    "./assets/ground_01.png",
    "./assets/player_05.png",
    "./assets/tile_0056.png",
    "./assets/tile_0057.png",
    "./assets/tile_0059.png",
    "./assets/tile_0072.png",
    "./assets/tile_0073.png",
    "./assets/tile_0075.png",
    "./assets/tile_0088.png",
    "./assets/tile_0089.png",
    "./assets/tile_0091.png",
    "./assets/brace-logo-symbol.png",
    //"./node_modules/excalibur/build/esm/excalibur.min.js"
];

// Installing Service Worker
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[Service Worker] Caching all: app shell and content');
      console.log(ASSETS_TO_CACHE);
      await cache.addAll(ASSETS_TO_CACHE);
    })());
  });
  
  // Fetching content using Service Worker
  self.addEventListener('fetch', (e) => {
      // Cache http and https only, skip unsupported chrome-extension:// and file://...
      if (!(
         e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
      )) {
          return; 
      }
  
    e.respondWith((async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) return r;
      const response = await fetch(e.request);
      const cache = await caches.open(CACHE_NAME);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
  });