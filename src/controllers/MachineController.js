import { AppStore } from '../utils/AppStore.js';
import { AppError, ERROR_CODES } from '../utils/AppError.js';
import { MachineRenderer } from '../views/MachineRenderer.js';
import { PotRenderer } from '../views/PotRenderer.js';

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
        try {
            if (AppStore.weather.heatWave) {
                // Tel ALLE draaiende machines
                const runningMachinesTotal = AppStore.machines.filter(m => m.status === 'running').length;

                if (runningMachinesTotal >= 1) {
                    throw new AppError(
                        "Het is te heet! Slechts 1 machine mag draaien tijdens een hittegolf.",
                        ERROR_CODES.HEATWAVE_LIMIT
                    );
                }
            }

            this.startMixingProcess(machine);
        } catch (error) {
            if (error.name === 'AppError') {
                alert(`Fout: ${error.message}`);
            } else {
                console.error(error);
                alert("Er ging iets mis bij het starten van de machine.");
            }
        }
    }

    startMixingProcess(machine) {
        // 1. Bereken tijd
        // Gebruik machine tijd indien ingesteld, anders de pot tijd
        let baseTime = 0;
        if (machine.configuredTime && machine.configuredTime > 0) {
            baseTime = machine.configuredTime;
        } else {
            baseTime = machine.currentPot.calculateBaseMixTime();
        }

        const finalTime = baseTime * AppStore.weather.timeModifier;

        console.log(`Start mixen. Basis: ${baseTime}ms, Weerfactor: ${AppStore.weather.timeModifier}, Totaal: ${finalTime}ms`);

        // 2. Update Status & UI
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

        // Voer de mix berekening uit ---
        if (machine.currentPot) {
            machine.currentPot.mix();
        }
        // ----------------------------------------

        // 4. Verplaats pot naar de "Andere Kant" (Output)
        // We simuleren dit door hem uit het slot te halen en ernaast te zetten
        const slotEl = document.querySelector(`.machine-slot[data-machine-id="${machine.id}"]`) || document.querySelector(`.machine-slot[data-machineId="${machine.id}"]`);
        const potEl = slotEl.querySelector('.pot');

        if (potEl) {
            // Maak de pot visueel "klaar" (gouden randje)
            potEl.style.borderColor = "#FFD700"; // Goud
            potEl.style.boxShadow = "0 0 15px #FFD700";

            //Verplaats naar de Output Area 
            const outputArea = document.getElementById('output-conveyor');

            if (outputArea) {
                outputArea.appendChild(potEl);

                // Optioneel: speel een geluidje of animatie
                console.log(`Pot verplaatst naar output band vanuit Machine ${machine.id}`);
            } else {
                // Fallback als zone niet bestaat
                slotEl.closest('.machine').appendChild(potEl);
            }

            // Nadat je de pot verplaatst hebt, update de view zodat hij er gemengd uitziet:
            if (machine.currentPot) {
                PotRenderer.update(potEl, machine.currentPot);
            }
        }

        machine.reset(); // Maak machine weer vrij voor de volgende
    }
}
