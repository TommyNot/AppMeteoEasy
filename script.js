function getWeather() {
    const apiKey = "INSERT API KEY";
    const city = document.getElementById('city').value;

    if (!city) {
        alert("Inserisci una città");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error("Errore nel recupero dei dati meteo:", error);
            alert("Errore nel recupero dei dati meteo. Riprova.");
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error("Errore nel recupero della previsione oraria:", error);
            alert("Errore nel recupero della previsione oraria.");
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById("temp-div");
    const weatherInfoDiv = document.getElementById("weather-info");
    const weatherIcon = document.getElementById("weather-icon");

    const windSpeed = document.getElementById("wind-speed");
    const humidity = document.getElementById("humidity");
    const pressure = document.getElementById("pressure");

    weatherInfoDiv.innerHTML = "";
    tempDivInfo.innerHTML = "";

    if (data.cod === "404") {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHTML = `<p>${cityName}</p><p>${description}</p>`;

        
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = "block";

        // Popola i dettagli aggiuntivi
        windSpeed.textContent = Math.round(data.wind.speed * 3.6); // Converti da m/s a km/h
        humidity.textContent = data.main.humidity;
        pressure.textContent = data.main.pressure;
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    hourlyForecastDiv.innerHTML = ""; 

    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `<div class="hourly-item">
            <span>${hour}:00</span>
            <img src="${iconUrl}" alt="Icona meteo oraria">
            <span>${temperature}°C</span>
        </div>`;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}
