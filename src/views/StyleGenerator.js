/**
 * Deze utility class helpt ons om data om te zetten naar CSS styles.
 * Zo houden we de logica gescheiden van de HTML creatie.
 */
export const StyleGenerator = {

    /**
     * Genereert een CSS string op basis van HSL en structuur.
     * @param {object} colorObj - {h, s, l}
     * @param {string} structure - 'grainy', 'smooth', 'slimy'
     * @returns {string} De waarde voor het 'style' attribuut.
     */
    getStyle(colorObj, structure) {
        // Even het HSL object omzetten naar een bruikbare CSS string
        const baseColor = `hsl(${colorObj.h}, ${colorObj.s}%, ${colorObj.l}%)`;

        let styles = `background-color: ${baseColor};`;

        // Hier bepalen we de 'look & feel' op basis van de structuur
        switch (structure) {
            case 'slimy':
                // Een beetje random border-radius zorgt voor die 'blob' vorm
                styles += `
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    box-shadow: inset 10px 10px 20px rgba(255,255,255,0.4), 
                                5px 5px 15px rgba(0,0,0,0.2);
                `;
                break;

            case 'grainy':
                // We gebruiken een radial-gradient om korrels te simuleren zonder plaatjes
                styles += `
                    border-radius: 10%; /* Bijna vierkant, maar net niet */
                    background-image: radial-gradient(circle, rgba(0,0,0,0.2) 2px, transparent 2.5px);
                    background-size: 8px 8px; /* Dit herhaalt het patroon */
                    border: 2px dashed rgba(0,0,0,0.3);
                `;
                break;

            case 'coarse':
                // Grove korrel: Grotere stippen, "wilde" border
                styles += `
                    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                    background-image: radial-gradient(circle, rgba(0,0,0,0.4) 4px, transparent 5px);
                    background-size: 15px 15px;
                    border: 3px dotted rgba(0,0,0,0.5);
                    box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
                `;
                break;

            case 'smooth':
            default:
                // Als er geen structuur is, doen we gewoon normaal (rondje)
                styles += `
                    border-radius: 50%;
                    box-shadow: inset -5px -5px 10px rgba(0,0,0,0.2);
                `;
                break;
        }

        return styles;
    }
};
