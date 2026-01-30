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

        // Async / Await patroon (netter dan .then().then())
        const response = await fetch(url);

        // Fetch gooit GEEN error op 404 of 500, dus dat moeten we checken
        if (!response.ok) {
            throw new Error(`Weer API faalde met status: ${response.status}`);
        }

        const data = await response.json();
        return data.current_weather;
    }
}
