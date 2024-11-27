class GridManager {
    constructor(gridWidth, gridHeight, cellSize) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.cellSize = cellSize;

        // Initialize grid cells with sun and water levels
        this.grid = [];
        for (let x = 0; x < gridWidth; x++) {
            this.grid[x] = [];
            for (let y = 0; y < gridHeight; y++) {
                this.grid[x][y] = new Cell(x, y); // Use Cell class
            }
        }

        // Define plant types and their growth conditions
        this.plantTypes = {
            carrot: { sunNeeded: 3, waterNeeded: 2 },
            //potato: { sunNeeded: 2, waterNeeded: 4 },
            //wheat: { sunNeeded: 4, waterNeeded: 3 },
        };
    }

    // Generate random sun and water levels for each grid cell
    generateResources() {
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                const cell = this.grid[x][y];
                cell.updateWaterLevel();
                cell.updateSunLevel();
            }
        }
    }

    // Plant a crop in the middle of a grid cell
    plantCrop(x, y, type) {
        const cell = this.grid[x][y];
        if (!cell.plant) {
            cell.plant = {
                type,
                growthLevel: 1, // Start at level 1
            };
        }
    }    

    // Check growth conditions for each plant
    updatePlantGrowth() {
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                const cell = this.grid[x][y];
                const plant = cell.getPlant();
                if (plant && plant.growthLevel < 3) {
                    const plantType = this.plantTypes[plant.type];
                    const previousGrowthLevel = plant.growthLevel;
    
                    // Check sun and water requirements
                    if (cell.getSunLevel() >= plantType.sunNeeded && cell.getWaterLevel() >= plantType.waterNeeded) {
                        plant.growthLevel += 1; // Increase growth level
                        cell.waterLevel -= plantType.waterNeeded; // Consume water
    
                        // Cap the growth level at 3
                        if (cell.plant.growthLevel > 3) {
                            cell.plant.growthLevel = 3;
                        }
    
                        // Emit event if growth level increased
                        if (plant.growthLevel > previousGrowthLevel) {
                            my.eventMan.emit('plantGrew', {
                                x,
                                y,
                                growthLevel: plant.growthLevel,
                                plantType: plant.type
                            });
                        }
                    }
                }
            }
        }
    }        

    // Check win condition: X plants at Y growth level or above
    checkWinCondition(requiredPlants, requiredGrowthLevel) {
        let count = 0;
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                const cell = this.grid[x][y];
                const plant = cell.getPlant();
                if (plant && plant.growthLevel >= requiredGrowthLevel) {
                    count++;
                }
            }
        }
        return count >= requiredPlants;
    }

    // Pick up a plant (reset cell)
    pickUpPlant(x, y) {
        const cell = this.grid[x][y];
        if (cell.getPlant()) {
            cell.setPlant(null); // Remove the plant
        }
    }
}