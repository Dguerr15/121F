// Replace these with appropriate type declarations or imports.
declare const Phaser: any; // from 'phaser' if needed.
declare const RAND_SUN_MAX: number;
declare const RAND_WATER_MAX: number;
declare const MAX_WATER_CAPACITY: number;

enum PlantTypesEnum {
    NONE = 0,
    CARROTS = 1,
    CORNS = 2,
    ROSES = 3
}

type PlantTypesKeys = keyof typeof PlantTypesEnum;
const PlantTypes = PlantTypesEnum; // For compatibility

interface CellState {
    x: number;
    y: number;
    waterLevel: number;
    sunLevel: number;
    plantType: number;
    growthLevel: number;
}

export class GridManager {
    gridWidth: number;
    gridHeight: number;
    cellSize: number;
    BYTES_PER_CELL: number;

    private gridBuffer: ArrayBuffer;
    private gridDataView: DataView;

    private plantSprites: Record<string, Phaser.Physics.Arcade.Image>;
    private waterTexts: Record<string, Phaser.GameObjects.Text>;
    private sunTexts: Record<string, Phaser.GameObjects.Text>;

    // Format: {"x,y": [{day: number, level: number}, ...]}
    private growthHistory: Record<string, { day: number; level: number }[]>;

    constructor(gridWidth: number, gridHeight: number, cellSize: number) {
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
        this.growthHistory = {};
    }

    initializeGrid(scene: Phaser.Scene): void {
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
    private getCellOffset(x: number, y: number): number {
        return (y * this.gridWidth + x) * this.BYTES_PER_CELL;
    }

    getWaterLevel(x: number, y: number): number {
        return this.gridDataView.getUint8(this.getCellOffset(x, y));
    }

    setWaterLevel(x: number, y: number, value: number): void {
        this.gridDataView.setUint8(this.getCellOffset(x, y), value);
    }

    getSunLevel(x: number, y: number): number {
        return this.gridDataView.getUint8(this.getCellOffset(x, y) + 1);
    }

    setSunLevel(x: number, y: number, value: number): void {
        this.gridDataView.setUint8(this.getCellOffset(x, y) + 1, value);
    }

    getPlantType(x: number, y: number): number {
        return this.gridDataView.getUint8(this.getCellOffset(x, y) + 2);
    }

    setPlantType(x: number, y: number, value: number): void {
        this.gridDataView.setUint8(this.getCellOffset(x, y) + 2, value);
    }

    getGrowthLevel(x: number, y: number): number {
        return this.gridDataView.getUint8(this.getCellOffset(x, y) + 3);
    }

    setGrowthLevel(x: number, y: number, value: number): void {
        this.gridDataView.setUint8(this.getCellOffset(x, y) + 3, value);
    }

    // Used for easy reverse engineering for undo
    getFakeRand(gridX: number, gridY: number, dayCount: number): number {
        // return some number based on parameters gridx gridy daycount. +1 to avoid 0.
        return (gridX + 1) + (gridY + 1) + (dayCount + 1);
    }

    drawCellInfo(scene: Phaser.Scene, x: number, y: number): void {
        const cellSize = this.cellSize;
        const posX = x * cellSize;
        const posY = y * cellSize;

        const waterLevel = this.getWaterLevel(x, y);
        const sunLevel = this.getSunLevel(x, y);

        const key = `${x},${y}`;

        // Water Level Text
        if (!this.waterTexts[key]) {
            this.waterTexts[key] = scene.add.text(posX, posY, '', { fontSize: '12px', color: '#0000ff' });
        }
        this.waterTexts[key].setText(`W: ${waterLevel}`);

        // Sun Level Text
        if (!this.sunTexts[key]) {
            this.sunTexts[key] = scene.add.text(posX, posY + 14, '', { fontSize: '12px', color: '#ffff00' });
        }
        this.sunTexts[key].setText(`S: ${sunLevel}`);
    }

    // Planting methods
    canPlant(x: number, y: number, plantName: string): boolean {
        if (this.getPlantType(x, y) !== PlantTypes.NONE) {
            return false;
        }
        return this.getAdjacentPlantCount(x, y) < 2;
    }

    plantCrop(x: number, y: number, plantName: string, scene: Phaser.Scene): void {
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

    removePlant(x: number, y: number): void {
        this.setPlantType(x, y, PlantTypes.NONE);
        this.setGrowthLevel(x, y, 0);

        const key = `${x},${y}`;
        if (this.plantSprites[key]) {
            this.plantSprites[key].destroy();
            delete this.plantSprites[key];
        }

        // Clear growth history
        delete this.growthHistory[key];
    }

    updatePlantSprite(x: number, y: number): void {
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
    getPlantTextureKey(plantType: number, growthLevel: number): string {
        const textures: Record<number, string[]> = {
            [PlantTypes.CARROTS]: ['carrotsSeedling', 'carrotsGrowing', 'carrotsFullGrown'],
            [PlantTypes.CORNS]: ['cornsSeedling', 'cornsGrowing', 'cornsFullGrown'],
            [PlantTypes.ROSES]: ['rosesSeedling', 'rosesGrowing', 'rosesFullGrown']
        };
        return textures[plantType][growthLevel - 1];
    }

    getPlantTypeName(plantTypeCode: number): string {
        const key = Object.keys(PlantTypes).find(key => (PlantTypes as any)[key] === plantTypeCode);
        return key ? key.toLowerCase() : '';
    }

    getPlantTypeCode(plantTypeName: string): number {
        console.log("attempting to get PlantTypes[] of plantTypeName: " + plantTypeName);
        return (PlantTypes as any)[plantTypeName.toUpperCase()];
    }

    returnAdjacentCells(x: number, y: number): { x: number; y: number }[] {
        const adjacentCells: { x: number; y: number }[] = [];
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

    getAdjacentPlantCount(x: number, y: number): number {
        return this.returnAdjacentCells(x, y).reduce((count, { x: adjX, y: adjY }) => {
            return count + (this.getPlantType(adjX, adjY) !== PlantTypes.NONE ? 1 : 0);
        }, 0);
    }

    checkWinCondition(requiredPlants: number, requiredGrowthLevel: number): boolean {
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
    getGridState(): CellState[] {
        console.log("getting grid state");
        const gridState: CellState[] = [];
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

    setGridState(gridState: CellState[], scene: Phaser.Scene): void {
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
