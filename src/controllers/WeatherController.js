import { WeatherService } from '../services/WeatherService.js';
import { AppStore } from '../utils/AppStore.js';

export class WeatherController {

    constructor() {
        this.displayElement = document.getElementById('weather-display');

        // Initialiseer Dropdown Options
        if (this.displayElement) {
            this.displayElement.innerHTML = `
                <option value="realtime">Live: Den Bosch (Laden...)</option>
                <option value="normal">Simulatie: Normaal (20°C)</option>
                <option value="cold">Simulatie: Koud (5°C)</option>
                <option value="hot">Simulatie: Hittegolf (38°C)</option>
            `;

            // Listen for changes
            this.displayElement.addEventListener('change', (e) => this.manualOverride(e.target.value));
        }

        // Standaard locatie: 's-Hertogenbosch
        this.location = { lat: 51.69, lon: 5.30, name: "'s-Hertogenbosch" };
    }

    async init() {
        // Start met realtime
        this.manualOverride('realtime');
    }

    async manualOverride(mode) {
        if (mode === 'realtime') {
            try {
                this.updateDisplay("Laden...");
                this.location.name = "'s-Hertogenbosch";
                const rawData = await WeatherService.fetchCurrentWeather(51.69, 5.30);
                this.processWeatherData(rawData);
            } catch (error) {
                console.error("Live fetch failed:", error);
                this.processWeatherData({ temperature: 20, weathercode: 3 });
                this.updateDisplay("Fout! (20°C)");
            }
            return;
        }

        let mockData = { weathercode: 3 };

        switch (mode) {
            case 'cold':
                mockData.temperature = 5;
                this.location.name = 'Simulatie: Koud';
                break;
            case 'hot':
                mockData.temperature = 38;
                this.location.name = 'Simulatie: Hittegolf';
                break;
            case 'normal':
                mockData.temperature = 20;
                this.location.name = 'Simulatie: Normaal';
                break;
            default:
                return;
        }
        this.processWeatherData(mockData);
    }

    processWeatherData(data) {
        const temp = data.temperature;
        const isRaining = data.weathercode > 50;
        let modifier = 1.0;
        let heatWave = false;

        if (isRaining) modifier += 0.10;
        if (temp < 10) modifier += 0.15;
        if (temp > 35) heatWave = true;

        AppStore.setWeather({
            temp: temp,
            isRaining: isRaining,
            timeModifier: modifier,
            heatWave: heatWave
        });

        this.renderUI(temp, isRaining, modifier);
    }

    renderUI(temp, isRaining, modifier) {
        const percentage = Math.round((modifier - 1) * 100);
        let statusText = `${this.location.name}: ${temp}°C`;

        if (isRaining) statusText += " (Regen)";
        if (temp > 35) statusText += " (Hittegolf)";
        if (temp < 10) statusText += " (Koud)";
        if (percentage > 0) statusText += ` (+${percentage}%)`;

        this.updateDisplay(statusText);

        const header = document.querySelector('header');
        if (temp > 30) header.style.backgroundColor = '#ffcc80';
        else if (temp < 10) header.style.backgroundColor = '#90caf9';
        else header.style.backgroundColor = '#ffffff';
    }

    updateDisplay(text) {
        if (this.displayElement) {
            // Update de tekst van de GESELECTEERDE optie
            const selectedOption = this.displayElement.options[this.displayElement.selectedIndex];
            if (selectedOption) {
                selectedOption.text = text;
            }
        }
    }
}