// You may need to adjust these interfaces based on the exact data structure in your code.

interface ScenarioInfo {
    starting_day?: number;
    victory_condition_amount?: number;
    victory_condition_level?: number;
  }
  
  interface CropsInfo {
    carrots?: number;
    roses?: number;
    corns?: number;
  }
  
  interface ScenarioData {
    scenario?: ScenarioInfo;
    crops?: CropsInfo;
    weather?: any; // Adjust this to match your weather data structure
  }
  
  interface SceneInventory {
    carrots: number;
    roses: number;
    corns: number;
  }
  
  interface Scene {
    dayCount: number;
    victoryConditionAmount: number;
    victoryConditionLevel: number;
    inventory: SceneInventory;
    weather?: any; // Adjust to match your weather data structure
  }
  
  interface ScheduledEvent {
    time: string;
    [key: string]: any; // Add more fields as needed
  }
  
  export class ScenarioManager {
    private scene: Scene;
    private scenarioData: ScenarioData;
  
    constructor(scene: Scene) {
      this.scene = scene;
      this.scenarioData = {};
    }
  
    /*
    // Original TOML loading method (commented out)
    // Load a scenario from a TOML file
    async loadScenario(fileName: string) {
      try {
        const filePath = `./src/Scenarios/${fileName}.json`;
        const response = await fetch(filePath);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch scenario file: ${response.statusText}`);
        }
  
        const tomlText = await response.text();
  
        // Parse the TOML text
        const toml = require('toml');
        this.scenarioData = toml.parse(tomlText);
  
        // Apply the parsed scenario data
        this.applyScenario();
      } catch (error) {
        console.error('Error loading or parsing scenario:', error);
      }
    }
    */
  
    // Load a scenario from a JSON file
    async loadScenario(fileName: string): Promise<void> {
      try {
        const filePath = `./src/Scenarios/${fileName}.json`;
        const response = await fetch(filePath);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch scenario file: ${response.statusText}`);
        }
  
        const jsonData: ScenarioData = await response.json();
  
        // Assign the loaded JSON data to scenarioData
        this.scenarioData = jsonData;
  
        // Apply the loaded scenario data
        this.applyScenario();
      } catch (error) {
        console.error('Error loading or parsing scenario:', error);
      }
    }
  
    // Apply the loaded scenario data to the game
    private applyScenario(): void {
      if (this.scenarioData.scenario) {
        const { starting_day, victory_condition_amount, victory_condition_level } = this.scenarioData.scenario;
  
        this.scene.dayCount = starting_day || 1;
        this.scene.victoryConditionAmount = victory_condition_amount || 9;
        this.scene.victoryConditionLevel = victory_condition_level || 3;
  
        // Apply crops starting conditions if available
        const crops = this.scenarioData.crops;
        if (crops) {
          if (typeof crops.carrots === 'number') this.scene.inventory.carrots = crops.carrots;
          if (typeof crops.roses === 'number') this.scene.inventory.roses = crops.roses;
          if (typeof crops.corns === 'number') this.scene.inventory.corns = crops.corns;
        }
  
        /*
        // Apply weather conditions (if needed)
        const weather = this.scenarioData.weather;
        this.scene.weather = weather;  // You can store it or use it as needed
        console.log('Weather data loaded:', weather);
        */
  
        console.log('Scenario applied:', this.scenarioData);
      } else {
        console.error('Invalid scenario data.');
      }
    }
  
    // Apply weather settings (for example)
    applyWeather(weather: any): void {
      if (weather) {
        // Adjust the weather in the game (you can map weather to some game mechanics)
        this.scene.weather = weather;
        console.log('Weather settings:', weather);
      }
    }
  
    // Schedule events based on the event schedule
    scheduleEvents(events: ScheduledEvent[]): void {
      if (events && events.length > 0) {
        events.forEach(event => {
          // Implement logic to schedule these events at the correct times
          console.log(`Scheduled event at ${event.time}:`, event);
          // For example: schedule event actions using Phaser's `time.addEvent` or any timing mechanism
        });
      }
    }
  }
  