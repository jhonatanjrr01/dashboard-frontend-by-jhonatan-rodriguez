// Respuesta cruda de OpenWeather para una ciudad
export interface WeatherApiResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

// Modelo interno normalizado
export interface WeatherCity {
  cityName: string;
  temperature: number;
  description: string;
  iconUrl: string;
}