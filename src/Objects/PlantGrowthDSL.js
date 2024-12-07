class GrowthCondition {
    constructor(condition) {
        this.condition = condition;
    }
    check(context) {
        return this.condition(context);
    }
}

class GrowthConditionBuilder {
    static sunAndWaterNeeded(sunNeeded, waterNeeded) {
        return new GrowthCondition(({ sunLevel, waterLevel }) => {
            return sunLevel >= sunNeeded && waterLevel >= waterNeeded;
        });
    }

    static adjacencyNeeded(minAdjacentPlants, requiredPlantType = null) {
        return new GrowthCondition(({ neighbors, gridManager }) => {
            const count = neighbors.reduce((acc, cell) => {
                const t = gridManager.getPlantType(cell.x, cell.y);
                if (requiredPlantType == null) {
                    return acc + (t !== 0 ? 1 : 0);
                } else {
                    return acc + (t === requiredPlantType ? 1 : 0);
                }
            }, 0);
            return count >= minAdjacentPlants;
        });
    }

    static noDifferentPlantsAdjacent(requiredPlantType) {
        return new GrowthCondition(({ neighbors, gridManager }) => {
            // ensure no neighbours of different plant type
            return neighbors.every(cell => {
                const plantType = gridManager.getPlantType(cell.x, cell.y);
                return plantType === 0 || plantType === requiredPlantType;
            });
        });
    }

    static moderateSoil(requiredMin, requiredMax) {
        return new GrowthCondition(({ waterLevel }) => {
            return waterLevel >= requiredMin && waterLevel <= requiredMax;
        });
    }

    // static customCondition(fn) {
    //     return new GrowthCondition(fn);
    // }
}

class PlantGrowthDSL {
    static definePlantGrowth(plantType, growthConditions, consumeResources) {
        return { plantType, growthConditions, consumeResources };
    }
}

// define growth conditions 
const GrowthDefinitions = {
    1: PlantGrowthDSL.definePlantGrowth(
        1,
        [ GrowthConditionBuilder.sunAndWaterNeeded(3, 2) ],
        { waterNeeded: 2, sunNeeded: 3 }
    ),
    2: PlantGrowthDSL.definePlantGrowth(
        2,
        [
            GrowthConditionBuilder.sunAndWaterNeeded(4, 3),
            GrowthConditionBuilder.noDifferentPlantsAdjacent(2)
        ],
        { waterNeeded: 3, sunNeeded: 4 }
    ),
    3: PlantGrowthDSL.definePlantGrowth(
        3,
        [
            GrowthConditionBuilder.sunAndWaterNeeded(2, 4),
            GrowthConditionBuilder.adjacencyNeeded(1)
        ],
        { waterNeeded: 4, sunNeeded: 2 }
    )
};
