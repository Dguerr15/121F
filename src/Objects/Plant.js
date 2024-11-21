class Plant {
    constructor(type, growthLevel) {
        const validTypes = ['A', 'B', 'C'];
        const validGrowthLevels = [1, 2, 3];

        if (!validTypes.includes(type)) {
            throw new Error('Invalid type. Valid types are ' + validTypes.join(', ') + '.');
        }

        if (!validGrowthLevels.includes(growthLevel)) {
            throw new Error('Invalid growth level. Valid levels are ' + validGrowthLevels.join(', ') + '.');
        }

        this.type = type;
        this.growthLevel = growthLevel;
    }

    grow() {
        if (this.growthLevel < 3) {
            this.growthLevel++;
        } else {
            console.log('The plant is already at the maximum growth level.');
        }
    }

    displayInfo() {
        console.log(`Plant Type: ${this.type}, Growth Level: ${this.growthLevel}`);
    }
}