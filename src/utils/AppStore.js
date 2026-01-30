export const AppStore = {
    ingredients: [],
    pots: [],
    machines: [],

    // NIEUW: Weer status opslaan
    weather: {
        temp: 20,       // Standaard kamertemperatuur
        isRaining: false,
        timeModifier: 1.0, // 1.0 = normaal, 1.1 = 10% trager
        heatWave: false // True als > 35 graden
    },

    addIngredient(ing) { this.ingredients.push(ing); },
    addPot(pot) { this.pots.push(pot); },

    getIngredient(id) { return this.ingredients.find(i => i.id === id); },
    getPot(id) { return this.pots.find(p => p.id === id); },

    // NIEUW: Setter voor weer
    setWeather(data) {
        // We mergen de nieuwe data met de oude (spread operator)
        this.weather = { ...this.weather, ...data };

        // Even publishen dat er iets veranderd is (handig voor UI updates later)
        // (Als je EventBus gebruikt, zou je hier eventBus.publish('STATE_CHANGE') doen)
    }
};
