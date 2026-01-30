import { ColorMath } from '../utils/ColorMath.js';
import { AppStore } from '../utils/AppStore.js';

export class ColorLabController {
    constructor() {
        this.gridContainer = document.getElementById('color-grid');
        this.popup = document.getElementById('color-popup');
        this.initListeners();
    }

    initListeners() {
        document.getElementById('btn-generate-grid').addEventListener('click', () => {
            this.generateGrid();
        });

        // Tab Wissel Logica (SPA)
        document.getElementById('nav-sim').addEventListener('click', () => this.switchTab('sim'));
        document.getElementById('nav-lab').addEventListener('click', () => this.switchTab('lab'));
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

    generateGrid() {
        this.gridContainer.innerHTML = ''; // Reset

        // Check of we gemengde potten hebben om het grid mee te vullen
        const mixedPots = AppStore.pots.filter(p => p.isMixed);

        // 6x6 Grid = 36 vakjes
        for (let i = 0; i < 36; i++) {
            const square = document.createElement('div');
            square.style.width = '40px';
            square.style.height = '40px';
            square.style.border = '1px solid #ccc';
            square.style.cursor = 'pointer';

            // Als we gemengde verf hebben, gebruik die. Anders random/grijs.
            // Voor de demo vullen we ze random of met de laatst gemengde pot
            if (mixedPots.length > 0) {
                // Pak een random pot uit de gemengde voorraad
                const randomPot = mixedPots[Math.floor(Math.random() * mixedPots.length)];

                // Simpele mix logica: pak hue van eerste ingrediënt (in het echt moet je mixen)
                const hue = randomPot.finalColor ? randomPot.finalColor.h : randomPot.ingredients[0].color.h;

                square.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
                square.dataset.hue = hue;

                // Click Event voor Triadic Popup
                square.addEventListener('click', () => this.showAnalysis(hue));
            } else {
                square.style.backgroundColor = '#eee';
                square.title = "Meng eerst verf om dit te vullen!";
            }

            this.gridContainer.appendChild(square);
        }
    }

    showAnalysis(hue) {
        const colors = ColorMath.getTriadicScheme(parseInt(hue));
        const swatchesContainer = document.getElementById('popup-swatches');
        swatchesContainer.innerHTML = '';

        colors.forEach((col, index) => {
            const wrapper = document.createElement('div');
            wrapper.style.textAlign = 'center';

            const div = document.createElement('div');
            div.style.width = '80px';
            div.style.height = '80px';
            div.style.backgroundColor = `hsl(${col.h}, ${col.s}%, ${col.l}%)`;
            div.style.borderRadius = '50%';
            div.style.marginBottom = '5px';
            div.style.border = '2px solid #fff';
            div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

            const info = document.createElement('div');
            info.innerHTML = `
                <strong>${index === 0 ? "Basis" : "Triadic"}</strong><br>
                <span style="font-size:10px; color:#666;">
                    HSL(${col.h}, ${col.s}%, ${col.l}%)
                </span>
            `;
            info.style.fontSize = '12px';

            wrapper.appendChild(div);
            wrapper.appendChild(info);
            swatchesContainer.appendChild(wrapper);
        });

        this.popup.showModal();
    }
}
