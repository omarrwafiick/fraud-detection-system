import { Component, signal } from '@angular/core';
import { Header } from '../../layout/components/header/header';
import { Footer } from '../../layout/components/footer/footer';
import { TableColumn, TableFilterEvent } from '../../shared/types/table.type';
import { SelectOption } from '../../shared/types/select.type';
import { AppTable } from '../../shared/components/app-table/app-table';
import { AppSelect } from '../../shared/components/app-select/app-select';

@Component({
  selector: 'app-landing-page',
  imports: [Header, Footer, AppTable, AppSelect],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.css',
})
export class LandingPage {
protected tableColumns: TableColumn[] = [
    { key: 'id', header: 'Incident Ref Token', isMono: true },
    { key: 'title', header: 'Case Summary Description' },
    { key: 'status', header: 'System Status Flag' }
  ];

  protected severityOptions: SelectOption[] = [
    { label: 'Critical Alert', value: 'critical' },
    { label: 'High Action', value: 'high' },
    { label: 'Muted Low', value: 'low' }
  ];

  protected activeSeverityFilter = signal<string[]>([]);
  protected mockCases = signal<any[]>([
    { id: 'FRD-2026-991A', title: 'Suspicious overseas ATM batch dispatch', status: 'INVESTIGATING' },
    { id: 'FRD-2026-884B', title: 'Failed validation api brute forcing tokens', status: 'CRITICAL' }
  ]);

  protected onSeverityChanged(selected: string[]): void {
    this.activeSeverityFilter.set(selected);
    // Trigger your NgRx action stream here with the updated criteria
  }

  protected onTableQueryChanged(event: TableFilterEvent): void {
    console.log('Execute unified server payload query tracking updates:', event);
    // Dispatch network calls here based on the paging or query filters
  }
}
