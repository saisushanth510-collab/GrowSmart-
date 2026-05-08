export type Weather = {
  temp: number;
  humidity: number;
  rain: number;
  windspeed: number;
  code: number;
};

export async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`;
  const r = await fetch(url);
  const j = await r.json();
  return {
    temp: j.current.temperature_2m,
    humidity: j.current.relative_humidity_2m,
    rain: j.current.precipitation,
    windspeed: j.current.wind_speed_10m,
    code: j.current.weather_code,
  };
}

export function weatherLabel(code: number) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Showers";
  return "Stormy";
}

export function wateringAdvice(w: Weather): string {
  if (w.rain > 1) return "Skip watering today — recent rainfall is sufficient.";
  if (w.temp > 28 && w.humidity < 50) return "Hot & dry: water deeply this evening.";
  if (w.temp < 10) return "Cold spell: reduce watering and check for frost.";
  if (w.humidity > 80) return "High humidity: water sparingly to avoid root rot.";
  return "Standard schedule: water if topsoil feels dry to the touch.";
}

export function getLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({ lat: 40.7128, lon: -74.006 });
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => resolve({ lat: 40.7128, lon: -74.006 }),
      { timeout: 4000 },
    );
  });
}