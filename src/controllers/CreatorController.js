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
        this.dialog = document.getElementById('creator-modal');
        this.initListeners();
    }

    initListeners() {
        // --- 1. Modal Openen/Sluiten Logica ---

        // Openen via de Navigatie knop
        const navBtn = document.getElementById('nav-tools');
        if (navBtn) {
            navBtn.addEventListener('click', () => {
                this.dialog.showModal();
            });
        }

        // Sluiten via het kruisje
        const closeBtn = document.getElementById('btn-close-tools');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.dialog.close();
            });
        }

        // --- 2. Creatie Logica (De "Functionaliteit") ---

        // Nieuw Ingrediënt
        document.getElementById('btn-create-ing').addEventListener('click', () => this.createIngredient());

        // Nieuwe Pot
        document.getElementById('btn-create-pot').addEventListener('click', () => this.createPot());

        // Nieuwe Machine
        document.getElementById('btn-create-mach').addEventListener('click', () => this.createMachine());

        // Kleur Modus selectie
        document.getElementById('color-mode').addEventListener('change', (e) => {
            document.getElementById('color-input-hex').style.display = e.target.value === 'hex' ? 'flex' : 'none';
            document.getElementById('color-input-rgb').style.display = e.target.value === 'rgb' ? 'flex' : 'none';
            document.getElementById('color-input-hsl').style.display = e.target.value === 'hsl' ? 'flex' : 'none';
        });
    }

    createIngredient() {
        const nameInput = document.getElementById('new-ing-name');
        const name = nameInput.value || "Naamloos";

        const structure = document.getElementById('new-ing-struct').value;
        const speed = parseInt(document.getElementById('new-ing-speed').value);
        const time = parseInt(document.getElementById('new-ing-time').value);

        if (speed < 1 || speed > 10) {
            alert("Snelheid moet tussen 1 en 10 zijn.");
            return;
        }

        const mode = document.getElementById('color-mode').value;
        let hsl;

        if (mode === 'rgb') {
            const r = parseInt(document.getElementById('ing-r').value) || 0;
            const g = parseInt(document.getElementById('ing-g').value) || 0;
            const b = parseInt(document.getElementById('ing-b').value) || 0;
            // Converteer RGB naar HSL via een tussenstap
            const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
            hsl = ColorMath.hexToHSL(hex);
        } else if (mode === 'hsl') {
            hsl = {
                h: parseInt(document.getElementById('ing-h').value) || 0,
                s: parseInt(document.getElementById('ing-s').value) || 100,
                l: parseInt(document.getElementById('ing-l').value) || 50,
            };
        } else {
            const hexColor = document.getElementById('new-ing-color').value || "#ff0000";
            hsl = ColorMath.hexToHSL(hexColor);
        }
        const newIng = new Ingredient(name, hsl, speed, structure, time);

        // Opslaan in Store
        AppStore.addIngredient(newIng);

        // Renderen op de plank
        const shelf = document.querySelector('.ingredient-shelf');
        if (shelf) {
            shelf.appendChild(IngredientRenderer.create(newIng));
        }

        // Feedback & Reset
        alert(`Ingrediënt "${name}" aangemaakt!`);
        nameInput.value = ''; // Reset naam veld
    }

    createPot() {
        const newPot = new Pot();
        AppStore.addPot(newPot);

        // Renderen in de workstation
        const potContainer = document.querySelector('.pot-container');
        if (potContainer) {
            potContainer.appendChild(PotRenderer.create(newPot));
        }

        // Optioneel: sluit de modal zodat je direct kunt kijken
        this.dialog.close();
    }

    createMachine() {
        const speed = parseInt(document.getElementById('new-mach-speed').value);
        const timeInput = document.getElementById('new-mach-time').value;
        const configuredTime = timeInput ? parseInt(timeInput) : null;

        // ID Genereren (M1, M2 bestaand -> M3)
        // Gebruik hoogste ID + 1 in plaats van length, om duplicaten na verwijderen te voorkomen
        const maxId = AppStore.machines.reduce((max, machine) => {
            const num = parseInt(machine.id.replace('M', '')) || 0;
            return num > max ? num : max;
        }, 0);

        const id = `M${maxId + 1}`;
        const newMachine = new Machine(id, speed, configuredTime);

        //Zet de hal op de huidige actieve hal
        newMachine.hall = AppStore.activeHall;

        AppStore.machines.push(newMachine);

        // Renderen in de workstation
        const machineRow = document.querySelector('.machine-row');
        if (machineRow) {
            const el = MachineRenderer.create(newMachine);
            machineRow.appendChild(el);

            // Check direct of hij zichtbaar moet zijn
            if (newMachine.hall !== AppStore.activeHall) {
                el.style.display = 'none';
            }
        }

        this.dialog.close();
    }
}
