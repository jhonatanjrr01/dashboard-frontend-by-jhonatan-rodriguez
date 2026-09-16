import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { WeatherCity, WeatherApiResponse } from '../models/weather.model';

export interface PaginatedWeatherResult {
  cities: WeatherCity[];
  totalResults: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly baseUrl = environment.openWeatherBaseUrl;
  private readonly apiKey = environment.openWeatherApiKey;

  // Listado predefinido de ciudades para la simulación de tabla paginada en cliente
  private readonly defaultCities: string[] = [
    'Bogota', 'Madrid', 'Mexico City', 'Buenos Aires', 'Lima',
    'Santiago', 'Tokyo', 'London', 'New York', 'Paris',
    'Rome', 'Berlin', 'Sydney', 'Toronto', 'Sao Paulo'
  ];

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el clima de una lista de ciudades aplicando filtrado y paginación local.
   * Usamos forkJoin para consultar múltiples ciudades en paralelo.
   */
  getWeatherCities(page: number = 1, pageSize: number = 5, query?: string): Observable<PaginatedWeatherResult> {
    let filteredCities = [...this.defaultCities];

    if (query && query.trim().length > 0) {
      const searchTerm = query.trim().toLowerCase();
      filteredCities = filteredCities.filter(city => city.toLowerCase().includes(searchTerm));
    }

    if (filteredCities.length === 0) {
      return of({
        cities: [],
        totalResults: 0,
        page,
        pageSize
      });
    }

    const startIndex = (page - 1) * pageSize;
    const paginatedCityNames = filteredCities.slice(startIndex, startIndex + pageSize);

    const requests = paginatedCityNames.map(city => this.fetchCityWeather(city));

    return forkJoin(requests).pipe(
      map(cities => ({
        cities,
        totalResults: filteredCities.length,
        page,
        pageSize
      })),
      catchError(this.handleError)
    );
  }

  private fetchCityWeather(cityName: string): Observable<WeatherCity> {
    const params = new HttpParams()
      .set('q', cityName)
      .set('appid', this.apiKey)
      .set('units', 'metric')
      .set('lang', 'es');

    return this.http.get<WeatherApiResponse>(`${this.baseUrl}/weather`, { params }).pipe(
      map(response => this.mapWeather(response)),
      catchError(() => {
        return of({
          cityName,
          temperature: 0,
          description: 'Datos no disponibles',
          iconUrl: 'https://openweathermap.org/img/wn/10d@2x.png'
        });
      })
    );
  }

  private mapWeather(raw: WeatherApiResponse): WeatherCity {
    const weatherInfo = raw.weather && raw.weather.length > 0 ? raw.weather[0] : null;
    return {
      cityName: raw.name,
      temperature: Math.round(raw.main.temp),
      description: weatherInfo ? weatherInfo.description : 'Sin datos',
      iconUrl: weatherInfo
        ? `https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`
        : 'https://openweathermap.org/img/wn/10d@2x.png'
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error al consultar el servicio de clima.';
    if (error.status === 401) {
      errorMessage = 'Clave de API de OpenWeather no válida.';
    }
    return throwError(() => new Error(errorMessage));
  }
}