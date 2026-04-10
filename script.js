// LOGIN
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html";
  } else {
    document.getElementById("error").innerText = "Invalid credentials";
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("loggedIn");
}

// AUTH CHECK
function checkAuth() {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
  }
}

// Protect pages
if (window.location.pathname.includes("index.html") ||
    window.location.pathname.includes("weather.html") ||
    window.location.pathname.includes("about.html")) {
  checkAuth();
}

// NAVIGATION
function goToWeather() {
  const city = document.getElementById("city").value;
  if (!city) {
    alert("Enter city");
    return;
  }
  window.location.href = `weather.html?city=${city}`;
}

// GET CITY FROM URL
function getCityFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("city");
}

// LOAD WEATHER
async function loadWeather() {
  const city = getCityFromURL();
  if (!city) return;

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) {
      document.getElementById("result").innerHTML = "❌ City not found";
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherRes.json();

    document.getElementById("result").innerHTML = `
      <h2>${name}</h2>
      <p>🌡️ Temperature: ${weatherData.current_weather.temperature} °C</p>
      <p>💨 Wind Speed: ${weatherData.current_weather.windspeed} km/h</p>
    `;
  } catch (err) {
    document.getElementById("result").innerHTML = "⚠️ Error loading data";
  }
}

// Run weather if on weather page
if (window.location.pathname.includes("weather.html")) {
  loadWeather();
}