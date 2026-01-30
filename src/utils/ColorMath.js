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
    },

    /**
     * Converts Hex string to HSL object
     * @param {string} H
     * @returns {Object} {h, s, l}
     */
    hexToHSL(H) {
        // Convert hex to RGB first
        let r = 0, g = 0, b = 0;
        if (H.length == 4) {
            r = "0x" + H[1] + H[1];
            g = "0x" + H[2] + H[2];
            b = "0x" + H[3] + H[3];
        } else if (H.length == 7) {
            r = "0x" + H[1] + H[2];
            g = "0x" + H[3] + H[4];
            b = "0x" + H[5] + H[6];
        }
        // Then to HSL
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0)
            h = 0;
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        else if (cmax == g)
            h = (b - r) / delta + 2;
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0)
            h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return { h, s, l };
    }
};
