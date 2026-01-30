export class Ingredient {
    /**
     * @param {string} name - Display name (e.g., "Red Slime")
     * @param {object} colorHSL - { h: 0-360, s: 0-100, l: 0-100 }
     * @param {number} speed - Mixing speed requirement (1-10)
     * @param {string} structure - 'grainy', 'smooth', or 'slimy'
     * @param {number} baseTime - Time in milliseconds
     */
    constructor(name, colorHSL, speed, structure, baseTime) {
        this.id = crypto.randomUUID(); // Native browser UUID generator
        this.name = name;
        this.color = colorHSL;
        this.speed = speed;
        this.structure = structure;
        this.baseTime = baseTime;
    }
}
