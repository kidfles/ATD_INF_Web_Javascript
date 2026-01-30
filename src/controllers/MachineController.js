import { AppStore } from '../utils/AppStore.js';
import { MachineRenderer } from '../views/MachineRenderer.js';

export class MachineController {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        // Event delegation voor start knoppen
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-mix')) {
                const machineId = e.target.id.replace('btn-', '');
                this.handleStartClick(machineId);
            }
        });
    }

    handleStartClick(machineId) {
        const machine = AppStore.machines.find(m => m.id === machineId);
        if (!machine || !machine.currentPot) {
            alert("Plaats eerst een pot in de machine!");
            return;
        }

        // --- CONSTRAINT: HITTEGOLF (> 35 graden) ---
        if (AppStore.weather.heatWave) {
            // Tel hoeveel machines er draaien
            const runningMachines = AppStore.machines.filter(m => m.status === 'running').length;
            if (runningMachines >= 1) {
                alert("⛔ HITTEGOLF ALARM: Het is te heet (>35°C)! Er mag maximaal 1 machine tegelijk draaien.");
                return; // Stop actie
            }
        }

        this.startMixingProcess(machine);
    }

    startMixingProcess(machine) {
        // 1. Bereken tijd
        // Basis tijd van pot * Weer modifier
        const baseTime = machine.currentPot.calculateBaseMixTime();
        const finalTime = baseTime * AppStore.weather.timeModifier;

        console.log(`Start mixen. Basis: ${baseTime}ms, Weerfactor: ${AppStore.weather.timeModifier}, Totaal: ${finalTime}ms`);

        // 2. Update State & UI
        machine.start();
        MachineRenderer.updateStatus(machine.id, `MIXING (${Math.round(finalTime)}ms)...`, true);

        // 3. Start Timer (Async simulatie)
        setTimeout(() => {
            this.finishMixing(machine);
        }, finalTime);
    }

    finishMixing(machine) {
        machine.finish();
        MachineRenderer.updateStatus(machine.id, "DONE!", false);

        // 4. Verplaats pot naar de "Andere Kant" (Output)
        // We simuleren dit door hem uit het slot te halen en ernaast te zetten
        const slotEl = document.querySelector(`.machine-slot[data-machineId="${machine.id}"]`);
        const potEl = slotEl.querySelector('.pot');

        if (potEl) {
            // Maak de pot visueel "klaar" (bijv. gouden randje)
            potEl.style.borderColor = "gold";
            potEl.style.boxShadow = "0 0 20px gold";

            // Haal uit slot, zet onder machine (of in output bak)
            // Voor nu: append aan de main container of een output divje
            const machineContainer = slotEl.closest('.machine');
            machineContainer.appendChild(potEl); // Zet hem onderaan de machine
        }

        machine.reset(); // Maak machine weer vrij voor de volgende
    }
}
