const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');
const apiKey = "";

weatherForm.addEventListener('submit', async event =>{

    event.preventDefault();
    const city = encodeURIComponent(cityInput.value.trim());

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            displayError("An error occurred while fetching the weather data");
        }
    }
    else displayError("Please enter a city name");
});

async function getWeatherData(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    try {
        card.style.display = 'flex';
        const response = await fetch(apiURL);
        if (!response.ok) {
            if (response.status === 404) throw new Error("City not found");
            else if (response.status === 401) throw new Error("Invalid API key");
            else throw new Error("Failed to fetch weather data");
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message || "Network error");
    }
}



function displayWeatherInfo(data){
    
    const {name: city, main: {temp, humidity}, weather: [{description, id}]} = data;
    card.textContent = '';
    card.style.display = 'flex';

    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const humidityDisplay = document.createElement('p');
    const descDisplay = document.createElement('p');
    const emojiDisplay = document.createElement('p');

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    emojiDisplay.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add('cityDisplay');
    tempDisplay.classList.add('tempDisplay');
    humidityDisplay.classList.add('humidityDisplay');
    descDisplay.classList.add('descDisplay');
    emojiDisplay.classList.add('weatherEmoji');

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(emojiDisplay);
}

function getWeatherEmoji(weatherID){
    if(weatherID >= 200 && weatherID < 300) return '⛈️';
    else if(weatherID >= 300 && weatherID < 400) return '🌧️';
    else if(weatherID >= 500 && weatherID < 600) return '🌧️';
    else if(weatherID >= 600 && weatherID < 700) return '❄️';
    else if(weatherID >= 700 && weatherID < 800) return '🌫️';
    else if(weatherID === 800) return '☀️';
    else if(weatherID === 801 || weatherID === 802) return '⛅';
    else if(weatherID === 803 || weatherID === 804) return '☁️';
    else return '❓';
}

function displayError(message) {
    card.textContent = '';
    card.style.display = 'flex';
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.classList.add('errorDisplay');
    card.appendChild(errorDisplay);
}