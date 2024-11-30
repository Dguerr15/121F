// Constants for resource limits
const RAND_SUN_MAX = 5;
const RAND_WATER_MAX = 2;
const MAX_WATER_CAPACITY = 10;

// Enumeration for plant types
const PlantTypes = {
    NONE: 0,
    CARROTS: 1,
    CORNS: 2,
    ROSES: 3
};

class GridManager {
    constructor(gridWidth, gridHeight, cellSize) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.cellSize = cellSize;

        // Bytes per cell: waterLevel, sunLevel, plantType, growthLevel
        this.BYTES_PER_CELL = 4;

        // Total cells and bytes
        const totalCells = gridWidth * gridHeight;
        const totalBytes = totalCells * this.BYTES_PER_CELL;

        // Initialize the buffer and DataView
        this.gridBuffer = new ArrayBuffer(totalBytes);
        this.gridDataView = new DataView(this.gridBuffer);

        // Initialize plant sprites and text objects
        this.plantSprites = {};
        this.waterTexts = {};
        this.sunTexts = {};
    }

    initializeGrid(scene) {
        // Initialize grid data
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                this.setWaterLevel(x, y, 0);
                this.setSunLevel(x, y, 0);
                this.setPlantType(x, y, PlantTypes.NONE);
                this.setGrowthLevel(x, y, 0);
            }
        }

        // Subscribe to end turn event
        my.eventMan.addTurnListener(this.endOfTurnUpdate.bind(this, scene));
    }

    // Calculate byte offset for a cell
    getCellOffset(x, y) {
        return (y * this.gridWidth + x) * this.BYTES_PER_CELL;
    }

    // Accessor methods
    // Water Level
    getWaterLevel(x, y) {
        const offset = this.getCellOffset(x, y);
        return this.gridDataView.getUint8(offset);
    }

    setWaterLevel(x, y, value) {
        const offset = this.getCellOffset(x, y);
        this.gridDataView.setUint8(offset, value);
    }

    // Sun Level
    getSunLevel(x, y) {
        const offset = this.getCellOffset(x, y) + 1;
        return this.gridDataView.getUint8(offset);
    }

    setSunLevel(x, y, value) {
        const offset = this.getCellOffset(x, y) + 1;
        this.gridDataView.setUint8(offset, value);
    }

    // Plant Type
    getPlantType(x, y) {
        const offset = this.getCellOffset(x, y) + 2;
        return this.gridDataView.getUint8(offset);
    }

    setPlantType(x, y, value) {
        const offset = this.getCellOffset(x, y) + 2;
        this.gridDataView.setUint8(offset, value);
    }

    // Growth Level
    getGrowthLevel(x, y) {
        const offset = this.getCellOffset(x, y) + 3;
        return this.gridDataView.getUint8(offset);
    }

    setGrowthLevel(x, y, value) {
        const offset = this.getCellOffset(x, y) + 3;
        this.gridDataView.setUint8(offset, value);
    }

    // Update water level for a cell
    updateWaterLevel(x, y) {
        let currentWater = this.getWaterLevel(x, y);
        let additionalWater = Math.floor(Math.random() * RAND_WATER_MAX);
        let newWaterLevel = Math.min(currentWater + additionalWater, MAX_WATER_CAPACITY);
        this.setWaterLevel(x, y, newWaterLevel);
    }

    // Update sun level for a cell
    updateSunLevel(x, y) {
        let newSunLevel = Math.floor(Math.random() * RAND_SUN_MAX);
        this.setSunLevel(x, y, newSunLevel);
    }

    // End of turn update for all cells
    endOfTurnUpdate(scene) {
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                this.updateWaterLevel(x, y);
                this.updateSunLevel(x, y);
                this.updatePlantGrowth(x, y);
                this.drawCellInfo(scene, x, y);
            }
        }
    }

    // Update plant growth based on resources
    updatePlantGrowth(x, y) {
        const plantType = this.getPlantType(x, y);
        if (plantType !== PlantTypes.NONE) {
            const growthLevel = this.getGrowthLevel(x, y);
            const sunLevel = this.getSunLevel(x, y);
            const waterLevel = this.getWaterLevel(x, y);
            const plantData = this.getPlantAttributesByCode(plantType);

            if (sunLevel >= plantData.sunNeeded && waterLevel >= plantData.waterNeeded) {
                if (growthLevel < 3) {
                    this.setGrowthLevel(x, y, growthLevel + 1);
                    this.updatePlantSprite(x, y);
                }
                this.setWaterLevel(x, y, waterLevel - plantData.waterNeeded);
            }
        }
    }

    // Draw water and sun levels on the grid
    drawCellInfo(scene, x, y) {
        const cellSize = this.cellSize;
        const posX = x * cellSize;
        const posY = y * cellSize;

        const waterLevel = this.getWaterLevel(x, y);
        const sunLevel = this.getSunLevel(x, y);

        const key = `${x},${y}`;

        // Water Level Text
        let waterText = this.waterTexts[key];
        if (!waterText) {
            waterText = scene.add.text(posX, posY, '', { fontSize: '12px', fill: '#00f' });
            this.waterTexts[key] = waterText;
        }
        waterText.setText(`W: ${waterLevel}`);

        // Sun Level Text
        let sunText = this.sunTexts[key];
        if (!sunText) {
            sunText = scene.add.text(posX, posY + 14, '', { fontSize: '12px', fill: '#ff0' });
            this.sunTexts[key] = sunText;
        }
        sunText.setText(`S: ${sunLevel}`);
    }

    // Helper methods
    getPlantAttributesByCode(plantType) {
        const plantAttributes = {
            [PlantTypes.CARROTS]: { sunNeeded: 3, waterNeeded: 2 },
            [PlantTypes.CORNS]: { sunNeeded: 4, waterNeeded: 3 },
            [PlantTypes.ROSES]: { sunNeeded: 2, waterNeeded: 4 }
        };
        return plantAttributes[plantType];
    }

    getPlantTextureKey(plantType, growthLevel) {
        const textures = {
            [PlantTypes.CARROTS]: ['carrotsSeedling', 'carrotsGrowing', 'carrotsFullGrown'],
            [PlantTypes.CORNS]: ['cornsSeedling', 'cornsGrowing', 'cornsFullGrown'],
            [PlantTypes.ROSES]: ['rosesSeedling', 'rosesGrowing', 'rosesFullGrown']
        };
        return textures[plantType][growthLevel - 1];
    }

    updatePlantSprite(x, y) {
        const spriteKey = `${x},${y}`;
        const plantSprite = this.plantSprites[spriteKey];
        if (plantSprite) {
            const plantType = this.getPlantType(x, y);
            const growthLevel = this.getGrowthLevel(x, y);
            const textureKey = this.getPlantTextureKey(plantType, growthLevel);
            plantSprite.setTexture(textureKey);
        }
    }

    // Methods to get plant type name and code
    getPlantTypeName(plantTypeCode) {
        const plantNames = {
            [PlantTypes.CARROTS]: 'carrots',
            [PlantTypes.CORNS]: 'corns',
            [PlantTypes.ROSES]: 'roses'
        };
        return plantNames[plantTypeCode];
    }

    getPlantTypeCode(plantTypeName) {
        const plantCodes = {
            'carrots': PlantTypes.CARROTS,
            'corns': PlantTypes.CORNS,
            'roses': PlantTypes.ROSES
        };
        return plantCodes[plantTypeName];
    }

    // Return adjacent cells including diagonals
    returnAdjacentCells(x, y) {
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
            const newX = x + dx;
            const newY = y + dy;

            // Check if the new coordinates are within bounds
            if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                adjacentCells.push({ x: newX, y: newY });
            }
        });

        return adjacentCells;
    }

    // Check for adjacent plants to enforce planting rules
    getAdjacentPlantCount(x, y) {
        let count = 0;
        const adjacentCells = this.returnAdjacentCells(x, y);
        adjacentCells.forEach(({ x: adjX, y: adjY }) => {
            if (this.getPlantType(adjX, adjY) !== PlantTypes.NONE) {
                count++;
            }
        });
        return count;
    }

    // Check win condition: X plants at Y growth level or above
    checkWinCondition(requiredPlants, requiredGrowthLevel) {
        let count = 0;
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                const plantType = this.getPlantType(x, y);
                const growthLevel = this.getGrowthLevel(x, y);
                if (plantType !== PlantTypes.NONE && growthLevel >= requiredGrowthLevel) {
                    count++;
                }
            }
        }
        return count >= requiredPlants;
    }
}
