import { WeatherService } from '../services/WeatherService.js';
import { AppStore } from '../utils/AppStore.js';

export class WeatherController {

    constructor() {
        this.displayElement = document.getElementById('weather-display');

        // Standaard locatie: Utrecht 
        this.location = { lat: 52.09, lon: 5.12, name: 'Utrecht' };
    }

    async init() {
        this.updateDisplay("Weer ophalen...");

        try {
            // 1. Data ophalen (Async!)
            // We wachten hier even 'nep' 1 seconde extra zodat je de laad-animatie ziet (optioneel)
            const rawData = await WeatherService.fetchCurrentWeather(this.location.lat, this.location.lon);

            // 2. Business Logica toepassen (De regels uit de opdracht)
            this.processWeatherData(rawData);

        } catch (error) {
            // 3. Error Handling (De "Craft")
            // Als de API stuk is, crasht de app NIET. We gaan over op 'Noodprotocol'.
            console.error("Weather Controller Error:", error);

            this.updateDisplay("⚠️ Weer data onbeschikbaar. Standaard instellingen actief.");

            // Zet veilige defaults in de store
            AppStore.setWeather({
                temp: 20,
                isRaining: false,
                timeModifier: 1.0,
                heatWave: false
            });

            // Gooi de error nog even door naar de global handler voor de toaster/alert
            throw error;
        }
    }

    processWeatherData(data) {
        const temp = data.temperature;
        // WMO code: 51, 53, 55, 61, 63, 65, 80, 81, 82 zijn regen. 71+ is sneeuw.
        // Voor simpelheid: als code > 50 is het nat.
        const isRaining = data.weathercode > 50;

        let modifier = 1.0;
        let heatWave = false;

        // REGEL 1: Regen/Sneeuw -> 10% trager
        if (isRaining) {
            modifier += 0.10;
        }

        // REGEL 2: Koud (< 10 graden) -> 15% trager
        // Let op: modifiers stapelen? De opdracht zegt het niet specifiek.
        // Laten we ze optellen voor de zekerheid (dus 1.0 + 0.10 + 0.15 = 1.25)
        if (temp < 10) {
            modifier += 0.15;
        }

        // REGEL 3: Hittegolf (> 35 graden)
        if (temp > 35) {
            heatWave = true;
        }

        // Opslaan in de store
        AppStore.setWeather({
            temp: temp,
            isRaining: isRaining,
            timeModifier: modifier,
            heatWave: heatWave
        });

        // UI Updaten
        this.renderUI(temp, isRaining, modifier);
    }

    renderUI(temp, isRaining, modifier) {
        const percentage = Math.round((modifier - 1) * 100);
        let statusText = `${this.location.name}: ${temp}°C`;

        if (isRaining) statusText += " 🌧️";
        if (temp > 35) statusText += " 🔥";
        if (temp < 10) statusText += " ❄️";

        if (percentage > 0) {
            statusText += ` (Mengtijd +${percentage}%)`;
        }

        this.updateDisplay(statusText);

        // Visuele feedback: verander header kleur op basis van temp
        const header = document.querySelector('header');
        if (temp > 30) header.style.backgroundColor = '#ffcc80'; // Oranje
        else if (temp < 10) header.style.backgroundColor = '#90caf9'; // Blauw
    }

    updateDisplay(text) {
        if (this.displayElement) {
            this.displayElement.innerText = text;
        }
    }
}