export class Machine {
    constructor(id, configuredSpeed) {
        this.id = id;
        this.configuredSpeed = configuredSpeed; // The speed this machine runs at
        this.status = 'idle'; // Options: 'idle', 'running', 'done'
        this.currentPot = null;
    }

    /**
     * Attempts to place a pot in the machine.
     * @param {Pot} pot 
     * @returns {boolean} true if successful
     */
    loadPot(pot) {
        if (this.status !== 'idle') {
            throw new Error("Machine is busy!");
        }

        // Validation: Does the machine speed match the pot contents?
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
