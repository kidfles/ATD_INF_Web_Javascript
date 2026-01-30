import { AppStore } from '../utils/AppStore.js'; // Die maken we hierna even snel
import { PotRenderer } from '../views/PotRenderer.js';

export class DragController {
    constructor() {
        this.draggedItem = null; // Even onthouden wat we vast hebben
        this.init();
    }

    init() {
        console.log("DragController luistert...");

        // Event Delegation: We luisteren op de hele body, ipv elk element apart.
        // Dat is beter voor performance en werkt ook met dynamische elementen.

        document.addEventListener('dragstart', (e) => this.handleDragStart(e));
        document.addEventListener('dragover', (e) => this.handleDragOver(e));
        document.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        document.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleDragStart(e) {
        // Check of we wel iets slepen wat mag (bijv. een ingrediënt)
        if (!e.target.dataset.type) return;

        this.draggedItem = {
            id: e.target.dataset.id,
            type: e.target.dataset.type,
            // Trucje: Als we de speed al in de dataset zetten, hoeven we 
            // niet in de database te zoeken tijdens het slepen (performance!)
            // Voor nu halen we het even uit het Model via de AppStore (netter).
        };

        // DataTransfer is nodig voor de browser om data mee te sturen
        e.dataTransfer.setData('text/plain', JSON.stringify(this.draggedItem));
        e.dataTransfer.effectAllowed = 'move';

        // Beetje transparant maken zodat je ziet dat je sleept
        e.target.style.opacity = '0.5';
    }

    handleDragOver(e) {
        e.preventDefault(); // SUPER BELANGRIJK! Zonder dit vuurt 'drop' nooit.

        const dropZone = e.target.closest('.pot');
        if (!dropZone || !this.draggedItem) return;

        // Validatie Logica: Mag dit ingrediënt in deze pot?
        const potId = dropZone.dataset.id;
        const potModel = AppStore.getPot(potId);
        const ingredientModel = AppStore.getIngredient(this.draggedItem.id);

        if (!potModel || !ingredientModel) return;

        // Check: Is de pot leeg OF is de snelheid gelijk?
        let isValid = false;
        if (potModel.isEmpty()) {
            isValid = true;
        } else {
            // Checken of de speeds matchen
            isValid = potModel.ingredients[0].speed === ingredientModel.speed;
        }

        // Visuele feedback geven
        if (isValid) {
            e.dataTransfer.dropEffect = 'copy';
            dropZone.classList.add('drag-over-valid');
            dropZone.classList.remove('drag-over-invalid');
        } else {
            e.dataTransfer.dropEffect = 'none'; // Cursor wordt een 'verboden' bordje
            dropZone.classList.add('drag-over-invalid');
            dropZone.classList.remove('drag-over-valid');
        }
    }

    handleDragLeave(e) {
        // Als we de pot verlaten, haal dan die groene/rode gloed weg
        const dropZone = e.target.closest('.pot');
        if (dropZone) {
            dropZone.classList.remove('drag-over-valid', 'drag-over-invalid');
        }
    }

    handleDrop(e) {
        e.preventDefault(); // Voorkom dat de browser de image/text opent

        // Reset de opacity van het gesleepte ding
        const draggedEl = document.querySelector(`[data-id="${this.draggedItem.id}"]`);
        if (draggedEl) draggedEl.style.opacity = '1';

        const dropZone = e.target.closest('.pot');

        // Schoonmaak: haal classes weg
        if (dropZone) dropZone.classList.remove('drag-over-valid', 'drag-over-invalid');

        if (!dropZone || !this.draggedItem) return;

        // De daadwerkelijke actie uitvoeren
        this.processDrop(dropZone.dataset.id, this.draggedItem.id);

        this.draggedItem = null; // Reset
    }

    processDrop(potId, ingredientId) {
        // Haal de echte objecten op
        const pot = AppStore.getPot(potId);
        const ingredient = AppStore.getIngredient(ingredientId);

        try {
            // 1. Update het Model (Data)
            pot.addIngredient(ingredient); // Dit gooit een error als het niet mag!
            console.log(`Ingrediënt ${ingredient.name} toegevoegd aan pot!`);

            // 2. Update de View (DOM)
            // Zoek het HTML element van de pot
            const potEl = document.querySelector(`.pot[data-id="${potId}"]`);

            // We verplaatsen het ingrediënt visueel IN de pot
            // (Clone node is vaak makkelijker dan verplaatsen als je het origineel wilt houden, 
            // maar voor deze opdracht verplaatsen we hem waarschijnlijk).
            const ingredientEl = document.querySelector(`[data-id="${ingredientId}"]`);

            if (ingredientEl && potEl) {
                // Verplaats de div fysiek in de DOM
                potEl.appendChild(ingredientEl);
                PotRenderer.update(potEl, pot); // Update labeltjes
            }

        } catch (error) {
            // Hier vangen we die validatie error van Block 2 op!
            alert(error.message); // Of een mooiere toaster
        }
    }
}
