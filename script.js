const weatherEmojiMap = {
    "clear sky": "☀️",
    "few clouds": "🌤️",
    "scattered clouds": "🌥️",
    "broken clouds": "☁️",
    "shower rain": "🌧️",
    "rain": "🌧️",
    "thunderstorm": "⛈️",
    "snow": "❄️",
    "mist": "🌫️"
};

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod !== 200) {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        return;
    }

    const cityName = data.name;
    const temperature = Math.round(data.main.temp); // Already in Celsius
    const description = data.weather[0].description;
    const emoji = weatherEmojiMap[description] || "🌈"; // Default emoji if description not found

    tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
    weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description} ${emoji}</p>`;
    weatherIcon.style.display = 'none'; // Hide the weather icon
}

async function getWeather() {
    const apiKey = 'API key'; // Replace with your own API key
    const city = document.getElementById('city').value || 'London'; // Use 'London' for testing

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    console.log('Fetching data from URL:', currentWeatherUrl);

    try {
        const response = await fetch(currentWeatherUrl);
        if (!response.ok) {
            const errorResponse = await response.text(); // Get error response
            console.error('Error response from current weather:', errorResponse);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching current weather data:', error);
        alert('Error fetching current weather data: ' + error.message);
        return; // Exit early on error
    }

    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) {
            const errorResponse = await response.text(); // Get error response
            console.error('Error response from hourly forecast:', errorResponse);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayHourlyForecast(data.list);
    } catch (error) {
        console.error('Error fetching hourly forecast data:', error);
        alert('Error fetching hourly forecast data: ' + error.message);
    }
}

// Hide the icon when typing
document.getElementById('city').addEventListener('input', function() {
    document.getElementById('weather-icon').style.display = 'none';
});

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Limit to 4 next hours (12-hour intervals)
    const nextHours = hourlyData.slice(0, 4); 

    nextHours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp); // Already in Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}
