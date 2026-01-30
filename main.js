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


import { ColorLabController } from './src/controllers/ColorLabController.js';
import { CreatorController } from './src/controllers/CreatorController.js';

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

    // 2. Maak Layout (Plank)
    const shelf = document.createElement('div');
    shelf.className = 'ingredient-shelf';
    container.appendChild(shelf);

    // [NEW] Wrapper voor workstation (Factory Floor)
    const workstation = document.createElement('div');
    workstation.className = 'workstation';
    container.appendChild(workstation);

    // --- NIEUW: HALL SWITCHER ---
    const hallNav = document.createElement('div');
    hallNav.className = 'hall-nav';
    hallNav.innerHTML = `
        <span style="font-weight:bold; margin-right:10px;">Locatie:</span>
        <button id="btn-hall-1" class="hall-btn active">Meng-hal 1</button>
        <button id="btn-hall-2" class="hall-btn">Meng-hal 2</button>
    `;
    workstation.appendChild(hallNav);

    // Event Listeners voor de Hal Knoppen
    const switchHall = (hallNum) => {
        AppStore.activeHall = hallNum;

        // Update Buttons
        document.getElementById('btn-hall-1').classList.toggle('active', hallNum === 1);
        document.getElementById('btn-hall-2').classList.toggle('active', hallNum === 2);

        // Filter Machines
        const allMachineEls = document.querySelectorAll('.machine');
        allMachineEls.forEach(el => {
            const machineId = el.dataset.id;
            const machine = AppStore.machines.find(m => m.id === machineId);
            if (machine) {
                // Toon alleen als machine.hall matcht met hallNum
                el.style.display = (machine.hall === hallNum) ? 'flex' : 'none';
            }
        });
    };

    hallNav.querySelector('#btn-hall-1').onclick = () => switchHall(1);
    hallNav.querySelector('#btn-hall-2').onclick = () => switchHall(2);
    // --- Einde Hall Switcher ---

    const potArea = document.createElement('div');
    potArea.className = 'pot-container';
    workstation.appendChild(potArea); // Append to workstation

    // 3. Maak Data (Ingredients)
    const ing1 = new Ingredient("Rode Slijm", { h: 0, s: 80, l: 50 }, 5, "slimy", 2000);
    const ing2 = new Ingredient("Blauw Zand", { h: 240, s: 70, l: 40 }, 5, "grainy", 3000);
    const ing3 = new Ingredient("Groen Snel", { h: 120, s: 90, l: 60 }, 9, "smooth", 1500);

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
    workstation.appendChild(machineArea); // Append to workstation

    // Maak 1 machine (was 2)
    const machine1 = new Machine("M1", 5);
    machine1.hall = 1; // Zet in Hal 1

    const machine2 = new Machine("M2", 5); // Start with only 1 machine
    machine2.hall = 2; // Zet in Hal 2 (Om te testen!)

    AppStore.machines.push(machine1, machine2);

    // Render ze
    // Render ze
    [machine1, machine2].forEach(m => {
        machineArea.appendChild(MachineRenderer.create(m));
    });

    // Initial filter applying hack
    setTimeout(() => document.getElementById('btn-hall-1').click(), 100);

    // 6. Maak Output Area (De lopende band voor klare potten)
    const outputArea = document.createElement('div');
    outputArea.id = 'output-conveyor'; // ID voor makkelijke toegang
    outputArea.innerHTML = '<h3>Klaar voor transport</h3>';

    // Wat styling direct hier (of verplaats naar CSS)
    // Wat styling direct hier (of verplaats naar CSS)
    // Inline styles removed in favor of CSS class #output-conveyor

    container.appendChild(outputArea);

    // Start de controller logic
    new MachineController();

    // START COLOR LAB
    new ColorLabController();

    // Start Factory Tools
    new CreatorController();

    console.log("Drag & Drop systeem actief. Probeer items in de potten te slepen!");
});
