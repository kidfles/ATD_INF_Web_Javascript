export class Pot {
    constructor() {
        this.id = crypto.randomUUID();
        this.ingredients = []; // Array of Ingredient objects
        this.maxIngredients = 5; // Default value, as it's used in addIngredient
        this.isMixed = false;
        this.finalColor = null; // Will be set after mixing
    }

    /**
     * Adds an ingredient if validation passes.
     * @param {Ingredient} ingredient
     * @throws {Error} If mixing speeds do not match.
     */
    addIngredient(ingredient) {
        // Validation 1: Pot Full?
        if (this.ingredients.length >= this.maxIngredients) {
            throw new Error("Pot is vol!");
        }

        // Validation 2: Speed Match? (Alleen als er al iets in zit)
        if (this.ingredients.length > 0) {
            const currentSpeed = this.ingredients[0].speed;
            if (ingredient.speed !== currentSpeed) {
                throw new Error(`Snelheid ${ingredient.speed} matcht niet met pot (${currentSpeed})`);
            }
        }

        this.ingredients.push(ingredient);
    }

    mix() {
        if (this.ingredients.length === 0) return;

        // 1. Bereken gemiddelde Hue (Kleur)
        let totalHue = 0;

        // Simpele aanpak: Pak de kleuren.
        // Let op: Rood (0) en Blauw (240). Gemiddelde is 120 (Groen). Dat klopt niet!
        // We moeten rekening houden met de cirkel (360 graden).
        const hues = this.ingredients.map(i => i.color.h);

        // Als we rood (0) en blauw (240) hebben, is het verschil > 180.
        // Dan moeten we 'omfietsen' via 360.
        const sumX = hues.reduce((a, h) => a + Math.cos(h * Math.PI / 180), 0);
        const sumY = hues.reduce((a, h) => a + Math.sin(h * Math.PI / 180), 0);

        let avgHue = Math.atan2(sumY, sumX) * 180 / Math.PI;
        if (avgHue < 0) avgHue += 360;

        // 2. Update de state
        this.finalColor = {
            h: Math.round(avgHue),
            s: 100, // Lekker fel
            l: 50
        };
        this.isMixed = true;
        console.log(`Pot Mixed! Final Hue: ${this.finalColor.h}`, this.finalColor);
    }

    /**
     * Calculates total mix time based on the "slowest" ingredient (highest time).
     * @returns {number} Time in milliseconds
     */
    calculateBaseMixTime() {
        if (this.ingredients.length === 0) return 0;

        // Find the ingredient with the highest mix time
        return Math.max(...this.ingredients.map(ing => ing.baseTime));
    }

    isEmpty() {
        return this.ingredients.length === 0;
    }
}
