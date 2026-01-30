// Een simpele opslagplaats voor onze data zodat we er overal bij kunnen
export const AppStore = {
    ingredients: [],
    pots: [],
    machines: [],

    addIngredient(ing) { this.ingredients.push(ing); },
    addPot(pot) { this.pots.push(pot); },

    getIngredient(id) { return this.ingredients.find(i => i.id === id); },
    getPot(id) { return this.pots.find(p => p.id === id); }
};
