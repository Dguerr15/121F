const RAND_SUN_MAX = 5;
const RAND_WATER_MAX = 2;
const MAX_WATER_CAPACITY = 10;

class Cell {
    constructor(x, y, waterLevel = 0, sunLevel = 0) {
        this.x = x;
        this.y = y;
        this.waterLevel = waterLevel;
        this.plant = null; 
        this.waterText = null;
        this.sunLevel = sunLevel;
        this.plantDensity = 0; // increment when spawning nearby plants.
    }

    drawWaterLevel(scene, cellSize) {
        let x = this.x * cellSize;
        let y = this.y * cellSize;
        if (this.waterText){
            this.waterText.destroy();
        }
        this.waterText = scene.add.text(x, y, 'W: ' + this.waterLevel, { fontFamily: 'Arial', fontSize: 16, color: '#ccccff' });
    }

    drawSunLevel(scene, cellSize){
        let x = this.x * cellSize;
        let y = this.y * cellSize;
        if (this.sunText){
            this.sunText.destroy();
        }
        this.sunText = scene.add.text(x, y + 16, 'S: ' + this.sunLevel, { fontFamily: 'Arial', fontSize: 16, color: '#ffffaa' });
    }

    updateWaterLevel(){
        let newWaterLevel = this.waterLevel + Math.floor(Math.random() * RAND_WATER_MAX);
        // clamp to max water capacity
        newWaterLevel = Math.min(newWaterLevel, MAX_WATER_CAPACITY);
        this.waterLevel = newWaterLevel;
        // console.log ("Water level: " + this.waterLevel);
    }

    updateSunLevel() {
        // Generate a new random sun level (not stored, as sun doesn't accumulate)
        this.sunLevel = Phaser.Math.Between(0, RAND_SUN_MAX);
    }

    setPlant(plant) {
        this.plant = plant;
    }

    getWaterLevel() {
        return this.waterLevel;
    }

    setWaterLevel(waterLevel) {
        this.waterLevel = waterLevel;
    }

    getSunLevel() {
        return this.sunLevel;
    }

    getPlant() {
        return this.plant;
    }

    endOfTurnUpdate(scene, cellSize){
        this.updateWaterLevel();
        this.updateSunLevel();
        this.drawWaterLevel(scene, cellSize);
        this.drawSunLevel(scene, cellSize);
    }

    // placeholder for f1
    undoTurn(){
        // note. will need to add an "actual water level" variable because water capacity is capped.
        //      e.g. if cell with 10 water is watered again, it stays at 10.
        //           undoing that, it should still stay at 10
    }
}