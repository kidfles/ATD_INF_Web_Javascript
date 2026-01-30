import { ColorMath } from '../utils/ColorMath.js';
import { AppStore } from '../utils/AppStore.js';
import { PotRenderer } from '../views/PotRenderer.js'; // Importeer de renderer

export class ColorLabController {
    constructor() {
        this.gridContainer = document.getElementById('color-grid');
        this.paintRack = document.getElementById('paint-rack'); // NIEUW
        this.popup = document.getElementById('color-popup');
        this.initListeners();
    }

    initListeners() {
        document.getElementById('btn-generate-grid').addEventListener('click', () => {
            this.generateEmptyGrid();
        });

        // Tab Wissel Logica (SPA)
        document.getElementById('nav-sim').addEventListener('click', () => this.switchTab('sim'));

        // Als we naar Lab gaan, verversen we de data!
        document.getElementById('nav-lab').addEventListener('click', () => {
            this.switchTab('lab');
            this.loadMixedPots();     // Laad potten
            if (this.gridContainer.children.length === 0) this.generateEmptyGrid(); // Maak grid als die leeg is
        });
    }

    switchTab(tabName) {
        const sim = document.getElementById('simulation-container');
        const lab = document.getElementById('color-lab-container');

        if (tabName === 'sim') {
            sim.style.display = 'grid';
            lab.style.display = 'none';
        } else {
            sim.style.display = 'none';
            lab.style.display = 'block';
        }
    }

    // Maak witte lege vakjes die dropzones zijn
    generateEmptyGrid() {
        this.gridContainer.innerHTML = '';

        for (let i = 0; i < 36; i++) {
            const square = document.createElement('div');
            square.className = 'color-grid-square empty'; // Voor styling & selectie
            square.classList.add('grid-square'); // Voor JS selectie in DragController

            // Maak het een dropzone
            square.dataset.type = 'grid-square';

            // Klikken werkt nog steeds (als er kleur in zit)
            square.addEventListener('click', () => {
                if (square.dataset.hue) {
                    this.showAnalysis(square.dataset.hue);
                }
            });

            this.gridContainer.appendChild(square);
        }
    }

    // Toon gemengde potten in het rek
    loadMixedPots() {
        this.paintRack.innerHTML = '';
        const mixedPots = AppStore.pots.filter(p => p.isMixed);

        if (mixedPots.length === 0) {
            this.paintRack.innerHTML = `
                <p class="rack-empty-message">
                    Meng eerst verf om de voorraad te vullen!
                </p>
            `;
            return;
        }

        mixedPots.forEach(pot => {
            // We gebruiken de bestaande PotRenderer, maar we clonen hem visueel
            // Of we maken gewoon een nieuwe render aan.
            const el = PotRenderer.create(pot);
            PotRenderer.update(el, pot); // Zorg dat hij de kleur heeft

            // Styling aanpassen voor in het rek (iets kleiner)
            el.style.transform = "scale(0.8)";
            el.style.margin = "-10px"; // Compensate scale

            this.paintRack.appendChild(el);
        });
    }

    showAnalysis(hue) {
        const colors = ColorMath.getTriadicScheme(parseInt(hue));
        const swatchesContainer = document.getElementById('popup-swatches');
        swatchesContainer.innerHTML = '';

        colors.forEach((col, index) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('analysis-wrapper');

            const div = document.createElement('div');
            div.classList.add('analysis-swatch');
            div.style.backgroundColor = `hsl(${col.h}, ${col.s}%, ${col.l}%)`;

            const info = document.createElement('div');
            info.classList.add('analysis-info');
            info.innerHTML = `
                <strong>${index === 0 ? "Basis" : "Triadic"}</strong><br>
                <span class="analysis-details">
                    HSL(${col.h}, ${col.s}%, ${col.l}%)
                </span>
            `;

            wrapper.appendChild(div);
            wrapper.appendChild(info);
            swatchesContainer.appendChild(wrapper);
        });

        this.popup.showModal();
    }
}
