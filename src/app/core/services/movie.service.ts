import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Movie, TmdbMovieListResponse, MovieApiResponse } from '../models/movie.model';

export interface PaginatedMovieResult {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly token = environment.tmdbReadAccessToken;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene películas populares de TMDB o realiza una búsqueda por título.
   * @param page Número de página (1-based)
   * @param query Texto de búsqueda opcional
   */
  getMovies(page: number = 1, query?: string): Observable<PaginatedMovieResult> {
    const isSearch = query && query.trim().length > 0;
    const endpoint = isSearch ? `${this.baseUrl}/search/movie` : `${this.baseUrl}/movie/popular`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'accept': 'application/json'
    });

    let params = new HttpParams()
      .set('language', 'es-ES')
      .set('page', page.toString());

    if (isSearch) {
      params = params.set('query', query.trim());
    }

    return this.http.get<TmdbMovieListResponse>(endpoint, { headers, params }).pipe(
      map(response => this.mapToPaginatedResult(response)),
      catchError(this.handleError)
    );
  }

  private mapToPaginatedResult(response: TmdbMovieListResponse): PaginatedMovieResult {
    return {
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
      movies: response.results.map((raw: MovieApiResponse) => this.mapMovie(raw))
    };
  }

  private mapMovie(raw: MovieApiResponse): Movie {
    return {
      id: raw.id,
      title: raw.title,
      releaseDate: raw.release_date || 'N/A',
      rating: raw.vote_average,
      posterUrl: raw.poster_path
        ? `https://image.tmdb.org/t/p/w500${raw.poster_path}`
        : 'assets/images/poster-placeholder.svg',
      overview: raw.overview || 'Sin descripción disponible.'
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado al obtener las películas.';
    if (error.status === 401) {
      errorMessage = 'Token o API Key de TMDB no válida.';
    } else if (error.status === 404) {
      errorMessage = 'No se encontraron resultados en TMDB.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de cliente: ${error.error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}