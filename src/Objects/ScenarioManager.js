import { my } from "../Globals.js";

export class ScenarioManager {
  constructor(scene) {
    this.scene = scene;
    this.scenarioData = {};
  }

  async loadScenario(fileName) {
    try {
      const filePath = `./src/Scenarios/${fileName}.json`;
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`Failed to fetch scenario file: ${response.statusText}`);
      }

      const jsonData = await response.json();

      // Assign the loaded JSON data to scenarioData
      this.scenarioData = jsonData;

      // Apply the loaded scenario data
      this.applyScenario();
    } catch (error) {
      console.error('Error loading or parsing scenario:', error);
    }
  }


  // Apply the loaded scenario data to the game
  applyScenario() {
    if (this.scenarioData.scenario) {
        const { starting_day, victory_condition_amount, victory_condition_level } = this.scenarioData.scenario;
        this.scene.dayCount = starting_day || 1;
        this.scene.victoryConditionAmount = victory_condition_amount || 9;
        this.scene.victoryConditionLevel = victory_condition_level || 3;

        // Apply crops starting conditions
        const crops = this.scenarioData.crops;
        this.scene.inventory.carrots = crops.carrots;
        this.scene.inventory.roses = crops.roses;
        this.scene.inventory.corns = crops.corns;

        this.scene.updateInventory();

        Object.values(this.scenarioData.special_events).forEach(event => {
          my.specialEvents[event.day_of_event] = event.event;
        });
    } else {
        console.error('Invalid scenario data.');
    }
  }
}
