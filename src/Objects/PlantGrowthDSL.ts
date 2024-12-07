interface GrowthContext {
    sunLevel: number;
    waterLevel: number;
    neighbors: { x: number; y: number }[];
    gridManager: GridManager;
}

interface GridManager {
    getPlantType(x: number, y: number): number;
}

interface ResourceConsumption {
    waterNeeded: number;
    sunNeeded: number;
}

class GrowthCondition {
    private condition: (context: GrowthContext) => boolean;

    constructor(condition: (context: GrowthContext) => boolean) {
        this.condition = condition;
    }

    check(context: GrowthContext): boolean {
        return this.condition(context);
    }
}

class GrowthConditionBuilder {
    static sunAndWaterNeeded(sunNeeded: number, waterNeeded: number): GrowthCondition {
        return new GrowthCondition(({ sunLevel, waterLevel }: GrowthContext) => {
            return sunLevel >= sunNeeded && waterLevel >= waterNeeded;
        });
    }

    static adjacencyNeeded(minAdjacentPlants: number, requiredPlantType: number | null = null): GrowthCondition {
        return new GrowthCondition(({ neighbors, gridManager }: GrowthContext) => {
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

    static noDifferentPlantsAdjacent(requiredPlantType: number): GrowthCondition {
        return new GrowthCondition(({ neighbors, gridManager }: GrowthContext) => {
            // ensure no neighbors of different plant type
            return neighbors.every(cell => {
                const plantType = gridManager.getPlantType(cell.x, cell.y);
                return plantType === 0 || plantType === requiredPlantType;
            });
        });
    }

    static moderateSoil(requiredMin: number, requiredMax: number): GrowthCondition {
        return new GrowthCondition(({ waterLevel }: GrowthContext) => {
            return waterLevel >= requiredMin && waterLevel <= requiredMax;
        });
    }

    // Uncomment and modify this function if needed
    // static customCondition(fn: (context: GrowthContext) => boolean): GrowthCondition {
    //     return new GrowthCondition(fn);
    // }
}

class PlantGrowthDSL {
    static definePlantGrowth(
        plantType: number,
        growthConditions: GrowthCondition[],
        consumeResources: ResourceConsumption
    ): { plantType: number; growthConditions: GrowthCondition[]; consumeResources: ResourceConsumption } {
        return { plantType, growthConditions, consumeResources };
    }
}

// Define growth conditions
const GrowthDefinitions: Record<number, { plantType: number; growthConditions: GrowthCondition[]; consumeResources: ResourceConsumption }> = {
    1: PlantGrowthDSL.definePlantGrowth(
        1,
        [GrowthConditionBuilder.sunAndWaterNeeded(3, 2)],
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
