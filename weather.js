const API_KEY = "c04bf0aa54ac4ce59e4100109201811";

const getWeatherButton = document.getElementById("getWeather");
getWeatherButton.addEventListener("click", getWeather);

async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const weatherDisplay = document.getElementById("weatherDisplay");
  const weatherError = document.getElementById("weatherError");
  const loading = document.getElementById("loading");

  // Reset displays
  weatherDisplay.innerHTML = "";
  weatherError.style.display = "none";

  if (!cityInput.value.trim()) {
    weatherError.textContent = "Please enter a city name";
    weatherError.style.display = "block";
    return;
  }

  loading.style.display = "block";

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(cityInput.value)}&aqi=no`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const weatherHTML = `
            <h2>${data.location.name}, ${data.location.country}</h2>
            <p>Temperature: ${data.current.temp_c}°C / ${data.current.temp_f}°F</p>
            <p>Condition: ${data.current.condition.text}</p>
            <img src="${data.current.condition.icon}" alt="Weather icon">
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind: ${data.current.wind_kph} km/h</p>
            <button onclick="speakWeather('${data.location.name}, ${data.current.condition.text}, Temperature ${data.current.temp_c} degrees celsius')">
                🔊 Speak Weather
            </button>
        `;

    weatherDisplay.innerHTML = weatherHTML;
  } catch (error) {
    weatherError.textContent = "Error fetching weather data. Please try again.";
    weatherError.style.display = "block";
    console.error("Error:", error);
  } finally {
    loading.style.display = "none";
  }
}

// Text-to-speech functionality
function speakWeather(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Text-to-speech is not supported in your browser");
  }
}
