class WeatherWidget extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadowDOM = this.attachShadow({ mode: 'closed' });

    await this.addStylesFile(shadowDOM);
    await this.getTemplate(shadowDOM);

    const searchBtn = shadowDOM.querySelector('.search-btn');
    const inputField = shadowDOM.querySelector('.input-field');
    const weatherResultWrapper = shadowDOM.querySelector('.weather-result');

    searchBtn.addEventListener('click', async () => {
      if (!inputField.value.trim()) { return; }

      const weatherData = await this.getWeather(inputField.value);

      if (weatherData) {
        weatherResultWrapper.textContent = `Temperatura dla miasta ${weatherData.name} wynosi ${weatherData.main.temp}°C`;
      }
    });
  }

  async getWeather(cityName) {
    // remember to create env.json with "weatherApiKey"
    const apiKey = await fetch('env/env.json')
      .then(response => response.json())
      .then(json => json.weatherApiKey);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);

    if (response.ok) {
      return await response.json();
    }
  }

  async getTemplate(shadowDOM) {
    const parser = new DOMParser();
    const response = await fetch('weather-widget/weather-widget.html');

    if (response.ok) {
      const responseContent = await response.text();
      const parsedHtml = parser.parseFromString(responseContent, 'text/html').documentElement;

      shadowDOM.appendChild(parsedHtml.cloneNode(true));
    }
  }

  addStylesFile(shadowDOM) {
    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', 'weather-widget/weather-widget.css');

    shadowDOM.appendChild(styles);
  }
}

customElements.define('weather-widget', WeatherWidget);
