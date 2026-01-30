import { AppStore } from '../utils/AppStore.js';

export class PotRenderer {
    /**
     * Maakt een lege pot in de HTML.
     * @param {Pot} potModel - Het data model
     */
    static create(potModel) {
        const el = document.createElement('div');
        el.classList.add('pot');

        // MAAK HEM SLEEPBAAR 
        el.setAttribute('draggable', 'true');

        // We koppelen het ID zodat de Controller weet WELKE pot dit is
        el.dataset.id = potModel.id;
        el.dataset.type = 'pot';

        // Labeltje erbij
        const label = document.createElement('span');
        label.innerText = "Leeg";
        label.style.cssText = "position:absolute; top:-20px; font-size:12px; pointer-events: none;";
        // pointer-events: none zorgt dat het label het slepen niet blokkeert
        el.appendChild(label);

        //Verwijder knop
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '×';
        delBtn.className = 'btn-delete';
        delBtn.title = 'Verwijder Pot';
        delBtn.style.right = '-10px'; // Beetje offset voor pot
        delBtn.onclick = (e) => {
            e.stopPropagation();
            if (confirm('Verwijder deze pot?')) {
                AppStore.removePot(potModel.id);
                el.remove();
            }
        };
        el.appendChild(delBtn);

        return el;
    }

    static update(potEl, potModel) {
        console.log("PotRenderer updating:", potModel.id, "isMixed:", potModel.isMixed);
        const label = potEl.querySelector('span');

        if (potModel.isMixed && potModel.finalColor) {
            // SCENARIO: GEMENGD
            const color = potModel.finalColor;

            // 1. Geef de pot de kleur van de mix
            potEl.style.background = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;

            // 2. Maak tekst wit of zwart voor contrast
            potEl.style.boxShadow = `0 0 20px hsl(${color.h}, 100%, 50%)`; // Gloed

            // 3. Verberg de losse ingrediënten (zitten er nog wel in, maar onzichtbaar)
            Array.from(potEl.children).forEach(child => {
                if (child.classList.contains('ingredient-item')) {
                    child.style.display = 'none';
                }
            });

            label.innerText = "Mixed!";
            label.style.color = "white";
            label.style.textShadow = "0 1px 2px black";

        } else if (potModel.isEmpty()) {
            label.innerText = "Leeg";
            potEl.style.background = "white"; // Reset
            potEl.style.boxShadow = "none";
        } else {
            const speed = potModel.ingredients[0].speed;
            label.innerText = `Speed: ${speed}`;
            potEl.style.background = "white"; // Reset
            potEl.style.boxShadow = "none";
        }
    }
}