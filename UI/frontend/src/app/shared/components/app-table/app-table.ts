import { Component, computed, input, output, signal } from '@angular/core';
import { TableColumn, TableFilterEvent } from '../../types/table.type';
import { AppInput } from '../app-input/app-input';
import { AppButton } from '../app-button/app-button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  imports: [AppInput, AppButton, CommonModule],
  templateUrl: './app-table.html',
  styleUrl: './app-table.css',
})
export class AppTable {
  columns = input<TableColumn[]>([]);
  data = input<any[]>([]);
  totalItems = input<number>(0);
  itemsPerPage = input<number>(10);
  
  filterChange = output<TableFilterEvent>();

  protected searchQuery = signal<string>('');
  protected currentPage = signal<number>(1);

  protected totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage()));
  });

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.emitFilterState();
  }

  protected changePage(direction: number): void {
    const target = this.currentPage() + direction;
    if (target >= 1 && target <= this.totalPages()) {
      this.currentPage.set(target);
      this.emitFilterState();
    }
  }

  private emitFilterState(): void {
    this.filterChange.emit({
      searchQuery: this.searchQuery(),
      currentPage: this.currentPage()
    });
  }
}
