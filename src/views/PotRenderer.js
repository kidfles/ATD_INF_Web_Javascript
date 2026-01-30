export class PotRenderer {
    /**
     * Maakt een lege pot in de HTML.
     * @param {Pot} potModel - Het data model
     */
    static create(potModel) {
        const el = document.createElement('div');
        el.classList.add('pot');

        // We koppelen het ID zodat de Controller weet WELKE pot dit is
        el.dataset.id = potModel.id;
        el.dataset.type = 'pot';

        // Labeltje erbij (optioneel, handig voor debuggen)
        const label = document.createElement('span');
        label.innerText = "Leeg";
        label.style.cssText = "position:absolute; top:-20px; font-size:12px;";
        el.appendChild(label);

        return el;
    }

    /**
     * Update de pot visueel (bijv. na een drop)
     * @param {HTMLElement} potEl 
     * @param {Pot} potModel 
     */
    static update(potEl, potModel) {
        // Simpele update: label aanpassen
        const label = potEl.querySelector('span');
        if (potModel.isEmpty()) {
            label.innerText = "Leeg";
        } else {
            // Toon de snelheid van de inhoud
            const speed = potModel.ingredients[0].speed;
            label.innerText = `Speed: ${speed}`;
        }
    }
}
