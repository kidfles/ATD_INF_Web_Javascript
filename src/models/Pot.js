import { AppError, ERROR_CODES } from '../utils/AppError.js';

export class Pot {
    constructor() {
        this.id = crypto.randomUUID();
        // Lijst met toegevoegde ingrediënten
        this.ingredients = [];
        this.maxIngredients = 67;
        this.isMixed = false;
        this.finalColor = null;
    }

    /**
     * Voegt een ingrediënt toe na validatie.
     * @param {Ingredient} ingredient
     */
    addIngredient(ingredient) {
        // Controleer of de pot vol is
        if (this.ingredients.length >= this.maxIngredients) {
            throw new AppError("Pot zit vol!", ERROR_CODES.POT_FULL);
        }

        // Controleer of de snelheid overeenkomt met de inhoud
        if (this.ingredients.length > 0) {
            const currentSpeed = this.ingredients[0].speed;
            if (ingredient.speed !== currentSpeed) {
                throw new AppError(
                    `Snelheid ${ingredient.speed} past niet bij de pot (${currentSpeed})`,
                    ERROR_CODES.POT_SPEED_MISMATCH
                );
            }
        }

        this.ingredients.push(ingredient);
    }

    mix() {
        if (this.ingredients.length === 0) return;

        // Bereken de gemiddelde kleurvector
        const hues = this.ingredients.map(i => i.color.h);
        const sumX = hues.reduce((a, h) => a + Math.cos(h * Math.PI / 180), 0);
        const sumY = hues.reduce((a, h) => a + Math.sin(h * Math.PI / 180), 0);

        let avgHue = Math.atan2(sumY, sumX) * 180 / Math.PI;
        if (avgHue < 0) avgHue += 360;

        // Zet de eindkleur vast
        this.finalColor = {
            h: Math.round(avgHue),
            s: 100,
            l: 50
        };
        this.isMixed = true;
        console.log(`Pot gemengd. Kleur: ${this.finalColor.h}`, this.finalColor);
    }

    /**
     * Berekent de mengtijd op basis van het traagste ingrediënt.
     * @returns {number} Tijd in milliseconden
     */
    calculateBaseMixTime() {
        if (this.ingredients.length === 0) return 0;
        return Math.max(...this.ingredients.map(ing => ing.baseTime));
    }

    isEmpty() {
        return this.ingredients.length === 0;
    }
}
