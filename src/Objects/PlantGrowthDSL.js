class GrowthCondition {
    constructor(condition) {
        this.condition = condition;
    }
    check(context) {
        return this.condition(context);
    }
}

class GrowthConditionBuilder {
    static sunAndWaterNeeded(waterNeeded, sunNeeded) {
        return new GrowthCondition(({ sunLevel, waterLevel }) => {
            console.log("waterLevel: " + waterLevel + ", sunLevel: " + sunLevel);
            return sunLevel >= sunNeeded && waterLevel >= waterNeeded;
        });
    }

    static adjacencyNeeded(minAdjacentPlants, requiredPlantType = null) {
        return new GrowthCondition(({ neighbors, gridManager }) => {
            console.log("minAdjacentPlants: " + minAdjacentPlants + ", requiredPlantType: " + requiredPlantType);
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
                console.log("neighbor plantType: " + plantType + ", requiredPlantType: " + requiredPlantType);
                console.log("eval:" + (plantType === 0 || plantType === requiredPlantType));
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
export const GrowthDefinitions = {
    //carrots
    1: { 1, [ GrowthConditionBuilder.sunAndWaterNeeded(5, 4) ] , {waterNeeded: 5, sunNeeded:4 } }, 
    // 1: PlantGrowthDSL.definePlantGrowth(
    //     1,
    //     [ GrowthConditionBuilder.sunAndWaterNeeded(5, 4) ],
    //     { waterNeeded: 5, sunNeeded: 4 }
    // ),
    //roses
    3: PlantGrowthDSL.definePlantGrowth(
        3,
        [
            GrowthConditionBuilder.sunAndWaterNeeded(3, 4),
            GrowthConditionBuilder.noDifferentPlantsAdjacent(3)
        ],
        { waterNeeded: 3, sunNeeded: 4 }
    ),
    //corn
    2: PlantGrowthDSL.definePlantGrowth(
        2,
        [
            GrowthConditionBuilder.sunAndWaterNeeded(4, 2),
            GrowthConditionBuilder.adjacencyNeeded(1)
        ],
        { waterNeeded: 4, sunNeeded: 2 }
    )
};
