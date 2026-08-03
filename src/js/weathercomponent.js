//cache time to load in ms
const CACHE_TTL_MS = 10 * 60 * 1000;
//getter for the cache key
function getCacheKey(lat, lon) {
    return `weather: ${lat}, ${lon}`;
}

function getCached(lat, lon) {
    try {
        const raw = sessionStorage.getItem(getCacheKey(lat, lon));
        if (!raw) return null;

        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp > CACHE_TTL_MS) {
            return null;
        }
        return data;
    } catch (e) {
        return null;
    }
}
//setter for  the cache
function setCached(lat, lon, data) {
    try {
        sessionStorage.setItem(
            getCacheKey(lat, lon),
            JSON.stringify({ data, timestamp: Date.now() })
        );
    } catch (e) {

    }
}
//weather component
class WeatherWidget extends HTMLElement {
    static get observedAttributes() {
        return ['latitude', 'longitude'];
    }

    constructor() {
        //shadow root and abort controller setting
        super();
        this.attachShadow({ mode: 'open' });
        this.abortController = null;
        //innerHTML that doesn't come from an API response
        this.shadowRoot.innerHTML = `
        <style>
            :host {
            display: block;
            border: var(--weather-border, 1px solid #ccc);
            border-radius: var(--weather-radius, 8px);
            padding: var(--weather-padding, 1rem);
            font-family: inherit;
            }
            .state-idle, .state-loading, .state-error {
                color: var(--weather-muted-text, #666);
            }
            .weather-card {
                list-style: none;
                padding: 0;
                margin: 0;
            }
        </style>
        <div class="widget-body">
            <slot>
                <p>Weather data requires JavaScript to work properly.</p>
            </slot>
        </div>
            `;

        this.body = this.shadowRoot.querySelector('.widget-body');
    }
    //callback function to create idle
    connectedCallback() {
        this.setState('idle');
        this.loadWeather();
    }
    //callback disconnect to abort the component if it disconnects
    disconnectedCallback() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }
    //to load the weather
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (this.isConnected) {
            this.loadWeather();
        }
    }
    //sets the state of the current data
    setState(state) {
        this.setAttribute('data-state', state);
    }
    //the fetch compartment
    async fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
        const timeoutId = setTimeout(() => this.abortController.abort(), timeoutMs);
        try {
            return await fetch(url, { ...options, signal: this.abortController.signal });
        } finally {
            clearTimeout(timeoutId);
        }
    }
    //loading the weather from OpenMeteo
    async loadWeather() {
        if (this.abortController) this.abortController.abort();
        this.abortController = new AbortController();

        this.setState('loading');
        this.renderLoading();

        const lat = this.getAttribute('latitude') || '32.7157';
        const lon = this.getAttribute('longitude') || '-117.1611';

        const cached = getCached(lat, lon);
        if (cached) {
            this.setState('ready');
            this.renderSuccess(cached);
            return;
        }
        //try catch blockt o set the JSON of the fetch for the weather
        try {
            const response = await this.fetchWithTimeout(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
            );
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            const data = await response.json();

            if (!data.current_weather) {
                this.setState('idle');
                this.renderEmpty();
                return;
            }

            this.setState('ready');
            this.renderSuccess(data.current_weather);
            //mentions an error if weather fetch fails
        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error('Weather fetch failed:', error);
            this.setState('error');
            this.renderError();
        }
    }
    //rendering in the elements for the weather component
    renderLoading() {
        const p = document.createElement('p');
        p.className = 'state-loading';
        p.setAttribute('role', 'status');
        p.setAttribute('aria-live', 'polite');
        p.textContent = 'Loading weather...';
        this.body.appendChild(p);
    }
    //render if the weather data is empty
    renderEmpty() {
        const p = document.createElement('p');
        p.className = 'state-idle';
        p.textContent = 'No weather data available yet';
        this.body.appendChild(p);
    }
    //if rendering is successful
    renderSuccess(weather) {
        const template = document.getElementById('weather-template');
        const clone = template.content.cloneNode(true);

        clone.querySelector('.weather-temp').textContent = weather.temperature;
        clone.querySelector('.weather-wind').textContent = weather.windspeed;

        this.body.appendChild(clone);
    }
    //if there is an error rendering weather data
    renderError() {

        const p = document.createElement('p');
        p.className = 'state-error';
        p.setAttribute('role', 'alert');
        p.textContent = 'Could not load weather data';

        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Retry';
        retryBtn.part = 'retry-button';
        retryBtn.addEventListener('click', () => this.loadWeather());

        this.body.appendChild(p);
        this.body.appendChild(retryBtn);
    }
}

customElements.define('weather-widget', WeatherWidget);