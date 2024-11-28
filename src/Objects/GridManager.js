class GridManager {
    constructor(gridWidth, gridHeight, cellSize) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.cellSize = cellSize;

        // Initialize grid cells
        this.grid = [];
    }
    
    initializeGrid(rows, cols, scene) {
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < cols; j++) {
                let newCell = new Cell(i, j);

                // Subscribe this cell's endOfTurnUpdate() to the event manager's endTurn() event trigger
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

    // Update plant density around a cell
    updatePlantDensityAround(x, y) {
        const cell = this.grid[x][y];
        cell.calculatePlantDensity();

        const adjacentCells = this.returnAdjacentCells(x, y);
        adjacentCells.forEach(adjCell => {
            adjCell.calculatePlantDensity();
        });
    }

    // Plant a crop in the middle of a grid cell
    plantCrop(x, y, plantType, plantSprite) {
        const cell = this.grid[x][y];

        // Ensure that the cell is empty
        if (!cell.plant) { 
            // Update plantDensity for the cell and adjacent cells
            this.updatePlantDensityAround(x, y);

            // Check if the cell has less than 2 adjacent plants
            if (cell.plantDensity >= 2) {
                // Cannot plant here
                console.log("Cannot plant here: too many adjacent plants.");
                return false; // Indicate failure to plant
            }

            // Define plant attributes from the plantType
            const plantData = this.getPlantAttributes(plantType);
            if (plantData) {
                // Create a new Plant object with the attributes and the sprite
                const newPlant = new Plant(plantType, plantData.sunNeeded, plantData.waterNeeded, plantSprite);
                cell.setPlant(newPlant);

                // After planting, update plantDensity again
                this.updatePlantDensityAround(x, y);
                return true; // Indicate success
            }
        }
        return false; // Indicate failure to plant
    }

    // Pick up a plant (reset cell)
    pickUpPlant(x, y) {
        const cell = this.grid[x][y];
        if (cell.getPlant()) {
            cell.setPlant(null); // Remove the plant

            // After removing the plant, update plantDensity around
            this.updatePlantDensityAround(x, y);
        }
    }

    // Helper method to get plant attributes
    getPlantAttributes(plantType) {
        const plantTypes = {
            carrots: { sunNeeded: 3, waterNeeded: 2 },
            roses: { sunNeeded: 2, waterNeeded: 4 },
            corns: { sunNeeded: 4, waterNeeded: 3 },
        };
        return plantTypes[plantType];
    }

    // Return adjacent cells including diagonals
    returnAdjacentCells(gridX, gridY) {
        const adjacentCells = [];
        const directions = [
            { dx: -1, dy: 0 },  // Left
            { dx: 1, dy: 0 },   // Right
            { dx: 0, dy: -1 },  // Up
            { dx: 0, dy: 1 },   // Down
            { dx: -1, dy: -1 }, // Up-Left
            { dx: 1, dy: -1 },  // Up-Right
            { dx: -1, dy: 1 },  // Down-Left
            { dx: 1, dy: 1 }    // Down-Right
        ];

        directions.forEach(({ dx, dy }) => {
            const newX = gridX + dx;
            const newY = gridY + dy;

            // Check if the new coordinates are within bounds
            if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                adjacentCells.push(this.grid[newX][newY]);
            }
        });

        return adjacentCells;
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

    // Helper methods for retrieving resource levels
    setWaterAt(x, y, waterLevel) {
        this.grid[x][y].setWaterLevel(waterLevel);
    }

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
