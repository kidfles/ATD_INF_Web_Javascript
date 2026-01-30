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
        e.preventDefault();

        // 1. Check POT drops (Only if we are dragging an INGREDIENT)
        if (this.draggedItem && this.draggedItem.type === 'ingredient') {
            const potDropZone = e.target.closest('.pot');
            if (potDropZone) {
                const potId = potDropZone.dataset.id;
                const potModel = AppStore.getPot(potId);
                const ingredientModel = AppStore.getIngredient(this.draggedItem.id);

                if (potModel && ingredientModel) {
                    let isValid = false;
                    if (potModel.isEmpty()) {
                        isValid = true;
                    } else {
                        isValid = potModel.ingredients[0].speed === ingredientModel.speed;
                    }

                    if (isValid) {
                        e.dataTransfer.dropEffect = 'copy';
                        potDropZone.classList.add('drag-over-valid');
                        potDropZone.classList.remove('drag-over-invalid');
                    } else {
                        e.dataTransfer.dropEffect = 'none';
                        potDropZone.classList.add('drag-over-invalid');
                        potDropZone.classList.remove('drag-over-valid');
                    }
                    return; // Stop here if we found a pot
                }
            }
        }

        // 2. Check MACHINE drops (Only if we are dragging a POT)
        const machineSlot = e.target.closest('.machine-slot');
        if (machineSlot && this.draggedItem && this.draggedItem.type === 'pot') {
            const machineId = machineSlot.dataset.machineId;
            const machine = AppStore.machines.find(m => m.id === machineId);
            const pot = AppStore.getPot(this.draggedItem.id);

            // Logic: Is Machine Empty? Is Pot not Empty? Speeds match?
            if (machine && pot && !pot.isEmpty()) {
                if (machine.configuredSpeed === pot.ingredients[0].speed) {
                    machineSlot.classList.add('drag-over-valid');
                    e.dataTransfer.dropEffect = 'copy';
                    return;
                }
            }
        }
    }

    handleDragLeave(e) {
        const dropZone = e.target.closest('.pot');
        if (dropZone) {
            dropZone.classList.remove('drag-over-valid', 'drag-over-invalid');
        }

        const machineSlot = e.target.closest('.machine-slot');
        if (machineSlot) {
            machineSlot.classList.remove('drag-over-valid');
        }
    }

    handleDrop(e) {
        e.preventDefault();

        // Reset opacity of dragged item
        if (this.draggedItem) {
            const originalEl = document.querySelector(`[data-id="${this.draggedItem.id}"]`);
            if (originalEl) originalEl.style.opacity = '1';
        }

        // 1. Check POT drops (Only if dragging Ingredient)
        const dropZone = e.target.closest('.pot');
        if (dropZone && this.draggedItem && this.draggedItem.type === 'ingredient') {
            dropZone.classList.remove('drag-over-valid', 'drag-over-invalid');
            this.processDrop(dropZone.dataset.id, this.draggedItem.id);
            this.draggedItem = null;
            return;
        }

        // 2. Check MACHINE drops (Only if dragging Pot)
        const machineSlot = e.target.closest('.machine-slot');
        if (machineSlot && this.draggedItem && this.draggedItem.type === 'pot') {
            machineSlot.classList.remove('drag-over-valid');
            this.processMachineDrop(machineSlot.dataset.machineId, this.draggedItem.id);
            this.draggedItem = null;
            return;
        }

        this.draggedItem = null;
    }

    processMachineDrop(machineId, potId) {
        // We verplaatsen de pot DOM naar het slot
        const potEl = document.querySelector(`.pot[data-id="${potId}"]`);
        const slotEl = document.querySelector(`.machine-slot[data-machineId="${machineId}"]`);

        if (potEl && slotEl) {
            // Check even of er al niet iets staat
            if (slotEl.children.length > 0) {
                alert("Er staat al een pot in deze machine!");
                return;
            }

            // Verplaats fysiek
            slotEl.appendChild(potEl);

            // Update het Machine Model
            const machine = AppStore.machines.find(m => m.id === machineId);
            const pot = AppStore.getPot(potId);

            try {
                machine.loadPot(pot);
                console.log(`Pot geladen in machine ${machineId}`);
            } catch (e) {
                alert(e.message);
                // Zet pot terug (zou eigenlijk in de catch moeten)
                document.querySelector('.pot-container').appendChild(potEl);
            }
        }
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