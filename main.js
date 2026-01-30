// Import global utilities
import { eventBus } from './src/utils/EventBus.js';
import { Ingredient } from './src/models/Ingredient.js';
import { Pot } from './src/models/Pot.js';
import { AppStore } from './src/utils/AppStore.js';
import { IngredientRenderer } from './src/views/IngredientRenderer.js';
import { PotRenderer } from './src/views/PotRenderer.js';
import { DragController } from './src/controllers/DragController.js';
import { WeatherController } from './src/controllers/WeatherController.js';
import { Machine } from './src/models/Machine.js';
import { MachineRenderer } from './src/views/MachineRenderer.js';
import { MachineController } from './src/controllers/MachineController.js';

// 1. Global Error Handler (The "Craft")
window.addEventListener('unhandledrejection', (event) => {
    console.error("CRITICAL ASYNC ERROR:", event.reason);
    // TODO: Connect this to a UI 'Toaster' notification in Block 1
    alert(`Oeps! Er ging iets mis: ${event.reason.message || event.reason}`);
});

// 2. App Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log("Future Color App Initialized");

    // 1. Start de DragController
    new DragController();

    // 1b. Start Weather Controller
    const weatherApp = new WeatherController();
    weatherApp.init();

    const container = document.getElementById('simulation-container');

    // 2. Maak Layout (Plank en Potten Area)
    const shelf = document.createElement('div');
    shelf.className = 'ingredient-shelf';
    container.appendChild(shelf);

    const potArea = document.createElement('div');
    potArea.className = 'pot-container';
    container.appendChild(potArea);

    // 3. Maak Data (Ingredients)
    const ing1 = new Ingredient("Rode Slijm (Speed 5)", { h: 0, s: 80, l: 50 }, 5, "slimy", 2000);
    const ing2 = new Ingredient("Blauw Zand (Speed 5)", { h: 240, s: 70, l: 40 }, 5, "grainy", 3000);
    const ing3 = new Ingredient("Groen Snel (Speed 9)", { h: 120, s: 90, l: 60 }, 9, "smooth", 1500);

    // Stop ze in de store
    [ing1, ing2, ing3].forEach(ing => {
        AppStore.addIngredient(ing);
        shelf.appendChild(IngredientRenderer.create(ing));
    });

    // 4. Maak Data (Pots)
    const pot1 = new Pot();
    const pot2 = new Pot();

    // Stop ze in de store
    [pot1, pot2].forEach(pot => {
        AppStore.addPot(pot);
        potArea.appendChild(PotRenderer.create(pot));
    });

    // 5. Maak Machines aan
    const machineArea = document.createElement('div');
    machineArea.className = 'machine-row';
    container.appendChild(machineArea);

    // Maak 2 machines: Eentje snel (5), eentje traag (9) ofzo
    const machine1 = new Machine("M1", 5); // Accepteert alleen ingredients met speed 5
    const machine2 = new Machine("M2", 5); // Ook speed 5, handig om hittegolf te testen

    AppStore.machines.push(machine1, machine2);

    // Render ze
    [machine1, machine2].forEach(m => {
        machineArea.appendChild(MachineRenderer.create(m));
    });

    // Start de controller logic
    new MachineController();

    console.log("Drag & Drop systeem actief. Probeer items in de potten te slepen!");
});
