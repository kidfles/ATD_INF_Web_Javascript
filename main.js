// Import global utilities
import { eventBus } from './src/utils/EventBus.js';

// 1. Global Error Handler (The "Craft")
window.addEventListener('unhandledrejection', (event) => {
    console.error("CRITICAL ASYNC ERROR:", event.reason);
    // TODO: Connect this to a UI 'Toaster' notification in Block 1
    alert(`Oeps! Er ging iets mis: ${event.reason.message || event.reason}`);
});

// 2. App Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log("Future Color App Initialized");

    // Example: Trigger the app start
    // const app = new AppController();
    // app.init();
});

// main.js - TEMPORARY TEST CODE
import { Ingredient } from './src/models/Ingredient.js';
import { Pot } from './src/models/Pot.js';

try {
    console.log('--- Testing Data Models ---');

    // 1. Create Ingredients
    const redSlime = new Ingredient('Red Slime', { h: 0, s: 100, l: 50 }, 5, 'slimy', 2000);
    const blueDust = new Ingredient('Blue Dust', { h: 240, s: 100, l: 50 }, 5, 'grainy', 3000);
    const fastGreen = new Ingredient('Fast Green', { h: 120, s: 100, l: 50 }, 9, 'smooth', 1000);

    // 2. Create Pot
    const pot = new Pot();

    // 3. Add Valid Ingredients
    console.log('Adding Red Slime...');
    pot.addIngredient(redSlime);

    console.log('Adding Blue Dust (Same Speed)...');
    pot.addIngredient(blueDust); // Should work

    // 4. Test Validation (Should fail)
    console.log('Adding Fast Green (Wrong Speed)...');
    pot.addIngredient(fastGreen); // Should throw Error

} catch (error) {
    console.error('SUCCESSFUL ERROR CATCH:', error.message);
}
