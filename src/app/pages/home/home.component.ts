import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DatasetToggleComponent } from '../../shared/components/dataset-toggle/dataset-toggle.component';
import { MoviesTableComponent } from '../../features/movies/movies-table/movies-table.component';
import { WeatherTableComponent } from '../../features/weather/weather-table/weather-table.component';
import { DatasetType } from '../../core/models/dataset-type.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    DatasetToggleComponent,
    MoviesTableComponent,
    WeatherTableComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden fade-in">
          <div class="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-8 sm:px-8">
            <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">
              🎬 Dashboard de Datos
            </h1>
            <p class="text-primary-100 text-lg">
              Consulta de Películas y Clima en tiempo real
            </p>
          </div>

          <div class="p-6 sm:p-8">
            <div class="mb-6">
              <app-dataset-toggle
                [selected]="currentDataset"
                (datasetChange)="onDatasetChange($event)">
              </app-dataset-toggle>
            </div>

            <div class="fade-in">
              <app-movies-table *ngIf="currentDataset === 'movies'"></app-movies-table>
              <app-weather-table *ngIf="currentDataset === 'weather'"></app-weather-table>
            </div>
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-gray-500 text-sm">
            Desarrollado por <span class="font-semibold text-primary-600">Jhonatan Rodriguez</span>
          </p>
          <p class="text-gray-400 text-xs mt-1">
            Angular 17 + Tailwind CSS + Angular Material
          </p>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  currentDataset: DatasetType = 'movies';

  onDatasetChange(dataset: DatasetType): void {
    this.currentDataset = dataset;
  }
}