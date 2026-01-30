export const AppStore = {
    ingredients: [],
    pots: [],
    machines: [],

    // NIEUW: We beginnen in Hal 1
    activeHall: 1,

    // NIEUW: Weer status opslaan
    weather: {
        temp: 20,       // Standaard kamertemperatuur
        isRaining: false,
        timeModifier: 1.0, // 1.0 = normaal, 1.1 = 10% trager
        heatWave: false // True als > 35 graden
    },

    addIngredient(ing) { this.ingredients.push(ing); },
    addPot(pot) { this.pots.push(pot); },
    removeIngredient(id) { this.ingredients = this.ingredients.filter(i => i.id !== id); },
    removePot(id) { this.pots = this.pots.filter(p => p.id !== id); },
    removeMachine(id) { this.machines = this.machines.filter(m => m.id !== id); },

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
