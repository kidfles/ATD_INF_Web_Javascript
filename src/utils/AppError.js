/**
 * Aangepaste foutklasse voor de applicatie.
 * Hiermee kunnen we op specifieke foutcodes controleren in plaats van alleen tekst.
 */
export class AppError extends Error {
    /**
     * @param {string} message - De foutmelding voor de gebruiker.
     * @param {string} code - De unieke foutcode (bijv. MACHINE_BUSY).
     */
    constructor(message, code) {
        super(message);
        this.name = 'AppError';
        this.code = code;
    }
}

// Lijst met vaste foutcodes
export const ERROR_CODES = {
    MACHINE_BUSY: 'MACHINE_BUSY',
    MACHINE_SPEED_MISMATCH: 'MACHINE_SPEED_MISMATCH',
    POT_FULL: 'POT_FULL',
    POT_EMPTY: 'POT_EMPTY',
    POT_SPEED_MISMATCH: 'POT_SPEED_MISMATCH',
    HEATWAVE_LIMIT: 'HEATWAVE_LIMIT',
    WEATHER_FETCH_FAILED: 'WEATHER_FETCH_FAILED'
};
