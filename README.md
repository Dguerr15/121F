# Devlog F0 Software Requirement Satisfaction 12/04

## How we satisfied the software requirements

[F0.a] You control a character moving over a 2D grid.

Same as last week.

[F0.b] You advance time manually in the turn-based simulation.

Same as last week.

[F0.c] You can reap or sow plants on grid cells only when you are near them.

Same as last week.

[F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.

Same as last week.

[F0.e] Each plant on the grid has a distinct type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).

Same as last week.

[F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).

Same as last week.

[F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).

Same as last week.

[F1.a] The important state of your game's grid must be backed by a single contiguous byte array in AoS or SoA format. If your game stores the grid state in multiple format, the byte array format must be the primary format (i.e. other formats are decoded from it as needed). Each command, such as PlantCropCommand or RemovePlantCommand, is stored as an individual object with all its related properties (like gridX, gridY, plantName) bundled together within the object. These command objects are then collected in arrays, such as history or redoStack in the CommandManager, where each entry is a fully-formed command object.

![diagram](https://github.com/user-attachments/assets/dede9a6c-8a4d-45cd-9c5a-c7276a335e3b)

We backed the grid state with a single contiguous array in an AoS format. Each grid cell is represented as an object containing the relevant data for the plant type and growth stage. This array is the primary format for managing the grid state, and all other derived formats, such as visual representations and plant behaviors, are decoded from this central structure as needed. 

[F1.b] The player must be able to manually save their progress in the game. This must allow them to load state and continue play another day (i.e. after quitting the game app). The player must be able to manage multiple save files/slots.

We satisfy the requirement for manual saving by using the localStorage API to allow players to save their progress in multiple slots. The player can save their progress by pressing the 'K' key, which triggers a prompt for selecting one of the available save slots (saveSlot1, saveSlot2). The game state, including inventory, grid, and day count, is stored in the chosen slot, and players can load their progress from a specific slot using the 'L' key. This enables the player to resume their game from the point they left off, even after quitting and restarting the game.

[F1.c] The game must implement an implicit auto-save system to support recovery from unexpected quits. (For example, when the game is launched, if an auto-save entry is present, the game might ask the player "do you want to continue where you left off?" The auto-save entry might or might not be visible among the list of manual save entries available for the player to load as part of F1.b.)

We satisfy the requirement for an implicit auto-save system by periodically saving the game state to saveSlot3. This auto-save process is triggered every 5 seconds using the autoSavePrompt method, which automatically saves the player's current progress (including inventory, grid state, and day count) to the specified slot. When the game is launched, the player is prompted with the option to continue from the auto-save entry, ensuring that they can recover their progress after an unexpected quit. This feature works alongside the manual save system, allowing the player to manage multiple save files, including the auto-save slot. The player will only be prompted to continue off the last auto-save if there is an auto-save slot present.

[F1.d] The player must be able to undo every major choice (all the way back to the start of play), even from a saved game. They should be able to redo (undo of undo operations) multiple times.

We used the Command Pattern to enable undo and redo functionality for all major player actions, such as planting crops, removing plants, and advancing time. Each action is encapsulated in a command class (PlantCropCommand, RemovePlantCommand, AdvanceTimeCommand) that implements execute, undo, and serialize methods, ensuring reversible and persistent operations. A CommandManager tracks a history stack for undo and a redo stack, allowing players to step backward or forward through their actions. 

## Reflection

Our team’s plan evolved as we considered the complexity of managing actions in the game. Initially, we used a direct approach to handle actions like planting and advancing time, but this made it difficult to implement the undo and redo functionality especially across save states. We switched to the command pattern to address this, as it allowed us to encapsulate each action as a command object just as we did in prior Demo assignments, making it easier to manage the history of actions and reverse them when needed. This change also gave us more flexibility in handling future game mechanics and ensuring the game's state could be easily modified without disrupting other systems.


---------------------------------------------------------------------------------------------------------------------------------------------------------


# Devlog F0 Software Requirement Satisfaction 11/27

## How we satisfied the software requirements

[F0.a] You control a character moving over a 2D grid.

We implemented a 2D grid system drawn using the drawGrid() method in farming.js. The player's movement is handled through the movePlayer method, allowing the player to move freely in four directions (up, down, left, and right) on the grid using W, A, S, and D. We also ensured the character stays within the 2D grid boundaries.

[F0.b] You advance time manually in the turn-based simulation.

The player can advance time manually by calling the advanceTime() function in the farming.js file by pressing the Spacebar in-game. This function triggers updates for all subscribed listeners which are listed as follows: The resources (sun and water) are recalculated for each cell, the dayCount is updated, each plant growth level is checked and updated depending on the sun and water levels of their cell, and the win condition is checked. 

[F0.c] You can reap or sow plants on grid cells only when you are near them.

The ability to sow plants on grid cells is implemented in the GridManager class through the plantCrop() method by pressing Q in-game. A plant can be planted in a grid cell if the cell is empty, ensuring players can only interact with nearby cells, satisfying the condition that planting or harvesting is proximity-based. Additionally, the pickUpPlant() method in the GridManager class allows plants to be removed from the grid (reaped) if the player interacts with the cell by pressing E in-game.

[F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.

Each grid cell has sun and water levels defined by the Cell class. The updateWaterLevel() and updateSunLevel() methods handle the random generation of water and sun levels, which are updated per day. Water slowly accumulates over turns but is capped at a maximum capacity to prevent infinite storage, while sun is randomly generated for each cell at the start of each turn and does not persist between turns. Water levels can build up, ensuring that moisture can be stored and accumulated, but the sun levels are reset each turn, following the rule that sun energy cannot be stored.

[F0.e] Each plant on the grid has a distinct type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).

Each plant is represented by an instance of the Plant class, which has a type (such as "carrots", "roses", or "corns") and a growthLevel that starts at 0. The plant’s growth is tracked and updated in the updateGrowth() method based on the sun and water levels in the grid cell. When conditions are met (sufficient sun and water), the plant’s growth level increases, and its sprite changes to reflect the plant’s current stage of growth. The visual representation of the plant changes based on its growth level via the updateSprite method, ensuring distinct progression states.

[F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).

Plant growth is managed through the updateGrowth() method in the Plant class. For each plant, growth is dependent on the sun and water levels available in the surrounding grid cell. If the sun and water levels meet the plant's required thresholds (sunNeeded and waterNeeded), the growth level of the plant increases, and the sprite is updated to reflect the next stage of growth. The GridManager class checks all plants in the grid every turn and updates their growth based on the current resource levels in their respective cells. This ensures that growth follows a spatial rule set, where each plant's growth is influenced by its location and the resources available. There is also a check for plants in adjacent cells, so the player cannot sow plants near each other.

[F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).

The win condition is checked in checkWinCondition(), which evaluates whether the required number of plants has reached a specified growth level. For example, achieving at least 9 plants at growth level 3 triggers a victory message, concluding the scenario when the condition is met.

## Reflection

Our team's approach has evolved from an early focus on getting basic functionality working to a more structured design that considers long-term scalability, maintainability, and the requirements for future features. While the initial implementation had several challenges, including random resource generation and getting all of the plants to grow correctly, the team’s reflection and changes to tools, materials, and roles helped address those issues. These adjustments also set the foundation for future development, ensuring that the game logic could be expanded and refined as needed. 


-------------------------------------------------------------------------------------------------------------------------------------------------------------------


# Devlog Entry - 11/14

## Introducing the Team
Tools Lead - Nick,Nate

Engine Lead - Norman, Josh

Design Lead - David

Everybody will have input into all parts these are just the people facilitating the conversations.

## Tools and materials
1. Our team will start with Phaser. We chose Phaser mainly because of its deep documentation online with extensive examples. Secondly, we chose Phaser because of its ease of access. It is very easy to start on a Phaser project since its systems are simple for the most part. And, finally, we went with Phaser because of our previous experience with it in CMPM 120, the prerequisite to this course. Since we are all pretty experienced with Phaser rather than Unity or another engine, we believed this would be quick to start with and get our game up and running as efficiently as possible.

2. Since we are using Phaser as our main engine to start, we are going to be using the JavaScript language and the JSON data language. We chose these because we did lots of projects in CMPM 120 using these languages. We felt that we had a somewhat solid background in these languages, so this seemed like an obvious choice.

3. Visual Studio Code will be our team's main IDE. Since we all have been using this IDE for a while, it made sense to stick with it to be efficient for the project. For the visual assets of our game, we will be using GIMP and Tiled. This should hopefully make our workflow of art simple as well, but we chose GIMP and Tiled because it's something our team is excited to learn more about.

4. Since we are using Phaser, our alternate platform will be Excalibur.js. We thought it would be smart to use an engine that has some similarities to Phaser as it will cause less headaches and stress as we carry our code forward and implement new ideas. We also wanted to keep the submission deadline in mind and remember that at the end of everything, we will have to submit something that works, so using Excalibur.js was our choice. However, this engine uses TypeScript as its main language, so we will probably have to switch our code around for that which shouldn't be too difficult.

## Outlook
- Our team is looking to add more interactive and fun game mechanics such as a weather system or maybe a combat system where enemies try to steal your crops and so on. We think this can add another interesting element to that game we will make that other teams might not try.
- We anticipate that switching platforms and languages will be the hardest and riskiest part of the project. Since none of us have used Excalibur.js before, this could be a tough obstacle to move past. We also have to make sure we finish our project on time to submit it, so we will have to figure out effective workflows when switching our engine/library.
- We are hoping to learn GIMP and Tiled for asset creation for our game and also the best way to refactor and change our code which will make it a lot easier if we have to switch engines or platforms. This can be beneficial for us in the future as well since we will always be working with different technologies in our careers, so being able to adapt is another key element we want to learn.

