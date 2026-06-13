import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavGroup {
  label: string;
  items: { path: string; label: string; icon: string }[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.css',
})
export class AppSidebar {
  private collapsedGroups = signal<Record<string, boolean>>({
    'Automation Engine': true,
    'Incident Resolution': true,
  });

  protected navigationStructure: NavGroup[] = [
    {
      label: 'Security Intelligence',
      items: [
        { path: '/dashboard/user/analytics/summary', label: 'Overview Metrics', icon: '📊' },
        { path: '/dashboard/user/analytics/trends', label: 'Anomalous Trends', icon: '📈' }
      ]
    },
    {
      label: 'Incident Resolution',
      items: [
        { path: '/dashboard/user/cases/list', label: 'Incident Ledger', icon: '🛡️' },
        { path: '/dashboard/user/cases/network', label: 'Graph Topology', icon: '🕸️' }
      ]
    },
    {
      label: 'Automation Engine',
      items: [
        { path: '/dashboard/user/rules/list', label: 'Active Matrix', icon: '⚙️' },
        { path: '/dashboard/user/rules/builder', label: 'Rule Orchestrator', icon: '🛠️' }
      ]
    }
  ];

  protected toggleGroup(label: string): void {
    this.collapsedGroups.update((currentMap) => ({
      ...currentMap,
      [label]: !currentMap[label]
    }));
  }

  protected isGroupCollapsed(label: string): boolean {
    return !!this.collapsedGroups()[label];
  }
}
