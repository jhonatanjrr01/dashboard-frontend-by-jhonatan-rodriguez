import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService, PaginatedMovieResult } from './movie.service';
import { TmdbMovieListResponse } from '../models/movie.model';
import { environment } from '../../../environments/environment';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener y mapear las películas populares correctamente', () => {
    const mockResponse: TmdbMovieListResponse = {
      page: 1,
      total_pages: 10,
      total_results: 200,
      results: [
        {
          id: 550,
          title: 'Fight Club',
          release_date: '1999-10-15',
          vote_average: 8.4,
          poster_path: '/poster.jpg',
          overview: 'An insomniac office worker...'
        }
      ]
    };

    service.getMovies(1).subscribe((result: PaginatedMovieResult) => {
      expect(result.page).toBe(1);
      expect(result.totalResults).toBe(200);
      expect(result.movies.length).toBe(1);

      const movie = result.movies[0];
      expect(movie.id).toBe(550);
      expect(movie.title).toBe('Fight Club');
      expect(movie.rating).toBe(8.4);
      expect(movie.posterUrl).toContain('https://image.tmdb.org/t/p/w500/poster.jpg');
    });

    const req = httpMock.expectOne(req =>
      req.url === `${environment.tmdbBaseUrl}/movie/popular` &&
      req.params.get('page') === '1'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});