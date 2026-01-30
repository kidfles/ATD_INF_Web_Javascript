import { Ingredient } from '../models/Ingredient.js';
import { Pot } from '../models/Pot.js';
import { Machine } from '../models/Machine.js';
import { AppStore } from '../utils/AppStore.js';
import { IngredientRenderer } from '../views/IngredientRenderer.js';
import { PotRenderer } from '../views/PotRenderer.js';
import { MachineRenderer } from '../views/MachineRenderer.js';
import { ColorMath } from '../utils/ColorMath.js';

export class CreatorController {
    constructor() {
        this.initListeners();
    }

    initListeners() {
        // Modal Logic
        const modal = document.getElementById('creator-modal');
        const openBtn = document.getElementById('nav-tools');
        const closeBtn = document.getElementById('btn-close-tools');

        if (openBtn && modal) {
            openBtn.addEventListener('click', () => modal.showModal());
        }
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.close());
        }

        // Close when clicking outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.close();
        });

        // 1. Ingrediënt Button
        document.getElementById('btn-create-ing').addEventListener('click', () => this.createIngredient());

        // 2. Pot Button
        document.getElementById('btn-create-pot').addEventListener('click', () => this.createPot());

        // 3. Machine Button
        document.getElementById('btn-create-mach').addEventListener('click', () => this.createMachine());
    }

    createIngredient() {
        const name = document.getElementById('new-ing-name').value || "Naamloos";
        const hexColor = document.getElementById('new-ing-color').value;
        const structure = document.getElementById('new-ing-struct').value;
        const speed = parseInt(document.getElementById('new-ing-speed').value);
        const time = parseInt(document.getElementById('new-ing-time').value);

        // Validatie
        if (speed < 1 || speed > 10) {
            alert("Snelheid moet tussen 1 en 10 zijn.");
            return;
        }

        // Conversie Hex -> HSL (Gebruik de helper die we in stap 1 maakten)
        const hsl = ColorMath.hexToHSL(hexColor);

        // Model aanmaken
        const newIng = new Ingredient(name, hsl, speed, structure, time);

        // Opslaan
        AppStore.addIngredient(newIng);

        // Renderen (Zoek de plank)
        const shelf = document.querySelector('.ingredient-shelf');
        if (shelf) {
            shelf.appendChild(IngredientRenderer.create(newIng));
        }

        console.log("Nieuw ingrediënt gemaakt:", newIng);
    }

    createPot() {
        const newPot = new Pot();
        AppStore.addPot(newPot);

        const potContainer = document.querySelector('.pot-container');
        if (potContainer) {
            potContainer.appendChild(PotRenderer.create(newPot));
        }
    }

    createMachine() {
        const speed = parseInt(document.getElementById('new-mach-speed').value);

        // Genereer een ID (M3, M4, etc.)
        const id = `M${AppStore.machines.length + 1}`;

        const newMachine = new Machine(id, speed);
        AppStore.machines.push(newMachine);

        const machineRow = document.querySelector('.machine-row');
        if (machineRow) {
            machineRow.appendChild(MachineRenderer.create(newMachine));
        }
    }
}
