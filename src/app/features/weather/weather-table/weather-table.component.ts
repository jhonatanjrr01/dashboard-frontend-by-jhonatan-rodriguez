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

import { WeatherService, PaginatedWeatherResult } from '../../../core/services/weather.service';
import { WeatherCity } from '../../../core/models/weather.model';

@Component({
  selector: 'app-weather-table',
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
          <mat-label>🌍 Filtrar por ciudad...</mat-label>
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="onSearchChange($event)" placeholder="Ej: Bogota" class="py-2" />
          <mat-icon matSuffix class="text-gray-400">search</mat-icon>
        </mat-form-field>
      </div>

      <div class="flex justify-center items-center py-12" *ngIf="loading">
        <mat-spinner diameter="50" class="text-primary-600"></mat-spinner>
      </div>

      <div class="bg-white rounded-lg shadow-lg overflow-hidden" *ngIf="!loading">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="cities" class="w-full">
            <ng-container matColumnDef="icon">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Estado
              </th>
              <td mat-cell *matCellDef="let city" class="px-4 py-4 whitespace-nowrap">
                <img [src]="city.iconUrl" [alt]="city.description" class="w-10 h-10" />
              </td>
            </ng-container>

            <ng-container matColumnDef="cityName">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Ciudad
              </th>
              <td mat-cell *matCellDef="let city" class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ city.cityName }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="temperature">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Temperatura
              </th>
              <td mat-cell *matCellDef="let city" class="px-4 py-4 whitespace-nowrap">
                <span [ngClass]="getTemperatureClass(city.temperature)" class="text-sm font-bold">
                  {{ city.temperature }} °C
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Clima
              </th>
              <td mat-cell *matCellDef="let city" class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 capitalize">{{ city.description }}</div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-50"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition-colors"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell px-4 py-8 text-center text-gray-500 text-sm" colspan="4">
                🌤️ No se encontraron ciudades
              </td>
            </tr>
          </table>
        </div>

        <div class="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <mat-paginator
            [length]="totalResults"
            [pageSize]="pageSize"
            [pageSizeOptions]="[5, 10]"
            [pageIndex]="pageIndex"
            (page)="onPageChange($event)"
            aria-label="Paginador de clima"
            class="mat-primary">
          </mat-paginator>
        </div>
      </div>
    </div>
  `
})
export class WeatherTableComponent implements OnInit {
  displayedColumns: string[] = ['icon', 'cityName', 'temperature', 'description'];
  cities: WeatherCity[] = [];
  loading: boolean = true;
  totalResults: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  searchQuery: string = '';

  private searchSubject = new Subject<string>();

  constructor(
    private weatherService: WeatherService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadWeather();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.pageIndex = 0;
      this.loadWeather();
    });
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadWeather();
  }

  loadWeather(): void {
    this.loading = true;
    const page = this.pageIndex + 1;

    this.weatherService.getWeatherCities(page, this.pageSize, this.searchQuery).subscribe({
      next: (res: PaginatedWeatherResult) => {
        this.cities = res.cities;
        this.totalResults = res.totalResults;
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.snackBar.open(err.message || 'Error al obtener datos del clima', 'Cerrar', { duration: 5000 });
      }
    });
  }

  getTemperatureClass(temperature: number): string {
    if (temperature < 15) {
      return 'text-blue-600';
    } else if (temperature >= 15 && temperature < 25) {
      return 'text-green-600';
    } else {
      return 'text-orange-600';
    }
  }
}