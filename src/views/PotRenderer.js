export class PotRenderer {
    /**
     * Maakt een lege pot in de HTML.
     * @param {Pot} potModel - Het data model
     */
    static create(potModel) {
        const el = document.createElement('div');
        el.classList.add('pot');

        // --- FIX: MAAK HEM SLEEPBAAR ---
        el.setAttribute('draggable', 'true');
        // -------------------------------

        // We koppelen het ID zodat de Controller weet WELKE pot dit is
        el.dataset.id = potModel.id;
        el.dataset.type = 'pot';

        // Labeltje erbij
        const label = document.createElement('span');
        label.innerText = "Leeg";
        label.style.cssText = "position:absolute; top:-20px; font-size:12px; pointer-events: none;";
        // pointer-events: none zorgt dat het label het slepen niet blokkeert
        el.appendChild(label);

        return el;
    }

    static update(potEl, potModel) {
        const label = potEl.querySelector('span');
        if (potModel.isEmpty()) {
            label.innerText = "Leeg";
        } else {
            const speed = potModel.ingredients[0].speed;
            label.innerText = `Speed: ${speed}`;
        }
    }
}