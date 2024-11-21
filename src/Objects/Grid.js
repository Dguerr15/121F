// Cell is defined in Cell.js

class Grid {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.grid = [];
    }

    initializeGrid(rows, cols) {
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < cols; j++) {
                row.push(new Cell(i, j));
            }
            this.grid.push(row);
        }
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