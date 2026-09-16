// Respuesta cruda de la API de TMDB para una película individual
export interface MovieApiResponse {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  overview: string;
}

// Respuesta cruda del endpoint de listado (paginado) de TMDB
export interface TmdbMovieListResponse {
  page: number;
  results: MovieApiResponse[];
  total_pages: number;
  total_results: number;
}

// Modelo interno normalizado que usa la aplicación (independiente del formato de TMDB)
export interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  rating: number;
  posterUrl: string;
  overview: string;
}