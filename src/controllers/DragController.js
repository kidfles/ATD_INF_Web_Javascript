import { AppStore } from '../utils/AppStore.js';
import { PotRenderer } from '../views/PotRenderer.js';

export class DragController {
    constructor() {
        this.draggedItem = null;
        this.init();
    }

    init() {
        console.log("DragController is actief...");

        document.addEventListener('dragstart', (e) => this.handleDragStart(e));
        document.addEventListener('dragover', (e) => this.handleDragOver(e));
        document.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        document.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleDragStart(e) {
        // FIX: Gebruik closest om zeker te zijn dat we het draggable element hebben
        // (ook al klik je op een randje of child element)
        const target = e.target.closest('[draggable="true"]');

        if (!target || !target.dataset.type) return;

        console.log("Drag gestart:", target.dataset.type, target.dataset.id);

        this.draggedItem = {
            id: target.dataset.id,
            type: target.dataset.type,
        };

        e.dataTransfer.setData('text/plain', JSON.stringify(this.draggedItem));
        e.dataTransfer.effectAllowed = 'copy'; // 'copy' is vaak veiliger dan 'move' voor visual feedback

        // FIX: Doe visuele aanpassingen in een timeout.
        // Directe DOM aanpassingen tijdens dragstart kunnen de drag annuleren in sommige browsers.
        setTimeout(() => {
            target.style.opacity = '0.5';
        }, 0);
    }

    handleDragOver(e) {
        e.preventDefault(); // Cruciaal!

        const dropZone = e.target.closest('.pot');

        // Als we niet boven een pot hangen, of we slepen niks, stop dan.
        if (!dropZone || !this.draggedItem) return;

        const potId = dropZone.dataset.id;

        // Haal data op uit de store
        const potModel = AppStore.getPot(potId);
        const ingredientModel = AppStore.getIngredient(this.draggedItem.id);

        // DEBUG: Als dit faalt, zien we het in de console
        if (!potModel) {
            console.warn("Pot model niet gevonden in AppStore:", potId);
            return;
        }
        if (!ingredientModel) {
            console.warn("Ingrediënt model niet gevonden in AppStore:", this.draggedItem.id);
            return;
        }

        // Check regels: Pot leeg? OF Snelheid gelijk?
        let isValid = false;
        if (potModel.isEmpty()) {
            isValid = true;
        } else {
            isValid = potModel.ingredients[0].speed === ingredientModel.speed;
            if (!isValid) {
                // Console log om te zien waarom het niet mag (handig voor dev)
                // console.log(`Speed mismatch: Pot=${potModel.ingredients[0].speed} vs Item=${ingredientModel.speed}`);
            }
        }

        if (isValid) {
            e.dataTransfer.dropEffect = 'copy';
            dropZone.classList.add('drag-over-valid');
            dropZone.classList.remove('drag-over-invalid');
        } else {
            e.dataTransfer.dropEffect = 'none';
            dropZone.classList.add('drag-over-invalid');
            dropZone.classList.remove('drag-over-valid');
        }
    }

    handleDragLeave(e) {
        const dropZone = e.target.closest('.pot');
        if (dropZone) {
            dropZone.classList.remove('drag-over-valid', 'drag-over-invalid');
        }
    }

    handleDrop(e) {
        e.preventDefault();

        // Reset de opacity (zoek het element via ID omdat 'target' hier de pot is)
        if (this.draggedItem) {
            const originalEl = document.querySelector(`[data-id="${this.draggedItem.id}"]`);
            if (originalEl) originalEl.style.opacity = '1';
        }

        const dropZone = e.target.closest('.pot');
        if (dropZone) dropZone.classList.remove('drag-over-valid', 'drag-over-invalid');

        if (!dropZone || !this.draggedItem) return;

        this.processDrop(dropZone.dataset.id, this.draggedItem.id);
        this.draggedItem = null; // Reset
    }

    processDrop(potId, ingredientId) {
        const pot = AppStore.getPot(potId);
        const ingredient = AppStore.getIngredient(ingredientId);

        if (!pot || !ingredient) return;

        try {
            // 1. Update Model
            pot.addIngredient(ingredient);
            console.log("Ingrediënt toegevoegd!", pot);

            // 2. Update View
            const potEl = document.querySelector(`.pot[data-id="${potId}"]`);
            const ingredientEl = document.querySelector(`[data-id="${ingredientId}"]`);

            if (ingredientEl && potEl) {
                // Verplaats het element de pot in
                potEl.appendChild(ingredientEl);
                // Reset styling omdat hij nu in de pot zit (optioneel)
                ingredientEl.style.position = 'relative';
                ingredientEl.style.opacity = '1';

                PotRenderer.update(potEl, pot);
            }

        } catch (error) {
            alert(error.message);
        }
    }
}