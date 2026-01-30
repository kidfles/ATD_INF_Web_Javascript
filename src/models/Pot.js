export class Pot {
    constructor() {
        this.id = crypto.randomUUID();
        this.ingredients = []; // Array van Ingredient objecten
        this.maxIngredients = 67; // Standaardwaarde, gebruikt in addIngredient
        this.isMixed = false;
        this.finalColor = null; // Wordt gezet na het mixen
    }

    /**
     * Voegt een ingrediënt toe als de validatie slaagt.
     * @param {Ingredient} ingredient
     * @throws {Error} Als mengsnelheden niet overeenkomen.
     */
    addIngredient(ingredient) {
        // Validatie 1: Pot Vol?
        if (this.ingredients.length >= this.maxIngredients) {
            throw new Error("Pot is vol!");
        }

        // Validatie 2: Snelheid Match? (Alleen als er al iets in zit)
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
            s: 100,
            l: 50
        };
        this.isMixed = true;
        console.log(`Pot Mixed! Final Hue: ${this.finalColor.h}`, this.finalColor);
    }

    /**
     * Berekent de totale mengtijd gebaseerd op het "traagste" ingrediënt (hoogste tijd).
     * @returns {number} Tijd in milliseconden
     */
    calculateBaseMixTime() {
        if (this.ingredients.length === 0) return 0;

        // Vind het ingrediënt met de hoogste mengtijd
        return Math.max(...this.ingredients.map(ing => ing.baseTime));
    }

    isEmpty() {
        return this.ingredients.length === 0;
    }
}
