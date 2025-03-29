// Weather codes và icons tương ứng
const weatherCodes = {
    0: { desc: "Trời quang", icon: "☀️" },
    1: { desc: "Ít mây", icon: "🌤️" },
    2: { desc: "Mây rải rác", icon: "⛅" },
    3: { desc: "Nhiều mây", icon: "☁️" },
    45: { desc: "Sương mù", icon: "🌫️" },
    48: { desc: "Sương giá", icon: "🌫️" },
    51: { desc: "Mưa phùn nhẹ", icon: "🌧️" },
    53: { desc: "Mưa phùn", icon: "🌧️" },
    55: { desc: "Mưa phùn nặng", icon: "🌧️" },
    61: { desc: "Mưa nhẹ", icon: "🌧️" },
    63: { desc: "Mưa", icon: "🌧️" },
    65: { desc: "Mưa nặng hạt", icon: "🌧️" },
    71: { desc: "Tuyết rơi nhẹ", icon: "🌨️" },
    73: { desc: "Tuyết rơi", icon: "🌨️" },
    75: { desc: "Tuyết rơi nặng hạt", icon: "🌨️" },
    95: { desc: "Giông bão", icon: "⛈️" }
};

const OPENWEATHER_API_KEY = "8d2de98e089f1c28e1a22fc19a24ef04";

async function getLocationFromIP() {
    try {
        const response = await fetch("http://ip-api.com/json/");
        const data = await response.json();
        
        if (data.status === "success") {
            return {
                lat: data.lat,
                lon: data.lon,
                city: data.city,
                country: data.country
            };
        }
        return null;
    } catch (error) {
        console.error("Location error:", error);
        return null;
    }
}

async function getWeather(lat, lon) {
    try {
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=vi`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Weather error:", error);
        return null;
    }
}

async function updateWeatherUI(weatherData, locationData) {
    const tempElement = document.getElementById('current-temp');
    const conditionElement = document.getElementById('weather-condition');
    const weatherIcon = document.getElementById('weather-icon');

    if (weatherData && weatherData.main) {
        tempElement.textContent = `${Math.round(weatherData.main.temp)}°C`;
        conditionElement.textContent = `${weatherData.weather[0].description}`;
        weatherIcon.className = getWeatherIcon(weatherData.weather[0].main.toLowerCase());
    } else {
        setErrorState();
    }
}

function getWeatherIcon(condition) {
    const iconMap = {
        'thunderstorm': 'fas fa-bolt',
        'drizzle': 'fas fa-cloud-rain',
        'rain': 'fas fa-cloud-showers-heavy',
        'snow': 'fas fa-snowflake',
        'clear': 'fas fa-sun',
        'clouds': 'fas fa-cloud',
        'mist': 'fas fa-smog',
        'smoke': 'fas fa-smog',
        'haze': 'fas fa-smog',
        'dust': 'fas fa-smog',
        'fog': 'fas fa-smog'
    };
    
    return iconMap[condition] || 'fas fa-cloud-sun';
}

function setErrorState() {
    const tempElement = document.getElementById('current-temp');
    const conditionElement = document.getElementById('weather-condition');
    const weatherIcon = document.getElementById('weather-icon');

    tempElement.textContent = '--°C';
    conditionElement.textContent = 'Đang cập nhật...';
    weatherIcon.className = 'fas fa-cloud-sun';
}

async function initWeather() {
    const location = await getLocationFromIP();
    if (location) {
        const weatherData = await getWeather(location.lat, location.lon);
        await updateWeatherUI(weatherData, location);
    } else {
        setErrorState();
    }
}

// Initialize weather
document.addEventListener('DOMContentLoaded', initWeather);

// Update every 5 minutes
setInterval(initWeather, 300000);
