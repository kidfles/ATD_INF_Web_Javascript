import { AppError, ERROR_CODES } from '../utils/AppError.js';

export class Machine {
    constructor(id, configuredSpeed, configuredTime = null) {
        this.id = id;
        // De ingestelde snelheid van de machine
        this.configuredSpeed = configuredSpeed;
        // Optionele tijd override in milliseconden
        this.configuredTime = configuredTime;
        // Status kan zijn: 'idle', 'running', 'done'
        this.status = 'idle';
        this.currentPot = null;

        // Standaardlocatie is Hal 1
        this.hall = 1;
    }

    /**
     * Probeert een pot in de machine te plaatsen.
     * @param {Pot} pot 
     * @returns {boolean} true als het plaatsen is gelukt
     */
    loadPot(pot) {
        // Controleer of de machine bezig is
        if (this.status !== 'idle') {
            throw new AppError("Machine is al bezig!", ERROR_CODES.MACHINE_BUSY);
        }

        // Controleer of de pot leeg is
        if (pot.isEmpty()) {
            throw new AppError("Deze pot is leeg! Vul hem eerst.", ERROR_CODES.POT_EMPTY);
        }

        // Controleer of de snelheid matcht
        if (!pot.isEmpty() && Number(pot.ingredients[0].speed) !== Number(this.configuredSpeed)) {
            throw new AppError(
                `Snelheid matcht niet (Machine: ${this.configuredSpeed}, Pot: ${pot.ingredients[0].speed})`,
                ERROR_CODES.MACHINE_SPEED_MISMATCH
            );
        }

        this.currentPot = pot;
        return true;
    }

    start() {
        this.status = 'running';
    }

    finish() {
        this.status = 'done';
    }

    reset() {
        this.status = 'idle';
        this.currentPot = null;
    }
}
