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
    plantCrop(x, y, plantType, plantSprite) {
        const cell = this.grid[x][y];
        if (!cell.plant) { // Ensure that the cell is empty
            // Define plant attributes from the plantType
            const plantData = this.getPlantAttributes(plantType); // Retrieve attributes from a lookup
            if (plantData) {
                // Create a new Plant object with the attributes and the sprite
                const newPlant = new Plant(plantType, plantData.sunNeeded, plantData.waterNeeded, plantSprite);
                cell.setPlant(newPlant);
            }
        }
    }    


    // Helper method to get plant attributes from the plantTypes
    getPlantAttributes(plantType) {
        const plantTypes = {
            carrots: { sunNeeded: 3, waterNeeded: 2 },
            roses: { sunNeeded: 2, waterNeeded: 4 },
            corns: { sunNeeded: 4, waterNeeded: 3 },
        };
        return plantTypes[plantType];
    }

    // Check growth conditions for each plant
    updatePlantGrowth() {
        this.grid.forEach((row) => 
            row.forEach((cell) => {
                const plant = cell.getPlant();
                if (plant) {
                    const sunLevel = cell.getSunLevel();
                    const waterLevel = cell.getWaterLevel();
                    if (sunLevel >= plant.sunNeeded && waterLevel >= plant.waterNeeded) {
                        plant.updateGrowth(sunLevel, waterLevel);
                        cell.setWaterLevel(waterLevel - plant.waterNeeded);
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

    // Helper methods
    setWaterAt(x, y, waterLevel) {
        this.grid[x][y].setWaterLevel(waterLevel);
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