export const ColorMath = {
    /**
     * Berekent de Triadic kleuren (120 graden en 240 graden verder).
     * @param {number} hue - 0 tot 360
     * @returns {Array} [Original, Triadic1, Triadic2] (Allemaal HSL objecten)
     */
    getTriadicScheme(hue) {
        const h1 = (hue + 120) % 360;
        const h2 = (hue + 240) % 360;

        return [
            { h: hue, s: 100, l: 50 },
            { h: h1, s: 100, l: 50 },
            { h: h2, s: 100, l: 50 }
        ];
    }
};
