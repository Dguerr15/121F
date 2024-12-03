// This isn't used anymore, so we can delete it

/*
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
        this.plantDensity = 0; // Initialize plantDensity to 0
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

        // Clamp to max water capacity
        newWaterLevel = Math.min(newWaterLevel, MAX_WATER_CAPACITY);
        this.waterLevel = newWaterLevel;
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

    // Calculate the number of adjacent cells with plants (including diagonals)
    calculatePlantDensity() {
        const adjacentCells = my.gridManager.returnAdjacentCells(this.x, this.y);
        let count = 0;
        adjacentCells.forEach(adjCell => {
            if (adjCell.getPlant()) {
                count++;
            }
        });
        this.plantDensity = count;
    }

    // Placeholder for undo functionality
    undoTurn(){
        // Implementation for undoing a turn if needed
    }
}
*/