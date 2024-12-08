import { PlantSprite } from "../PlantSprite.js";
import { my } from "../Globals.js";
import { Actor, Label, Font, Color, vec } from "excalibur";

// Constants for resource limits
export const RAND_SUN_MAX = 5;
export const RAND_WATER_MAX = 2;
export const MAX_WATER_CAPACITY = 10;

// Enumeration for plant types
export const PlantTypes = {
    NONE: 0,
    CARROTS: 1,
    CORNS: 2,
    ROSES: 3
};

// GridManager.js

export class GridManager {
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

        // Add a growth history map
        this.growthHistory = {}; // Format: {"x,y": [{day: 1, level: 1}, ...]}
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
            this.addWaterText (scene, x, y);
        }
        this.waterTexts[key].text = `W: ${waterLevel}`;

        // Sun Level Text
        if (!this.sunTexts[key]) {
            this.addSunText (scene, x, y);
        }
        this.sunTexts[key].text = `S: ${sunLevel}`;
    }

    addWaterText(scene, x, y) {
        const cellSize = scene.cellSize;
        const posX = x * cellSize;
        const posY = y * cellSize;

        const waterLevel = this.getWaterLevel(x, y);

        const key = `${x},${y}`;

        // Water Level Text
        if (!this.waterTexts[key]) {
            this.waterTexts[key] = new Label({
                text: `W: ${waterLevel}`,
                pos: vec(posX, posY),
                fontSize: 12,
                color: Color.Blue,
                z: 4
            });
            scene.add (this.waterTexts[key]);
        }
    }

    addSunText(scene, x, y) {
        const cellSize = scene.cellSize;
        const posX = x * cellSize;
        const posY = y * cellSize;

        const sunLevel = this.getSunLevel(x, y);

        const key = `${x},${y}`;

        // Sun Level Text
        if (!this.sunTexts[key]) {
            this.sunTexts[key] = new Label({
                text: `S: ${sunLevel}`,
                pos: vec(posX, posY + 14),
                fontSize: 12,
                color: Color.Yellow,
                z: 4
            });
            scene.add (this.sunTexts[key]);
        }
    }

    // Planting methods
    canPlant(x, y, plantName) {
        if (this.getPlantType(x, y) !== PlantTypes.NONE) {
            return false;
        }
        return this.getAdjacentPlantCount(x, y) < 2;
    }

    plantCrop(x, y, plantName, scene) {
        console.log ('plantCrop called');
        const plantTypeCode = this.getPlantTypeCode(plantName);
        const textureKey = `${plantName}Seedling`;

        const posX = x * this.cellSize + this.cellSize / 2;
        const posY = y * this.cellSize + this.cellSize / 2;
        // const plantSprite = scene.physics.add.image(posX, posY, textureKey);
        // plantSprite.setScale(2.5);
        const plantSprite = new PlantSprite();
        plantSprite.initSprite(posX, posY, textureKey);
        my.scene.add(plantSprite);

        this.setPlantType(x, y, plantTypeCode);
        this.setGrowthLevel(x, y, 1);
        this.plantSprites[`${x},${y}`] = plantSprite;
    }

    removePlant(x, y) {
        this.setPlantType(x, y, PlantTypes.NONE);
        this.setGrowthLevel(x, y, 0);
    
        const key = `${x},${y}`;
        if (this.plantSprites[key]) {
            this.plantSprites[key].kill();
            delete this.plantSprites[key];
        }
    
        // Clear growth history
        delete this.growthHistory[key]; // deprecated? using lists in commands now
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
            this.plantSprites[key].kill();
        }
        this.plantSprites = {};

        for (let key in this.waterTexts) {
            this.waterTexts[key].kill();
        }
        this.waterTexts = {};

        for (let key in this.sunTexts) {
            this.sunTexts[key].kill();
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

                const plantSprite = new PlantSprite();
                plantSprite.initSprite(posX, posY, textureKey);
                my.scene.add(plantSprite);
                
                this.plantSprites[`${x},${y}`] = plantSprite;
            }

            // redraw cell info
            this.drawCellInfo(scene, x, y);
        });
    }

}
