async function getWeather() {
  const city = document.getElementById("city").value;
  if (!city) {
    alert("Enter city name");
    return;
  }
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
    const temp = weatherData.current_weather.temperature;
    const wind = weatherData.current_weather.windspeed;
    document.getElementById("result").innerHTML = `
      <h2>${name}</h2>
      <p>🌡️ Temperature: ${temp} °C</p>
      <p>💨 Wind Speed: ${wind} km/h</p>
    `;
  } catch (error) {
    document.getElementById("result").innerHTML = "⚠️ Error fetching data";
    console.log(error);
  }
}