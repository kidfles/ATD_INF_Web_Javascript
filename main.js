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
