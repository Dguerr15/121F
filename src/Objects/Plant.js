// This isn't used anymore, so we can delete it

/*
class Plant {
    constructor(type, sunNeeded, waterNeeded, plantSprite) {
        this.type = type;
        this.sunNeeded = sunNeeded;
        this.waterNeeded = waterNeeded;
        this.growthLevel = 0;  // Start with growth level 0
        this.plantSprite = plantSprite;
    }

    updateGrowth(sunLevel, waterLevel) {
        if (this.growthLevel < 3 && sunLevel >= this.sunNeeded && waterLevel >= this.waterNeeded) {
            this.growthLevel++;
            this.updateSprite();
        }
    }

    getSunNeeded() {
        return this.sunNeeded;
    }

    getWaterNeeded() {
        return this.waterNeeded;
    }

    updateSprite(){
        if (this.plantSprite) {
            if (this.growthLevel === 1) {
                this.plantSprite.setTexture(this.type + 'Growing');
            } else if (this.growthLevel === 2) {
                this.plantSprite.setTexture(this.type + 'FullGrown');
            }
        }
    }

    displayInfo() {
        console.log(`${this.name} - Growth Level: ${this.growthLevel}, Sun Needed: ${this.sunNeeded}, Water Needed: ${this.waterNeeded}`);
    }
}
    */