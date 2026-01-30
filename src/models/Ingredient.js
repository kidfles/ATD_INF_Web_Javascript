export class Ingredient {
    /**
    * @param {string} name - Weergavenaam (bijv. "Rooie Slijm")
    * @param {object} colorHSL - { h: 0-360, s: 0-100, l: 0-100 }
    * @param {number} speed - Vereiste mengsnelheid (1-10)
    * @param {string} structure - 'Korrel, grove korrel, glad, slijmerig'
    * @param {number} baseTime - Tijd in milliseconden
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
