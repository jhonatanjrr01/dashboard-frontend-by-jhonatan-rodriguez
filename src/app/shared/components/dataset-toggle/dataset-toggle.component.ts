import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { DatasetType } from '../../../core/models/dataset-type.model';

@Component({
  selector: 'app-dataset-toggle',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  template: `
    <div class="bg-gray-100 rounded-xl p-1 mb-6">
      <mat-tab-group [selectedIndex]="selectedIndex" (selectedIndexChange)="onTabChange($event)" class="dataset-tabs">
        <mat-tab label="🎬 Películas">
          <ng-template matTabContent></ng-template>
        </mat-tab>
      <mat-tab label="🌤️ Clima">
          <ng-template matTabContent></ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    ::ng-deep .dataset-tabs .mat-mdc-tab {
      @apply font-medium text-gray-600;
    }
    ::ng-deep .dataset-tabs .mat-mdc-tab.mdc-tab--active {
      @apply text-primary-600 font-semibold;
    }
    ::ng-deep .dataset-tabs .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label {
      @apply text-primary-600;
    }
    ::ng-deep .dataset-tabs .mat-mdc-ink-bar {
      @apply bg-primary-600;
    }
  `]
})
export class DatasetToggleComponent {
  @Input() selected: DatasetType = 'movies';
  @Output() datasetChange = new EventEmitter<DatasetType>();

  get selectedIndex(): number {
    return this.selected === 'movies' ? 0 : 1;
  }

  onTabChange(index: number): void {
    const dataset: DatasetType = index === 0 ? 'movies' : 'weather';
    this.datasetChange.emit(dataset);
  }
}
