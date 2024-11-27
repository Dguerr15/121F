class GridManager {
    constructor(gridWidth, gridHeight, cellSize) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.cellSize = cellSize;

        // Initialize grid cells with sun and water levels
        this.grid = [];
    }
    
    initializeGrid(rows, cols, scene) {
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < cols; j++) {
                let newCell = new Cell(i, j);
                // subscribe this cell's     endOfTurnUpdate()
                //         to the eventMan's endTurn() event trigger
                my.eventMan.addTurnListener(newCell.endOfTurnUpdate.bind(newCell, scene, this.cellSize));
                row.push(newCell);
            }
            this.grid.push(row);
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
        this.grid.forEach(row => 
            row.forEach(cell => {
                cell.updateWaterLevel();
                cell.updateSunLevel();
            })
        );
    }

    // Plant a crop in the middle of a grid cell
    plantCrop(x, y, plantType) {
        const cell = this.grid[x][y];
    if (!cell.plant) { // Ensure that the cell is empty
        cell.plant = {
            type: plantType,
            growthLevel: 0,  // Start with growth level 0
            sunNeeded: this.plantTypes[plantType].sunNeeded,
            waterNeeded: this.plantTypes[plantType].waterNeeded,
        };
    }
    }    

    // Check growth conditions for each plant
    updatePlantGrowth() {
        this.grid.forEach((row, x) => 
            row.forEach((cell, y) => {
                const plant = cell.getPlant();
                if (plant && plant.growthLevel < 3) {
                    const plantType = this.plantTypes[plant.type];
                    const previousGrowthLevel = plant.growthLevel;

                    if (cell.getSunLevel() >= plantType.sunNeeded && cell.getWaterLevel() >= plantType.waterNeeded
                    ) {
                        plant.growthLevel += 1; // Increase growth level
                        cell.waterLevel -= plantType.waterNeeded; // Consume water
                        plant.growthLevel = Math.min(plant.growthLevel, 3);

                        if (plant.growthLevel > previousGrowthLevel) {
                            my.eventMan.emit('plantGrew', {
                                x,
                                y,
                                growthLevel: plant.growthLevel,
                                plantType: plant.type,
                            });
                        }
                    }
                }
            })
        );
    }        

    // Check win condition: X plants at Y growth level or above
    checkWinCondition(requiredPlants, requiredGrowthLevel) {
        let count = 0;
        this.grid.forEach(row => 
            row.forEach(cell => {
                const plant = cell.getPlant();
                if (plant && plant.growthLevel >= requiredGrowthLevel) {
                    count++;
                }
            })
        );
        return count >= requiredPlants;
    }

    // Pick up a plant (reset cell)
    pickUpPlant(x, y) {
        const cell = this.grid[x][y];
        if (cell.getPlant()) {
            cell.setPlant(null); // Remove the plant
        }
    }

    // Helper methods for retrieving resource levels
    getWaterAt(x, y) {
        return this.grid[x][y].getWaterLevel();
    }

    getSunAt(x, y) {
        return this.grid[x][y].getSunLevel();
    }

    getPlantDensityAt(x, y) {
        return this.grid[x][y].plantDensity;
    }

    getPlantAt(x, y) {
        return this.grid[x][y].getPlant();
    }
}