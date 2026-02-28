class Store {
    constructor() {
        this.ingredients = [];
        this.pots = [];
        this.machines = [];
        this.activeHall = 1;
        this.weather = {
            temp: 20,
            isRaining: false,
            timeModifier: 1.0,
            heatWave: false
        };
    }

    addIngredient(ing) { this.ingredients.push(ing); }
    addPot(pot) { this.pots.push(pot); }
    removeIngredient(id) { this.ingredients = this.ingredients.filter(i => i.id !== id); }
    removePot(id) { this.pots = this.pots.filter(p => p.id !== id); }
    removeMachine(id) { this.machines = this.machines.filter(m => m.id !== id); }
    getIngredient(id) { return this.ingredients.find(i => i.id === id); }
    getPot(id) { return this.pots.find(p => p.id === id); }
    setWeather(data) { this.weather = { ...this.weather, ...data }; }
}

// Exporteer één instantie
export const AppStore = new Store();
