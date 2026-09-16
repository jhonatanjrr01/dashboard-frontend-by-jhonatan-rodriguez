import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MovieService, PaginatedMovieResult } from '../../../core/services/movie.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movies-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-4">
        <mat-form-field appearance="outline" class="w-full max-w-md">
          <mat-label>🔍 Buscar película por título...</mat-label>
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange($event)" placeholder="Ej: Inception" class="py-2" />
          <mat-icon matSuffix class="text-gray-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="flex justify-center items-center py-12" *ngIf="loading">
        <mat-spinner diameter="50" class="text-primary-600"></mat-spinner>
      </div>

      <div class="bg-white rounded-lg shadow-lg overflow-hidden" *ngIf="!loading">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="movies" class="w-full">
            <ng-container matColumnDef="poster">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Póster
              </th>
              <td mat-cell *matCellDef="let movie" class="px-4 py-4 whitespace-nowrap">
                <img [src]="movie.posterUrl" [alt]="movie.title" class="w-12 h-16 object-cover rounded-lg shadow-sm" />
              </td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Título
              </th>
              <td mat-cell *matCellDef="let movie" class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ movie.title }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="releaseDate">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Lanzamiento
              </th>
              <td mat-cell *matCellDef="let movie" class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ movie.releaseDate }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="rating">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Rating
              </th>
              <td mat-cell *matCellDef="let movie" class="px-4 py-4 whitespace-nowrap">
                <span [ngClass]="getRatingBadgeClass(movie.rating)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                  ⭐ {{ movie.rating | number:'1.1-1' }}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-50"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition-colors"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell px-4 py-8 text-center text-gray-500 text-sm" colspan="4">
                🎬 No se encontraron películas
              </td>
            </tr>
          </table>
        </div>

        <div class="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <mat-paginator
            [length]="totalResults"
            [pageSize]="pageSize"
            [pageIndex]="pageIndex"
            [hidePageSize]="true"
            (page)="onPageChange($event)"
            aria-label="Paginador de películas"
            class="mat-primary">
          </mat-paginator>
        </div>
      </div>
    </div>
  `
})
export class MoviesTableComponent implements OnInit {
  displayedColumns: string[] = ['poster', 'title', 'releaseDate', 'rating'];
  movies: Movie[] = [];
  loading: boolean = true;
  totalResults: number = 0;
  pageSize: number = 20;
  pageIndex: number = 0;
  searchQuery: string = '';

  private searchSubject = new Subject<string>();

  constructor(
    private movieService: MovieService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMovies();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.pageIndex = 0;
      this.loadMovies();
    });
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    const apiPage = this.pageIndex + 1;

    this.movieService.getMovies(apiPage, this.searchQuery).subscribe({
      next: (res: PaginatedMovieResult) => {
        this.movies = res.movies;
        this.totalResults = res.totalResults;
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Error al obtener películas', 'Cerrar', { duration: 5000 });
      }
    });
  }

  getRatingBadgeClass(rating: number): string {
    if (rating >= 7) {
      return 'bg-green-100 text-green-800';
    } else if (rating >= 5) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  }
}