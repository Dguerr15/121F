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

// GridManager.js

class GridManager {
    constructor(gridWidth, gridHeight, cellSize) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.cellSize = cellSize;

        this.BYTES_PER_CELL = 4; // waterLevel, sunLevel, plantType, growthLevel

        const totalCells = gridWidth * gridHeight;
        const totalBytes = totalCells * this.BYTES_PER_CELL;

        this.gridBuffer = new ArrayBuffer(totalBytes);
        this.gridDataView = new DataView(this.gridBuffer);

        this.plantSprites = {};
        this.waterTexts = {};
        this.sunTexts = {};
    }

    initializeGrid(scene) {
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                this.setWaterLevel(x, y, 0);
                this.setSunLevel(x, y, 0);
                this.setPlantType(x, y, PlantTypes.NONE);
                this.setGrowthLevel(x, y, 0);
            }
        }

        my.eventMan.addTurnListener(this.endOfTurnUpdate.bind(this, scene));
        my.eventMan.addUndoListener(this.undoTurnUpdate.bind(this, scene));
    }

    // Accessor methods
    getCellOffset(x, y) {
        return (y * this.gridWidth + x) * this.BYTES_PER_CELL;
    }

    getWaterLevel(x, y) {
        return this.gridDataView.getUint8(this.getCellOffset(x, y));
    }

    setWaterLevel(x, y, value) {
        this.gridDataView.setUint8(this.getCellOffset(x, y), value);
    }

    getSunLevel(x, y) {
        return this.gridDataView.getUint8(this.getCellOffset(x, y) + 1);
    }

    setSunLevel(x, y, value) {
        this.gridDataView.setUint8(this.getCellOffset(x, y) + 1, value);
    }

    getPlantType(x, y) {
        return this.gridDataView.getUint8(this.getCellOffset(x, y) + 2);
    }

    setPlantType(x, y, value) {
        this.gridDataView.setUint8(this.getCellOffset(x, y) + 2, value);
    }

    getGrowthLevel(x, y) {
        return this.gridDataView.getUint8(this.getCellOffset(x, y) + 3);
    }

    setGrowthLevel(x, y, value) {
        this.gridDataView.setUint8(this.getCellOffset(x, y) + 3, value);
    }

    // End of turn updates. performed pre increment of daycount.
    endOfTurnUpdate(scene) {
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                this.updateResources(x, y);
                this.updatePlantGrowth(x, y);
                this.drawCellInfo(scene, x, y);
            }
        }
    }

    // Undo turn updates. performed post decrement of daycount.
    undoTurnUpdate(scene) {
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                this.undoResources(x, y);
                this.undoPlantGrowth(x, y); // not implemented yet.
                this.drawCellInfo(scene, x, y);
            }
        }
    }

    updateResources(x, y) {
        this.updateWaterLevel(x, y);
        this.updateSunLevel(x, y);
    }

    undoResources(x, y){
        this.undoWaterLevel(x, y);
        this.undoSunLevel(x, y); // sun level is not accumulated, can reuse update function.
    }

    updateWaterLevel(x, y) {
        const currentWater = this.getWaterLevel(x, y);
        const additionalWater = this.getFakeRand(x, y, my.scene.dayCount) % RAND_WATER_MAX;
        this.setWaterLevel(x, y, Math.min(currentWater + additionalWater, MAX_WATER_CAPACITY));
    }

    undoWaterLevel(x, y){
        const currentWater = this.getWaterLevel(x, y);
        const additionalWater = this.getFakeRand(x, y, my.scene.dayCount - 1) % RAND_WATER_MAX;
        this.setWaterLevel(x, y, Math.max(currentWater - additionalWater, 0));
    }

    updateSunLevel(x, y) {
        // console.log ("updating sun level, fake rand: " + this.getFakeRand(x, y, my.scene.dayCount));
        const sun = this.getFakeRand(x, y, my.scene.dayCount) % RAND_SUN_MAX;
        this.setSunLevel(x, y, sun);
    }

    undoSunLevel(x, y){
        // console.log ("undoing sun level, fake rand: " + this.getFakeRand(x, y, my.scene.dayCount));
        const sun = this.getFakeRand(x, y, my.scene.dayCount - 1) % RAND_SUN_MAX;
        this.setSunLevel(x, y, sun);
    }

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

    undoPlantGrowth(x, y){
        // const plantType = this.getPlantType(x, y);
        // if (plantType !== PlantTypes.NONE) {
        //     const growthLevel = this.getGrowthLevel(x, y);
        //     if (growthLevel > 0) {
        //         const sunLevel = this.getFakeRand(x, y, my.scene.dayCount) % RAND_SUN_MAX;
        //         const waterLevel = this.getWaterLevel(x, y);
        //         if (waterLevel < this.getPlantAttributesByCode(plantType).waterNeeded){
        //             this.setWaterLevel(x, y, waterLevel + this.getPlantAttributesByCode(plantType).waterNeeded);
        //             this.setGrowthLevel(x, y, growthLevel - 1);
        //         }
        //         this.updatePlantSprite(x, y);
        //     }
        // }
    }

    // Used for easy reverse engineering for undo
    getFakeRand(gridX, gridY, dayCount){
        // return some number based on parameters gridx gridy daycount. +1 to avoid 0.
        return (gridX + 1) + (gridY + 1) + (dayCount + 1);
    }

    drawCellInfo(scene, x, y) {
        const cellSize = this.cellSize;
        const posX = x * cellSize;
        const posY = y * cellSize;

        const waterLevel = this.getWaterLevel(x, y);
        const sunLevel = this.getSunLevel(x, y);

        const key = `${x},${y}`;

        // Water Level Text
        if (!this.waterTexts[key]) {
            this.waterTexts[key] = scene.add.text(posX, posY, '', { fontSize: '12px', fill: '#00f' });
        }
        this.waterTexts[key].setText(`W: ${waterLevel}`);

        // Sun Level Text
        if (!this.sunTexts[key]) {
            this.sunTexts[key] = scene.add.text(posX, posY + 14, '', { fontSize: '12px', fill: '#ff0' });
        }
        this.sunTexts[key].setText(`S: ${sunLevel}`);
    }

    // Planting methods
    canPlant(x, y, plantName) {
        if (this.getPlantType(x, y) !== PlantTypes.NONE) {
            return false;
        }
        return this.getAdjacentPlantCount(x, y) < 2;
    }

    plantCrop(x, y, plantName, scene) {
        const plantTypeCode = this.getPlantTypeCode(plantName);
        const textureKey = `${plantName}Seedling`;

        const posX = x * this.cellSize + this.cellSize / 2;
        const posY = y * this.cellSize + this.cellSize / 2;
        const plantSprite = scene.physics.add.image(posX, posY, textureKey);
        plantSprite.setScale(2.5);

        this.setPlantType(x, y, plantTypeCode);
        this.setGrowthLevel(x, y, 1);
        this.plantSprites[`${x},${y}`] = plantSprite;
    }

    removePlant(x, y) {
        this.setPlantType(x, y, PlantTypes.NONE);
        this.setGrowthLevel(x, y, 0);

        const spriteKey = `${x},${y}`;
        if (this.plantSprites[spriteKey]) {
            this.plantSprites[spriteKey].destroy();
            delete this.plantSprites[spriteKey];
        }
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

    getPlantTypeName(plantTypeCode) {
        return Object.keys(PlantTypes).find(key => PlantTypes[key] === plantTypeCode).toLowerCase();
    }

    getPlantTypeCode(plantTypeName) {
        console.log ("attempting to get PlantTypes[] of plantTypeName: " + plantTypeName);
        return PlantTypes[plantTypeName.toUpperCase()];
    }

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
            if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                adjacentCells.push({ x: newX, y: newY });
            }
        });

        return adjacentCells;
    }

    getAdjacentPlantCount(x, y) {
        return this.returnAdjacentCells(x, y).reduce((count, { x: adjX, y: adjY }) => {
            return count + (this.getPlantType(adjX, adjY) !== PlantTypes.NONE ? 1 : 0);
        }, 0);
    }

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

    // get and set grid state for game saving
    getGridState() {
        console.log("getting grid state");
        const gridState = [];
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                gridState.push({
                    x: x,
                    y: y,
                    waterLevel: this.getWaterLevel(x, y),
                    sunLevel: this.getSunLevel(x, y),
                    plantType: this.getPlantType(x, y),
                    growthLevel: this.getGrowthLevel(x, y)
                });
            }
        }

        return gridState;
    }

    setGridState(gridState, scene) {
        console.log("setting grid state");

        // clear existing grid ui and text
        for (let key in this.plantSprites) {
            this.plantSprites[key].destroy();
        }
        this.plantSprites = {};

        for (let key in this.waterTexts) {
            this.waterTexts[key].destroy();
        }
        this.waterTexts = {};

        for (let key in this.sunTexts) {
            this.sunTexts[key].destroy();
        }
        this.sunTexts = {};

        // set new grid state
        gridState.forEach(cell => {
            const x = cell.x;
            const y = cell.y;

            this.setWaterLevel(x, y, cell.waterLevel);
            this.setSunLevel(x, y, cell.sunLevel);
            this.setPlantType(x, y, cell.plantType);
            this.setGrowthLevel(x, y, cell.growthLevel);

            // redraw plants if exist
            if (cell.plantType !== PlantTypes.NONE) {
                const plantType = cell.plantType;
                const growthLevel = cell.growthLevel;
                const textureKey = this.getPlantTextureKey(plantType, growthLevel);

                const posX = x * this.cellSize + this.cellSize / 2;
                const posY = y * this.cellSize + this.cellSize / 2;

                const plantSprite = scene.physics.add.image(posX, posY, textureKey);
                plantSprite.setScale(2.5);

                this.plantSprites[`${x},${y}`] = plantSprite;
            }

            // redraw cell info
            this.drawCellInfo(scene, x, y);
        });
    }

}
