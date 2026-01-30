export class Machine {
    constructor(id, configuredSpeed, configuredTime = null) {
        this.id = id;
        this.configuredSpeed = configuredSpeed; // De snelheid waarop deze machine draait
        this.configuredTime = configuredTime;   // Tijd override (ms) of null
        this.status = 'idle'; // Opties: 'idle', 'running', 'done'
        this.currentPot = null;

        // Standaard hal is 1
        this.hall = 1;
    }

    /**
     * Probeert een pot in de machine te plaatsen.
     * @param {Pot} pot 
     * @returns {boolean} true indien succesvol
     */
    loadPot(pot) {
        if (this.status !== 'idle') {
            throw new Error("Machine is busy!");
        }

        // Validatie: Is de pot leeg?
        if (pot.isEmpty()) {
            throw new Error("Deze pot is leeg! Vul hem eerst met een ingrediënt.");
        }

        // Validatie: Matcht de machine snelheid met de pot inhoud?
        if (!pot.isEmpty() && Number(pot.ingredients[0].speed) !== Number(this.configuredSpeed)) {
            throw new Error(`Machine speed (${this.configuredSpeed}) does not match Ingredient speed.`);
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
