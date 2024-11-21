const RAND_SUN_MAX = 3;
const RAND_WATER_MAX = 2;
const MAX_WATER_CAPACITY = 10;

class Cell {
    constructor(x, y, waterLevel = 0, sunLevel = 0) {
        this.x = x;
        this.y = y;
        this.waterLevel = waterLevel;
        this.sunLevel = sunLevel;
        this.plantDensity = 0; // increment when spawning nearby plants.
    }

    updateWaterLevel(){
        newWaterLevel = this.waterLevel + Math.floor(Math.random() * RAND_WATER_MAX);
        // clamp to max water capacity
        newWaterLevel = Math.min(newWaterLevel, MAX_WATER_CAPACITY);
        this.waterLevel = newWaterLevel;
    }

    updateSunLevel() {
        this.sunLevel = Math.floor(Math.random() * RAND_SUN_MAX);
    }

    setPlant(plant) {
        this.plant = plant;
    }

    getWaterLevel() {
        return this.waterLevel;
    }

    getSunLevel() {
        return this.sunLevel;
    }

    getPlant() {
        return this.plant;
    }

    endOfTurnUpdate(){
        this.updateWaterLevel();
        this.updateSunLevel();
    }
}