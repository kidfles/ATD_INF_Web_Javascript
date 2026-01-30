import { AppError, ERROR_CODES } from '../utils/AppError.js';

export class WeatherService {

    /**
     * Haalt weerdata op voor een locatie.
     * Gebruikt Open-Meteo API.
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     */
    static async fetchCurrentWeather(lat, lon) {
        // URL bouwen: We willen current_weather weten
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

        // Async / Await patroon
        const response = await fetch(url);

        // Fetch gooit GEEN error op 404 of 500, dus dat moeten we checken
        if (!response.ok) {
            throw new AppError(
                `Weer ophalen mislukt (status: ${response.status})`,
                ERROR_CODES.WEATHER_FETCH_FAILED
            );
        }

        const data = await response.json();
        return data.current_weather;
    }
}
