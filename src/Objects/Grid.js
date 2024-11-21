// Cell is defined in Cell.js

class Grid {
    constructor(cellSize) {
        this.cellSize = cellSize;
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