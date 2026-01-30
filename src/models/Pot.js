export class Pot {
    constructor() {
        this.id = crypto.randomUUID();
        this.ingredients = []; // Array of Ingredient objects
        this.isMixed = false;
        this.finalColor = null; // Will be set after mixing
    }

    /**
     * Adds an ingredient if validation passes.
     * @param {Ingredient} ingredient 
     * @throws {Error} If mixing speeds do not match.
     */
    addIngredient(ingredient) {
        // Validation: If pot is not empty, check speed compatibility
        if (this.ingredients.length > 0) {
            const currentSpeed = this.ingredients[0].speed;

            if (ingredient.speed !== currentSpeed) {
                // We throw an error here so the Controller can catch it 
                // and show a UI error message to the user.
                throw new Error(`Speed Mismatch! This pot is for Speed ${currentSpeed}, but ingredient is Speed ${ingredient.speed}.`);
            }
        }

        this.ingredients.push(ingredient);
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
