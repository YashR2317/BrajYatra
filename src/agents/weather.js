

const fetch = require('node-fetch');
const llm = require('../llm/connector');
const { WEATHER_PROMPT } = require('../prompts/system-prompts');
const { getCityCentroid } = require('../utils/geo');
require('dotenv').config();

const OWM_KEY = process.env.OPENWEATHER_API_KEY;


async function getWeather(city) {
    const coords = getCityCentroid(city);
    if (!coords) {
        return {
            success: false,
            text: `Sorry, I don't have location data for "${city}". Try: Mathura, Vrindavan, Agra, Govardhan, Barsana, or Gokul.`
        };
    }

    
    let weatherData = null;
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&appid=${OWM_KEY}&units=metric`;
        const res = await fetch(url);
        if (res.ok) {
            weatherData = await res.json();
        }
    } catch (e) {
        console.warn('[Weather] API fetch failed:', e.message);
    }

    if (!weatherData) {
        return {
            success: true,
            text: `I couldn't fetch live weather for ${city} right now. Generally, the best time to visit the Braj region is **October to March** when temperatures are pleasant (15–25°C). Summers (April–June) can be very hot (40°C+), and monsoons (July–September) bring heavy rains.`,
            source: 'fallback'
        };
    }

    
    const weather = {
        city: city,
        temp: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        description: weatherData.weather?.[0]?.description || 'N/A',
        wind_speed: weatherData.wind?.speed || 0,
        visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1000) : null
    };

    
    const result = await llm.generateResponse(
        WEATHER_PROMPT,
        `Current weather in ${city}, India: Temperature ${weather.temp}°C (feels like ${weather.feels_like}°C), ${weather.description}, Humidity ${weather.humidity}%, Wind ${weather.wind_speed} m/s, Visibility ${weather.visibility || 'N/A'} km. The user is planning to visit temples, ghats, and monuments in the Braj region.`
    );

    return {
        success: true,
        text: result.success ? result.text : formatBasicWeather(weather),
        data: weather,
        source: result.success ? result.source : 'basic'
    };
}

function formatBasicWeather(w) {
    return `**Weather in ${w.city}**\n\n🌡️ Temperature: ${w.temp}°C (feels like ${w.feels_like}°C)\n☁️ Conditions: ${w.description}\n💧 Humidity: ${w.humidity}%\n💨 Wind: ${w.wind_speed} m/s\n\n${w.temp > 35 ? '⚠️ It\'s quite hot! Stay hydrated and visit outdoor sites early morning.' : w.temp < 15 ? '🧥 It\'s cool — carry a jacket for evening aarti visits.' : '👍 Pleasant weather for sightseeing!'}`;
}

module.exports = { getWeather };
