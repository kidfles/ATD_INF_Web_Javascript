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
        const target = e.target.closest('[draggable="true"]');

        if (!target || !target.dataset.type) return;

        console.log("Drag gestart:", target.dataset.type, target.dataset.id);

        this.draggedItem = {
            id: target.dataset.id,
            type: target.dataset.type,
        };

        e.dataTransfer.setData('text/plain', JSON.stringify(this.draggedItem));
        e.dataTransfer.effectAllowed = 'copy';
        setTimeout(() => {
            target.style.opacity = '0.5';
        }, 0);
    }

    handleDragOver(e) {
        e.preventDefault();

        // 1. Check POT drops (Alleen als we een INGREDIËNT slepen)
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
                    return; // Stop hier als we een pot vonden
                }
            }
        }

        // 2. Check MACHINE drops (Alleen als we een POT slepen)
        const machineSlot = e.target.closest('.machine-slot');
        if (machineSlot && this.draggedItem && this.draggedItem.type === 'pot') {
            const machineId = machineSlot.dataset.machineId;
            const machine = AppStore.machines.find(m => m.id === machineId);
            const pot = AppStore.getPot(this.draggedItem.id);

            // Logica: Is Machine Leeg? Is Pot? Matchen snelheden?
            if (machine && pot) {
                //Sta lege potten toe om te 'hoveren' als geldig, zodat we kunnen falen met een alert bij drop
                if (pot.isEmpty()) {
                    machineSlot.classList.add('drag-over-valid');
                    e.dataTransfer.dropEffect = 'copy';
                    return;
                }

                // Normale check voor gevulde potten
                const machineSpeed = Number(machine.configuredSpeed);
                const potSpeed = Number(pot.ingredients[0].speed);

                if (machineSpeed === potSpeed) {
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

        // Reset ondoorzichtigheid van gesleept item
        if (this.draggedItem) {
            const originalEl = document.querySelector(`[data-id="${this.draggedItem.id}"]`);
            if (originalEl) originalEl.style.opacity = '1';
        }

        // 1. Check POT drops (Alleen als Ingrediënt wordt gesleept)
        const dropZone = e.target.closest('.pot');
        if (dropZone && this.draggedItem && this.draggedItem.type === 'ingredient') {
            dropZone.classList.remove('drag-over-valid', 'drag-over-invalid');
            this.processDrop(dropZone.dataset.id, this.draggedItem.id);
            this.draggedItem = null;
            return;
        }

        // 2. Check MACHINE drops (Alleen als Pot wordt gesleept)
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
        const slotEl = document.querySelector(`.machine-slot[data-machine-id="${machineId}"]`) || document.querySelector(`.machine-slot[data-machineId="${machineId}"]`);

        if (potEl && slotEl) {
            console.log(`Processing drop for Pot ${potId} into Machine ${machineId}`);

            // Check even of er al niet iets staat
            if (slotEl.children.length > 0) {
                console.warn("Slot is niet leeg!", slotEl.children);
                alert("Er staat al een pot in deze machine!");
                return;
            }

            // Sla originele parent op voor rollback bij fout
            const originalParent = potEl.parentElement;

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
                // Zet pot terug naar waar hij vandaan kwam (rollback)
                if (originalParent) {
                    originalParent.appendChild(potEl);
                } else {
                    // Fallback als parent weg is (zou niet mogen gebeuren)
                    document.querySelector('.pot-container').appendChild(potEl);
                }
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