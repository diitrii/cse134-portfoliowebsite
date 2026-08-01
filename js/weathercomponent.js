class WeatherWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `<p>Loading weather...</p>`;
        this.loadWeather();
    }

    async loadWeather() {
        try {
            const response = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=32.7157&longitude=-117.1611&current_weather=true'
            );
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            const data = await response.json();
            this.render(data.current_weather);
        } catch (error) {
            console.error('Fetch failed:', error);
            this.shadowRoot.innerHTML = `<p>Failed to load weather</p>`;
        }
    }

    render(weather) {
        this.shadowRoot.innerHTML = `
        <div>
            <h3>Current Weather</h3>
            <p>Temperature: ${weather.temperature}C</p>
            <p>Wind speed: ${weather.windspeed} km/h</p>
        </div>
        `;
    }
}

customElements.define('weather-widget', WeatherWidget);