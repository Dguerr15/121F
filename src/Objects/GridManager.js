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
                this.grid[x][y] = {
                    sun: 0,  // Sun energy (resets every turn)
                    water: 0, // Water moisture (accumulates)
                    plant: null, // Plant object, if any
                };
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
                this.grid[x][y].sun = Phaser.Math.Between(0, 5); // Random sun (0-5)
                this.grid[x][y].water += Phaser.Math.Between(0, 2); // Random water increment (0-2)
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
                if (cell.plant && cell.plant.growthLevel < 3) {
                    const plantType = this.plantTypes[cell.plant.type];
                    const previousGrowthLevel = cell.plant.growthLevel;
    
                    // Check sun and water requirements
                    if (cell.sun >= plantType.sunNeeded && cell.water >= plantType.waterNeeded) {
                        cell.plant.growthLevel += 1; // Increase growth level
                        cell.water -= plantType.waterNeeded; // Consume water
    
                        // Cap the growth level at 3
                        if (cell.plant.growthLevel > 3) {
                            cell.plant.growthLevel = 3;
                        }
    
                        // Emit event if growth level increased
                        if (cell.plant.growthLevel > previousGrowthLevel) {
                            my.eventMan.emit('plantGrew', {
                                x,
                                y,
                                growthLevel: cell.plant.growthLevel,
                                plantType: cell.plant.type
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
                if (cell.plant && cell.plant.growthLevel >= requiredGrowthLevel) {
                    count++;
                }
            }
        }
        return count >= requiredPlants;
    }

    // Pick up a plant (reset cell)
    pickUpPlant(x, y) {
        const cell = this.grid[x][y];
        if (cell.plant) {
            cell.plant = null; // Remove the plant
        }
    }
}