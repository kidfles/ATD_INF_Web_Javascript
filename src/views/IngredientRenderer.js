import { StyleGenerator } from './StyleGenerator.js';
import { AppStore } from '../utils/AppStore.js';

export class IngredientRenderer {

    /**
     * Maakt een HTML element voor een ingrediënt.
     * @param {Ingredient} ingredient - Het data model
     * @returns {HTMLElement} Een div die we in de DOM kunnen knallen.
     */
    static create(ingredient) {
        // We maken een nieuwe div aan. Geen innerHTML string gebruiken,
        // want createElement is veiliger en sneller voor events.
        const el = document.createElement('div');

        // Voeg de basis CSS class toe voor grootte en gedrag
        el.classList.add('ingredient-item');

        // Hier gebruiken we onze generator voor de specifieke look
        el.style.cssText = StyleGenerator.getStyle(ingredient.color, ingredient.structure);

        // --- Drag & Drop Voorbereiding ---

        // Zet draggable op true zodat we later kunnen slepen
        el.setAttribute('draggable', 'true');

        // We slaan het ID op in de dataset.
        // Dit is cruciaal om straks te weten WAT we aan het slepen zijn.
        el.dataset.id = ingredient.id;
        el.dataset.type = 'ingredient';

        // Eventueel een tooltipje voor de gebruiker
        el.dataset.tooltip = `${ingredient.name} | ${ingredient.baseTime}ms | Speed ${ingredient.speed}`;

        // [NEW] Delete Button
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '×';
        delBtn.className = 'btn-delete';
        delBtn.title = 'Verwijder Ingrediënt';
        delBtn.dataset.id = ingredient.id; // Mark for easy selecting
        delBtn.onclick = (e) => {
            e.stopPropagation(); // Voorkom drag start als je klikt
            if (confirm(`Verwijder ${ingredient.name}?`)) {
                AppStore.removeIngredient(ingredient.id);
                el.remove();
            }
        };
        el.appendChild(delBtn);

        return el;
    }
}
